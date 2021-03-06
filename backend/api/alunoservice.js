const server = require('../config/server');
const express = require('express');
const router = express.Router();
server.use('/api/alunos', router);
const general = require('./core/general');
const emailservice = require('./emailservice');
var nodemailer = require('nodemailer');

router.route('/listaralunos').get(function(req, res) {
    var sql = "SELECT id AS id, nm_nome AS nome FROM alunos";
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
    var id = parametros.id;
    var emailto = parametros.nm_email;

    general.executeObj(table,parametros, function(ret){
        if(id == ""){
            var param = [];
            var paramvalues = [];
            enviaremailconfig("3", emailto, param, paramvalues, function(){
                
            });
        }
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
    var sql = "SELECT id AS id, nm_nome AS Nome, nm_cpf AS cpf,  nm_rg AS RG, nm_plano AS plano, nm_estudio AS Estudio ";
    sql += " FROM alunos ORDER BY nm_nome";
    general.select(sql, function(ret){
        res.send(ret);
    })    
})

router.route('/search/:id').get(function(req, res) {
    var id = req.param('id');
    var sql = "SELECT * ";
    sql += " FROM alunos WHERE id='" + id + "'";
    general.select(sql, function(ret){
        res.send(ret);
    })    
})






//=================================================================================

router.route('/pregeraraulasaluno/:id').get(function(req, res) {
    var id = req.param('id');
    aulasAluno(id, function(arrayretorno){
        res.send(arrayretorno);
    })    
})

router.route('/geraraulasaluno/:id').get(function(req, res) {
    var id = req.param('id');
    aulasAluno(id, function(arrayretorno){
        //gravar
        
        var datahoje = new Date();
        datahoje.setHours(0, 0, 0, 0);
        var dataformathoje = "";
        var dia;
        var mes;
        var ano;

        if(String(datahoje.getDate()).length == 1){
            dia = "0" + datahoje.getDate();
        }else{
            dia = datahoje.getDate();
        }
        
        if(String((datahoje.getMonth() + 1)).length == 1){
            mes = "0" + (datahoje.getMonth() + 1);
        }else{
            mes = (datahoje.getMonth() + 1);
        }

        ano = datahoje.getFullYear();

        dataformathoje = mes + "/" + dia + "/" + ano;

        var ins = "DELETE FROM aulas WHERE  ";
        ins += "  nm_alunos='" + id + "';";
        
        ins += "INSERT INTO aulas (id, dt_data, nm_alunos, nm_estudio, nm_horade, nm_horaate)";
               
        ins += " VALUES";

        for (let index = 0; index < arrayretorno.length; index++) {
            const element = arrayretorno[index];
            var data = new Date(element.dataformat)

            //if(data > datahoje){
                ins += "('" + guid() + "', ";
                ins += "'" + element.dataformat + "','" + element.aluno + "','" + element.estudio
                ins += "','" + element.horario + "','" + element.horarioate + "'";
                ins += ") ";
    
                if(index < (arrayretorno.length - 1)){
                    ins += ",";
                }
            //}
            
        }
        console.log(ins)
        general.execute(ins, function(ret){
            res.send(ret);
        }) 

    })    
})

function aulasAluno(id, callback){
    
    var retorno = {}
    var arrayretorno = []

    var sql = "SELECT *, estudios.id AS idestudio  ";
    sql += " FROM alunos ";
    sql += " INNER JOIN planos ON planos.nm_nome=alunos.nm_plano ";
    sql += " INNER JOIN estudios ON estudios.nm_nome=alunos.nm_estudio ";
    sql += " WHERE alunos.id='" + id + "'";

    general.select(sql, function(ret){
        var datainicio = new Date();

        if(ret.length > 0){
            if(ret[0].dt_inicioplano){
                var datainicioArray = ret[0].dt_inicioplano.split("/")
                var datainicioStr = datainicioArray[1] + "/" + datainicioArray[0] + "/" + datainicioArray[2];
                datainicio = new Date(datainicioStr);
                var data = datainicio;

                var nr_meses = ret[0].nr_meses;
                var nr_aulassemana = ret[0].nr_aulassemana;
                var diasemana = datainicio.getDay();
                var nr_aulasmes = ret[0].nr_aulasmes;

                if(diasemana == 0){
                    diasemana = 7;
                }

                var meses = 0
                var mes = datainicio.getMonth();
                var horario = "";
                var horarioate = "";
                var dataanterior;

                for (let i1 = 1; meses < (nr_meses); i1++) {                  
                    for (let i3 = 1; i3 <= 5; i3++) { 
                        for (let i2 = 1; i2 <= nr_aulassemana; i2++) {  
                            if(i1 == 1 && i2 == 1 && i3 == 1){
                                diasemana = ret[0].nm_dia1;
                                horario = ret[0].nm_horade1;
                                horarioate = ret[0].nm_horaate1;
                            }else{
                                var somadata = 0;
                                var diasemana = "";
                                horario = "";
    
                                switch (i2) {
                                    case 1: 
                                        diasemana = ret[0].nm_dia1;
                                        horario = ret[0].nm_horade1;
                                        horarioate = ret[0].nm_horaate1;
                                        break;
                                    case 2:
                                        diasemana = ret[0].nm_dia2;
                                        horario = ret[0].nm_horade2;
                                        horarioate = ret[0].nm_horaate2;
                                        break;
                                    case 3: 
                                        diasemana = ret[0].nm_dia3;
                                        horario = ret[0].nm_horade3;
                                        horarioate = ret[0].nm_horaate3;
                                        break;
                                    case 4: 
                                        diasemana = ret[0].nm_dia4;
                                        horario = ret[0].nm_horade4;
                                        horarioate = ret[0].nm_horaate4;
                                        break;
                                    case 5: 
                                        diasemana = ret[0].nm_dia5;
                                        horario = ret[0].nm_horade5;
                                        horarioate = ret[0].nm_horaate5;
                                        break;
                                    case 6: 
                                        diasemana = ret[0].nm_dia6;
                                        horario = ret[0].nm_horade6;
                                        horarioate = ret[0].nm_horaate6;
                                        break;
                                    case 7: 
                                        diasemana = ret[0].nm_dia7;
                                        horario = ret[0].nm_horade7;
                                        horarioate = ret[0].nm_horaate7;
                                        break;
                                }
                                somadata =  retornaData(diasemana, data)
                                data.setDate(data.getDate() + somadata)
                            }
    
                            if(mes != data.getMonth()){
                                meses += 1;
                                mes = data.getMonth();
                            }
    /*
                            if(meses == nr_meses){
                                break;
                            }
    */
                            if(arrayretorno.length == (nr_aulasmes * nr_meses)){
                                break;
                            }

                            if(data <= dataanterior){
                                meses += 1;
                                break;
                            }
    
                            
                            dataanterior = new Date(String(data));
                            
                            var dataformat = "";
                                
                            if(String((data.getMonth() + 1)).length == 1){
                                dataformat += "0" + (data.getMonth() + 1) + "/";
                            }else{
                                dataformat += (data.getMonth() + 1) + "/";
                            }
                                
                            if(String((data.getDate())).length == 1){
                                dataformat += "0" + (data.getDate()) + "/";
                            }else{
                                dataformat += (data.getDate()) + "/";
                            }
    
                            dataformat +=  data.getFullYear();  
    
                            var datahoje = new Date();
                            datahoje.setHours(0, 0, 0, 0);
    
                            //if(data >= datahoje){
                                retorno = {};
                                retorno.diasemana = diasemana;
                                retorno.data = data;
                                retorno.horario = horario;
                                retorno.dataformat = dataformat;
                                retorno.aluno = id;
                                retorno.estudio = ret[0].idestudio;
                                retorno.horarioate = horarioate;
    
                                arrayretorno.push(retorno);
                            //}
                            
    
                        }   
                    }
                                     
                }

            }
        }

        callback(arrayretorno);
    })   
}

function retornaData(diasemana, dataatualaula){
    var novadata = new Date()
    var proximodia = dataatualaula.getDay();
    var diasemananovo = proximodia;

    switch (diasemana) {
        case "Segunda":
            diasemananovo = 1;            
            break;
        case "Terça":
            diasemananovo = 2;
            break;
        case "Quarta":
            diasemananovo = 3;
            break;
        case "Quinta":
            diasemananovo = 4;            
            break;
        case "Sexta":
            diasemananovo = 5;            
            break;
        case "Sábado":
            diasemananovo = 6;            
            break;
        case "Domingo":
            diasemananovo = 7; 
            break;
        
    }
    var dt = 0;

    if(diasemananovo > proximodia){
        dt = diasemananovo - proximodia;
    }else{
        if(diasemananovo == proximodia){
            dt = 7;
        }else{            
            dt = (7 - proximodia) + diasemananovo;
        }
        
    }
     
    return dt
}


function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
  
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }




  router.route('/deletaraulas/:id').get(function(req, res) {
    var id = req.param('id');
    
    var sql = "DELETE FROM aulas WHERE nm_alunos='" + id + "' AND dt_data >= CURRENT_DATE";
    general.execute(sql, function(ret){
        res.send(ret);
    })    
})

router.route('/diasbloqueados/:id').get(function(req, res) {
    var id = req.param('id');
        
    var sql = "SELECT intervalo.*, ";
    sql += " (SELECT nm_horade  FROM estudios WHERE nm_nome='" + id + "') AS horade, ";
    sql += "(SELECT nm_horaate  FROM estudios WHERE nm_nome='" + id + "') AS horaate, "
    sql += "(SELECT nm_diade  FROM estudios WHERE nm_nome='" + id + "') AS diade, "
    sql += "(SELECT nm_diaate  FROM estudios WHERE nm_nome='" + id + "') AS diaate, "
    
    sql += " (SELECT nm_horafimde  FROM estudios WHERE nm_nome='" + id + "') AS horafimde, ";
    sql += "(SELECT nm_horafimate  FROM estudios WHERE nm_nome='" + id + "') AS horafimate, "
    sql += "(SELECT nm_diafimde  FROM estudios WHERE nm_nome='" + id + "') AS diafimde, "
    sql += "(SELECT nm_diafimate  FROM estudios WHERE nm_nome='" + id + "') AS diafimate "

    sql += " FROM intervalo ";
    sql += " INNER JOIN estudios ON estudios.id=intervalo.nm_estudio ";
    sql += " WHERE nm_nome='" + id + "' ";

    general.select(sql, function(ret){
        res.send(ret);
    })    
})


function enviaremailconfig(tipo, emailto, parametros, paramvalues, callback){

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

            if(parametros.length > 0){
                for (let index = 0; index < parametros.length; index++) {
                    const element = parametros[index];
                    ret[0].nm_text = ret[0].nm_text.replace("@@" + element, paramvalues[index]);                    
                }
            }

            mail.text = ret[0].nm_text; //"123" ;
            enviarEmail(sender,mail, function(error, info){
                callback(error)
            });
        
        }else{
            callback("Template de envio de email não encontrado")
        }
    })    

}



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
        //from: 'user-alias <' + sender.user + '>', // sender address
        from: '' + sender.user + '',
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



router.route('/recuperarsenha/:email').get(function(req, res) {
    var email = req.param('email');
    var retorno = "";
    var sql = "";
    sql += " SELECT * FROM alunos WHERE nm_email='" + email + "'";
    general.select(sql, function(ret){
        if(ret.length > 0){
            var param = [];
            var paramvalues = [];
            param[0] = "SENHA";
            paramvalues[0] = ret[0].nm_senha;
            param[1] = "LOGIN";
            paramvalues[1] = ret[0].nm_login;
            enviaremailconfig("4", email,param, paramvalues, function(){
                
            });
            retorno = "Email enviado para " + ret[0].nm_email;
        }else{
            retorno = "Email não encontrado";
        }
        
        res.send(retorno);
    }) 
    
});