const express = require('express')
const multer = require('multer')
module.exports = function(server) {
    
    const router = express.Router()
    server.use('/api', router)
    
    const usuarios = require('../api/usuarioservice')
    const estudios = require('../api/estudioservice')
    const planos = require('../api/planoservice')
    const tiposaulas = require('../api/tiposaulaservice')
    const alunos = require('../api/alunoservice')
    const professores = require('../api/professorservice')



    const administrador = require('../api/administrador')
    const reports = require('../api/reports')
    const calendario = require('../api/calendarioservice')
    const intervalo = require('../api/intervaloservice')
    const capacidade_estudios = require('../api/capacidadeestudioservice')
    const email = require('../api/emailservice')
}
