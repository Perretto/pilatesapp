var sqlite3 = require('sqlite3').verbose();
var pg = require('pg');

exports.select =  function (sql, callback){
    const config = {
        //host: '34.212.28.6',
        host: 'localhost',
        user: 'postgres',
        database: 'pilatesapp_producao',
        password: 'Joao3:16',
        port: 5432
        //port: 5434
    };
    const pool = new pg.Pool(config);
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Falha ao conectar ao banco de dados" + err);
        }
        client.query(sql, function (err, result) {
             done();
             if (err) {
                 console.log(err);
                 callback(err);
             }
             callback(result.rows);
        })
    })

/*
    var retorno = [];
    //var db = new sqlite3.Database('C:\\sqlite\\baseig');
    var db = new sqlite3.Database(__dirname + '/baseig');
    var teste = __dirname;
    db.serialize(function() {
        db.each(sql, function(err, row) {
            retorno.push(row);            
        });        
    });
    
    db.close((err) => {
        if (err) {
          console.error(err.message);
          retorno.push(err);
        } 
        
        callback(retorno);         
    });
    */
}

exports.execute =  function (sql, callback){

    const config = {
        //host: '34.212.28.6',
        host: 'localhost',
        user: 'postgres',
        database: 'pilatesapp_producao',
        password: 'Joao3:16',
        port: 5432
        //port: 5434
    };
    const pool = new pg.Pool(config);
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Falha ao conectar ao banco de dados" + err);
        }
        client.query(sql, function (err, result) {
             done();
             if (err) {
                 console.log(err);
                 callback(err);
             }
             callback(result);
        })
    })

    /*
    var retorno = [];
    //var db = new sqlite3.Database('C:\\sqlite\\baseig');
    var db = new sqlite3.Database(__dirname + '/baseig');
    
    db.serialize(function() {        
        db.run(sql);        
    });
    
    db.close((err) => {
        if (err) {
          console.error(err.message);
          retorno.push(err.message);
        } 
        
        callback(retorno);         
    });
    */
}






exports.executeObj =  function (table, parametros, callback){
    
    var sql = "";
    var columns = "";
    var values = "";
    var nome = "";
    var i = 0;
    var up = false;
    var id = guid();

    if(parametros.id){
        id = parametros.id;
        up = true;
        sql = "UPDATE " + table + " SET ";
        for (index in parametros) {
            if(index != "id"){
                nome = "";

                switch (index.substring(0,2)) {
                    case "nm":
                        nome = "'" + parametros[index] + "'";
                        break; 
                    case "dt":
                        if(!parametros[index]){
                            nome = "NULL";
                        }else{
                            var dataArray = parametros[index].split("/");
                            var data = dataArray[0] + "/" + dataArray[1] + "/" + dataArray[2]

                            nome = "'" + data + "'";
                        }
                        break;     
                    case "im":
                        nome = "'" + parametros[index] + "'";
                        break;                                   
                    case "vl":  
                        if(parametros[index].substr(parametros[index].length - 3,1) == ","){
                            parametros[index] = parametros[index].replace(".","").replace(".","").replace(".","").replace(".","").replace(".","").replace(",",".")
                        }
                        
                        if(!parametros[index]){
                            parametros[index] = "0";
                        }
                        nome = "" + parametros[index] + "";
                    break;
                    case "nr":  
                                                 
                        if(!parametros[index]){
                            parametros[index] = "0";
                        }
                        nome = "" + parametros[index] + "";
                    break;           
                    default:
                        nome = "" + parametros[index] + "";
                        break;
                }
                
                if(i == 0){
                    sql += " " + index + "=" + nome;
                }else{
                    sql += ", " + index + "=" + nome;
                }
                i += 1; 
            }
        }

        sql += " WHERE id='" + parametros.id + "'";         
    }else{
        parametros.id = guid()
        for (index in parametros) {
            if(index != "id"){
                console.log(index.substring(0,2))
                switch (index.substring(0,2)) {
                    case "nm":
                        nome = "'" + parametros[index] + "'";
                        break; 
                    case "dt":
                        if(!parametros[index]){
                            nome = "NULL";
                        }else{
                            var dataArray = parametros[index].split("/");
                            var data = dataArray[1] + "/" + dataArray[0] + "/" + dataArray[2]

                            nome = "'" + data + "'";
                        }
                        break;        
                    case "im":
                        nome = "'" + parametros[index] + "'";
                        break;                                          
                    case "vl": 
                        if(parametros[index].substr(parametros[index].length - 3,1) == ","){
                            parametros[index] = parametros[index].replace(".","").replace(".","").replace(".","").replace(".","").replace(".","").replace(",",".")
                        }
                        if(!parametros[index]){
                            parametros[index] = "0";
                        }
                        nome = "" + parametros[index] + "";         
                    default:
                        nome = "" + parametros[index] + "";
                        break;
                }


                if(i == 0){
                    columns += index;
                    values += nome;
                }else{
                    columns += ", " + index;
                    values += ", " + nome;
                }
                
                i += 1;
            }
        }

        sql = "INSERT INTO " + table + " (id," + columns + ") VALUES('"+ id + "'," + values + ")";
    }
    console.log(sql)

    const config = {
        //host: '34.212.28.6',
        host: 'localhost',
        user: 'postgres',
        database: 'pilatesapp_producao',
        password: 'Joao3:16',
        port: 5432
        //port: 5434
    };
    const pool = new pg.Pool(config);
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Falha ao conectar ao banco de dados" + err);
        }
        client.query(sql, function (err, result) {
             done();
             if (err) {
                 console.log(err);
                 callback(err);
             }
             result.lastID = id;
             callback(result);
        })
    })

    /*
    var retorno = [];
    //var db = new sqlite3.Database('C:\\sqlite\\baseig');
    var db = new sqlite3.Database(__dirname + '/pdv');
    
    db.serialize(function() {        
        db.run(sql,function(err, ret){
            if(up){
                this.lastID = parametros.id;
            }
            retorno.push(this);
            console.log(this)    
        });    
    });
    
    db.close((err) => {
        if (err) {
          console.error(err);
          retorno.push(err);
        } 
        
        callback(retorno);         
    }); 
    */
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