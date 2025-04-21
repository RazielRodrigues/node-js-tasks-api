const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        return res.status(200).json({
            data: {
                message: 'Welcome to the node js tasks API',
                description: 'Get your token and start managing your tasks',
                repository: 'https://github.com/RazielRodrigues/node-js-tasks-api',
                doc: 'https://github.com/RazielRodrigues/node-js-tasks-api/blob/main/node_js_tasks_api_postman_collection.json',
        } })
    } catch (error) {
        return res.status(500).json({ data: 'Internal server error' });
    }
})

module.exports = router