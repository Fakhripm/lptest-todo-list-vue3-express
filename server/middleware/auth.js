import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: '未提供认证令牌' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ message: '令牌无效或令牌已过期' })
    }
}

export default authMiddleware