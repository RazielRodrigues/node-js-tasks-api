module.exports = (sequelize, Sequelize) => {
    const task = sequelize.define('task', {
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