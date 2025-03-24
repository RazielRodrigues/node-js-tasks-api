const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken');
const app = express()
const database = require('./src/model/index')
const amqp = require('amqplib');

app.use(cors({ origin: process.env.CORS_ORIGIN + process.env.PORT }))
app.use(express.json())
app.listen(process.env.PORT, () => {

    // Message broker com rabbimq https://github.com/amqp-node/amqplib/tree/main/examples/tutorials
    (async () => {
        try {

            const exchange = 'logs';
            const connection = await amqp.connect(process.env.MESSAGE_BROKER);
            const channel = await connection.createChannel();

            process.once('SIGINT', async () => {
                await channel.close();
                await connection.close();
            });

            await channel.assertExchange(exchange, 'fanout', { durable: false });

            const { queue } = await channel.assertQueue('', { exclusive: true });
            await channel.bindQueue(queue, exchange, '')

            await channel.consume(queue, (message) => {
                if (message) console.log(" [x] '%s'", message.content.toString());
                else console.warn(' [x] Consumer cancelled');
            }, { noAck: true });

            console.log(' [*] Waiting for logs. To exit press CTRL+C');
        } catch (err) {
            console.warn(err);
        }
    })();

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