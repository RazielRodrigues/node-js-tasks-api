const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        res.status(200).json({ data: 'Welcome to the sword health tasks API' })
    } catch (error) {
        res.status(500).json({ data: 'Internal server error' });
    }
})

module.exports = router