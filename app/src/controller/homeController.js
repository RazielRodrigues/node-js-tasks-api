const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    res.json({ status: 200, data: 'Welcome to the sword health tasks API' })
    res.status(200)
})

module.exports = router