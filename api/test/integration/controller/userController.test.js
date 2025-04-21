const axios = require('axios');
const { expect } = require('chai');

const BASE_URL = `http://node_js_tasks_api_node:3000`;

describe('User Controller Integration Tests', () => {
    let managerToken = '';
    let techToken = '';
    let createdUserId = '';
    let createdUserEmail = '';

    before(async () => {
        try {
            // Create and login as a manager
            try {
                await axios.post(`${BASE_URL}/user`, {
                    email: 'mail@manager.com',
                    password: '12345678',
                    role: 1
                });
            } catch (error) {
                // Ignore if user already exists
            }

            const managerLogin = await axios.post(`${BASE_URL}/login`, {
                email: 'mail@manager.com',
                password: '12345678'
            });
            managerToken = managerLogin.data.data;

            // Create and login as a tech user
            try {
                await axios.post(`${BASE_URL}/user`, {
                    email: 'mail@tech.com',
                    password: '12345678',
                    role: 2
                });
            } catch (error) {
                // Ignore if user already exists
            }

            const techLogin = await axios.post(`${BASE_URL}/login`, {
                email: 'mail@tech.com',
                password: '12345678'
            });
            techToken = techLogin.data.data;
        } catch (error) {
            console.error('Authentication setup failed:', error.response ? error.response.data : error.message);
            throw error;
        }
    });

/*     describe('POST /user - Create User', () => {
        it('should create a new user', async () => {
            try {
                const response = await axios.post(`${BASE_URL}/user`, {
                    email: 'newuser@test.com',
                    password: '12345678',
                    role: 2
                });

                expect(response.status).to.equal(201);
                expect(response.data.data).to.include('Your user has been created with the email: newuser@test.com');
                createdUserEmail = 'newuser@test.com';
            } catch (error) {
                console.error('User creation failed:', error.response ? error.response.data : error.message);
                throw error;
            }
        });

        it('should prevent creating a user with an existing email', async () => {
            try {
                const response = await axios.post(`${BASE_URL}/user`, {
                    email: 'newuser@test.com',
                    password: '12345678',
                    role: 2
                });

                expect(response.status).to.equal(400);
                expect(response.data.data).to.equal('Email already exists');
            } catch (error) {
                console.error('Duplicate user creation test failed:', error.response ? error.response.data : error.message);
                throw error;
            }
        });

        it('should prevent creating a user with a password shorter than 8 characters', async () => {
            try {
                const response = await axios.post(`${BASE_URL}/user`, {
                    email: 'shortpassword@test.com',
                    password: '1234567',
                    role: 2
                });

                expect(response.status).to.equal(400);
                expect(response.data.data).to.equal('Your password should be at least 8 digits');
            } catch (error) {
                console.error('Short password test failed:', error.response ? error.response.data : error.message);
                throw error;
            }
        });
    }); */

    describe('GET /user - Retrieve Users', () => {
        it('should allow manager to retrieve all users', async () => {
            try {
                const response = await axios.get(`${BASE_URL}/user`, {
                    headers: { 'Authorization': `Bearer ${managerToken}` }
                });

                expect(response.status).to.equal(200);
                expect(response.data).to.have.property('data');
                expect(Array.isArray(response.data.data)).to.be.true;
            } catch (error) {
                console.error('User retrieval failed:', error.response ? error.response.data : error.message);
                throw error;
            }
        });

        it('should prevent non-manager from retrieving users', async () => {
            try {
                const response = await axios.get(`${BASE_URL}/user`, {
                    headers: { 'Authorization': `Bearer ${techToken}` },
                    validateStatus: status => status >= 200 && status < 600
                });

                expect(response.status).to.equal(401);
                expect(response.data.error).to.equal('Unauthorized: only managers can see users');
            } catch (error) {
                console.error('Unauthorized user retrieval test failed:', error.response ? error.response.data : error.message);
                throw error;
            }
        });
    });

/*     describe('GET /user/:id - Retrieve Single User', () => {
        before(async () => {
            // Get the ID of the newly created user
            const users = await axios.get(`${BASE_URL}/user`, {
                headers: { 'Authorization': `Bearer ${managerToken}` }
            });
            const newUser = users.data.data.find(user => user.email === createdUserEmail);
            createdUserId = newUser.id;
        });

        it('should retrieve a specific user by ID for managers', async () => {
            try {
                const response = await axios.get(`${BASE_URL}/user/${createdUserId}`, {
                    headers: { 'Authorization': `Bearer ${managerToken}` }
                });

                expect(response.status).to.equal(200);
                expect(response.data.data.email).to.equal(createdUserEmail);
            } catch (error) {
                console.error('Single user retrieval failed:', error.response ? error.response.data : error.message);
                throw error;
            }
        });

        it('should prevent non-managers from retrieving a user', async () => {
            try {
                const response = await axios.get(`${BASE_URL}/user/${createdUserId}`, {
                    headers: { 'Authorization': `Bearer ${techToken}` },
                    validateStatus: status => status >= 200 && status < 600
                });

                expect(response.status).to.equal(401);
                expect(response.data.error).to.equal('Unauthorized: only managers can see users');
            } catch (error) {
                console.error('Unauthorized single user retrieval test failed:', error.response ? error.response.data : error.message);
                throw error;
            }
        });

        it('should return 404 for non-existent user ID', async () => {
            try {
                const response = await axios.get(`${BASE_URL}/user/999999`, {
                    headers: { 'Authorization': `Bearer ${managerToken}` },
                    validateStatus: status => status >= 200 && status < 600
                });

                expect(response.status).to.equal(404);
                expect(response.data.data).to.include('User not found for ID #999999');
            } catch (error) {
                console.error('Non-existent user retrieval test failed:', error.response ? error.response.data : error.message);
                throw error;
            }
        });
    }); */

 /*    describe('PUT /user/:id - Update User', () => {
        it('should update a user', async () => {
            try {
                const response = await axios.put(`${BASE_URL}/user/${createdUserId}`, {
                    email: 'updateduser@test.com',
                    password: '87654321',
                    role: 1
                }, {
                    headers: { 'Authorization': `Bearer ${managerToken}` }
                });

                expect(response.status).to.equal(200);
                expect(response.data.data).to.include(`Your user has been updated with the ID: ${createdUserId}`);
            } catch (error) {
                console.error('User update failed:', error.response ? error.response.data : error.message);
                throw error;
            }
        });

        it('should prevent updating to an existing email', async () => {
            try {
                const response = await axios.put(`${BASE_URL}/user/${createdUserId}`, {
                    email: 'mail@manager.com',
                    password: '87654321',
                    role: 1
                }, {
                    headers: { 'Authorization': `Bearer ${managerToken}` },
                    validateStatus: status => status >= 200 && status < 600
                });

                expect(response.status).to.equal(401);
                expect(response.data.data).to.equal('User already exists');
            } catch (error) {
                console.error('Duplicate email update test failed:', error.response ? error.response.data : error.message);
                throw error;
            }
        });

        it('should return 404 when updating a non-existent user', async () => {
            try {
                const response = await axios.put(`${BASE_URL}/user/999999`, {
                    email: 'nonexistent@test.com',
                    password: '87654321',
                    role: 1
                }, {
                    headers: { 'Authorization': `Bearer ${managerToken}` },
                    validateStatus: status => status >= 200 && status < 600
                });

                expect(response.status).to.equal(404);
                expect(response.data.data).to.include('User not found for ID #999999');
            } catch (error) {
                console.error('Non-existent user update test failed:', error.response ? error.response.data : error.message);
                throw error;
            }
        });
    });
 */
/*     describe('DELETE /user/:id - Delete User', () => {
        it('should delete a user', async () => {
            try {
                const response = await axios.delete(`${BASE_URL}/user/${createdUserId}`, {
                    headers: { 'Authorization': `Bearer ${managerToken}` }
                });

                expect(response.status).to.equal(200);
                expect(response.data.data).to.include(`Your user has been deleted with the ID: ${createdUserId}`);
            } catch (error) {
                console.error('User deletion failed:', error.response ? error.response.data : error.message);
                throw error;
            }
        });

        it('should prevent non-managers from deleting users', async () => {
            try {
                const response = await axios.delete(`${BASE_URL}/user/${createdUserId}`, {
                    headers: { 'Authorization': `Bearer ${techToken}` },
                    validateStatus: status => status >= 200 && status < 600
                });

                expect(response.status).to.equal(401);
                expect(response.data.error).to.equal('Unauthorized: only managers can delete users');
            } catch (error) {
                console.error('Unauthorized user deletion test failed:', error.response ? error.response.data : error.message);
                throw error;
            }
        });

        it('should return 404 when deleting a non-existent user', async () => {
            try {
                const response = await axios.delete(`${BASE_URL}/user/999999`, {
                    headers: { 'Authorization': `Bearer ${managerToken}` },
                    validateStatus: status => status >= 200 && status < 600
                });

                expect(response.status).to.equal(404);
                expect(response.data.data).to.include('User not found for ID #999999');
            } catch (error) {
                console.error('Non-existent user deletion test failed:', error.response ? error.response.data : error.message);
                throw error;
            }
        });
    }); */
});