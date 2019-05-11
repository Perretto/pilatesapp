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
    sql += " WHERE aulas.dt_data='" + data + "' AND estudios.id='" + estudio + "'";
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
    if(req.host != "localhost"){
        if(sm == 0){
            sm = 6;
        }else{
            sm -= 1;
        }
    }

    var semana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sabado", "Domingo"][sm];
    
    sm = diaSemanaComFim(semana);
    console.log(semana)
   console.log(sm)

var sql = "SELECT false AS disponivel,  estudios.nm_diade, estudios.nm_diaate, estudios.nm_diafimde, estudios.nm_diafimate , estudios.nm_horade AS horadefunc, estudios.nm_horaate AS horaatefunc, ";
    sql += " aulas.id AS id, TO_CHAR(dt_data :: DATE, 'dd/mm/yyyy') AS data, ";
    sql += " aulas.nm_obs AS obs, alunos.nm_nome AS aluno, ";
    sql += " estudios.nm_nome AS estudio, aulas.nm_horade AS horade, aulas.nm_horaate AS horaate ";
    sql += " FROM aulas ";
    sql += " INNER JOIN alunos ON alunos.id=aulas.nm_alunos ";
    sql += " INNER JOIN estudios ON estudios.id=aulas.nm_estudio ";
    sql += " WHERE aulas.dt_data='" + data + "' AND aulas.nm_alunos='" + id + "'";
    sql += " ORDER BY aulas.nm_horade ";

    console.log(sql)
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
            sql = "SELECT false AS disponivel, estudios.nm_diade, estudios.nm_diaate, estudios.nm_diafimde, estudios.nm_diafimate , estudios.nm_horade AS horadefunc, estudios.nm_horaate AS horaatefunc, TO_CHAR('" + data + "' :: DATE, 'dd/mm/yyyy') AS data FROM estudios ";
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
        ret.push({text: "ADICIONAR NOVO ALUNO", value: "-"});
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