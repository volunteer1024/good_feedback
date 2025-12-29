# Taro 开发踩坑记录 (Taro Pitfalls)

本文档用于记录在使用 Taro 进行微信小程序开发过程中遇到的各种“坑”及其解决方案，方便后续查阅和避免重复踩坑。

## 1. 原生组件 (Input/Textarea) 在 iOS 上的悬浮与残影问题

### 🔴 问题描述

在 iOS 真机或真机模拟环境下，当 `<Input>` 或 `<Textarea>` 组件位于：

1.  可滚动的区域（`ScrollView` 或 `View` 设置了 `overflow: auto/scroll`）内；
2.  `position: fixed` 的模态框 (Modal) 内；

用户进行滚动操作或拖动页面时，输入框内的**文字内容**会出现“悬浮”、“残影”或“漂移”的现象，即文字没有紧贴输入框背景移动，或者显示在模态框层级之上（穿透）。

### 🧐 原因分析

微信小程序中的 `<Input>` 和 `<Textarea>` 是**原生组件 (Native Components)**，其渲染层级高于 WebView 层（即普通的 `View`, `Text` 等组件）。

在 iOS 的 WebKit 内核实现中，原生组件覆盖在 WebView 之上。当 WebView 内容滚动时，原生组件的位置需要通过 JSBridge 通信进行更新。这种通信存在微小的延迟，导致视觉上出现“文字跟不上背景”或“文字漂浮”的错觉。此外，原生组件的高层级特性也容易导致其穿透普通的 `z-index` 遮罩。

### ✅ 解决方案

给 `<Input>` 组件添加 `always-embed` 属性。

```jsx
<Input
  always-embed // 关键属性
  className="input-box"
  placeholder="请输入..."
  // ... 其他属性
/>
```

### 💡 `always-embed` 特性说明

- **作用**：强制 `<Input>` 组件在 iOS 下使用**同层渲染 (Same-layer Rendering)** 模式。
- **效果**：开启后，`<Input>` 组件的行为更像是一个普通的 Web 组件，它会正确地遵循 CSS 的层级（z-index）和滚动行为，彻底解决了悬浮和残影问题。
- **适用范围**：仅 iOS 有效（Android 天然支持同层渲染，通常没有此问题）。

### ⚠️ 注意事项

1.  **Textarea 组件**：`Textarea` 也是原生组件，但它**不**支持 `always-embed` 属性。对于 `Textarea` 的穿透问题，通常建议：
    - 在非编辑状态下，使用 `<View>` 或 `<RichText>` 显示内容。
    - 点击后切换为 `<Textarea>` 并自动聚焦。
    - 或者尽量避免将 `Textarea` 放入复杂的滚动或 Fixed 容器中。
2.  **键盘遮挡**：开启 `always-embed` 后，有时键盘弹起的行为会有所变化。如果遇到键盘遮挡输入框，配合 `adjust-position="{{true}}"` (默认) 或手动处理键盘高度。

---

## 2. ScrollView 与 Flex 布局

_（记录其他踩坑，如 ScrollView 默认不支持 gap 属性等）_

- **问题**：在 `ScrollView` 的直接子元素上使用 `display: flex` 和 `gap` 属性，在某些真机上可能失效或布局错乱。
- **解决**：在 `ScrollView` 内部再包裹一层 `View` 作为 Flex 容器，或者使用 margin 替代 gap。

```jsx
<ScrollView scrollY>
  <View className="flex-container">
    {' '}
    {/* 在这里应用 flex 和 gap */}
    {/* items */}
  </View>
</ScrollView>
```
