const server = require('../config/server');
const express = require('express');
const router = express.Router();
server.use('/api/administrador', router);
const general = require('../api/core/general');

router.route('/login/:login/:senha').get(function(req, res) {    
    var login = req.param('login');
    var senha = req.param('senha');
    var sql = "SELECT * FROM usuarios WHERE nm_login='" + login + "' AND nm_senha='" + senha + "'";
    general.select(sql, function(ret){
        res.send(ret);
    })    
})