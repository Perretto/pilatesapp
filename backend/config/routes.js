const express = require('express')
const multer = require('multer')
module.exports = function(server) {
    
    const router = express.Router()
    server.use('/api', router)
    
    const usuarios = require('../api/usuarioservice')
    const estudios = require('../api/estudioservice')
    const planos = require('../api/planoservice')
    const tiposaulas = require('../api/tiposaulaservice')



    const administrador = require('../api/administrador')
    const reports = require('../api/reports')
}
