#!/usr/bin/env python3
"""Snapshot/diff visible wallpaper files; not a visual or platform validator."""
import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import sys
import tempfile
from urllib.parse import unquote, urlsplit


SKIP = {"node_modules", "__pycache__"}


def relative_name(value):
    p = PurePosixPath(value)
    if (not value or "\\" in value or p.is_absolute() or ".." in p.parts
            or str(p) != value or value == "."):
        raise ValueError("Expected an exact project-relative path: " + value)
    return value


def file_record(path):
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return {"sha256": digest.hexdigest(), "bytes": path.stat().st_size}


def inventory(root):
    records = {}
    for folder, dirs, files in os.walk(root, followlinks=False):
        dirs[:] = sorted(n for n in dirs if not n.startswith(".") and n not in SKIP)
        for name in dirs:
            if (Path(folder) / name).is_symlink():
                raise ValueError("Symlink directory is not audited: " + name)
        for name in sorted(files):
            if name.startswith("."):
                continue
            path = Path(folder) / name
            if path.is_symlink() or not path.is_file():
                raise ValueError("Non-regular file is not audited: " + str(path))
            records[path.relative_to(root).as_posix()] = file_record(path)
    return dict(sorted(records.items()))


def check_entry(root, value, label):
    if not isinstance(value, str) or not value:
        return label + " must be a nonempty local path"
    parsed = urlsplit(value)
    if parsed.scheme or parsed.netloc:
        return label + " must refer to a local project file"
    try:
        name = relative_name(unquote(parsed.path))
    except ValueError as error:
        return label + ": " + str(error)
    path = root / name
    if not path.resolve().is_relative_to(root) or not path.is_file():
        return label + " is missing or outside the project: " + name
    return None


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("project", type=Path)
    parser.add_argument("--baseline", type=Path)
    parser.add_argument("--allow", action="append", default=[], metavar="RELATIVE_PATH")
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    try:
        root, output = args.project.resolve(), args.out.resolve()
        if not root.is_dir():
            raise ValueError("Project directory does not exist")
        if output.is_relative_to(root):
            raise ValueError("Save the report outside the project directory")
        if args.baseline and args.baseline.resolve() == output:
            raise ValueError("Do not overwrite the baseline with the change report")
        if args.allow and not args.baseline:
            raise ValueError("--allow requires --baseline")
        allowed = {relative_name(name) for name in args.allow}
        files = inventory(root)
        errors = []
        config_path = root / "project.json"
        if not config_path.is_file():
            errors.append("Missing project.json")
        else:
            config = json.loads(config_path.read_text(encoding="utf-8-sig"))
            if not isinstance(config, dict):
                raise ValueError("project.json must contain an object")
            for field in ("file", "preview"):
                if field == "file" or field in config:
                    error = check_entry(root, config.get(field), field)
                    if error:
                        errors.append(error)
        changes = {"added": [], "removed": [], "modified": []}
        if args.baseline:
            baseline = json.loads(args.baseline.read_text(encoding="utf-8"))
            if baseline.get("schema") != 1 or not isinstance(baseline.get("files"), dict):
                raise ValueError("Baseline must be an audit_project.py schema 1 report")
            old = baseline["files"]
            for name, record in old.items():
                relative_name(name)
                if not isinstance(record, dict) or not isinstance(record.get("sha256"), str):
                    raise ValueError("Invalid baseline record: " + name)
            changes["added"] = sorted(files.keys() - old.keys())
            changes["removed"] = sorted(old.keys() - files.keys())
            changes["modified"] = sorted(n for n in files.keys() & old.keys() if files[n] != old[n])
        changed = set().union(*map(set, changes.values()))
        unexpected = sorted(changed - allowed) if args.baseline else []
        report = {
            "schema": 1, "project": str(root), "files": files,
            "changes": changes, "allowed": sorted(allowed),
            "unexpected": unexpected, "errors": errors,
            "ok": not errors and not unexpected,
            "limits": "File/entry audit only; no visual, playback, dependency or platform validation.",
        }
        output.parent.mkdir(parents=True, exist_ok=True)
        with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=output.parent,
                                         prefix=".wallpaper-audit-", delete=False) as handle:
            temp = Path(handle.name)
            json.dump(report, handle, ensure_ascii=False, indent=2)
            handle.write("\n")
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temp, output)
        print(json.dumps({"ok": report["ok"], "file_count": len(files),
                          "changes": changes, "unexpected": unexpected,
                          "errors": errors, "report": str(output)}, ensure_ascii=False))
        return 0 if report["ok"] else 2
    except (OSError, ValueError, TypeError, AttributeError) as error:
        print("Audit error: " + str(error), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
