const express = require('express');
const app = express();
const PORT = process.env.PORT;
 
app.get('/', (req, res) => {
    res.json(
        'Coding in node again :)'
    )
})

app.listen(PORT, () => {
    console.log('Server ready: ' + PORT)
})