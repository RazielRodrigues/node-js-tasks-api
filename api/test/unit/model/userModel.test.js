const { expect } = require('chai');
const SequelizeMock = require('sequelize-mock');
const userModelFactory = require('../../../src/model/userModel');

describe('User Model Unit Tests', () => {
    let sequelizeMock;
    let UserModel;

    before(() => {
        sequelizeMock = new SequelizeMock();
        UserModel = userModelFactory(sequelizeMock);
    });

    describe('Model Definition', () => {
        it('should define the "user" model with correct fields', () => {
            const attributes = UserModel._defaults;

            expect(attributes.email).to.exist;
            expect(attributes.email.type.key).to.equal('STRING');
            expect(attributes.email.allowNull).to.be.false;
            expect(attributes.email.unique).to.be.true;
            expect(attributes.email.validate.isEmail).to.be.true;

            expect(attributes.password).to.exist;
            expect(attributes.password.type.key).to.equal('STRING');
            expect(attributes.password.allowNull).to.be.false;
            expect(attributes.password.validate.notEmpty).to.be.true;

            expect(attributes.role).to.exist;
            expect(attributes.role.type.key).to.equal('INTEGER');
            expect(attributes.role.allowNull).to.be.false;
            expect(attributes.role.validate.isInt).to.be.true;
        });
    });

    describe('Validation Rules', () => {
        it('should validate email format', async () => {
            const invalidEmail = 'invalid-email';
            const user = UserModel.build({ email: invalidEmail, password: 'password123', role: 1 });

            try {
                await user.validate();
            } catch (error) {
                expect(error.errors[0].message).to.equal('Validation isEmail on email failed');
            }
        });

        it('should not allow empty password', async () => {
            const user = UserModel.build({ email: 'test@example.com', password: '', role: 1 });

            try {
                await user.validate();
            } catch (error) {
                expect(error.errors[0].message).to.equal('Validation notEmpty on password failed');
            }
        });

        it('should ensure role is an integer', async () => {
            const user = UserModel.build({ email: 'test@example.com', password: 'password123', role: 'not-an-integer' });

            try {
                await user.validate();
            } catch (error) {
                expect(error.errors[0].message).to.equal('Validation isInt on role failed');
            }
        });

        it('should enforce unique email constraint', async () => {
            await UserModel.create({ email: 'test@example.com', password: 'password123', role: 1 });

            const duplicateUser = UserModel.build({ email: 'test@example.com', password: 'password456', role: 2 });

            try {
                await duplicateUser.validate();
            } catch (error) {
                expect(error.errors[0].message).to.equal('email must be unique');
            }
        });
    });
});