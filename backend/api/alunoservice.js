const server = require('../config/server');
const express = require('express');
const router = express.Router();
server.use('/api/alunos', router);
const general = require('./core/general');

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

        var ins = "DELETE FROM aulas WHERE dt_data >= '" + dataformathoje +  "' ";
        ins += " AND nm_alunos='" + id + "';";
        
        ins += "INSERT INTO aulas (id, dt_data, nm_alunos, nm_estudio, nm_horade, nm_horaate)";
               
        ins += " VALUES";

        for (let index = 0; index < arrayretorno.length; index++) {
            const element = arrayretorno[index];
            
            ins += "('" + guid() + "', ";
            ins += "'" + element.dataformat + "','" + element.aluno + "','" + element.estudio
            ins += "','" + element.horario + "','" + element.horarioate + "'";
            ins += ") ";

            if(index < (arrayretorno.length - 1)){
                ins += ",";
            }
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
    
                            if(meses == nr_meses){
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
    
                            if(data >= datahoje){
                                retorno = {};
                                retorno.diasemana = diasemana;
                                retorno.data = data;
                                retorno.horario = horario;
                                retorno.dataformat = dataformat;
                                retorno.aluno = id;
                                retorno.estudio = ret[0].idestudio;
                                retorno.horarioate = horarioate;
    
                                arrayretorno.push(retorno);
                            }
                            
    
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