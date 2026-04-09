import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
    throw new Error('错误：JWT_SECRET 环境变量未配置');
}

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');

    // 严格校验请求头格式
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: '未提供认证令牌或格式错误' });
    }

    // 提取并过滤空令牌
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) {
        return res.status(401).json({ message: '认证令牌不能为空' });
    }

    try {
        // 🔴 核心安全：强制指定算法 HS256，杜绝攻击
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });

        // 校验用户ID是否存在
        if (!decoded.userId) {
            return res.status(401).json({ message: '令牌无效：用户信息缺失' });
        }

        req.userId = decoded.userId;
        next();
    } catch (err) {
        // 精细化区分错误（可选，推荐加上）
        const msg = err.name === 'TokenExpiredError'
            ? '令牌已过期，请重新登录'
            : '令牌无效或被篡改';

        res.status(401).json({ message: msg });
    }
};

export default authMiddleware;