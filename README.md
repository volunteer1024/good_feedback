# Good Feedback (学习反馈系统)

这是一个基于 [Taro](https://taro.jd.com/) + React + TypeScript 开发的跨端学习反馈应用，支持微信小程序和 H5。项目旨在为教育机构或个人老师提供便捷的学员管理、考勤打卡及学习反馈生成功能。

## ✨ 核心功能

- **学员管理**：学员信息的增删改查，支持头像自动生成。
- **考勤打卡**：基于宫格的快捷签到/消课系统。
- **反馈生成**：生成精美的学员学习反馈图片，支持自定义内容和分享。
- **数据同步**：本地优先的存储策略，确保弱网环境下的可用性。

## 🛠 技术栈

- **框架**: Taro 3.x (React)
- **语言**: TypeScript / JavaScript
- **样式**: Less modules / Tailwind CSS (配合 `taro-plugin-tailwindcss`)
- **状态管理**: Zustand
- **后端**: 微信小程序云开发 (目前主要使用本地存储过渡)

## 📂 项目目录结构

```text
.
├── config/                # Taro 编译配置目录
├── docs/                  # 项目文档
├── example/               # 需求示例与参考资源
├── cloudfunctions/        # 微信云函数目录 (如启用)
├── src/
│   ├── components/        # 通用 UI 组件
│   ├── pages/             # 页面视图 (Page)
│   ├── services/          # 核心业务逻辑与 API 封装
│   ├── styles/            # 全局样式变量与 Mixins
│   ├── utils/             # 工具函数
│   ├── app.config.js      # 小程序全局配置
│   ├── app.js             # 应用入口逻辑
│   └── app.less           # 全局样式入口
├── .eslintrc              # ESLint 配置
├── package.json           # 项目依赖配置
└── project.config.json    # 微信开发者工具配置
```

## 🚀 快速开始

### 1. 环境准备

确保您的开发环境已安装：

- Node.js (推荐 v18+)
- PNPM (推荐) 或 NPM/Yarn
- 微信开发者工具 (用于小程序预览)

### 2. 安装依赖

```bash
pnpm install
```

### 3. 本地开发

**微信小程序模式：**

```bash
pnpm run dev:weapp
```

启动后，请打开「微信开发者工具」，导入本项目根目录即可预览。

**H5 模式：**

```bash
pnpm run dev:h5
```

启动后，浏览器访问 `http://localhost:10086` (端口视配置而定)。

### 4. 项目构建

```bash
# 构建微信小程序正式版
pnpm run build:weapp
```

## 📝 开发规范

详细开发规范请参考 [代码规范](./code-style-guide.md) (如果有) 或遵循以下原则：

- **组件化**：UI 组件与业务逻辑分离。
- **类型安全**：新功能强制使用 TypeScript。
- **样式隔离**：页面级样式使用 CSS Modules 或 Tailwind CSS 以避免污染。
