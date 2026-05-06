[English](./README_EN.md)

# 瓷都旅游指北

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Language](https://img.shields.io/badge/language-TypeScript-3178c6.svg)

景德镇互动旅行路线工具。网站用青花瓷风格的可爱地图展示市区、三宝、浮梁、瑶里等景点分布，并提供 1 日、2 日、3 日和自定义路线规划。

## 功能

- 景德镇迷你地图和景点点击卡片
- 小人沿路线自动移动
- 1 日、2 日、3 日经典路线
- 自定义景点选择和拖拽排序
- 路线时间估算、折腾提醒和远郊提示
- 住宿区域建议
- 交通、买瓷器、陶艺体验和节假日避坑

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 图片资产

项目提供 `npm run generate:assets`，用于通过 Gemini / nano banana 在本地生成青花瓷风格图片资产。API Key 只放在 `.env.local` 或 `~/.codex/CODEX.local.md`，不提交到仓库。

## 部署

项目使用 GitHub Actions 部署到 GitHub Pages。
