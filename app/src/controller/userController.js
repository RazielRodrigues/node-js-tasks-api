const express = require('express')
const router = express.Router()
const database = require('../model/index')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { userModel } = database;


const userRole = {
    1: 'manager',
    2: 'techinician'
}


// Route to authenticate and log in a user
router.post('/login', async (req, res) => {
    try {
 
        const user = await userModel.findOne({
            where: {
                email: req.body.email
            }
        });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ email: user.email }, 'secret');
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// create
router.post('/', async (req, res) => {
    const user = await userModel.findOne({
        where: {
            email: req.body.email
        }
    });
    if (user) {
        res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const data = await userModel.create({
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role,
    })

    res.status(201).json({ data: data })
})

// read all
router.get('/', async (req, res) => {
    try {
        const data = await userModel.findAll();
        if (!data) {
            res.status(204).json({ data: [] })
        }

        res.status(200).json({ data: data })
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

// read one
router.get('/:id', async (req, res) => {


    try {
        const data = await userModel.findOne({ where: { id: req.params.id } });
        if (!data) {
            res.json({
                status: 404,
                data: `User not found for id #${req.params.id}`
            })
            res.status(404)
        }
 

        res.status(200).json({ data: data })
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

// update
router.put('/:id', async (req, res) => {

    const user = await userModel.findOne({ where: { id: req.params.id } });
    if (!user) {
        res.json({
            status: 404,
            data: `User not found for id #${req.params.id}`
        })
        res.status(404)
    }

    const data = await userModel.update({
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
    }, { where: { id: req.params.id, } })

    res.json({ status: 200, data: data })
    res.status(200)
})

// delete
router.delete('/:id', async (req, res) => {

    const user = await userModel.findOne({ where: { id: req.params.id } });
    if (!user) {
        res.json({
            status: 404,
            data: `User not found for id #${req.params.id}`
        })
        res.status(404)
    }

    const data = await userModel.destroy({
        where: {
            id: user.id
        }
    })

    res.json({ status: 200, data: data })
    res.status(200)
})

module.exports = router