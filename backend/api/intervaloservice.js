const server = require('../config/server');
const express = require('express');
const router = express.Router();
server.use('/api/intervalo', router);
const general = require('./core/general');

router.route('/listarintervalos/:id').get(function(req, res) {
    var id = req.param('id');
    var sql = "SELECT * FROM intervalo WHERE nm_estudio='" + id + "'";
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
