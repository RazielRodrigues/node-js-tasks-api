const express = require('express')
const cors = require('cors')
const { startLog } = require('./src/service/logService')
const database = require('./src/model/index')
const app = express()

app.use(cors({ origin: process.env.CORS_ORIGIN + process.env.PORT }))
app.use(express.json())
app.listen(process.env.PORT, async () => {

    // Healthcheck
    console.log('\nSword health tasks API ready: ' + process.env.BASE_URL + ':' + process.env.PORT)

    // Iniciar a base de dados
    try {
        await database.connection.sync()
        console.log('\nDatabase Connected...')
    } catch (err) {
        console.warn(err);
    }

    // Iniciar o message broker
    try {
        await startLog();
        console.log('\nLogs Connected...');
    } catch (err) {
        console.warn(err);
    }

})

// Registrando controllers
const homeController = require('./src/controller/homeController')
app.use('/', homeController)

const loginController = require('./src/controller/loginController')
app.use('/login', loginController)

const taskController = require('./src/controller/taskController')
app.use('/task', taskController)

const userController = require('./src/controller/userController')
app.use('/user', userController)

module.exports = app