const server = require('../config/server');
const express = require('express');
const router = express.Router();
server.use('/api/aulas', router);
const general = require('../api/core/general');
var nodemailer = require('nodemailer');

router.route('/listaaulas/:data/:estudio').get(function(req, res) {   
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
  

    var data = req.param('data'); 
    var estudio = req.param('estudio');
    var d = new Date(data);
    var sm = d.getDay();
    console.log("dia = " + sm)
    if(req.host != "localhost"){
        if(sm == 0){
            sm = 6;
        }else{
            sm -= 1;
        }
    }

    var semana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sabado", "Domingo"][sm];
    
    console.log(semana)
    sm = diaSemanaComFim(semana);
   console.log(sm)

var sql = "SELECT false AS disponivel,  estudios.nm_diade, estudios.nm_diaate, estudios.nm_diafimde, estudios.nm_diafimate , estudios.nm_horade AS horadefunc, estudios.nm_horaate AS horaatefunc, ";
    sql += " aulas.id AS id, TO_CHAR(dt_data :: DATE, 'dd/mm/yyyy') AS data, ";
    sql += " aulas.nm_obs AS obs, alunos.nm_nome AS aluno, ";
    sql += " estudios.nm_nome AS estudio, aulas.nm_horade AS horade, aulas.nm_horaate AS horaate ";
    sql += " FROM aulas ";
    sql += " INNER JOIN alunos ON alunos.id=aulas.nm_alunos ";
    sql += " INNER JOIN estudios ON estudios.id=aulas.nm_estudio ";
    sql += " WHERE aulas.status IS NULL AND aulas.dt_data='" + data + "' AND estudios.id='" + estudio + "'";
    sql += " ORDER BY aulas.nm_horade ";

    general.select(sql, function(ret){
        var diade;
        var diaate;
        var diafimde;
        var diafimate;

        if(ret.length > 0){
            ret[0].disponivel = false;
            diade = diaSemanaComFim(ret[0].nm_diade);
            diaate = diaSemanaComFim(ret[0].nm_diaate);
            diafimde = diaSemanaComFim(ret[0].nm_diafimde);
            diafimate = diaSemanaComFim(ret[0].nm_diafimate);

            if(sm >= diade && sm <= diaate){
                ret[0].disponivel = true;
            }

            if(sm >= diafimde && sm <= diafimate){
                ret[0].disponivel = true;
            }

            res.send(ret);
        }else{
            sql = "SELECT false AS disponivel,  estudios.nm_diade, estudios.nm_diaate, estudios.nm_diafimde, estudios.nm_diafimate , estudios.nm_horade AS horadefunc, estudios.nm_horaate AS horaatefunc, TO_CHAR('" + data + "' :: DATE, 'dd/mm/yyyy') AS data FROM estudios ";
            sql += " WHERE estudios.id='" + estudio + "'";

            general.select(sql, function(ret){
                ret[0].disponivel = false;

                
                diade = diaSemanaComFim(ret[0].nm_diade);
                diaate = diaSemanaComFim(ret[0].nm_diaate);
                diafimde = diaSemanaComFim(ret[0].nm_diafimde);
                diafimate = diaSemanaComFim(ret[0].nm_diafimate);
                
                    
                
                if(sm >= diade && sm <= diaate){
                    ret[0].disponivel = true;
                }

                if(sm >= diafimde && sm <= diafimate){
                    ret[0].disponivel = true;
                } 
                res.send(ret);
            });
        }        
    })    
})

