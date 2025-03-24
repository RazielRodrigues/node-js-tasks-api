const { expect } = require('chai');
const SequelizeMock = require('sequelize-mock');
const taskModelFactory = require('../../../src/model/taskModel');

describe('Task Model Unit Tests', () => {
    let sequelizeMock;
    let TaskModel;

    before(() => {
        sequelizeMock = new SequelizeMock();
        TaskModel = taskModelFactory(sequelizeMock);
    });

    describe('Model Definition', () => {
        it('should define the "task" model with correct fields', () => {


            const attributes = TaskModel._defaults;


            expect(attributes.summary).to.exist;
            expect(attributes.summary.type.key).to.equal('STRING');
            expect(attributes.summary.allowNull).to.be.false;
            expect(attributes.summary.validate.notEmpty).to.be.true;

            expect(attributes.completed_at).to.exist;
            expect(attributes.completed_at.type.key).to.equal('DATE');
            expect(attributes.completed_at.allowNull).to.be.true;
        });
    });

    describe('Validation Rules', () => {
        it('should not allow empty summary', async () => {
            const task = TaskModel.build({ summary: '', completed_at: null });

            try {
                await task.validate();
            } catch (error) {
                expect(error.errors[0].message).to.equal('Validation notEmpty on summary failed');
            }
        });

        it('should allow null for completed_at', async () => {
            const task = TaskModel.build({ summary: 'Complete the project', completed_at: null });

            try {
                await task.validate();
            } catch (error) {
                throw new Error('Validation should not have failed');
            }
        });

        it('should allow a valid date for completed_at', async () => {
            const task = TaskModel.build({ summary: 'Complete the project', completed_at: new Date() });

            try {
                await task.validate();
            } catch (error) {
                throw new Error('Validation should not have failed');
            }
        });

        it('should reject invalid date for completed_at', async () => {
            const task = TaskModel.build({ summary: 'Complete the project', completed_at: 'invalid-date' });

            try {
                await task.validate();
            } catch (error) {
                expect(error.errors[0].message).to.equal('Validation isDate on completed_at failed');
            }
        });
    });
});