# Todo Project

## 项目简介

这是一个功能完整的Todo应用后端服务，提供用户认证和Todo管理的API接口。

- **后端技术**：Node.js, Express
- **数据库**：MongoDB
- **认证机制**：JWT (JSON Web Tokens)
- **代码规范**：ESLint, Prettier

## 前置条件

在运行此项目前，您需要：

1. 安装 **Node.js** (推荐 v14+)
2. 安装并运行 **MongoDB** (本地或云端MongoDB Atlas)

## 安装与运行

### 1. 克隆项目

```bash
git clone <repository-url>
cd todo-project
```

### 2. 安装依赖

```bash
cd server
npm install
```

### 3. 配置环境变量

复制 `.env.example` 文件为 `.env` 并填写相应的配置：

```bash
cp .env.example .env
```

**环境变量内容**：

```env
# 数据库连接字符串
MONGO_URI=<your-mongodb-connection-string>

# JWT密钥
JWT_SECRET=<your-jwt-secret>

# 服务器端口
PORT=3000
```

### 4. 启动服务

```bash
cd server
npm start
```

后端服务默认运行在 `http://localhost:3000`

## 项目结构

```
todo-project/
├── server/            # 后端服务
│   ├── config/        # 配置文件
│   │   └── db.js      # 数据库连接配置
│   ├── middleware/    # 中间件
│   │   └── auth.js    # 认证中间件
│   ├── models/        # 数据模型
│   │   ├── Todo.js    # Todo模型
│   │   └── User.js    # 用户模型
│   ├── routes/        # API路由
│   │   ├── auth.js    # 认证相关路由
│   │   └── todos.js   # Todo相关路由
│   ├── utils/         # 工具函数
│   │   └── dirname.js # 目录路径工具
│   ├── .env.example   # 环境变量示例
│   ├── package.json   # 后端依赖
│   └── server.js      # 后端入口文件
├── .gitignore         # Git忽略文件
├── .prettierrc        # Prettier配置
├── eslint.config.js   # ESLint配置
└── README.md          # 项目说明
```

## API接口详情

### 认证相关接口

#### 1. 注册用户
- **请求方式**：POST `/api/auth/register`
- **请求体**：
  ```json
  {
    "username": "用户名",
    "email": "邮箱地址",
    "password": "密码"
  }
  ```
- **响应**：包含用户信息和token

#### 2. 用户登录
- **请求方式**：POST `/api/auth/login`
- **请求体**：
  ```json
  {
    "email": "邮箱地址",
    "password": "密码"
  }
  ```
- **响应**：包含用户信息和token

### Todo相关接口

**注意**：所有Todo接口都需要在请求头中携带 `Authorization: Bearer <token>`

#### 1. 获取所有Todo
- **请求方式**：GET `/api/todos`
- **响应**：返回当前用户的所有Todo列表

#### 2. 创建Todo
- **请求方式**：POST `/api/todos`
- **请求体**：
  ```json
  {
    "title": "Todo标题",
    "description": "Todo描述",
    "completed": false
  }
  ```
- **响应**：返回创建的Todo详情

#### 3. 更新Todo
- **请求方式**：PUT `/api/todos/:id`
- **请求体**：
  ```json
  {
    "title": "更新的标题",
    "description": "更新的描述",
    "completed": true
  }
  ```
- **响应**：返回更新后的Todo详情

#### 4. 删除Todo
- **请求方式**：DELETE `/api/todos/:id`
- **响应**：返回删除成功的消息

## 许可证

MIT License