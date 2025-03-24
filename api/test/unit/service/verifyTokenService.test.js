const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const verifyToken = require('../../../src/service/verifyTokenService');

describe('verifyToken Middleware Unit Tests', () => {
    let req, res, next;

    beforeEach(() => {
        req = { headers: {} };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy(),
        };
        next = sinon.spy();
    });

    it('should return 401 if no token is provided', () => {
        req.headers = {};

        verifyToken(req, res, next);

        expect(res.status.calledWith(401)).to.be.true;
        expect(res.json.calledWith({ error: 'Unauthorized' })).to.be.true;
        expect(next.called).to.be.false;
    });

    it('should return 401 if token is invalid', () => {
        req.headers = { authorization: 'Bearer invalid-token' };

        sinon.stub(jwt, 'verify').callsArgWith(2, new Error('Invalid token'));

        verifyToken(req, res, next);

        expect(res.status.calledWith(401)).to.be.true;
        expect(res.json.calledWith({ error: 'Unauthorized' })).to.be.true;
        expect(next.called).to.be.false;

        jwt.verify.restore();
    });

    it('should call next() and set req.user if token is valid', () => {
        const validToken = 'valid-token';
        const decodedPayload = { userId: 123 };
        req.headers = { authorization: `Bearer ${validToken}` };

        sinon.stub(jwt, 'verify').callsArgWith(2, null, decodedPayload);

        verifyToken(req, res, next);

        expect(req.user).to.deep.equal(decodedPayload);
        expect(next.calledOnce).to.be.true;
        expect(res.status.called).to.be.false;
        expect(res.json.called).to.be.false;

        jwt.verify.restore();
    });

    it('should handle tokens without Bearer prefix gracefully', () => {
        req.headers = { authorization: 'invalid-token' };

        verifyToken(req, res, next);

        expect(res.status.calledWith(401)).to.be.true;
        expect(res.json.calledWith({ error: 'Unauthorized' })).to.be.true;
        expect(next.called).to.be.false; 
    });
});