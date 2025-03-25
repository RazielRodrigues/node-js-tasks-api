const axios = require('axios');
const { expect } = require('chai');

const BASE_URL = `http://sword_health_tasks_api_node:3000`;

describe('Task Controller Integration Tests', () => {
    let techToken = '';
    let managerToken = '';
    let createdTaskId = '';

    before(async () => {
        try {
            
            try {
                await axios.post(`${BASE_URL}/user`, {
                    email: 'mail@tech.com',
                    password: '12345678',
                    role: 2
                });
            } catch (error) {
                
            }

            const techLogin = await axios.post(`${BASE_URL}/login`, {
                email: 'mail@tech.com',
                password: '12345678'
            });

            techToken = techLogin.data.data;

            try {
                await axios.post(`${BASE_URL}/user`, {
                    email: 'mail@manager.com',
                    password: '12345678',
                    role: 1
                });
            } catch (error) {
                
            }

            const managerLogin = await axios.post(`${BASE_URL}/login`, {
                email: 'mail@manager.com',
                password: '12345678'
            });
            managerToken = managerLogin.data.data;
        } catch (error) {
            console.error('Authentication setup failed:', error.response ? error.response.data : error.message);
            throw error;
        }
    });

    describe('POST /task - Create Task', () => {
        it('should create a task for a technician', async () => {
            try {
                const response = await axios.post(`${BASE_URL}/task`,
                    { summary: 'Test task creation' },
                    {
                        headers: { 'Authorization': `Bearer ${techToken}` },
                        validateStatus: status => status >= 200 && status < 600
                    }
                );

                expect(response.status).to.equal(201);
                expect(response.data.data).to.include('Your task has been created with ID');

                createdTaskId = response.data.data.match(/#(\d+)/)[1];
            } catch (error) {
                console.error('Task creation failed:', error.response ? error.response.data : error.message);
                throw error;
            }
        });

        it('should prevent non-technicians from creating tasks', async () => {
            try {
                const response = await axios.post(`${BASE_URL}/task`,
                    { summary: 'Unauthorized task creation' },
                    {
                        headers: { 'Authorization': `Bearer ${managerToken}` },
                        validateStatus: status => status >= 200 && status < 600
                    }
                );

                expect(response.status).to.equal(401);
            } catch (error) {
                console.error('Unauthorized task creation test failed:', error.response ? error.response.data : error.message);
                throw error;
            }
        });
    });

    describe('GET /task - Retrieve Tasks', () => {
        it('should get tasks for a technician', async () => {
            try {
                const response = await axios.get(`${BASE_URL}/task`, {
                    headers: { 'Authorization': `Bearer ${techToken}` },
                    validateStatus: status => status >= 200 && status < 600
                });

                expect(response.status).to.equal(200);
                expect(response.data).to.have.property('data');
                expect(Array.isArray(response.data.data)).to.be.true;
            } catch (error) {
                console.error('Task retrieval failed:', error.response ? error.response.data : error.message);
                throw error;
            }
        });

        it('should get all tasks for a manager', async () => {
            try {
                const response = await axios.get(`${BASE_URL}/task`, {
                    headers: { 'Authorization': `Bearer ${managerToken}` },
                    validateStatus: status => status >= 200 && status < 600
                });

                expect(response.status).to.equal(200);
                expect(response.data).to.have.property('data');
                expect(Array.isArray(response.data.data)).to.be.true;
            } catch (error) {
                console.error('Manager task retrieval failed:', error.response ? error.response.data : error.message);
                throw error;
            }
        });
    });

    describe('GET /task/:id - Retrieve Single Task', () => {
        it('should get a specific task by ID', async () => {
            try {
                const response = await axios.get(`${BASE_URL}/task/${createdTaskId}`, {
                    headers: { 'Authorization': `Bearer ${techToken}` },
                    validateStatus: status => status >= 200 && status < 600
                });

                expect(response.status).to.equal(200);
                expect(response.data).to.have.property('data');
                expect(response.data.data.id.toString()).to.equal(createdTaskId);
            } catch (error) {
                console.error('Single task retrieval failed:', error.response ? error.response.data : error.message);
                throw error;
            }
        });
    });

    describe('PUT /task/:id - Update Task', () => {
        it('should update a task', async () => {
            try {
                const response = await axios.put(`${BASE_URL}/task/${createdTaskId}`,
                    {
                        summary: 'Updated test task',
                        completed: false
                    },
                    {
                        headers: { 'Authorization': `Bearer ${techToken}` },
                        validateStatus: status => status >= 200 && status < 600
                    }
                );

                expect(response.status).to.equal(200);
                expect(response.data.data).to.include(`Your task has been updated with ID`);
            } catch (error) {
                console.error('Task update failed:', error.response ? error.response.data : error.message);
                throw error;
            }
        });
    });

    describe('PATCH /task/completed/:id - Complete Task', () => {
        it('should mark a task as completed', async () => {
            try {
                const response = await axios.patch(`${BASE_URL}/task/completed/${createdTaskId}`,
                    {},
                    {
                        headers: { 'Authorization': `Bearer ${techToken}` },
                        validateStatus: status => status >= 200 && status < 600
                    }
                );

                expect(response.status).to.equal(200);
            } catch (error) {
                console.error('Task completion failed:', error.response ? error.response.data : error.message);
                throw error;
            }
        });
    });

    describe('DELETE /task/:id - Delete Task', () => {
        it('should delete a task', async () => {
            try {
                const response = await axios.delete(`${BASE_URL}/task/${createdTaskId}`, {
                    headers: { 'Authorization': `Bearer ${managerToken}` },
                    validateStatus: status => status >= 200 && status < 600
                });

                expect(response.status).to.equal(200);
            } catch (error) {
                console.error('Task deletion failed:', error.response ? error.response.data : error.message);
                throw error;
            }
        });
    });
});