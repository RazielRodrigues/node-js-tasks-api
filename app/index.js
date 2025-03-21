const express = require('express');
const app = express();
const PORT = 3000;
 
app.get('/', (req, res) => {
    res.json(
        'Coding in node again :)'
    )
})

app.listen(PORT, () => {
    console.log('Server ready: ' + PORT)
})