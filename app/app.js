const express = require('express')
const cors = require('cors')
const app = express()
const database = require('./src/model/index')

app.use(cors({ origin: process.env.CORS_ORIGIN + process.env.PORT }))
app.use(express.json())
app.listen(process.env.PORT, () => {
    console.log('Sword health tasks api ready: ' + process.env.PORT)
})

// Sync da base de dados (adicionar migrations?)
database.connection.sync().then(() => { console.log('Database Connected...'); }).catch((err) => { console.log(err); })

// Registrando controllers e rotas
const homeController = require('./src/controller/homeController')
app.get('/', homeController)

const taskController = require('./src/controller/taskController')
app.get('/task', taskController)

const userController = require('./src/controller/userController')
app.get('/user', userController)