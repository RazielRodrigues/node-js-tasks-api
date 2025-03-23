const express = require('express')
const router = express.Router()
const database = require('../model/index')
const { userModel } = database;

// create
router.post('/', async (req, res) => {
    let data = null;

    data = await userModel.create({
        email: 'tech@mail.com',
        password: 12345678,
        role: 'technician',
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
        data = await userModel.findByPK(req.params.id);
    }

    data = await userModel.findAll();

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

    const user = userModel.findByPK(req.params.id)
    if (!user) {
        res.json({
            status: 404,
        })
    }

    await userModel.update({
        email: 'tech@mail.update.com',
        password: 12345678,
        role: 'technician',
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

    const user = userModel.findByPK(req.params.id)
    if (!user) {
        res.json({
            status: 404,
        })
    }

    await userModel.destroy({
        where: {
            id: user.id
        }
    })

    res.json({
        status: 200,
    })
})

module.exports = router