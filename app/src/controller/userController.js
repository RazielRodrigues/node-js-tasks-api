const express = require('express')
const router = express.Router()
const database = require('../model/index')
const bcrypt = require('bcryptjs');
const { userModel } = database;
const verifyToken = require('../service/verifyTokenService')

router.post('/', async (req, res) => {
    try {
        const user = await userModel.findOne({ where: { email: req.body.email } });

        if (user) {
            return res.status(400).json({ data: 'Email already exists' });
        }

        if (req.body.password.length < 8) {
            return res.status(400).json({ data: 'Your password should be at least 8 digits' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        await userModel.create({
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role,
        })

        return res.status(201).json({ data: `Your user has been created with the email: ${req.body.email}` })
    } catch (error) {
        return res.status(500).json({ data: 'Internal server error' });
    }
})

router.get('/', verifyToken, async (req, res) => {
    try {
        const data = await userModel.findAll();

        if (!data) {
            return res.status(204).json({ data: data })
        }

        return res.status(200).json({ data: data })
    } catch (error) {
        return res.status(500).json({ data: 'Internal server error' });
    }
})

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const data = await userModel.findOne({ where: { id: req.params.id } })

        if (!data) {
            return res.status(404).json({ data: `User not found for ID #${req.params.id}` })
        }

        return res.status(200).json({ data: data })
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
})

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const user = await userModel.findOne({ where: { id: req.params.id } });

        if (!user) {
            return res.status(404).json({ data: `User not found for ID #${req.params.id}` })
        }

        const userExists = await userModel.findOne({ where: { id: req.body.email } });

        if (userExists) {
            return res.status(404).json({ data: `User already exists` })
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        await userModel.update({
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role,
        }, { where: { id: req.params.id, } })

        return res.status(200).json({ data: `Your user has been updated with the ID: ${user.id}` })
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
})

router.delete('/:id', verifyToken, async (req, res) => {
    try {

        const loggedUser = await userModel.findOne({ where: { email: req.user.email } });

        if (loggedUser.role !== ROLE_TECHNICIAN) {
            return res.status(401).json({ error: 'Unauthorized: only technicians can delete users' });
        }

        const user = await userModel.findOne({ where: { id: req.params.id } });

        if (!user) {
            return res.status(404).json({ data: `User not found for ID #${req.params.id}` })
        }

        await userModel.destroy({ where: { id: user.id } })

        return res.status(200).json({ data: `Your user has been deleted with the ID: ${user.id}` })
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router