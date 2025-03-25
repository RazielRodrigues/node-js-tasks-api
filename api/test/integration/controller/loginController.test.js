const axios = require('axios');
const { expect } = require('chai');

const BASE_URL = `http://sword_health_tasks_api_node:3000`;

describe('Login Route Integration Test', () => {

    it('should return 401 for invalid credentials', async () => {
        try {
            const invalidCredentials = {
                email: 'mail@manager.com',
                password: '12312'
            };

            const response = await axios.post(`${BASE_URL}/login`, invalidCredentials, {
                validateStatus: function (status) {
                    return status >= 200 && status < 600;
                }
            });

            expect(response.status).to.equal(401);

            expect(response.data).to.have.property('data');
            expect(response.data.data).to.equal('Invalid credentials');
        } catch (error) {
            console.error('Test failed:', error.response ? error.response.data : error.message);
            throw error;
        }
    });

    it('should return token for valid credentials', async () => {
        try {

            try {
                await axios.post(`${BASE_URL}/user`, {
                    email: 'mail@tech.com',
                    password: '12345678',
                    role: 2
                });
            } catch (error) {
                
            }

            const validCredentials = {
                email: 'mail@manager.com',
                password: '12345678'
            };

            const response = await axios.post(`${BASE_URL}/login`, validCredentials, {
                validateStatus: function (status) {
                    return status >= 200 && status < 600;
                }
            });

            expect(response.status).to.equal(200);
            expect(response.data).to.have.property('data');

            const token = response.data.data;
            expect(token).to.be.a('string');
            expect(token.length).to.be.greaterThan(10);
        } catch (error) {
            console.error('Test failed:', error.response ? error.response.data : error.message);
            throw error;
        }
    });
});