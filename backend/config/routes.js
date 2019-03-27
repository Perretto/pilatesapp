const express = require('express')
const multer = require('multer')
module.exports = function(server) {
    
    const router = express.Router()
    server.use('/api', router)
    
    const usuarios = require('../api/cadastros/usuarioservice')
    const administrador = require('../api/administrador')
    const reports = require('../api/reports')
}
