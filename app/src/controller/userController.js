const express = require('express')
const router = express.Router()
const database = require('../model/index')
const bcrypt = require('bcryptjs');
const { userModel } = database;

router.post('/', async (req, res) => {
    try {
        const user = await userModel.findOne({ where: { email: req.body.email } });

        if (user) {
            res.status(400).json({ data: 'Email already exists' });
        }

        if (req.body.password.length < 8) {
            res.status(400).json({ data: 'Your password should be at least 8 digits' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const data = await userModel.create({
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role,
        })

        res.status(201).json({ data: data })
    } catch (error) {
        res.status(500).json({ data: 'Internal server error' });
    }
})

router.get('/', async (req, res) => {
    try {
        const data = await userModel.findAll();

        if (!data) {
            res.status(204).json({ data: data })
        }

        res.status(200).json({ data: data })
    } catch (error) {
        res.status(500).json({ data: 'Internal server error' });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const data = await userModel.findOne({ where: { id: req.params.id } })

        if (!data) {
            res.status(404).json({ data: `User not found for ID #${req.params.id}` })
        }

        res.status(200).json({ data: data })
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.put('/:id', async (req, res) => {
    try {
        const user = await userModel.findOne({ where: { id: req.params.id } });

        if (!user) {
            res.status(404).json({ data: `User not found for ID #${req.params.id}` })
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const data = await userModel.update({
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role,
        }, { where: { id: req.params.id, } })

        res.status(200).json({ data: data })

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.delete('/:id', async (req, res) => {
    try {

        const user = await userModel.findOne({ where: { id: req.params.id } });

        if (!user) {
            res.status(404).json({ data: `User not found for ID #${req.params.id}` })
        }

        const data = await userModel.destroy({ where: { id: user.id } })

        res.status(200).json({ data: data })
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router