const { expect } = require('chai');
const sinon = require('sinon');
const amqplib = require('amqplib');
const { startLog, sendLog } = require('../../../src/service/logService');

describe('logQueue Unit Tests', () => {
    let amqplibConnectStub, connectionCreateChannelStub, channelAssertExchangeStub, channelAssertQueueStub, channelBindQueueStub, channelConsumeStub, channelPublishStub, mockConnection, mockChannel;

    beforeEach(() => {
        amqplibConnectStub = sinon.stub(amqplib, 'connect');
        connectionCreateChannelStub = sinon.stub();
        channelAssertExchangeStub = sinon.stub();
        channelAssertQueueStub = sinon.stub();
        channelBindQueueStub = sinon.stub();
        channelConsumeStub = sinon.stub();
        channelPublishStub = sinon.stub();

        mockConnection = {
            createChannel: connectionCreateChannelStub,
            close: sinon.stub().resolves()
        };
        mockChannel = {
            assertExchange: channelAssertExchangeStub,
            assertQueue: channelAssertQueueStub,
            bindQueue: channelBindQueueStub,
            consume: channelConsumeStub,
            publish: channelPublishStub,
            close: sinon.stub().resolves()
        };

        amqplibConnectStub.resolves(mockConnection);
        connectionCreateChannelStub.resolves(mockChannel);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('startLog Function', () => {
        it('should start logging successfully', async () => {
            const exchange = 'logs';
            const queue = 'test_queue';

            channelAssertQueueStub.resolves({ queue });

            await startLog();

            expect(connectionCreateChannelStub.calledOnce).to.be.true;
            expect(channelAssertExchangeStub.calledWith(exchange, 'fanout', { durable: false })).to.be.true;
            expect(channelAssertQueueStub.calledWith('', { exclusive: true })).to.be.true;
            expect(channelBindQueueStub.calledWith(queue, exchange, '')).to.be.true;
            expect(channelConsumeStub.calledWith(queue, sinon.match.func, { noAck: true })).to.be.true;
            expect(process.listeners('SIGINT').length).to.equal(2); // SIGINT listener added
        });

        it('should log message when consuming', async () => {
            const queue = 'test_queue';
            const consoleLogSpy = sinon.spy(console, 'log');

            channelAssertQueueStub.resolves({ queue });
            channelConsumeStub.callsFake((queue, callback) => {
                callback({ content: Buffer.from('Test message') });
            });

            await startLog();

            expect(consoleLogSpy.calledWith(" [x] 'Test message'")).to.be.true;
            consoleLogSpy.restore();
        });

        it('should warn when consumer is cancelled (null message)', async () => {
            const queue = 'test_queue';
            const consoleWarnSpy = sinon.spy(console, 'warn');

            channelAssertQueueStub.resolves({ queue });
            channelConsumeStub.callsFake((queue, callback) => {
                callback(null); 
            });

            await startLog();

            expect(consoleWarnSpy.calledWith('Consumer cancelled...')).to.be.true;
            consoleWarnSpy.restore();
        });

        it('should handle connection errors gracefully', async () => {
            const consoleWarnSpy = sinon.spy(console, 'warn');
            amqplibConnectStub.rejects(new Error('Connection failed'));

            await startLog();

            expect(consoleWarnSpy.calledWith(sinon.match.instanceOf(Error))).to.be.true;
            consoleWarnSpy.restore();
        });

        it('should close connection and channel on SIGINT', async () => {
            const exchange = 'logs';
            const queue = 'test_queue';

            channelAssertQueueStub.resolves({ queue });

            await startLog();

            const sigintHandler = process.listeners('SIGINT')[1];
            await sigintHandler();

            expect(mockChannel.close.calledOnce).to.be.true;
            expect(mockConnection.close.calledOnce).to.be.true;
        });
    });

    describe('sendLog Function', () => {
        it('should send a message to the exchange successfully', async () => {
            const text = 'Test message';
            const exchange = 'logs';
            const consoleLogSpy = sinon.spy(console, 'log');

            await sendLog(text);

            expect(connectionCreateChannelStub.calledOnce).to.be.true;
            expect(channelAssertExchangeStub.calledWith(exchange, 'fanout', { durable: false })).to.be.true;
            expect(channelPublishStub.calledWith(exchange, '', Buffer.from(text))).to.be.true;
            expect(consoleLogSpy.calledWith(" [x] Sent 'Test message'")).to.be.true;
            expect(mockChannel.close.calledOnce).to.be.true;
            expect(mockConnection.close.calledOnce).to.be.true;
            consoleLogSpy.restore();
        });

        it('should handle errors and close connection gracefully', async () => {
            const text = 'Test message';
            const consoleWarnSpy = sinon.spy(console, 'warn');
            amqplibConnectStub.rejects(new Error('Connection failed'));

            await sendLog(text);

            expect(consoleWarnSpy.calledWith(sinon.match.instanceOf(Error))).to.be.true;
            expect(mockConnection.close.calledOnce).to.be.true;
            consoleWarnSpy.restore();
        });
    });
});