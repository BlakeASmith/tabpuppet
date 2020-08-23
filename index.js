const express = require('express')
const cors = require('cors')
const path = require('path')
const port = 6969

const app = express()
app.use(cors());


app.use(express.static(__dirname + "/static/"))
app.listen(port, () => console.log(`listening on ${port}`))
