const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const loginToken = require('../../../src/service/loginTokenService'); // Ajuste o caminho conforme necessário

describe('loginToken Unit Tests', () => {
    let bcryptCompareStub, jwtSignStub;

    beforeEach(() => {
        // Mock the bcrypt.compare method
        bcryptCompareStub = sinon.stub(bcrypt, 'compare');

        // Mock the jwt.sign method
        jwtSignStub = sinon.stub(jwt, 'sign');
    });

    afterEach(() => {
        // Restore original methods
        sinon.restore();
    });

    it('should return null if user is not provided', async () => {
        const req = { body: { email: 'test@example.com', password: 'password123' } };
        const user = null;
        const result = await loginToken(req, user);

        expect(result).to.be.null; // Expect null when user is not provided
    });

    it('should return null if password is invalid', async () => {
        const req = { body: { email: 'test@example.com', password: 'wrongPassword' } };
        const mockUser = { email: 'test@example.com', password: 'hashedPassword' };
        bcryptCompareStub.resolves(false); // Password does not match

        const result = await loginToken(req, mockUser);

        expect(result).to.be.null; // Expect null when password is invalid
    });

    it('should return a JWT token if credentials are valid', async () => {
        const req = { body: { email: 'test@example.com', password: 'password123' } };
        const mockUser = { email: 'test@example.com', password: 'hashedPassword' };
        bcryptCompareStub.resolves(true); // Password matches
        const mockToken = 'mock-jwt-token';
        jwtSignStub.returns(mockToken);

        const result = await loginToken(req, mockUser);

        expect(result).to.equal(mockToken); // Expect the generated JWT token
        expect(jwtSignStub.calledWith({ email: mockUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' })).to.be.true;
    });

    it('should handle unexpected errors gracefully', async () => {
        const req = { body: { email: 'test@example.com', password: 'password123' } };
        const mockUser = { email: 'test@example.com', password: 'hashedPassword' };
        bcryptCompareStub.rejects(new Error('Bcrypt error'));

        try {
            await loginToken(req, mockUser);
        } catch (error) {
            expect(error.message).to.equal('Bcrypt error'); // Expect the error message
        }
    });
});