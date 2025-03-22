module.exports = (sequelize, Sequelize) => {
    const user = sequelize.define('usuario', {
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