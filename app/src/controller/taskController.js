const express = require('express')
const router = express.Router()
const database = require('../model/index');
const { taskModel, userModel } = database;

// create
router.post('/', async (req, res) => {
    try {
        const user = await userModel.findOne({ where: { id: req.body.userId } });

        if (!user) {
            res.status(404).json({ data: `User not found for ID #${req.body.userId}` })
        }

        const data = await taskModel.create({
            summary: req.body.summary,
            completed_at: req.body.completed ? new Date() : null,
            status: req.body.status,
            userId: user.id
        })

        res.status(201).json({ data: data })
    } catch (error) {
        res.status(500).json({ data: 'Internal server error' });
    }
})

// read all
router.get('/', async (req, res) => {
    try {
        const data = await taskModel.findAll();

        if (!data) {
            res.status(204).json({ data: data })
        }

        res.status(200).json({ data: data })
    } catch (error) {
        res.status(500).json({ data: 'Internal server error' });
    }
})

// read one
router.get('/:id', async (req, res) => {
    try {
        const data = await taskModel.findOne({ where: { id: req.params.id } });

        if (!data) {
            res.status(404).json({ data: `Task not found for ID #${req.params.id}` })
        }

        res.status(200).json({ data: data })
    } catch (error) {
        res.status(500).json({ data: 'Internal server error' });
    }
})

// update
router.put('/:id', async (req, res) => {
    try {

        const task = await taskModel.findOne({ where: { id: req.params.id } });

        if (!task) {
            res.status(404).json({ data: `Task not found for ID #${req.params.id}` })
        }

        const user = await userModel.findOne({ where: { id: req.body.userId } });

        if (!user) {
            res.status(404).json({ data: `User not found for ID #${req.body.userId}` })
        }

        const data = await taskModel.update({
            summary: req.body.summary,
            completed_at: req.body.completed ? new Date() : null,
            status: req.body.status,
            userId: user.id
        }, { where: { id: req.params.id, } })

        res.status(200).json({ data: data })
    } catch (error) {
        res.status(500).json({ data: 'Internal server error' });
    }
})

// delete
router.delete('/:id', async (req, res) => {
    try {

        const task = await taskModel.findOne({ where: { id: req.params.id } });

        if (!task) {
            res.status(404).json({ data: `Task not found for ID #${req.params.id}` })
        }

        const data = await taskModel.destroy({
            where: {
                id: task.id
            }
        })

        res.status(200).json({ data: data })
    } catch (error) {
        res.status(500).json({ data: 'Internal server error' });
    }
})

module.exports = router

