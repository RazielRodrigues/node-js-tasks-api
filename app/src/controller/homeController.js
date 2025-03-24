const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        res.status(200).json({
            data: {
                message: 'Welcome to the sword health tasks API',
                description: 'Get your token and start managing your tasks',
                repository: 'https://github.com/RazielRodrigues/sword-health-tasks-api',
                doc: 'https://github.com/RazielRodrigues/sword-health-tasks-api/blob/main/sword_health_tasks_api_postman_collection.json',
        } })
    } catch (error) {
        res.status(500).json({ data: 'Internal server error' });
    }
})

module.exports = router