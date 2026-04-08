import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// 注册接口
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. 基础参数校验
        if (!username || !password) {
            return res.status(400).json({ message: '用户名或密码不能为空' });
        }
        // 前置校验（与 Schema 保持一致）
        if (username.trim().length < 6 || username.trim().length > 20 || password.length < 6) {
            return res.status(400).json({ message: '用户名需6-20位，密码至少6位' });
        }

        // 2. 检查用户名是否已存在
        const existingUser = await User.findOne({ username: username.trim() });
        if (existingUser) {
            return res.status(400).json({ message: '用户名已存在' });
        }

        // 3. 创建并保存用户（此处可能触发 Schema 长度验证）
        const user = new User({ username: username.trim(), password });
        await user.save();

        res.status(201).json({ message: '注册成功' });

    } catch (err) {
        if (err.name === 'ValidationError') {
            // 提取第一个错误信息返回
            const errorMsg = Object.values(err.errors)[0].message;
            return res.status(400).json({ message: errorMsg });
        }
        // 其他服务器错误
        res.status(500).json({ message: '服务器内部错误', error: err.message });
    }
});

// 登录接口
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 基础校验
        if (!username || !password) {
            return res.status(400).json({ message: '用户名或密码不能为空' });
        }

        // 查找用户并显式返回密码（因为模型中设置了 select: false）
        const user = await User.findOne({ username: username.trim() }).select('+password');
        if (!user) {
            return res.status(401).json({ message: '用户名或密码错误' });
        }

        // 比对密码
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: '用户名或密码错误' });
        }

        // 校验 JWT 密钥是否存在
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET 环境变量未配置');
        }

        // 生成 JWT 令牌
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: '登录成功',
            token,
            user: { id: user._id, username: user.username }
        });

    } catch (err) {
        res.status(500).json({
            message: '服务器内部错误',
            error: process.env.NODE_ENV === 'development' ? err.message : '未知错误'
        });
    }
});

export default router;