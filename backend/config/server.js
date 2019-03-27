const port = 3003

const bodyParser = require('body-parser')
const express = require('express')
const server = express()
const allowCors = require('./cors')
const queryParser = require('express-query-int')

server.use(bodyParser.urlencoded({ 
    extended: true ,
    parameterLimit: 100000,
    limit: 1024 * 1024 * 100
}))
server.use(bodyParser.json({
    extended: false,
    parameterLimit: 100000,
    limit: 1024 * 1024 * 100
}))
server.use(allowCors)
server.use(queryParser())

server.listen(3003, function() {
    console.log(`BACKEND is running on port ${port}.`)
})

module.exports = server