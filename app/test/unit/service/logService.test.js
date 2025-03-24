const { expect } = require('chai');
const sinon = require('sinon');
const amqplib = require('amqplib');
const { startLog, sendLog } = require('../../../src/service/logService');

describe('logQueue Unit Tests', () => {
    let amqplibConnectStub, connectionCreateChannelStub, channelAssertExchangeStub, channelAssertQueueStub, channelBindQueueStub, channelConsumeStub, channelPublishStub;

    beforeEach(() => {
        amqplibConnectStub = sinon.stub(amqplib, 'connect');
        connectionCreateChannelStub = sinon.stub();
        channelAssertExchangeStub = sinon.stub();
        channelAssertQueueStub = sinon.stub();
        channelBindQueueStub = sinon.stub();
        channelConsumeStub = sinon.stub();
        channelPublishStub = sinon.stub();

        const mockConnection = {
            createChannel: connectionCreateChannelStub,
            close: sinon.stub().resolves()
        };
        const mockChannel = {
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

            expect(amqplibConnectStub.calledWith(process.env.MESSAGE_BROKER)).to.be.true;
            expect(connectionCreateChannelStub.calledOnce).to.be.true;
            expect(channelAssertExchangeStub.calledWith(exchange, 'fanout', { durable: false })).to.be.true;
            expect(channelAssertQueueStub.calledWith('', { exclusive: true })).to.be.true;
            expect(channelBindQueueStub.calledWith(queue, exchange, '')).to.be.true;
            expect(channelConsumeStub.calledWith(queue, sinon.match.func, { noAck: true })).to.be.true;
            expect(process.listeners('SIGINT').length).to.equal(1);
        });
    });

    describe('sendLog Function', () => {
        it('should send a message to the exchange successfully', async () => {
            const text = 'Test message';
            const exchange = 'logs';

            await sendLog(text);

            expect(amqplibConnectStub.calledWith(process.env.MESSAGE_BROKER)).to.be.true;
            expect(connectionCreateChannelStub.calledOnce).to.be.true;
            expect(channelAssertExchangeStub.calledWith(exchange, 'fanout', { durable: false })).to.be.true;
            expect(channelPublishStub.calledWith(exchange, '', Buffer.from(text))).to.be.true;
            expect(connectionCreateChannelStub.returnValues[0].close.calledOnce).to.be.true;
        });
    });
});