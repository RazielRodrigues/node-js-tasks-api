const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors({ origin: 'http://localhost:' + process.env.PORT }))
app.use(express.json())
app.listen(process.env.PORT, () => {
    console.log('Server ready: ' + process.env.PORT)
})

// Base de dados
const db = require('./src/model/index')
db.sequelize.sync().then(() => { console.log('Database up'); }).catch((err) => { console.log(err); })

// Controllers
// • We’ll evaluate security, quality and readability of your code;
// The technician performs tasks and is only able to see, create or update his own
// performed tasks.
// The manager can see tasks from all the technicians, delete them, and should be
// notified when some tech performs a task

// Features:
// • Create API endpoint to save a new task;
// • Create API endpoint to list tasks;
// • Notify manager of each task performed by the tech(This notification can be
// just a print saying “The tech X performed the task Y on date Z”);
// • This notification should not block any http request.

// Bonus
// • Use a message broker to decouple notification logic from the application flow;
// • Create Kubernetes object files needed to deploy this application.

app.get('/', async (req, res) => {
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