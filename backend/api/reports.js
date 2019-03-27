const server = require('../config/server');
const express = require('express');
const router = express.Router();
server.use('/api/reports', router);
var pdf = require('html-pdf');
const general = require('../../backend/api/core/general.js');


router.route('/impressoesfixas/:nome').get(function(req, res) {
    var nome = req.param('nome');
    var sql = "SELECT * FROM reports WHERE nm_nome='" + nome + "'";
    general.select(sql, function(ret){ 
        if(ret.length > 0){
            var html = {};
            if(ret[0].nm_header){
                html.header = ret[0].nm_header;
            }else{
                html.header = " ";
            }
            
            if(ret[0].nm_topo){
                html.topo = ret[0].nm_topo;
            }else{
                html.topo = " ";
            }
            
            if(ret[0].nm_detail){
                html.detail = ret[0].nm_detail;
            }else{
                html.detail = " ";
            }
            
            if(ret[0].nm_base){
                html.base = ret[0].nm_base;
            }else{
                html.base = " ";
            }
            
            if(ret[0].nm_footer){
                html.footer = ret[0].nm_footer;
            }else{
                html.footer = " ";
            }
            

            var headersize = "20";
            var orientation = "portrait";
            var options = {
                paginationOffset: 1,
                orientation: orientation, 
                header: {
                    "height": "" + headersize + "mm", 
                    "contents": html.header
                } ,
                footer: {
                    "height":"10mm", 
                    "contents":html.footer
                }, timeout: '100000'
            };

            res.setHeader('Content-type', 'application/pdf');

            pdf.create(html.topo +  html.detail + html.base, options).toBuffer(function(err, buffer){

                if(err){
                    console.log(err)
                }
                else{
                    if(buffer){
                        res.write(buffer);
                    }
                }
                

                res.end()
            });
        }   
    })    
   
})