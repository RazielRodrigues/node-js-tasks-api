const { Sequelize } = require('sequelize');

module.exports = (connection) => {
    const task = connection.define('task', {
        summary: {
            type: Sequelize.STRING, // contain personal information? maybe hash?
            length: 2500,
        },
        completed_at: {
            type: Sequelize.DATE,
        },
    })
    return task
}