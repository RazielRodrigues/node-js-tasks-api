const express = require('express')
const router = express.Router()
const database = require('../model/index')
const { taskModel } = database;

// create
router.post('/', async (req, res) => {
    let data = null;

    data = await taskModel.create({
        summary: 'mail@mail.com' + Math.random(),
        completed_at: null,
        status: 1,
        usuarioId: 1
    })

    res.json({
        status: 200,
        data: data
    })
})

// read
router.get('/', async (req, res) => {
    let data = null;

    if (req.params.id) {
        data = await taskModel.findByPK(req.params.id);
    }

    data = await taskModel.findAll();

    res.json({
        status: 200,
        data: data
    })
})

// update
router.put('/', async (req, res) => {

    if (!req.params.id) {
        res.json({
            status: 500,
        })
    }

    const task = taskModel.findByPK(req.params.id)
    if (!task) {
        res.json({
            status: 404,
        })
    }

    await taskModel.update({
        summary: 'mail@mail.com' + Math.random(),
        completed_at: null,
        status: 1,
        // usuarioId: 1
    }, { where: { id: req.params.id, } })

    res.json({
        status: 200,
    })
})

// delete
router.delete('/', async (req, res) => {

    if (!req.params.id) {
        res.json({
            status: 500,
        })
    }

    const task = taskModel.findByPK(req.params.id)
    if (!task) {
        res.json({
            status: 404,
        })
    }

    await taskModel.destroy({
        where: {
            id: task.id
        }
    })

    res.json({
        status: 200,
    })
})

module.exports = router