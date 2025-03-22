const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT
    }
)

// Configurando a minha base de dados para a tarefa
const database = {}
database.sequelize = sequelize
database.Sequelize = Sequelize

// Carregando os modelos de dados
database.task = require('./task.js')(sequelize, Sequelize)
database.user = require('./user.js')(sequelize, Sequelize)

// Cardinalidades
database.user.hasMany(database.task)
database.task.belongsTo(database.user)

module.exports = database