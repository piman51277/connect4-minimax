const express = require('express')
const app = express()
const port = 3000 | process.env.PORT
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})
app.listen(port, () => {
    console.log(`Go to http://localhost:${port}`)
})