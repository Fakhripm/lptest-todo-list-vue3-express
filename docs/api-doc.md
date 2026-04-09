# Todo Project API 文档

## 1. 认证 API

### 1.1 注册接口
- **URL**: `/api/auth/register`
- **方法**: `POST`
- **功能**: 注册新用户

#### 请求参数
| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| `username` | String | 是 | 用户名，6-20位 |
| `password` | String | 是 | 密码，至少6位 |

#### 响应格式
- **成功** (201 Created):
  ```json
  {
    "message": "注册成功"
  }
  ```
- **失败** (400 Bad Request):
  ```json
  {
    "message": "用户名或密码不能为空"
  }
  ```
  或
  ```json
  {
    "message": "用户名需6-20位，密码至少6位"
  }
  ```
  或
  ```json
  {
    "message": "用户名已存在"
  }
  ```
- **服务器错误** (500 Internal Server Error):
  ```json
  {
    "message": "服务器内部错误",
    "error": "错误信息"
  }
  ```

### 1.2 登录接口
- **URL**: `/api/auth/login`
- **方法**: `POST`
- **功能**: 用户登录并获取JWT令牌

#### 请求参数
| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| `username` | String | 是 | 用户名 |
| `password` | String | 是 | 密码 |

#### 响应格式
- **成功** (200 OK):
  ```json
  {
    "message": "登录成功",
    "token": "JWT令牌",
    "user": {
      "id": "用户ID",
      "username": "用户名"
    }
  }
  ```
- **失败** (400 Bad Request):
  ```json
  {
    "message": "用户名或密码不能为空"
  }
  ```
- **认证失败** (401 Unauthorized):
  ```json
  {
    "message": "用户名或密码错误"
  }
  ```
- **服务器错误** (500 Internal Server Error):
  ```json
  {
    "message": "服务器内部错误",
    "error": "错误信息"
  }
  ```

## 2. 待办事项 API

> **注意**: 所有待办事项API都需要在请求头中包含认证令牌：
> ```
> Authorization: Bearer <JWT令牌>
> ```

### 2.1 获取待办事项列表
- **URL**: `/api/todos`
- **方法**: `GET`
- **功能**: 获取当前用户的所有待办事项

#### 响应格式
- **成功** (200 OK):
  ```json
  [
    {
      "_id": "任务ID",
      "title": "任务标题",
      "completed": false,
      "user": "用户ID",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "__v": 0
    },
    // 更多任务...
  ]
  ```
- **认证失败** (401 Unauthorized):
  ```json
  {
    "message": "未提供认证令牌"
  }
  ```
  或
  ```json
  {
    "message": "令牌无效或令牌已过期"
  }
  ```
- **服务器错误** (500 Internal Server Error):
  ```json
  {
    "message": "获取失败",
    "error": "错误信息"
  }
  ```

### 2.2 创建待办事项
- **URL**: `/api/todos`
- **方法**: `POST`
- **功能**: 创建新的待办事项

#### 请求参数
| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| `title` | String | 是 | 任务标题，不能为空 |

#### 响应格式
- **成功** (201 Created):
  ```json
  {
    "_id": "任务ID",
    "title": "任务标题",
    "completed": false,
    "user": "用户ID",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "__v": 0
  }
  ```
- **失败** (400 Bad Request):
  ```json
  {
    "message": "内容不能为空"
  }
  ```
- **认证失败** (401 Unauthorized):
  ```json
  {
    "message": "未提供认证令牌"
  }
  ```
  或
  ```json
  {
    "message": "令牌无效或令牌已过期"
  }
  ```
- **服务器错误** (500 Internal Server Error):
  ```json
  {
    "message": "创建失败",
    "error": "错误信息"
  }
  ```

### 2.3 更新待办事项
- **URL**: `/api/todos/:id`
- **方法**: `PUT`
- **功能**: 更新指定的待办事项

#### 请求参数
| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| `title` | String | 否 | 任务标题，不能为空 |
| `completed` | Boolean | 否 | 任务完成状态 |

#### 响应格式
- **成功** (200 OK):
  ```json
  {
    "_id": "任务ID",
    "title": "更新后的任务标题",
    "completed": true,
    "user": "用户ID",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "__v": 0
  }
  ```
- **失败** (400 Bad Request):
  ```json
  {
    "message": "任务内容不能为空"
  }
  ```
- **未找到** (404 Not Found):
  ```json
  {
    "message": "任务不存在"
  }
  ```
- **认证失败** (401 Unauthorized):
  ```json
  {
    "message": "未提供认证令牌"
  }
  ```
  或
  ```json
  {
    "message": "令牌无效或令牌已过期"
  }
  ```
- **服务器错误** (500 Internal Server Error):
  ```json
  {
    "message": "更新失败",
    "error": "错误信息"
  }
  ```

### 2.4 删除待办事项
- **URL**: `/api/todos/:id`
- **方法**: `DELETE`
- **功能**: 删除指定的待办事项

#### 响应格式
- **成功** (200 OK):
  ```json
  {
    "message": "删除成功"
  }
  ```
- **未找到** (404 Not Found):
  ```json
  {
    "message": "任务不存在"
  }
  ```
- **认证失败** (401 Unauthorized):
  ```json
  {
    "message": "未提供认证令牌"
  }
  ```
  或
  ```json
  {
    "message": "令牌无效或令牌已过期"
  }
  ```
- **服务器错误** (500 Internal Server Error):
  ```json
  {
    "message": "删除失败",
    "error": "错误信息"
  }
  ```

## 3. 认证机制

- 使用 JWT (JSON Web Token) 进行认证
- 登录成功后会返回 JWT 令牌
- 所有待办事项API需要在请求头中包含 `Authorization: Bearer <JWT令牌>`
- 令牌有效期为7天

## 4. 错误处理

- **400 Bad Request**: 请求参数错误
- **401 Unauthorized**: 认证失败
- **404 Not Found**: 资源不存在
- **500 Internal Server Error**: 服务器内部错误

## 5. 示例请求

### 注册请求
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

### 登录请求
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

### 获取待办事项
```http
GET /api/todos
Authorization: Bearer <JWT令牌>
```

### 创建待办事项
```http
POST /api/todos
Authorization: Bearer <JWT令牌>
Content-Type: application/json

{
  "title": "完成API文档"
}
```

### 更新待办事项
```http
PUT /api/todos/60a7a1f9e6b3f4001c8e4f5a
Authorization: Bearer <JWT令牌>
Content-Type: application/json

{
  "title": "更新后的任务",
  "completed": true
}
```

### 删除待办事项
```http
DELETE /api/todos/60a7a1f9e6b3f4001c8e4f5a
Authorization: Bearer <JWT令牌>
```

## 6. 注意事项

1. 所有待办事项操作都会自动关联到当前登录用户
2. 用户只能操作自己的待办事项
3. 密码会在服务器端进行加密存储
4. 生产环境下，错误信息会被隐藏，只返回"未知错误"

此API文档适用于测试人员进行接口测试，包含了所有可用的API端点、请求参数、响应格式和示例。