const express = require('express')
const router = express.Router()
const database = require('../model/index');
const { taskModel, userModel } = database;

// create
router.post('/', async (req, res) => {

    const user = await userModel.findOne({ where: { id: req.body.userId } });
    if (!user) {
        res.json({
            status: 404,
            data: `User not found for id #${req.body.userId}`
        })
        res.status(404)
    }

    const data = await taskModel.create({
        summary: req.body.summary,
        completed_at: req.body.completed ? new Date() : null,
        status: req.body.status,
        userId: user.id
    })

    res.json({ status: 201, data: data })
    res.status(201)
})

// read all
router.get('/', async (req, res) => {

    const data = await taskModel.findAll();
    if (!data) {
        res.json({
            status: 204,
            data: []
        })
        res.status(204)
    }

    res.json({ status: 200, data: data })
    res.status(200)
})

// read one
router.get('/:id', async (req, res) => {

    const data = await taskModel.findOne({ where: { id: req.params.id } });
    if (!data) {
        res.json({
            status: 404,
            data: `Task not found for id #${req.params.id}`
        })
        res.status(404)
    }

    res.json({ status: 200, data: data })
    res.status(200)

})

// update
router.put('/:id', async (req, res) => {

    const task = await taskModel.findOne({ where: { id: req.params.id } });
    if (!task) {
        res.json({
            status: 404,
            data: `Task not found for id #${req.params.id}`
        })
        res.status(404)
    }

    const user = await userModel.findOne({ where: { id: req.body.userId } });
    if (!user) {
        res.json({
            status: 404,
            data: `User not found for id #${req.body.userId}`
        })
        res.status(404)
    }

    const data = await taskModel.update({
        summary: req.body.summary,
        completed_at: req.body.completed ? new Date() : null,
        status: req.body.status,
        userId: user.id
    }, { where: { id: req.params.id, } })

    res.json({ status: 200, data: data })
    res.status(200)
})

// delete
router.delete('/:id', async (req, res) => {

    const task = await taskModel.findOne({ where: { id: req.params.id } });
    if (!task) {
        res.json({
            status: 404,
            data: `Task not found for id #${req.params.id}`
        })
        res.status(404)
    }

    const data = await taskModel.destroy({
        where: {
            id: task.id
        }
    })

    res.json({ status: 200, data: data })
    res.status(200)
})

module.exports = router

