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
    sql += " INNER JOIN estudios ON estudios.id=aulas.nm_estudio ";
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

    var sql = "SELECT aulas.id AS id, TO_CHAR(aulas.dt_data :: DATE, 'dd/mm/yyyy') AS dt_data, aulas.nm_obs AS nm_obs, ";
    sql += " aulas.nm_alunos AS nm_alunos, aulas.nm_estudio AS nm_estudio, aulas.nm_horade AS nm_horade,  ";
    sql += " aulas.nm_horaate AS nm_horaate,alunos.nm_nome AS nomealuno";
    sql += " FROM aulas ";
    sql += " INNER JOIN alunos ON alunos.id=aulas.nm_alunos";
    sql += " WHERE aulas.id='" + id + "' ";
    console.log(sql)
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



router.route('/autocompletealunos/:id').get(function(req, res) {   
    var id = req.param('id');
    var sql = "SELECT nm_nome AS text, id AS value FROM alunos ";
    sql += " WHERE nm_nome LIKE '" + id + "%' ";
    console.log(sql)
    general.select(sql, function(ret){
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


router.route('/deleteaulas/:horade/:horaate/:estudio/:data').get(function(req, res) {
    var horade = req.param('horade');
    var horaate = req.param('horaate');
    var estudio = req.param('estudio');
    var data = req.param('data');
    
    var sql = "DELETE FROM aulas WHERE nm_horade='" + horade + "' ";
    sql += " AND nm_horaate='" + horaate + "' ";
    sql += " AND nm_estudio='" + estudio + "' ";
    sql += " AND dt_data='" + data + "' ";

    general.execute(sql, function(ret){
        res.send(ret);
    })    
})



router.route('/horariosdisponiveis/:estudio').get(function(req, res) {
    var estudio = req.param('estudio');
    
    var sql = "SELECT TO_CHAR(dt_data :: DATE, 'yyyy-mm-dd') AS dt_data, id AS id FROM aulas WHERE  ";
    sql += " nm_estudio='" + estudio + "' ";

    general.select(sql, function(ret){
        
        var array = [];
        var obj = {};

        obj.id = "a";
        obj.start = "2019-04-01";
        obj.end = "2019-04-07";
        obj.title = "Disponível";
        array.push(obj);

        obj = {};
        obj.id = "b";
        obj.start = "2019-04-08";
        obj.end = "2019-04-14";
        obj.title = "Disponível";
        array.push(obj);

        obj = {};
        obj.id = "c";
        obj.start = "2019-04-15";
        obj.end = "2019-04-21";
        obj.title = "Disponível";
        array.push(obj);

        obj = {};
        obj.id = "d";
        obj.start = "2019-04-22";
        obj.end = "2019-04-28";
        obj.title = "Disponível";
        array.push(obj);

        obj = {};
        obj.id = "d";
        obj.start = "2019-04-29";
        obj.end = "2019-05-01";
        obj.title = "Disponível";
        array.push(obj);

        var arrayaulas = [];

        for (let index = 0; index < ret.length; index++) {
            const element = ret[index];
            if(arrayaulas.indexOf(element.dt_data) == -1){
                
                obj = {};
                obj.id = element.id;
                obj.start = element.dt_data;
                obj.title = "Aula(s) agendada(s)";
                array.push(obj);
                arrayaulas.push(element.dt_data);
            }
        }

        res.send(array);         
    })     
})