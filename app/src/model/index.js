const { Sequelize } = require('sequelize');

const connection = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT
    }
)

const database = {}
database.connection = connection

// Carregando os modelos de dados
database.task = require('./task.js')(connection)
database.user = require('./user.js')(connection)

// Cardinalidades
database.user.hasMany(database.task)
database.task.belongsTo(database.user)

module.exports = database