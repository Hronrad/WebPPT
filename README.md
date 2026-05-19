# WebPPT Template

WebPPT 是一种 AI-native 的互动型展示方式。它把演示文稿写成普通网页：可进 Git、可复用组件、可写公式、可放动态演示，也可以直接通过告诉 AI 修改需求来编辑页面，不必再在 PPT 里反复拖拽文本框、调对齐和手动改样式。

相比传统 PPT，WebPPT 更适合学术汇报、课程讲义、研究分享和技术说明：

- 公式由 MathJax 渲染，不需要截图
- 动态演示可以直接写进页面
- 样式统一维护，整套报告更容易保持一致
- 页面结构清楚，便于 AI 或代码工具继续修改
- 静态 HTML 文件即可分享和归档

## 使用

最简单的方式：直接打开 `index.html`。

```text
webppt-template/index.html
```

进阶方式：如果需要本地服务或避免浏览器本地文件限制，可以运行：

```bash
cd webppt-template
npm run serve
```

然后访问：

```text
http://localhost:4174
```

## 内置内容

- 自动侧边导航与进度条
- 全屏演示与键盘翻页
- 封面、基础版式、公式页、时间线、动态演示、对照表、结论页
- 玻璃卡片、引用卡、指标卡、主公式卡、对照表
- 可切换动态背景：粒子网络 / 流动波纹 / 关闭背景
- 可切换水印：南京大学 / 学术圆章 / 实验室标识 / 关闭水印

## 新增一页

复制一个 section，放到 `<main>` 内：

```html
<section class="page-content hidden w-full max-w-7xl mx-auto"
         data-nav="导航名称"
         data-part="PART 01"
         data-part-title="章节标题"
         data-group-start="true">
    ...
</section>
```

`app.js` 会自动识别所有 `.page-content`，不需要手动维护总页数。

## 文件结构

```text
webppt-template/
├── assets/
│   ├── nanjing-university-logo.png
│   ├── watermark-academic-seal.svg
│   └── watermark-lab-mark.svg
├── index.html
├── styles.css
├── app.js
├── package.json
└── README.md
```

## 定制

- 主题色：修改 `index.html` 中 Tailwind 的 `academic.accent`
- 水印：替换 `assets/` 中图片，或修改 `watermark-mode` 下拉框
- 动态背景：在 `app.js` 中增加新的 `drawXxx()`，再加入 `background-mode` 下拉框
- 动态演示：复制第 4 页的 canvas 结构和 `initInteractiveDemo()` 逻辑
