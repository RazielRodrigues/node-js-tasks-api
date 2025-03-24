const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    let token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    token = token.replace('Bearer ', '');
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        req.user = decoded;
        next();
    });
};

module.exports = verifyToken