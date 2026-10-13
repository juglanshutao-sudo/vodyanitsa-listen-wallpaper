# 聆听我声 · 沃雅妮莎 — Wallpaper Engine 互动动态壁纸

《原神》沃雅妮莎（Vodyanitsa）主题的 Wallpaper Engine 网页壁纸（type: web），v3.4.4。

清晰分层主页面、独立发丝飘动、眨眼与微笑、约定与歌声、五号藏信室、羽笔光标互动；内置 BGM、人物台词逐句播放与可调用户设置。

![预览](Vodyanitsa_Listen/preview.jpg)

## 功能特性

- **分层立绘**：主页面 / 歌唱 A / 歌唱 B / 童年 / 回忆 / 士兵 等多套分层画面
- **物理动效**：独立发丝飘动、衣物飘动、风力与视角响应均可调
- **互动内容**：点击逐句前进台词、旅行者回答选项、羽笔光标互动、五号藏信室
- **音频系统**：内置 BGM 与人物台词，音量独立调节
- **用户设置面板**：音量、风力、字号缩放、底部避让等参数可视化调整

## 使用方法

1. 确认已安装 [Wallpaper Engine](https://store.steampowered.com/app/431960/Wallpaper_Engine/)
2. 下载本仓库（Code → Download ZIP），完整解压
3. 按 `先读我-WallpaperEngine导入与发布.txt` 中的步骤导入 Wallpaper Engine 编辑器
4. 详细功能说明见 `工程功能说明.md`

## 目录结构

```
├── Vodyanitsa_Listen/          # Wallpaper Engine 工程主体
│   ├── index.html / app.js     # 入口与主逻辑
│   ├── project.json            # WE 工程配置与用户属性
│   ├── cloth-rig.js / singing-rig.js  # 布料/歌唱物理
│   ├── assets/img/             # 分层立绘素材
│   └── assets/audio/           # BGM 与台词语音
├── 工程功能说明.md              # 功能详细说明
└── 先读我-WallpaperEngine导入与发布.txt
```

## 免责声明

本项目为**非商业粉丝作品**。《原神》及其角色、立绘、语音素材版权归 **miHoYo / HoYoverse** 所有。本项目仅供学习交流使用，请勿用于商业用途。素材原始出处：原神沃雅妮莎逸闻。

## 许可证

代码部分以 [MIT License](LICENSE) 提供。
