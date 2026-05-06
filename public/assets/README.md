# 图片资产

`porcelain-stamp.svg` 是仓库内置的轻量占位视觉。

运行以下命令可以使用 Gemini 2.5 Flash Image / nano banana 生成位图资产：

```bash
npm run generate:assets
```

生成结果会写入本目录：

- `porcelain-map.png`
- `traveler-character.png`
- `share-cover.png`

API Key 只从 `.env.local`、`.env` 或 `~/.codex/CODEX.local.md` 读取。
