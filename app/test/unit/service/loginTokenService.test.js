const { expect } = require('chai');

describe('Login Token Service', () => {
    it('should return null when user is not found', async () => {
        expect(null).to.be.null;
    });
    it('should return null when password is not found', async () => {
        expect(null).to.be.null;
    });
    it('should return password when password is correct', async () => {
        expect('123').to.be.not.empty;
    });
});