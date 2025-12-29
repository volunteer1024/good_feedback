# 用户管理 (Student Management)

## 1. 用户列表 (Student List)

### 1.1 核心展示

- **头像 (Avatar)**:
  - 优先展示用户上传的头像图片。-若无图片，自动根据用户姓名生成“莫兰迪色系背景 + 首字母大写”的默认头像。
- **基础信息**: 显示用户完整姓名 (Full Name)
- **状态标签 (Status)**: 根据用户状态显示对应标签（In Class / Paused / Graduated）。
- **关键数据**: 醒目展示剩余课时 (Remaining Hours)。

### 1.2 交互功能

- **搜索 (Search)**: 顶部提供搜索框，支持通过姓名进行模糊匹配搜索。
- **筛选 (Filter)**: 提供 Tab 切换，支持按状态筛选用户列表：
  - All (全部)
  - In Class (在读)
  - Paused (停课)
  - Graduated (结课)
- **快捷入口**:
  - 顶部右侧 "+" 按钮：触发【新增用户】流程。
  - 点击单条用户卡片：触发【用户编辑】流程。

---

## 2. 新增用户 (Add Student)

### 2.1 交互形式

- 点击 "+" 按钮唤起模态框 (Modal)。
- 包含“取消”与“提交”操作按钮。

### 2.2 字段定义

| 字段名              | 类型   | 必填   | 说明                                          |
| :------------------ | :----- | :----- | :-------------------------------------------- |
| **Avatar**          | Image  | 否     | 支持点击调用系统相册/相机上传；为空时自动生成 |
| **Full Name**       | String | **是** | 用户全名                                      |
| **Nickname**        | String | 否     | 用于反馈生成图中的昵称展示                    |
| **Gender**          | Enum   | 否     | 选项：Female, Male, Other                     |
| **Birthday**        | Date   | 否     | 用于生日提醒                                  |
| **Remaining Hours** | Number | 否     | 初始剩余课时，默认为 0                        |
| **Fee Standard**    | Number | 否     | 单节课费用标准 ($/Sess)                       |
| **Remarks**         | Text   | 否     | 备注信息                                      |

### 2.3 默认逻辑

- 新增用户的状态 (Status) 默认为 `In Class`。
- 系统自动生成唯一 ID。

---

## 3. 用户编辑 (Edit Student)

### 3.1 交互形式

- 点击列表卡片唤起模态框，回显当前用户所有信息。

### 3.2 功能要求

- 支持修改上述【新增用户】中的所有字段。
- **状态变更** (UI 设计稿包含，代码待同步): 支持切换用户状态 (In Class / Paused / Graduated)。
  - _注：当前代码逻辑中 Update 操作已支持 status 字段更新，需在前端表单补充对应 Radio Group 组件。_

---

## 4. 技术实现细节

### 4.1 数据存储

- 使用 `Taro.setStorageSync` / `getStorageSync` 进行本地数据持久化。
- Storage Key: `STUDENTS_DATA`。

### 4.2 头像算法

- 颜色池：预设 10 种莫兰迪色值。
- 逻辑：取姓名最后一个字符的 CharCode 对颜色池长度取模，确定背景色。

### 4.3 状态枚举

- `In Class`: 正常在读 (绿色/默认)
- `Paused`: 停课/请假 (橙色)
- `Graduated`: 毕业/结课 (灰色)
