const express = require('express')
const cors = require('cors')
const routes = require('./src/routes')

const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)

app.listen(5000, () => console.log('Api on 5000'))
