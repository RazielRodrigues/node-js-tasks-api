const amqp = require('amqplib');

const startLog = async () => {
    let connection = null;
    try {
        connection = await amqp.connect(process.env.MESSAGE_BROKER);
        const channel = await connection.createChannel();

        process.once('SIGINT', async () => {
            await channel.close();
            await connection.close();
        });

        await channel.assertExchange('logs', 'fanout', { durable: false });

        const { queue } = await channel.assertQueue('', { exclusive: true });
        await channel.bindQueue(queue, 'logs', '')

        await channel.consume(queue, (message) => {
            if (message) console.log(" [x] '%s'", message.content.toString());
            else console.warn('Consumer cancelled...');
        }, { noAck: true });

    } catch (err) {
        console.warn(err);
    }
}

const sendLog = async (text) => {
    let connection = null;
    try {
        connection = await amqp.connect(process.env.MESSAGE_BROKER);
        const channel = await connection.createChannel();

        await channel.assertExchange('logs', 'fanout', { durable: false });

        channel.publish('logs', '', Buffer.from(text));
        console.log(" [x] Sent '%s'", text);

        await channel.close();
    } catch (err) {
        console.warn(err);
        await connection.close();
    } finally {
        if (connection) {
            await connection.close();
        }
    };
}

module.exports = {
    startLog,
    sendLog,
}