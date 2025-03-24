const { Sequelize } = require('sequelize');

module.exports = (connection) => {
    const userModel = connection.define('user', {
        email: {
            type: Sequelize.STRING,
            length: 255,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            }
        },
        password: {
            type: Sequelize.STRING,
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
        }
    })
    return userModel
}