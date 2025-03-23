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

database.taskModel = require('./taskModel.js')(connection)
database.userModel = require('./userModel.js')(connection)

database.userModel.hasMany(database.taskModel)
database.taskModel.belongsTo(database.userModel)

module.exports = database