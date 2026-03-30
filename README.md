

# Todo List Vue3 + Express

[图片: Todo应用演示]

## 项目简介

这是一个功能完整的全栈Todo待办事项管理应用，采用前后端分离架构。

- **前端技术**：Vue 3 + TypeScript + Vite + Pinia
- **后端技术**：Node.js + Express
- **数据库**：MongoDB
- **认证机制**：JWT (JSON Web Tokens)
- **代码规范**：ESLint + Prettier

## 项目结构

```
todo-list-vue3-express/
├── client/                 # 前端应用 (Vue 3)
│   ├── src/
│   │   ├── api/           # API接口
│   │   ├── assets/        # 静态资源
│   │   ├── components/   # 公共组件
│   │   ├── router/        # 路由配置
│   │   ├── stores/        # Pinia状态管理
│   │   ├── types/         # TypeScript类型
│   │   ├── utils/         # 工具函数
│   │   ├── views/         # 页面视图
│   │   ├── App.vue        # 根组件
│   │   └── main.ts        # 入口文件
│   ├── index.html        # HTML模板
│   ├── package.json      # 前端依赖
│   └── vite.config.ts    # Vite配置
├── server/                # 后端服务 (Express)
│   ├── config/           # 配置文件
│   │   └── db.js          # 数据库连接
│   ├── middleware/       # 中间件
│   │   └── auth.js        # 认证中间件
│   ├── models/           # 数据模型
│   │   ├── Todo.js       # Todo模型
│   │   └── User.js       # 用户模型
│   ├── routes/           # API路由
│   │   ├── auth.js        # 认证路由
│   │   └── todos.js      # Todo路由
│   ├── utils/            # 工具函数
│   │   └── dirname.js    # 目录路径工具
│   ├── .env.example      # 环境变量示例
│   ├── package.json     # 后端依赖
│   └── server.js       # 服务入口
├── .gitignore           # Git忽略文件
├── .prettierrc         # Prettier配置
├── eslint.config.js    # ESLint配置
└── README.md          # 项目说明
```

## 前置条件

在运行此项目前，您需要：

1. 安装 **Node.js** (推荐 v14+)
2. 安装并运行 **MongoDB** (本地或使用 MongoDB Atlas 云端)

## 安装与运行

### 1. 克隆项目

```bash
git clone https://gitee.com/its-emo/todo-list-vue3-express.git
cd todo-list-vue3-express
```

### 2. 安装后端依赖

```bash
cd server
npm install
```

### 3. 配置后端环境变量

复制 `.env.example` 文件为 `.env` 并填写相应配置：

```bash
cp server/.env.example server/.env
```

**环境变量说明**：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| MONGO_URI | MongoDB连接字符串 | mongodb://localhost:27017/todo |
| JWT_SECRET | JWT签名密钥 | your-secret-key |
| PORT | 服务器端口 | 3000 |

### 4. 启动后端服务

```bash
cd server
npm start
```

后端服务默认运行在 `http://localhost:3000`

### 5. 安装前端依赖

```bash
cd client
npm install
```

### 6. 启动前端开发服务

```bash
cd client
npm run dev
```

前端应用默认运行在 `http://localhost:5173`

## API接口详情

### 认证相关接口

#### 用户注册
- **Endpoint**: `POST /api/auth/register`
- **请求体**:
  ```json
  {
    "username": "用户名",
    "email": "邮箱地址",
    "password": "密码"
  }
  ```
- **响应**: 返回用户信息和JWT Token

#### 用户登录
- **Endpoint**: `POST /api/auth/login`
- **请求体**:
  ```json
  {
    "email": "邮箱地址",
    "password": "密码"
  }
  ```
- **响应**: 返回用户信息和JWT Token

### Todo相关接口

> ⚠️ **注意**：所有Todo接口需要在请求头中携带认证Token：`Authorization: Bearer