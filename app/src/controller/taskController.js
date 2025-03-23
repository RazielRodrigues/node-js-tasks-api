const express = require('express')
const router = express.Router()
const db = require('./src/model/index')
const task = require('./src/model/task')

router.get('/', async (req, res) => {
    await db.user.create({
        email: 'mail@mail.com',
        password: '12345678',
        role: 1,
    })

    await db.user.update({
        email: 'mail@update.com',
        password: '12345678',
        role: 'manager',
    }, { where: { id: 1, } })

    await db.user.update({
        email: 'mail@update.com',
        password: '12345678',
        role: 2,
    }, { where: { id: 1, } })

    const users = await db.user.findAll({ include: db.task })

    await db.task.create({
        summary: 'mail@mail.com',
        completed_at: null,
        status: 1,
        usuarioId: 1
    })

    const tasks = await db.task.findAll({
        where: {
            usuarioId: 2
        }
    })

    res.json({
        users: users,
    })
})

module.exports = router