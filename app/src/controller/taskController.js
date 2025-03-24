const express = require('express')
const router = express.Router()
const database = require('../model/index');
const { ROLE_MANAGER, ROLE_TECHNICIAN } = require('../model/enum');
const { taskModel, userModel } = database;
const verifyToken = require('../service/verifyTokenService')
const {sendLog} = require('../service/logService')

router.post('/', verifyToken, async (req, res) => {
    try {
        const user = await userModel.findOne({ where: { email: req.user.email } });

        if (user.role !== ROLE_TECHNICIAN) {
            return res.status(401).json({ error: 'Unauthorized: only technicians can create tasks' });
        }

        const data = await taskModel.create({
            summary: req.body.summary,
            completed_at: null,
            userId: user.id
        })

        return res.status(201).json({ data: `Your task has been created with ID #${data.id}` })
    } catch (error) {
        return res.status(500).json({ data: 'Internal server error' });
    }
})

router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await userModel.findOne({ where: { email: req.user.email } });

        const data = user.role === ROLE_MANAGER
            ? await taskModel.findAll()
            : await taskModel.findOne({ where: { userId: user.id } });

        if (!data) {
            return res.status(204).json({ data: data })
        }

        return res.status(200).json({ data: data })
    } catch (error) {
        return res.status(500).json({ data: 'Internal server error' });
    }
})

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const user = await userModel.findOne({ where: { email: req.user.email } });

        const data = user.role === ROLE_MANAGER
            ? await taskModel.findOne({ where: { id: req.params.id } })
            : await taskModel.findOne({ where: { id: req.params.id, userId: user.id } });

        if (!data && user.role !== ROLE_MANAGER) {
            return res.status(401).json({ error: 'Unauthorized: you are not allowed to see this task' });
        }
        
        if (!data) {
            return res.status(404).json({ data: `Task not found for ID #${req.params.id}` })
        }

        return res.status(200).json({ data: data })
    } catch (error) {
        return res.status(500).json({ data: 'Internal server error' });
    }
})

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const user = await userModel.findOne({ where: { email: req.user.email } });

        if (user.role !== ROLE_TECHNICIAN) {
            return res.status(401).json({ error: 'Unauthorized: only technicians can update tasks' });
        }

        const task = user.role === ROLE_MANAGER
            ? await taskModel.findOne({ where: { id: req.params.id } })
            : await taskModel.findOne({ where: { id: req.params.id, userId: user.id } });

        if (!task) {
            return res.status(404).json({ data: `Task not found for ID #${req.params.id}` })
        }

        const data = await taskModel.update({
            summary: req.body.summary,
            completed_at: req.body.completed ? new Date() : null,
        }, { where: { id: req.params.id, } })

        return res.status(200).json({ data: `Your task has been updated with ID #${req.params.id}` })
    } catch (error) {
        return res.status(500).json({ data: 'Internal server error' });
    }
})

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const user = await userModel.findOne({ where: { email: req.user.email } });

        if (user.role !== ROLE_MANAGER) {
            return res.status(401).json({ error: 'Unauthorized: only managers can delete tasks' });
        }

        const task = user.role === ROLE_MANAGER
            ? await taskModel.findOne({ where: { id: req.params.id } })
            : await taskModel.findOne({ where: { id: req.params.id, userId: user.id } });

        if (!task) {
            return res.status(404).json({ data: `Task not found for ID #${req.params.id}` })
        }

        await taskModel.destroy({ where: { id: task.id } })

        return res.status(200).json({ data: `Your task has been deleted with the email: ${task.id}` })
    } catch (error) {
        return res.status(500).json({ data: 'Internal server error' });
    }
})

router.patch('/completed/:id', verifyToken, async (req, res) => {
    try {
        const user = await userModel.findOne({ where: { email: req.user.email } });

        if (user.role !== ROLE_TECHNICIAN) {
            return res.status(401).json({ error: 'Unauthorized: only technicians can update tasks' });
        }

        const task = await taskModel.findOne({ where: { id: req.params.id, userId: user.id } })

        if (!task) {
            return res.status(404).json({ data: `Task not found for ID #${req.params.id}` })
        }

        const time = new Date();
        const data = await taskModel.update({
            completed_at: time,
        }, { where: { id: req.params.id, } })

        const text = `Task with ID #${req.params.id} updated to complete at: ` + time.toUTCString();
        await sendLog(text)

        return res.status(200).json({ data: data })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ data: 'Internal server error' });
    }
})

module.exports = router
