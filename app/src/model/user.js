const { Sequelize } = require('sequelize');

module.exports = (connection) => {
    const user = connection.define('usuario', {
        email: {
            type: Sequelize.STRING,
        },
        password: {
            type: Sequelize.STRING, // hash this!
        },
        role: {
            type: Sequelize.STRING
        }
    })
    return user
}