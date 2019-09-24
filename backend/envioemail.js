
    var url = 'http://meupilates.pilatesapp.com.br:3003/api/email/enviaremailaniversario';
    var Client = require('node-rest-client').Client;
    
   // direct way 
   var client = new Client();   

   var args = {
    headers: { "Content-Type": "application/json" }
    };
    
   client.get(url, args,
       function (data, response) {
           if (callback) {
                console.log(data);
           }
            
       }
    );