router.route('/listaaulasaluno/:data/:estudio/:id').get(function(req, res) {   
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
 
    var data = req.param('data');
    var id = req.param('id');
    var estudio = req.param('estudio');
    var d = new Date(data);
    var sm = d.getDay();
    //if(req.host != "localhost"){
        if(sm == 0){
            sm = 6;
        }else{
            sm -= 1;
        }
    //}

    var semana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sabado", "Domingo"][sm];
    
    sm = diaSemanaComFim(semana);
    console.log(semana)
   console.log(sm)

var sql = "SELECT false AS disponivel,  estudios.nm_diade, estudios.nm_diaate, estudios.nm_diafimde, estudios.nm_diafimate , estudios.nm_horade AS horadefunc, estudios.nm_horaate AS horaatefunc, ";
    sql += " aulas.id AS id, TO_CHAR(dt_data :: DATE, 'dd/mm/yyyy') AS data, ";
    sql += " aulas.nm_obs AS obs, alunos.nm_nome AS aluno, ";
    sql += " estudios.nm_nome AS estudio, aulas.nm_horade AS horade, aulas.nm_horaate AS horaate, ";



    sql += " (SELECT  ";
			
    sql += "     (CASE alunos.nr_creditos ";
    sql += "        WHEN 0 THEN (planos.nr_meses * planos.nr_aulasmes) ";
    sql += "        ELSE alunos.nr_creditos ";
    sql += "       END) - ";



    sql += "(SELECT COUNT(*) FROM aulas WHERE nm_alunos='" + id + "' ";
    //sql += " AND  aulas.dt_data >= CURRENT_DATE ";
    sql += ") FROM alunos INNER JOIN planos ON planos.nm_nome=alunos.nm_plano ";
    sql += " WHERE alunos.id='" + id + "') AS reposicao, ";

    sql += " (SELECT sn_experimental FROM alunos a INNER JOIN planos ON planos.nm_nome=a.nm_plano WHERE a.id='" + id + "' ) AS experimental,";

    sql += " estudios.nr_maxima AS capacidade, ";

    sql += "( SELECT bloquear_dia.id FROM bloquear_dia WHERE nm_estudio='" + estudio + "' AND dt_data='" + data + "' ) AS bloquear,  "

    sql += " (SELECT dt_inicioplano ";
    sql += " FROM alunos  ";
    sql += " WHERE alunos.id='" + id + "') AS dt_inicioplano, ";
    
    
    sql += " (SELECT nr_meses ";
    sql += " FROM alunos INNER JOIN planos ON planos.nm_nome=alunos.nm_plano ";
    sql += " WHERE alunos.id='" + id + "') AS numeromeses ";

    sql += " FROM aulas ";
    sql += " INNER JOIN alunos ON alunos.id=aulas.nm_alunos ";
    sql += " INNER JOIN estudios ON estudios.id=aulas.nm_estudio ";
    sql += " WHERE aulas.status IS NULL AND aulas.dt_data='" + data + "' AND aulas.nm_alunos='" + id + "' AND aulas.nm_estudio='" + estudio + "'";
    sql += " ORDER BY aulas.nm_horade ";

    console.log(sql)
    general.select(sql, function(ret){
        var diade;
        var diaate;
        var diafimde;
        var diafimate;

        if(ret.length > 0){
            if(!ret[0].capacidade){
                ret[0].capacidade = 10000000;
            }

            if(ret[0].reposicao < 0){
                ret[0].reposicao = ret[0].reposicao * -1;
            }

            

            ret[0].disponivel = false;
            diade = diaSemanaComFim(ret[0].nm_diade);
            diaate = diaSemanaComFim(ret[0].nm_diaate);
            diafimde = diaSemanaComFim(ret[0].nm_diafimde);
            diafimate = diaSemanaComFim(ret[0].nm_diafimate);

            
            var arraydate = ret[0].dt_inicioplano.split("/")
            var dateinicio = new Date(arraydate[2] + "-" + arraydate[1] + "-" + arraydate[0]);    
            var month = dateinicio.getMonth() + 1 + ret[0].numeromeses;
            
            var dateatual = new Date(data);  
            var monthatual = dateatual.getMonth() + 1;

            //if((sm >= diade && sm <= diaate) && !ret[0].bloquear && monthatual < month){
                if((sm >= diade && sm <= diaate) && !ret[0].bloquear){
                    ret[0].disponivel = true;
                }

                //if((sm >= diafimde && sm <= diafimate) && !ret[0].bloquear && monthatual < month){
                if((sm >= diafimde && sm <= diafimate) && !ret[0].bloquear){
                    ret[0].disponivel = true;
                } 

            ret[0].semana = semana;

            sql = " SELECT (NULLIF(nm_horade, '')::int) AS hora , count(*) AS capacidade FROM aulas WHERE dt_data='" + data + "' AND aulas.nm_estudio='" + estudio + "' GROUP BY nm_horade ORDER BY NULLIF(nm_horade, '')::int";
            general.select(sql, function(retorno){
                var capacidadehorario = {}; 
                ret[0].capacidadehorario = [];

                for (let index = 0; index < 24; index++) {   
                    capacidadehorario = {};                  
                    capacidadehorario.hora = index;
                    capacidadehorario.capacidade = 0;
                    capacidadehorario.horariodisponivel = true;
                                       
                    for (let i = 0; i < retorno.length; i++) { 
                        if(retorno[i].hora == index ){
                            capacidadehorario.capacidade = parseInt(retorno[i].capacidade);
                            if(ret[0].capacidade <= capacidadehorario.capacidade){
                                capacidadehorario.horariodisponivel = false;
                            }

                            break;
                        }
                    }

                    ret[0].capacidadehorario.push(capacidadehorario);

                }

                var sel = "SELECT count(*), nm_horade1 AS hora FROM alunos WHERE nm_dia1='" + semana + "' AND alunos.id <> '" + id + "'  GROUP BY nm_horade1"
                aulasfuturas(sel, ret,ret[0].capacidade,function(ret){
                    sel = "SELECT count(*), nm_horade2 AS hora FROM alunos WHERE nm_dia2='" + semana + "' AND alunos.id <> '" + id + "'  GROUP BY nm_horade2"
                    aulasfuturas(sel, ret,ret[0].capacidade,function(ret){
                        sel = "SELECT count(*), nm_horade3 AS hora  FROM alunos WHERE nm_dia3='" + semana + "' AND alunos.id <> '" + id + "'  GROUP BY nm_horade3"
                        aulasfuturas(sel, ret,ret[0].capacidade,function(ret){
                            sel = "SELECT count(*), nm_horade4 AS hora  FROM alunos WHERE nm_dia4='" + semana + "' AND alunos.id <> '" + id + "'  GROUP BY nm_horade4"
                            aulasfuturas(sel, ret,ret[0].capacidade,function(ret){
                                sel = "SELECT count(*), nm_horade5 AS hora  FROM alunos WHERE nm_dia5='" + semana + "' AND alunos.id <> '" + id + "'  GROUP BY nm_horade5"
                                aulasfuturas(sel, ret,ret[0].capacidade,function(ret){
                                    sel = "SELECT count(*), nm_horade6 AS hora  FROM alunos WHERE nm_dia6='" + semana + "' AND alunos.id <> '" + id + "'  GROUP BY nm_horade6"
                                    aulasfuturas(sel, ret,ret[0].capacidade,function(ret){
                                        sel = "SELECT count(*), nm_horade7 AS hora  FROM alunos WHERE nm_dia7='" + semana + "' AND alunos.id <> '" + id + "'  GROUP BY nm_horade7"
                                        aulasfuturas(sel, ret,ret[0].capacidade,function(ret){
                                            res.send(ret);
                                        });
                                    });
                                });
                            });
                        });
                    });
                });

            })
            

            
        }else{
            sql = "SELECT false AS disponivel, estudios.nm_diade, estudios.nm_diaate, estudios.nm_diafimde, ";
            sql += "estudios.nm_diafimate , estudios.nm_horade AS horadefunc, estudios.nm_horaate AS horaatefunc, ";
            sql += "TO_CHAR('" + data + "' :: DATE, 'dd/mm/yyyy') AS data, ";

                    
            
            sql += " (SELECT  ";
			
            sql += "     (CASE alunos.nr_creditos ";
            sql += "        WHEN 0 THEN (planos.nr_meses * planos.nr_aulasmes) ";
            sql += "        ELSE alunos.nr_creditos ";
            sql += "       END) - ";

            sql += " (SELECT COUNT(*) FROM aulas WHERE nm_alunos='" + id + "' ";
            //sql += " AND aulas.dt_data >=  CURRENT_DATE";
            sql += " ) FROM alunos INNER JOIN planos ON planos.nm_nome=alunos.nm_plano ";
            sql += " WHERE alunos.id='" + id + "') AS reposicao, ";

            sql += " (SELECT sn_experimental FROM alunos a INNER JOIN planos ON planos.nm_nome=a.nm_plano WHERE a.id='" + id + "' ) AS experimental, ";

            sql += " estudios.nr_maxima AS capacidade, ";

            
            sql += "( SELECT bloquear_dia.id FROM bloquear_dia WHERE nm_estudio='" + estudio + "' AND dt_data='" + data + "' ) AS bloquear, "

            
            sql += " (SELECT dt_inicioplano ";
            sql += " FROM alunos  ";
            sql += " WHERE alunos.id='" + id + "') AS dt_inicioplano, ";
            
            sql += " (SELECT nr_meses ";
            sql += " FROM alunos INNER JOIN planos ON planos.nm_nome=alunos.nm_plano ";
            sql += " WHERE alunos.id='" + id + "') AS numeromeses ";


            sql += " FROM estudios ";
            sql += " WHERE estudios.id='" + estudio + "'";

            general.select(sql, function(ret){
                console.log(sql)
                ret[0].disponivel = false;

                if(ret[0].reposicao < 0){
                    ret[0].reposicao = ret[0].reposicao * -1;
                }
                
                diade = diaSemanaComFim(ret[0].nm_diade);
                diaate = diaSemanaComFim(ret[0].nm_diaate);
                diafimde = diaSemanaComFim(ret[0].nm_diafimde);
                diafimate = diaSemanaComFim(ret[0].nm_diafimate);
                
                var arraydate = ret[0].dt_inicioplano.split("/")
                var dateinicio = new Date(arraydate[2] + "-" + arraydate[1] + "-" + arraydate[0]);   
                var month = dateinicio.getMonth() + 1 + ret[0].numeromeses;
                
                var dateatual = new Date(data);  
                var monthatual = dateatual.getMonth() + 1;


                //if((sm >= diade && sm <= diaate) && !ret[0].bloquear && monthatual < month){
                if((sm >= diade && sm <= diaate) && !ret[0].bloquear){
                    ret[0].disponivel = true;
                }

                //if((sm >= diafimde && sm <= diafimate) && !ret[0].bloquear && monthatual < month){
                if((sm >= diafimde && sm <= diafimate) && !ret[0].bloquear){
                    ret[0].disponivel = true;
                } 
                ret[0].semana = semana;
                sql = " SELECT (NULLIF(nm_horade, '')::int) AS hora , count(*) AS capacidade FROM aulas WHERE dt_data='" + data + "' AND aulas.nm_estudio='" + estudio + "' GROUP BY nm_horade ORDER BY NULLIF(nm_horade, '')::int";
                general.select(sql, function(retorno){
                    var capacidadehorario = {}; 
                    ret[0].capacidadehorario = [];

                    for (let index = 0; index < 24; index++) {   
                        capacidadehorario = {};                  
                        capacidadehorario.hora = index;
                        capacidadehorario.capacidade = 0;
                        capacidadehorario.horariodisponivel = true;
                                        
                        for (let i = 0; i < retorno.length; i++) { 
                            if(retorno[i].hora == index ){
                                capacidadehorario.capacidade = parseInt(retorno[i].capacidade);
                                if(ret[0].capacidade <= capacidadehorario.capacidade){
                                    capacidadehorario.horariodisponivel = false;
                                }

                                break;
                            }
                        }

                        ret[0].capacidadehorario.push(capacidadehorario);
                    }

                    var sel = "SELECT count(*), nm_horade1 AS hora FROM alunos WHERE nm_dia1='" + semana + "' AND alunos.id <> '" + id + "' GROUP BY nm_horade1"
                    aulasfuturas(sel, ret,ret[0].capacidade,function(ret){
                        sel = "SELECT count(*), nm_horade2 AS hora FROM alunos WHERE nm_dia2='" + semana + "' AND alunos.id <> '" + id + "'  GROUP BY nm_horade2"
                        aulasfuturas(sel, ret,ret[0].capacidade,function(ret){
                            sel = "SELECT count(*), nm_horade3 AS hora  FROM alunos WHERE nm_dia3='" + semana + "' AND alunos.id <> '" + id + "'  GROUP BY nm_horade3"
                            aulasfuturas(sel, ret,ret[0].capacidade,function(ret){
                                sel = "SELECT count(*), nm_horade4 AS hora  FROM alunos WHERE nm_dia4='" + semana + "' AND alunos.id <> '" + id + "'  GROUP BY nm_horade4"
                                aulasfuturas(sel, ret,ret[0].capacidade,function(ret){
                                    sel = "SELECT count(*), nm_horade5 AS hora  FROM alunos WHERE nm_dia5='" + semana + "' AND alunos.id <> '" + id + "'  GROUP BY nm_horade5"
                                    aulasfuturas(sel, ret,ret[0].capacidade,function(ret){
                                        sel = "SELECT count(*), nm_horade6 AS hora  FROM alunos WHERE nm_dia6='" + semana + "' AND alunos.id <> '" + id + "'  GROUP BY nm_horade6"
                                        aulasfuturas(sel, ret,ret[0].capacidade,function(ret){
                                            sel = "SELECT count(*), nm_horade7 AS hora  FROM alunos WHERE nm_dia7='" + semana + "' AND alunos.id <> '" + id + "'  GROUP BY nm_horade7"
                                            aulasfuturas(sel, ret,ret[0].capacidade,function(ret){
                                                res.send(ret);
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });

                    
                })
            });
        }        
    })    
})


function aulasfuturas(sql,ret,capacidade, callback){
    general.select(sql, function(retorno){
 
        for (let index = 0; index < retorno.length; index++) {  
            var i = parseInt(retorno[index].hora);
            if(ret[0].capacidadehorario[i]){
                ret[0].capacidadehorario[i].capacidade += parseInt(retorno[index].count);
                if(parseInt(retorno[index].count) + ret[0].capacidadehorario[i].capacidade >= capacidade){                
                    ret[0].capacidadehorario[i].horariodisponivel = false;
                }
            }
            
        }

        callback(ret);
    })
            
}


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

    verificarRemarcacao(parametros.dt_data, 0,parametros.nm_alunos, function(ver){
        if(ver.length > 0){
            res.send(ver);
        }else{
            verificarRemarcacao(parametros.dt_data, 1,parametros.nm_alunos, function(ver){
                general.executeObj(table,parametros, function(ret){
                    res.send(ret);
                })
            })
        }        
    })  
      
})

function verificarRemarcacao(data, quantidade,aluno, callback){
    var arradata = data.split('/');
    data = arradata[1] + "/" + arradata[0] + "/" + arradata[2];
    var sql = "";
    
    if(quantidade == 0){
        sql = "SELECT to_char(dt_data, 'DD-MM-YYYY') AS dt_data FROM aulas_canceladas ";
        sql += "WHERE dt_data > CURRENT_DATE ";
        sql += "AND nr_remarcacao IS NULL AND dt_data <> '" + data + "' AND nm_alunos='" + aluno + "'";
        console.log(sql)
        general.select(sql, function(ret){
            callback(ret);               
        }) 
    }else if(quantidade == 1){
        sql = "UPDATE aulas_canceladas SET nr_remarcacao=1 ";
        sql += "WHERE dt_data > CURRENT_DATE ";
        sql += "AND nr_remarcacao IS NULL AND dt_data = '" + data + "' AND nm_alunos='" + aluno + "'";
        general.execute(sql, function(ret){
            callback(ret); 
        }) 
    }else if(quantidade == 2){
        sql = "SELECT to_char(dt_data, 'DD-MM-YYYY') AS dt_data FROM aulas_canceladas ";
        sql += "WHERE dt_data > CURRENT_DATE ";
        sql += "AND nr_remarcacao IS NULL AND nm_alunos='" + aluno + "' OR (dt_data = '" + data + "' AND nr_remarcacao=1 AND nm_alunos='" + aluno + "') ";
        console.log(sql)
        general.select(sql, function(ret){
            callback(ret);               
        }) 
    }
}

router.route('/dataexpiracao/:aluno').get(function(req, res) {     
    var aluno = req.param('aluno');

    sql = "SELECT to_char(dt_data, 'DD-MM-YYYY') AS dt_data FROM aulas_canceladas ";
    sql += "WHERE dt_data > CURRENT_DATE ";
    sql += "AND nr_remarcacao IS NULL AND nm_alunos='" + aluno + "'";
    console.log(sql)
    general.select(sql, function(ret){
        var data;
        if(ret){
            if(ret.length > 0){
                data = ret[0].dt_data;
            }
        }
        res.send(data);              
    }) 
})

router.route('/autocompletealunos/:id').get(function(req, res) {   
    var id = req.param('id');
    var sql = "SELECT nm_nome AS text, id AS value FROM alunos ";
    sql += " WHERE nm_nome LIKE '" + id + "%' ";
    console.log(sql)
    general.select(sql, function(ret){
        ret.push({text: "ADICIONAR NOVO ALUNO", value: "-"});
        res.send(ret);         
    })    

})


router.route('/delete/:id/:data/:aluno').get(function(req, res) {
    var id = req.param('id');
    var data = req.param('data');
    var aluno = req.param('aluno');
    var atable = req.baseUrl.split("/");
    var table = "";
    if(atable.length > 0){
        table = atable[atable.length - 1]
    }

    data = data.replace("-","/");
    data = data.replace("-","/");

    verificarRemarcacao(data,2 ,aluno, function(ver){
        if(ver.length > 0){
            ver.remarcacao = true;
            res.send(ver);
        }else{
            insertAulaCancelada(id, function(){
                var sql2 = "SELECT nm_email AS email FROM alunos WHERE id='" + aluno + "'";
                general.select(sql2, function(ret2){
                    if(ret2 && ret2.length > 0){
                        var emailto = ret2[0].email;
                        enviaremailconfig(2, emailto, function(){
                            var sql = "DELETE FROM " + table + " WHERE id='" + id + "'";
                            general.execute(sql, function(ret){
                                res.send(ret);
                            }) 
                        })
                    }else{
                        var sql = "DELETE FROM " + table + " WHERE id='" + id + "'";
                            general.execute(sql, function(ret){
                                res.send(ret);
                            }) 
                    }

                    
                }) 
            })  
        }
    })     
})

router.route('/anula/:id').get(function(req, res) {
    var id = req.param('id');
    
    var atable = req.baseUrl.split("/");
    var table = "";
    if(atable.length > 0){
        table = atable[atable.length - 1]
    }


     
    var up = "UPDATE aulas SET status='anulado' WHERE id='" + id + "'";
    console.log(up)
    general.execute(up, function(ret){
        res.send(ret);
        //callback();
    })               
          
})


function insertAulaCancelada(id, callback){
    var sql = "SELECT * FROM aulas WHERE id='" + id + "'";
    
    general.select(sql, function(ret){

        if(ret){
            if(ret.length > 0){

                var data = new Date(ret[0].dt_data)

                var ins = "INSERT INTO aulas_canceladas (id, dt_data, nm_horade, nm_horaate, nm_alunos)";
                ins += " VALUES('" + id + "','" + data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate() + "', '" + ret[0].nm_horade + "', '" + ret[0].nm_horaate + "','" + ret[0].nm_alunos + "' )";
                console.log(ins)
                general.execute(ins, function(ret){
                    //res.send(ret);
                    callback();
                })                
            }
        }
        
    })  
}


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
    
    var sql = "SELECT TO_CHAR(dt_data :: DATE, 'yyyy-mm-dd') AS dt_data, id AS id FROM aulas   ";
    sql += " WHERE nm_estudio='" + estudio + "' ";

    general.select(sql, function(ret){
        
        
        var array = [];
        var obj = {};

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




router.route('/horariosdisponiveisdatas/:estudio/:startdate/:enddate').get(function(req, res) {
    var estudio = req.param('estudio');
    var startdate = req.param('startdate');
    var enddate = req.param('enddate');
    
    var sql = "SELECT TO_CHAR(dt_data :: DATE, 'yyyy-mm-dd') AS dt_data, id AS id FROM aulas WHERE  ";
    sql += " status IS NULL AND  nm_estudio='" + estudio + "' AND dt_data >= '" + startdate + "' AND dt_data <= '" + enddate + "'";
    console.log(sql)
    general.select(sql, function(ret){
        
        var array = [];
        var obj = {};

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

router.route('/horariosdisponiveisdatasaluno/:id/:startdate/:enddate').get(function(req, res) {
    var id = req.param('id');
    var startdate = req.param('startdate');
    var enddate = req.param('enddate');
    
    var sql = "SELECT TO_CHAR(dt_data :: DATE, 'yyyy-mm-dd') AS dt_data, id AS id FROM aulas WHERE  ";
    sql += " nm_alunos='" + id + "' AND dt_data >= '" + startdate + "' AND dt_data <= '" + enddate + "'";
    console.log(sql)
    general.select(sql, function(ret){
        
        var array = [];
        var obj = {};

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






router.route('/aulasmarcadas').get(function(req, res) {
    
    var d = new Date();
    var m = d.getMonth();
    var a = d.getFullYear();
    var retorno = {};

    var month = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"][m];
    m += 1;
    var ultimoDia = (new Date(a, m, 0)).getDate();
    var s_m = m.toString();
    if(s_m.length == 1){
        s_m = "0" + s_m;
    }

    var sql = "SELECT nm_diade, nm_diaate, nm_horade, nm_horaate, nm_diafimde, nm_diafimate, ";
    sql += " nm_horafimde, nm_horafimate, ";
    
    sql += "(SELECT Count(*)  ";
    sql += " FROM aulas ";
    sql += " WHERE dt_data >= '" + s_m + "/01/" + a + "' AND dt_data <= '" + s_m + "/" + ultimoDia + "/" + a + "'), ";
    sql += " (SELECT SUM(CAST(nm_horaate AS integer)) - SUM(CAST(nm_horade AS integer)) AS intervalo  FROM intervalo) AS intervalo "
      
    sql += " FROM estudios "
    

    console.log(sql)
    general.select(sql, function(ret){
        var dias = 0;
        var horas = 0;
        var intervalo = 0;

        for (let index = 0; index < ret.length; index++) {
            const element = ret[index];

            if(element.intervalo && intervalo == 0){
                intervalo = element.intervalo;
            }

            if(element.nm_diade && element.nm_diaate && element.nm_horade && element.nm_horaate){
                var diade = diaSemana(element.nm_diade);
                var diaate = diaSemana(element.nm_diaate);
                var horade = element.nm_horade;
                var horaate = element.nm_horaate;
    
                dias += (diaate - diade) + 1;
                horas += (horaate - horade)
            }     
            
            
            if(element.nm_diafimde && element.nm_diafimate && element.nm_horafimde && element.nm_horafimate){
                var diafimde = diaSemana(element.nm_diafimde);
                var diafimate = diaSemana(element.nm_diafimate);
                var horafimde = element.nm_horafimde;
                var horafimate = element.nm_horafimate;
    
                dias += (diafimate - diafimde) + 1;
                horas += (horafimate - horafimde)
            }  
 
        }

        
        
        retorno.horaslivres = ((dias * horas) - ret[0].count) - intervalo;
        retorno.month = month;
        retorno.year = a;
        retorno.horasaulas = ret[0].count;

        retorno.uso = Math.round((retorno.horasaulas / retorno.horaslivres) * 100); 
        retorno.livre = 100 - retorno.uso;
        res.send(retorno);         
    })     
})

function diaSemana(dia){
    switch (dia) {
        case "Segunda":
            return 1;
            break;   
        case "Terça":
            return 2;
            break;    
        case "Quarta":
            return 3;
            break;    
        case "Quinta":
            return 4;
            break;    
        case "Sexta":
            return 5;
            break;      
        case "Sabado":
            return 1;
            break;      
        case "Domingo":
            return 2;
            break;     
        default:
            return 0;
            break;
    }
}


function diaSemanaComFim(dia){
    switch (dia) {
        case "Segunda":
            return 1;
            break;   
        case "Terça":
            return 2;
            break;    
        case "Quarta":
            return 3;
            break;    
        case "Quinta":
            return 4;
            break;    
        case "Sexta":
            return 5;
            break;      
        case "Sabado":
            return 6;
            break;      
        case "Domingo":
            return 7;
            break;     
        default:
            return 0;
            break;
    }
}


router.route('/aulasmeses/:horas').get(function(req, res) {
    
    var horas = req.param('horas');
    var d = new Date();
    var m = d.getMonth();
    var a = d.getFullYear();
    var retorno = {};
    
    m += 1;
    var ultimoDia = (new Date(a, m, 0)).getDate();
    var s_m = m.toString();
    if(s_m.length == 1){
        s_m = "0" + s_m;
    }

    var m3 = m - 1;
    var a3 = a;
    if(m3 == 0){
        m3 = 12;
        a3 -= 1;
    }
    var ultimoDiaM3 = (new Date(a3, m3, 0)).getDate();

    var m2 = m3 - 1;
    var a2 = a3;
    if(m2 == 0){
        m2 = 12;
        a2 -= 1;
    }
    var ultimoDiaM2 = (new Date(a2, m2, 0)).getDate();
    
    var m1 = m2 - 1;
    var a1 = a2;
    if(m1 == 0){
        m1 = 12;
        a1 -= 1;
    }
    var ultimoDiaM1 = (new Date(a1, m1, 0)).getDate();

    var m5 = m + 1;
    var a5 = a;
    if(m5 == 13){
        m5 = 1;
        a5 += 1;
    }
    var ultimoDiaM5 = (new Date(a5, m5, 0)).getDate();
    
    var m6 = m5 + 1;
    var a6 = a;
    if(m6 == 13){
        m6 = 1;
        a6 += 1;
    }
    var ultimoDiaM6 = (new Date(a6, m6, 0)).getDate();
    
    var m7 = m6 + 1;
    var a7 = a;
    if(m7 == 13){
        m7 = 1;
        a7 += 1;
    }
    var ultimoDiaM7 = (new Date(a7, m7, 0)).getDate();

    var sql = "SELECT Count(*) AS mesatual, ";
    sql += " (SELECT Count(*) FROM aulas  WHERE dt_data >= '" + m3 + "/01/" + a3 + "' AND dt_data <= '" + m3 + "/" + ultimoDiaM3 + "/" + a3 + "') AS mes3, ";
    sql += " (SELECT Count(*) FROM aulas  WHERE dt_data >= '" + m2 + "/01/" + a2 + "' AND dt_data <= '" + m2 + "/" + ultimoDiaM2 + "/" + a2 + "') AS mes2, ";
    sql += " (SELECT Count(*) FROM aulas  WHERE dt_data >= '" + m1 + "/01/" + a1 + "' AND dt_data <= '" + m1 + "/" + ultimoDiaM1 + "/" + a1 + "') AS mes1, ";
    sql += " (SELECT Count(*) FROM aulas  WHERE dt_data >= '" + m5 + "/01/" + a5 + "' AND dt_data <= '" + m5 + "/" + ultimoDiaM5 + "/" + a5 + "') AS mes5, ";
    sql += " (SELECT Count(*) FROM aulas  WHERE dt_data >= '" + m6 + "/01/" + a6 + "' AND dt_data <= '" + m6 + "/" + ultimoDiaM6 + "/" + a6 + "') AS mes6, ";
    sql += " (SELECT Count(*) FROM aulas  WHERE dt_data >= '" + m7 + "/01/" + a7 + "' AND dt_data <= '" + m7 + "/" + ultimoDiaM7 + "/" + a7 + "') AS mes7 ";
 
    
    
    sql += " FROM aulas  ";
    sql += " WHERE dt_data >= '" + s_m + "/01/" + a + "' AND dt_data <= '" + s_m + "/" + ultimoDia + "/" + a + "' ";
     
    var month1 = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"][m1 - 1];
    var month2 = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"][m2 - 1];
    var month3 = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"][m3 - 1];
    var month4 = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"][m - 1];
    var month5 = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"][m5 - 1];
    var month6 = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"][m6 - 1];
    var month7 = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"][m7 - 1];
    
    console.log(sql)
    general.select(sql, function(ret){
        if(ret.length > 0){
            retorno.mes1 = ret[0].mes1;
            retorno.mes2 = ret[0].mes2;
            retorno.mes3 = ret[0].mes3;
            retorno.mes4 = ret[0].mesatual;
            retorno.mes5 = ret[0].mes5;
            retorno.mes6 = ret[0].mes6;
            retorno.mes7 = ret[0].mes7;
            
            retorno.mes1perc = Math.round((ret[0].mes1 / horas) * 100);
            retorno.mes2perc = Math.round((ret[0].mes2 / horas) * 100);
            retorno.mes3perc = Math.round((ret[0].mes3 / horas) * 100);
            retorno.mes4perc = Math.round((ret[0].mesatual / horas) * 100);
            retorno.mes5perc = Math.round((ret[0].mes5 / horas) * 100);
            retorno.mes6perc = Math.round((ret[0].mes6 / horas) * 100);
            retorno.mes7perc = Math.round((ret[0].mes7 / horas) * 100);

            retorno.rows = [];
            retorno.rows.push(0);
            var value = 0;
            var fator = horas / 5;

            for (let index = 0; index <= 4; index++) {
                value +=  fator;
                retorno.rows.push(Math.round(value));                
            }

            
            retorno.month1 = month1;
            retorno.month2 = month2;
            retorno.month3 = month3;
            retorno.month4 = month4;
            retorno.month5 = month5;
            retorno.month6 = month6;
            retorno.month7 = month7;

        }
        res.send(retorno);         
    })     
})






router.route('/aulasmesescalendario').get(function(req, res) {

    var retorno = [
        
    ];

    var sql = "SELECT dt_data FROM aulas GROUP BY dt_data "
    general.select(sql, function(ret){
        if(ret.length > 0){
            for (let index = 0; index < ret.length; index++) {
                const element = ret[index];
                var d = new Date(element.dt_data);
                var dia = d.getDate();
                var s_dia = dia;

                if(dia.toString().length == 1){
                   s_dia = "0" + dia;
                }

                var m = d.getMonth() + 1;
                var s_m = m;
                if(m.toString().length == 1){
                   s_m = "0" + m;
                }

                var a = d.getFullYear(); 
                
                retorno.push({
                    "date": a + "-" + s_m + "-" + s_dia,
                    "badge":true,
                    "title":"Aula marcada",
                    "body":"",
                    "footer":"",
                    "classname":"purple-event"
                })
            }
            
        }
        res.send(retorno); 
    })
})


router.route('/horariointervalos/:data/:estudio').get(function(req, res) {
    var data = req.param('data');
    var id = req.param('id');
    var estudio = req.param('estudio');
    var d = new Date(data);
    var sm = d.getDay();

    var semana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"][sm];
    console.log(semana)
    var sql = "SELECT * FROM intervalo WHERE nm_dia='" + semana + "' "
    general.select(sql, function(ret){
        if(ret.length > 0){

        }
        res.send(ret);
    })
})




router.route('/bloqueardia/:estudio/:data').get(function(req, res) {
    var estudio = req.param('estudio'); 
    var dia = req.param('data'); 

    var array = dia.split("-");
    dia = array[1] + "/" +  array[0] + "/" + array[2];
    var id = guid();

    var sql = "DELETE FROM aulas WHERE nm_estudio='" + estudio + "' AND dt_data='" + dia + "'; ";
    sql += " INSERT INTO bloquear_dia (id, nm_estudio, dt_data) VALUES('" + id + "', '" + estudio + "', '" + dia + "');";
    general.execute(sql, function(ret){
        res.send(ret);
    })    
})


router.route('/desbloqueardia/:estudio/:data').get(function(req, res) {
    var estudio = req.param('estudio'); 
    var dia = req.param('data'); 

    var sql = "DELETE FROM bloquear_dia WHERE nm_estudio='" + estudio + "' AND dt_data='" + dia + "'";
    general.execute(sql, function(ret){
        res.send(ret);
    })    
})

function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
  
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }


  
router.route('/datasbloqueio/:estudio/:startdate/:enddate').get(function(req, res) {
    var estudio = req.param('estudio');
    var startdate = req.param('startdate');
    var enddate = req.param('enddate');
    
    var sql = "SELECT TO_CHAR(dt_data :: DATE, 'yyyy-mm-dd') AS dt_data, id AS id FROM bloquear_dia WHERE  ";
    sql += " nm_estudio='" + estudio + "' AND dt_data >= '" + startdate + "' AND dt_data <= '" + enddate + "'";
    console.log(sql)
    general.select(sql, function(ret){
        
        var array = [];
        var obj = {};

        var arrayaulas = [];

        for (let index = 0; index < ret.length; index++) {
            const element = ret[index];
            if(arrayaulas.indexOf(element.dt_data) == -1){
                
                obj = {};
                obj.id = element.id;
                obj.start = element.dt_data;
                obj.title = "Dia indisponível";
                array.push(obj);
                arrayaulas.push(element.dt_data);
            }
        }

        res.send(array);         
    })     
})


router.route('/informaluno/:id').get(function(req, res) {
    var idusuario = req.param('id');
    var dataatual = dataAtualFormatada()
    var sql = "SELECT count(*) - (SELECT count(*) FROM aulas_canceladas WHERE nm_alunos = '" + idusuario + "') AS quant, ";
    sql += "(SELECT  to_char(dt_data, 'DD/MM/YYYY') FROM aulas WHERE nm_alunos = '" + idusuario + "' ORDER BY dt_data DESC limit 1) AS ultimaaula, ";
    sql += "(SELECT (planos.nr_aulasmes * planos.nr_meses) FROM planos INNER JOIN alunos ON alunos.nm_plano = planos.nm_nome WHERE alunos.id='" + idusuario + "') AS quantplano"
    sql += " FROM aulas  ";
    sql += "WHERE nm_alunos = '" + idusuario + "' AND dt_data >= '" + dataatual + "'";
    
    console.log(sql)
    general.select(sql, function(ret){  
        console.log(sql)   
        if(ret){
            if(ret.length > 0){
                if(ret[0].quant <= 0){
                    ret[0].quant = ret[0].quantplano;
                }

                if(!ret[0].ultimaaula){
                    ret[0].ultimaaula = "";
                }
            } 
        }   
        res.send(ret);         
    })     
})

function dataAtualFormatada(){
    var data = new Date(),
        dia  = data.getDate().toString().padStart(2, '0'),
        mes  = (data.getMonth()+1).toString().padStart(2, '0'),
        ano  = data.getFullYear();
    return mes+"/"+dia+"/"+ano;
}


function enviaremailconfig(tipo, emailto, callback){

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
