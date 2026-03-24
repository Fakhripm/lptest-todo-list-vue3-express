import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({ message: '用户名或密码不能为空' })
        }

        const existingUser = await User.findOne({ username })
        if (existingUser) {
            return res.status(400).json({ message: '用户名已存在' })
        }

        const user = new User({ username, password })
        await user.save()

        res.status(201).json({ message: '注册成功' })

    } catch (err) {
        res.status(500).json({ message: '服务器内部错误', error: err.message })
    }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        if (!username || !password) {
            return res.status(400).json({ message: '用户名或密码不能为空' })
        }

        const user = await User.findOne({ username })
        if (!user) {
            return res.status(400).json({ message: '用户名不存在' })
        }

        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            return res.status(400).json({ message: '密码错误' })
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.json(
            {
                message: '登录成功',
                token,
                user: { id: user._id, username: user.username }
            }
        )

    } catch (err) {
        res.status(500).json({ message: '服务器内部错误', error: err.message })
    }
})

export default router