const server = require('../config/server');
const express = require('express');
const router = express.Router();
server.use('/api/email', router);
const general = require('./core/general');
var nodemailer = require('nodemailer');

router.route('/listarconfiguracaoemail').get(function(req, res) {
    var sql = "SELECT id AS id, nm_nome AS nome FROM configuracaoemail";
    general.select(sql, function(ret){
        res.send(ret);
    })    
})

router.route('/carregaremail').get(function(req, res) {
    var sql = "SELECT * FROM configuracaoemail";
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
    var table = "configuracaoemail";
    var parametros = req.body;
    general.executeObj(table,parametros, function(ret){
        res.send(ret);
    })
      
})

router.route('/delete/:id').get(function(req, res) {
    var id = req.param('id');
    var atable = req.baseUrl.split("/");
    var table = "configuracaoemail";

    var sql = "DELETE FROM " + table + " WHERE id='" + id + "'";
    general.execute(sql, function(ret){
        res.send(ret);
    })    
})


router.route('/listsearch').get(function(req, res) {
    var sql = "SELECT id AS id, nm_descricao AS Nome, nm_server AS Servidor, nm_from AS Remetente, nm_subject AS Assunto ";
    sql += " FROM configuracaoemail ORDER BY nm_descricao";
    general.select(sql, function(ret){
        res.send(ret);
    })    
})

router.route('/search/:id').get(function(req, res) {
    var id = req.param('id');
    var sql = "SELECT * ";
    sql += " FROM configuracaoemail WHERE id='" + id + "'";
    general.select(sql, function(ret){
        res.send(ret);
    })    
})


router.route('/enviar/:tipo/:emailto').get(async function(req, res) {
    var emailto = req.param('emailto');
    var tipo = req.param('tipo');
    var sql = "SELECT * ";
    sql += " FROM configuracaoemail WHERE id_tipo='" + tipo + "'";
    general.select(sql, function(ret){
        if(ret.length > 0){

            var sender = {};
            var mail = {};

            sender.service = ret[0].nm_server; //"smtp.live.com" ;
            sender.user = ret[0].nm_user; //"andreperretto@hotmail.com" ;
            sender.pass = ret[0].nm_pass;//"barra586270" ;

            mail.from = ret[0].nm_from;//"andreperretto@hotmail.com" ;
            mail.to = emailto;

            mail.subject = ret[0].nm_subject; //"teste" ;
            mail.text = ret[0].nm_text; //"123" ;
            enviarEmail(sender,mail, function(error, info){
                res.send(error)
            });
        
        }else{
            res.send("Template de envio de email não encontrado")
        }
    })    


    
})




function enviarEmail(sender, mail, callback) { 

    let transporter = nodemailer.createTransport({
        host: sender.service,
        port: 587,
        auth: {
            user: sender.user,
            pass: sender.pass
        },
        tls: { ciphers: 'SSLv3' }
    });
    /*
    var attachments = [];
    if(mail.attachments){
        attachments = mail.attachments;
    }else{
        attachments.push({   
            filename: "relatorio.pdf",
            path: mail.path
        })
    }
*/
    
    let mailOptions = {
        from: 'user-alias <' + sender.user + '>', // sender address
        to: mail.to, // list of receivers
        subject: mail.subject, // Subject line
        html: mail.text//, // plain text body,  
        //attachments: attachments
    };

    transporter.sendMail(mailOptions, function(error, info){
        transporter.close();
        callback(error, info);
    });
}
