const server = require('../config/server');
const express = require('express');
const router = express.Router();
server.use('/api/estudios', router);
const general = require('./core/general');

router.route('/listarusuarios').get(function(req, res) {
    var sql = "SELECT id AS id, nm_nome AS nome FROM estudios";
    general.select(sql, function(ret){
        res.send(ret);
    })    
})

router.route('/gravar').post(function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    
    var atable = req.baseUrl.split("/");
    var table = "";
    if(atable.length > 0){
        table = atable[atable.length - 1]
    }
    var parametros = req.body;
    general.executeObj(table,parametros, function(ret){
        res.send(ret);
    })
      
})

router.route('/delete/:id').get(function(req, res) {
    var id = req.param('id');
    var atable = req.baseUrl.split("/");
    var table = "";
    if(atable.length > 0){
        table = atable[atable.length - 1]
    }

    var sql = "DELETE FROM " + table + " WHERE id='" + id + "'";
    general.execute(sql, function(ret){
        res.send(ret);
    })    
})


router.route('/listsearch').get(function(req, res) {
    var sql = "SELECT id AS id, nm_nome AS Nome, nm_logradouro AS logradouro, nm_numero AS número, nm_cidade AS cidade, nm_estado AS UF, nm_telefone AS telefone, nm_celular AS celular ";
    sql += " FROM estudios ORDER BY nm_nome";
    general.select(sql, function(ret){
        res.send(ret);
    })    
})

router.route('/search/:id').get(function(req, res) {
    var id = req.param('id');
    var sql = "SELECT * ";
    sql += " FROM estudios WHERE id='" + id + "'";
    general.select(sql, function(ret){
        res.send(ret);
    })    
})






//=================================================================================

router.route('/testeinsert').get(function(req, res) {
    var sql = "INSERT INTO usuarios (id, nm_nome)";
    sql += " VALUES";
    for (let index = 0; index < 10000; index++) {
        sql += "(" + index + ",'" + index + "'), ";
    }
    sql += "(20000, '0')";
    sql += " ;";

    general.execute(sql, function(ret){
        res.send(ret);
    })    
})


router.route('/testeupdate').get(function(req, res) {
    var sql = "UPDATE usuarios SET nm_nome='PPERRETTO' WHERE nm_nome='1'";
    general.execute(sql, function(ret){
        res.send(ret);
    })    
})