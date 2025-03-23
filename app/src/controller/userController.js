const express = require('express')
const router = express.Router()
const database = require('../model/index')
const { userModel } = database;

// create
router.post('/', async (req, res) => {

    const data = await userModel.create({
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
    })

    res.json({ status: 201, data: data })
    res.status(201)
})

// read all
router.get('/', async (req, res) => {

    const data = await userModel.findAll();
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

    const data = await userModel.findOne({ where: { id: req.params.id } });
    if (!data) {
        res.json({
            status: 404,
            data: `User not found for id #${req.params.id}`
        })
        res.status(404)
    }

    res.json({ status: 200, data: data })
    res.status(200)
})

// update
router.put('/:id', async (req, res) => {

    const user = await userModel.findOne({ where: { id: req.params.id } });
    if (!user) {
        res.json({
            status: 404,
            data: `User not found for id #${req.params.id}`
        })
        res.status(404)
    }

    const data = await userModel.update({
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
    }, { where: { id: req.params.id, } })

    res.json({ status: 200, data: data })
    res.status(200)
})

// delete
router.delete('/:id', async (req, res) => {

    const user = await userModel.findOne({ where: { id: req.params.id } });
    if (!user) {
        res.json({
            status: 404,
            data: `User not found for id #${req.params.id}`
        })
        res.status(404)
    }

    const data = await userModel.destroy({
        where: {
            id: user.id
        }
    })

    res.json({ status: 200, data: data })
    res.status(200)
})

module.exports = router