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

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    });
};

// Registrando controllers e rotas
const homeController = require('./src/controller/homeController')
app.use('/', homeController)

const taskController = require('./src/controller/taskController')
app.use('/task', verifyToken, taskController)

const userController = require('./src/controller/userController')
app.use('/user', userController)