describe('userModel', function () {

    
/*     email: {
        type: Sequelize.STRING,
            length: 255,
                allowNull: false,
                    unique: true,
                        validate: {
            isEmail: true,
            }
    },
    password: {
        type: Sequelize.STRING, // aplicar segurança!
            length: 255,
                allowNull: false,
                    validate: {
            notEmpty: true,
            }
    },
    role: {
        type: Sequelize.INTEGER,
            allowNull: false,
                validate: {
            isInt: true,
            }
    } */

    it('should have keys', function () {
        assert.equal([1, 2, 3].indexOf(4), -1);
    });
});