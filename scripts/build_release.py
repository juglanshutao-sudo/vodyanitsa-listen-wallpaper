"""Build two complete Wallpaper Engine ZIPs and two offline HTML previews."""
import argparse
import base64
import hashlib
import json
import mimetypes
from pathlib import Path
import re
import zipfile

ROOT = Path(__file__).resolve().parents[1]
VARIANTS = [("Bright", "Vodyanitsa_Listen"), ("Dark", "Vodyanitsa_Listen_Dark")]


def local_file(root, value):
    path = (root / value.split("?", 1)[0]).resolve()
    if not path.is_relative_to(root.resolve()) or not path.is_file():
        raise ValueError(f"Missing or nonlocal resource: {value}")
    return path


def standalone(project):
    assets = {}
    for path in sorted((project / "assets").rglob("*")):
        if path.is_file():
            mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
            assets[path.relative_to(project).as_posix()] = (
                f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode("ascii")
            )
    html = (project / "index.html").read_text(encoding="utf-8-sig")

    def style(match):
        css = local_file(project, match[1]).read_text(encoding="utf-8-sig")
        def embed_url(found):
            value = found[2]
            if value.startswith("data:"):
                return found[0]
            if value not in assets:
                raise ValueError(f"Unbundled CSS resource: {value}")
            return "url('" + assets[value] + "')"
        css = re.sub(r"url\(\s*(['\"]?)([^)'\"\s]+)\1\s*\)", embed_url, css)
        return "<style>" + css + "</style>"

    html = re.sub(r'<link\b[^>]*href=["\']([^"\']+)["\'][^>]*>', style, html)
    def script(match):
        code = local_file(project, match[1]).read_text(encoding="utf-8-sig")
        return "<script>" + re.sub(r"</script", r"<\\/script", code, flags=re.I) + "</script>"
    html = re.sub(r'<script\b[^>]*src=["\']([^"\']+)["\'][^>]*>\s*</script>', script, html)
    asset_script = "<script>window.WALLPAPER_ASSETS=" + json.dumps(assets, separators=(",", ":")) + ";</script>"
    html = html.replace("<script>", asset_script + "<script>", 1)
    if re.search(r'<(?:script|link)\b[^>]*(?:src|href)\s*=', html):
        raise ValueError("External script or stylesheet remains")
    return html


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=ROOT / ".release")
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    checksums = []
    for suffix, folder in VARIANTS:
        project = ROOT / folder
        config = json.loads((project / "project.json").read_text(encoding="utf-8-sig"))
        if config.get("workshopid") or config.get("workshopurl"):
            raise ValueError("Downloadable templates must not contain a published Workshop ID")
        local_file(project, config["file"])
        local_file(project, config["preview"])
        archive = args.output / f"Vodyanitsa_WallpaperEngine_v3.5.5_{suffix}.zip"
        with zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as bundle:
            for path in sorted(project.rglob("*")):
                if path.is_file():
                    if any(part.startswith(".") for part in path.relative_to(project).parts):
                        raise ValueError(f"Hidden file in project: {path.name}")
                    bundle.write(path, folder + "/" + path.relative_to(project).as_posix())
            for name in ["LICENSE", "先读我-WallpaperEngine导入与发布.txt"]:
                bundle.write(ROOT / name, name)
        with zipfile.ZipFile(archive) as bundle:
            assert bundle.testzip() is None
            assert len(bundle.namelist()) == len(set(bundle.namelist()))
            assert len([n for n in bundle.namelist() if n.endswith("project.json")]) == 1
            for path in project.rglob("*"):
                if path.is_file():
                    assert bundle.read(folder + "/" + path.relative_to(project).as_posix()) == path.read_bytes()
        preview = args.output / f"Vodyanitsa_Interactive_v3.5.5_{suffix}.html"
        preview.write_text(standalone(project), encoding="utf-8")
        for path in [archive, preview]:
            checksums.append(hashlib.sha256(path.read_bytes()).hexdigest() + "  " + path.name)
            print(f"Built {path.name}: {path.stat().st_size} bytes")
    (args.output / "SHA256SUMS.txt").write_text("\n".join(checksums) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
