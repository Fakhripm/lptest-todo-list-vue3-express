import express from 'express'
import Todo from '../models/Todo.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()
router.use(authMiddleware)

// GET /api/todos
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.userId }).sort({ createdAt: -1 })
        res.json(todos)
    } catch (err) {
        res.status(500).json({ messgae: '获取失败', error: err.message })
    }
})

// POST /api/todos
router.post('/', async (req, res) => {
    try {
        const { title } = req.body
        if (!title?.trim()) {
            res.status(400).json({ messgae: '内容不能为空' })
            return
        }

        const todo = new Todo({ user: req.userId, title: title.trim() })
        await todo.save()
        res.status(201).json(todo)
    } catch (err) {
        res.status(500).json({ messgae: '创建失败', error: err.message })
    }
})

// PUT /api/todos/:id
router.put('/:id', async (req, res) => {
    try {
        const { title, completed } = req.body
        const updateData = {}
        if (title !== undefined) updateData.title = title.trim()
        if (completed !== undefined) updateData.completed = completed

        const todo = await Todo.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            updateData,
            { returnDocument: 'after' }
        )

        if (!todo) return res.status(404).json({ message: '任务不存在' });
        res.json(todo);

    } catch (err) {
        res.status(500).json({ message: '更新失败', error: err.message });
    }
})

// DELETE /api/todos/:id
router.delete('/:id', async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!todo) return res.status(404).json({ message: '任务不存在' });
        res.json({ message: '删除成功' });
    } catch (err) {
        res.status(500).json({ message: '删除失败', error: err.message });
    }
});

export default router