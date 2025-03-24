const axios = require('axios');
const { expect } = require('chai');
const BASE_URL = `http://localhost:${process.env.BASE_URL || 3000}`;

describe('Home Route Integration Test', () => {
    it('should return welcome message with correct structure', async () => {
        try {
            const response = await axios.get(BASE_URL + '/');

            expect(response.status).to.equal(200);
            expect(response.headers['content-type']).to.include('application/json');
            expect(response.data).to.have.property('data');
            expect(response.data.data).to.include.all.keys(
                'message',
                'description',
                'repository',
                'doc'
            );

            expect(response.data.data.message).to.be.a('string');
            expect(response.data.data.message).to.equal('Welcome to the sword health tasks API');
            expect(response.data.data.repository).to.equal('https://github.com/RazielRodrigues/sword-health-tasks-api');
            expect(response.data.data.description).to.equal('Get your token and start managing your tasks');
            expect(response.data.data.repository).to.match(/^https:\/\/github\.com/);
            expect(response.data.data.doc).to.match(/^https:\/\/github\.com/);
        } catch (error) {
            console.error('Test failed:', error.response ? error.response.data : error.message);
            throw error;
        }
    });
});