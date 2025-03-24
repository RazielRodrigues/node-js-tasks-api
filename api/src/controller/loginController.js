const express = require('express');
const loginToken = require('../service/loginTokenService');
const router = express.Router()
const database = require('../model/index')
const { userModel } = database;

router.post('/', async (req, res) => {
    try {

        const user = await userModel.findOne({ where: { email: req.body.email } });
        const data = await loginToken(req, user);

        if (!data) {
            return res.status(401).json({ data: 'Invalid credentials' });
        }

        return res.status(200).json({ data: data });
    } catch (error) {
        return res.status(500).json({ data: 'Internal server error' });
    }
});

module.exports = router