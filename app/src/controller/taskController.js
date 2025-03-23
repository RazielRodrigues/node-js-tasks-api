const express = require('express')
const router = express.Router()
const database = require('../model/index');
const { taskModel, userModel } = database;

// todo: transfer to other file
const ROLE_MANAGER = 1
const ROLE_TECHNICIAN = 2

router.post('/', async (req, res) => {
    try {
        const user = await userModel.findOne({ where: { email: req.user.email } });

        const data = await taskModel.create({
            summary: req.body.summary, // todo: add encryption
            completed_at: null,
            userId: user.id
        })

        res.status(201).json({ data: data })
    } catch (error) {
        res.status(500).json({ data: 'Internal server error' });
    }
})

router.get('/', async (req, res) => {
    try {
        const user = await userModel.findOne({ where: { email: req.user.email } });

        const data = user.role === ROLE_MANAGER
            ? await taskModel.findAll()
            : await taskModel.findAll({ where: { userId: user.id } });

        if (!data) {
            res.status(204).json({ data: data })
        }

        res.status(200).json({ data: data })
    } catch (error) {
        res.status(500).json({ data: 'Internal server error' });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const user = await userModel.findOne({ where: { email: req.user.email } });

        const data = user.role === ROLE_MANAGER
            ? await taskModel.findOne({ where: { id: req.params.id } })
            : await taskModel.findOne({ where: { id: req.params.id, userId: user.id } });

        if (!data) {
            res.status(404).json({ data: `Task not found for ID #${req.params.id}` })
        }

        res.status(200).json({ data: data })
    } catch (error) {
        res.status(500).json({ data: 'Internal server error' });
    }
})

router.put('/:id', async (req, res) => {
    try {
        const user = await userModel.findOne({ where: { email: req.user.email } });

        const task = user.role === ROLE_MANAGER
            ? await taskModel.findOne({ where: { id: req.params.id } })
            : await taskModel.findOne({ where: { id: req.params.id, userId: user.id } });

        if (!task) {
            res.status(404).json({ data: `Task not found for ID #${req.params.id}` })
        }

        const data = await taskModel.update({
            summary: req.body.summary, // todo: add encryption
            completed_at: req.body.completed ? new Date() : null,
        }, { where: { id: req.params.id, } })

        res.status(200).json({ data: data })
    } catch (error) {
        res.status(500).json({ data: 'Internal server error' });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const user = await userModel.findOne({ where: { email: req.user.email } });

        const task = user.role === ROLE_MANAGER
            ? await taskModel.findOne({ where: { id: req.params.id } })
            : await taskModel.findOne({ where: { id: req.params.id, userId: user.id } });

        if (!task) {
            res.status(404).json({ data: `Task not found for ID #${req.params.id}` })
        }

        const data = await taskModel.destroy({ where: { id: task.id } })

        res.status(200).json({ data: data })
    } catch (error) {
        res.status(500).json({ data: 'Internal server error' });
    }
})

router.put('/completed/:id', async (req, res) => {
    try {
        const user = await userModel.findOne({ where: { email: req.user.email } });

        if (user.role !== ROLE_TECHNICIAN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const task = await taskModel.findOne({ where: { id: req.params.id, userId: user.id } })

        if (!task) {
            res.status(404).json({ data: `Task not found for ID #${req.params.id}` })
        }

        const data = await taskModel.update({
            completed_at: new Date(),
        }, { where: { id: req.params.id, } })

        // todo: add message broker
        console.log(`Task with ID #${req.params.id} updated to complete`);

        res.status(200).json({ data: data })
    } catch (error) {
        res.status(500).json({ data: 'Internal server error' });
    }
})

module.exports = router
