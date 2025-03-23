const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors({ origin: process.env.CORS_ORIGIN + process.env.PORT }))
app.use(express.json())
app.listen(process.env.PORT, () => {
    console.log('Sword health tasks api ready: ' + process.env.PORT)
})

// Sync da base de dados (adicionar migrations?)
db.connection.sync().then(() => { console.log('Database Connected...'); }).catch((err) => { console.log(err); })

// Registrando controllers e rotas
const taskController = require('./src/routes/taskController')
app.get('/task', taskController)

const userController = require('./src/routes/userController')
app.get('/user', userController)