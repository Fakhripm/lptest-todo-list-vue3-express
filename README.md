

# Todo List Vue3-Express

[Repository URL](https://gitee.com/its-emo/todo-list-vue3-express)

一个使用 Vue 3 + Express + MongoDB 构建的 TODO 应用。

## 项目介绍

这是一个前后端分离的全栈 TODO 应用，采用 Vue 3 作为前端框架，Express.js 作为后端框架，MongoDB 作为数据库。支持用户的注册登录、任务的增删改查等核心功能。

## 技术栈

### 前端
- **Vue 3** - 渐进式前端框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **Pinia** - 轻量级状态管理
- **Vue Router** - 路由管理
- **Element Plus** - UI 组件库
- **Vite** - 现代构建工具

### 后端
- **Express.js** - Node.js Web 框架
- **MongoDB** - NoSQL 数据库
- **JWT** - JSON Web Token 认证

## 项目结构

```
todo-project/
├── client/                    # 前端代码
│   ├── src/
│   │   ├── api/               # API 接口封装
│   │   ├── assets/            # 静态资源
│   │   │   └── styles/        # 样式文件
│   │   ├── composables/       # 可复用的组合式函数
│   │   ├── router/            # 路由配置
│   │   ├── stores/            # Pinia 状态管理
│   │   ├── types/             # TypeScript 类型定义
│   │   ├── utils/             # 工具函数
│   │   ├── views/             # 页面组件
│   │   │   ├── auth/          # 认证相关视图
│   │   │   └── todo/          # TODO 相关视图
│   │   ├── App.vue            # 根组件
│   │   └── main.ts            # 应用入口
│   ├── vite.config.ts         # Vite 配置
│   └── package.json           # 前端依赖配置
│
├── server/                    # 后端代码
│   ├── config/                # 后端配置
│   ├── middleware/            # 中间件
│   ├── models/                # 数据模型
│   ├── routes/               # 路由
│   ├── utils/                # 工具函数
│   ├── server.js             # 服务器入口
│   └── package.json          # 后端依赖配置
│
└── README.md                 # 项目说明文档
```

## 功能特性

- 用户注册和登录
- JWT 令牌认证
- 任务的增加、删除、修改、查询
- 任务状态管理
- 响应式设计
- 完善的错误处理和提示

## 快速开始

### 前端安装

```bash
# 进入前端目录
cd client

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 后端安装

```bash
# 进入后端目录
cd server

# 安装依赖
npm install

# 复制环境变量配置文件
cp .env.example .env

# 启动服务器
npm start
```

## 环境变量配置

### 前端 (.env)

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 后端 (.env)

```env
MONGO_URI=mongodb://localhost:27017/todo-app
JWT_SECRET=your-secret-key
PORT=3000
```

## 开发命令

### 前端

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览生产版本 |
| `npm run lint` | 代码检查 |

### 后端

| 命令 | 说明 |
|------|------|
| `npm start` | 启动生产服务器 |
| `npm run dev` | 启动开发服务器 |

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

[MIT](https://gitee.com/its-emo/todo-list-vue3-express/blob/master/LICENSE)