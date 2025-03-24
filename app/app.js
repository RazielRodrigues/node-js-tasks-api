const express = require('express')
const cors = require('cors')
const app = express()
const database = require('./src/model/index')
const amqp = require('amqplib');
app.use(cors({ origin: process.env.CORS_ORIGIN + process.env.PORT }))
app.use(express.json())
app.listen(process.env.PORT, () => {

    // inciei o rabbitMQ
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

            console.log('\n[*] Waiting for API logs...');
        } catch (err) {
            healthcheck = 504;
            console.warn(err);
        }
    })();

    // Iniciando a base de dados
    (async () => {
        try {
            await database.connection.sync()
            console.log('\nDatabase Connected...')
        } catch (err) {
            healthcheck = 504;
            console.warn(err);
        }
    })();

    // Message
    (async () => {
        console.log('\nSword health tasks API ready: ' + process.env.DOMAIN + ':' + process.env.PORT)
    })();

})

// Registrando controllers e rotas
const homeController = require('./src/controller/homeController')
app.use('/', homeController)

const loginController = require('./src/controller/loginController')
app.use('/login', loginController)

const taskController = require('./src/controller/taskController')
app.use('/task', taskController)

const userController = require('./src/controller/userController')
app.use('/user', userController)