const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken');
const app = express()
const database = require('./src/model/index')

app.use(cors({ origin: process.env.CORS_ORIGIN + process.env.PORT }))
app.use(express.json())
app.listen(process.env.PORT, () => {
    console.log('Sword health tasks api ready: ' + process.env.PORT)
})

// Token middleware
const verifyToken = (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    token = token.replace('Bearer ', '');
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        req.user = decoded;
        next();
    });
};

// Sync da base de dados (adicionar migrations?)
database.connection.sync().then(() => { console.log('Database Connected...'); }).catch((err) => { console.log(err); })

// Registrando controllers e rotas
const homeController = require('./src/controller/homeController')
app.use('/', homeController)

const loginController = require('./src/controller/loginController')
app.use('/login', loginController)

const taskController = require('./src/controller/taskController')
app.use('/task', verifyToken, taskController)

const userController = require('./src/controller/userController')
app.use('/user', verifyToken, userController)