const { Sequelize } = require('sequelize');

module.exports = (connection) => {
    const taskModel = connection.define('task', {
        summary: {
            type: Sequelize.STRING, // talvez encryptar
            length: 2500,
        },
        completed_at: {
            type: Sequelize.DATE,
        },
    })
    return taskModel
}