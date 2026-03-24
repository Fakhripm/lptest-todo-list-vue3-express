import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import todoRoutes from './routes/todos.js';

// 连接数据库
connectDB();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: '服务器运行正常' });
});

// 错误处理
app.use((err, req, res, next) => {
    console.error("捕获到全局错误:", err);
    res.status(500).json({
        message: '服务器内部错误',
        error: err.message,
        stack: err.stack
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
});