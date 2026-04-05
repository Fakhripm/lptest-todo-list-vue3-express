

# Todo Project

一个使用 Vue 3 + Express + MongoDB 构建的 TODO 应用。

## 项目结构

```
todo-project/
├── client/             # 前端代码
│   ├── src/            # 前端源代码
│   │   ├── api/        # API 接口封装
│   │   ├── assets/     # 静态资源
│   │   ├── composables/ # 可复用的组合式函数
│   │   ├── router/     # 路由配置
│   │   ├── stores/     # Pinia 状态管理
│   │   ├── types/      # TypeScript 类型定义
│   │   ├── utils/      # 工具函数
│   │   ├── views/      # 页面组件
│   │   ├── App.vue     # 根组件
│   │   └── main.ts     # 应用入口
│   ├── package.json    # 前端依赖配置
│   └── vite.config.ts  # Vite 配置
├── server/             # 后端代码
│   ├── config/         # 后端配置
│   ├── middleware/     # 中间件
│   ├── models/         # 数据模型
│   ├── routes/         # 路由
│   ├── server.js       # 服务器入口
│   └── package.json    # 后端依赖配置
├── .gitignore          # Git 忽略规则
└── README.md           # 项目说明文档
```

## 技术栈

### 前端
- Vue 3 + TypeScript
- Pinia（状态管理）
- Vue Router（路由管理）
- Element Plus（UI 组件库）
- Vite（构建工具）

### 后端
- Express.js（Web 框架）
- MongoDB（数据库）
- JWT（认证）

## 安装步骤

### 前端
1. 进入 client 目录：`cd client`
2. 安装依赖：`npm install`
3. 启动开发服务器：`npm run dev`

### 后端
1. 进入 server 目录：`cd server`
2. 安装依赖：`npm install`
3. 复制 `.env.example` 为 `.env` 并配置环境变量
4. 启动服务器：`npm start`

## 环境变量

### 前端
创建 `.env` 文件，配置以下环境变量：
```
VITE_API_BASE_URL=http://localhost:3000/api
```

### 后端
创建 `.env` 文件，配置以下环境变量：
```
MONGO_URI=mongodb://localhost:27017/todo-app
JWT_SECRET=your-secret-key
PORT=3000
```

## 功能特性
- 用户注册和登录
- 任务的增删改查
- 任务状态管理
- 响应式设计
- 错误处理和提示

## 部署

### 前端
1. 构建生产版本：`npm run build`
2. 将 `dist` 目录部署到静态文件服务器

### 后端
1. 部署到 Node.js 服务器
2. 配置环境变量
3. 启动服务

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT