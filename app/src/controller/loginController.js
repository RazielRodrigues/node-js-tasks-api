const express = require('express')
const router = express.Router()
const database = require('../model/index')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { userModel } = database;

router.post('/', async (req, res) => {
    try {
 
        const user = await userModel.findOne({ where: { email: req.body.email } });

        if (!user) {
            return res.status(401).json({ data: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    
        if (!passwordMatch) {
            return res.status(401).json({ data: 'Invalid credentials' });
        }

        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ data: token });
    } catch (error) {
        res.status(500).json({ data: 'Internal server error' });
    }
});

module.exports = router