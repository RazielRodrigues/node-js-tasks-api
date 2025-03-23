const { Sequelize } = require('sequelize');

module.exports = (connection) => {
    const userModel = connection.define('user', {
        email: {
            type: Sequelize.STRING,
        },
        password: {
            type: Sequelize.STRING, // aplicar segurança!
        },
        role: {
            type: Sequelize.STRING
        }
    })
    return userModel
}