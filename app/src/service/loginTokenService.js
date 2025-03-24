const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const database = require('../model/index')
const { userModel } = database;

const loginToken = async (req) => {
    const user = await userModel.findOne({ where: { email: req.body.email } });

    if (!user) {
        return null;
    }

    const passwordMatch = await bcrypt.compare(req.body.password, user.password);

    if (!passwordMatch) {
        return null;
    }

    return jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

module.exports = loginToken;