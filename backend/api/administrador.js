const server = require('../config/server');
const express = require('express');
const router = express.Router();
server.use('/api/administrador', router);
const general = require('../api/core/general');

router.route('/login/:login/:senha/:tipo').get(function(req, res) {    
    var login = req.param('login');
    var senha = req.param('senha');
    var tipo = req.param('tipo');
    var sql = "";

    if(tipo == "admin"){
        sql = "SELECT * FROM usuarios WHERE nm_login='" + login + "' AND nm_senha='" + senha + "'";
    }else{
        sql = "SELECT *,alunos.id AS id, 'Aluno' AS nm_tipousuario, estudios.id AS idestudio  FROM alunos LEFT JOIN estudios ON estudios.nm_nome=alunos.nm_estudio WHERE nm_cpf='" + login + "' AND alunos.sn_desativar=false";
    }
    
    general.select(sql, function(ret){
        res.send(ret);
    })    
})