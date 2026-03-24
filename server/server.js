import express from 'express'
import 'dotenv/config'

const PORT = process.env.PORT || 3000;

const app = express()

app.use(express.json())

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: '服务器运行正常' })
})

app.listen(PORT, () => {
    console.log(`后端端口已启动:\n http://127.0.0.1:${PORT}`);
})