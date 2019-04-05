const server = require('../config/server');
const express = require('express');
const router = express.Router();
server.use('/api/aulas', router);
const general = require('../api/core/general');

router.route('/listaaulas/:data/:estudio').get(function(req, res) {   
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
 
    var data = req.param('data');
    var estudio = req.param('estudio');

var sql = "SELECT estudios.nm_horade AS horadefunc, estudios.nm_horaate AS horaatefunc, ";
    sql += " aulas.id AS id, TO_CHAR(dt_data :: DATE, 'dd/mm/yyyy') AS data, ";
    sql += " aulas.nm_obs AS obs, alunos.nm_nome AS aluno, ";
    sql += " estudios.nm_nome AS estudio, aulas.nm_horade AS horade, aulas.nm_horaate AS horaate ";
    sql += " FROM aulas ";
    sql += " INNER JOIN alunos ON alunos.id=aulas.nm_alunos ";
    sql += " INNER JOIN estudios ON estudios.id=aulas.nm_estudios ";
    sql += " WHERE aulas.dt_data='" + data + "' AND estudios.id='" + estudio + "'";
    sql += " ORDER BY aulas.nm_horade ";
    general.select(sql, function(ret){

        if(ret.length > 0){
            res.send(ret);
        }else{
            sql = "SELECT estudios.nm_horade AS horadefunc, estudios.nm_horaate AS horaatefunc, TO_CHAR('" + data + "' :: DATE, 'dd/mm/yyyy') AS data FROM estudios ";
            sql += " WHERE estudios.id='" + estudio + "'";

            general.select(sql, function(ret){
                res.send(ret);
            });
        }        
    })    
})


router.route('/editaraula/:id').get(function(req, res) {   
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
 
    var id = req.param('id');

    var sql = "SELECT * FROM aulas ";
    sql += " WHERE aulas.id='" + id + "' ";
    
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
