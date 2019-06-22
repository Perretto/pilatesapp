function createtable(table){  

    var url = "http://" + window.location.hostname + ":3003/api/" + table + "/listsearch"
                    
    $.ajax({        
        type: "GET",
        url: url,
        success: function(data){
            if(data){
                if(data.length > 0){
                    var perpage = 10;
                    var ind = 0;
                    var ths = "";
                    var tds = "";
                    ths += "<tr>";
                    for (index in data[0]) {
                        if(index == "id"){
                            ths += "<th></th>";   
                        }else
                            ths += "<th>" + index + "</th>";   
                        }                     
                    }
                    ths += "</tr>";

                    var page = 0;
                    var changepage = 0;

                    for (let i = 0; i < data.length; i++) {
                        const element = data[i]; 
                        if(changepage == perpage){
                            page += 1;
                            changepage = 0;
                        }

                        changepage += 1;

                        if(i > perpage){
                            tds += "<tr page=" + page + " style=\"display:none\">";
                        }else{
                            tds += "<tr page=" + page + ">";
                        }

                        for (index in element) {
                            if(index == "id"){
                                tds += "<td style=\"padding:1px\">";
                                tds += "<button  onclick=\"edit('" + element[index] + "','" + table + "')\" type=\"button\" class=\"btn btn-icons btn-rounded btn-outline-info\">";
                                tds += "    <i class=\"fa fa-edit\"></i>";
                                tds += "</button>";
                                tds += "</td>";
                            }else{
                                tds += "<td>" + element[index] + "</td>";     
                            }                   
                        }
                        tds += "</tr>";
                    }
                                            
                    var html = "<div class=\"col-md-12 grid-margin stretch-card\">";
                    html += "   <div class=\"form-panel\">";
                    html += "       <div class=\"card-body\">   ";                    
                    html += "           <div class=\"table-responsive\">";
                    html += "               <table class=\"table table-striped\">";
                    html += "                   <thead>";
                    html += ths;
                    html += "                   </thead>";
                    html += "                   <tbody>";
                    html += tds;
                    html += "                   </tbody>";
                    html += "               </table>";

                    html += "           </div>";   
                    page = parseInt(page) + 1;
                    html += "<p class=\"card-description\" >Numero de paginas: " + page + "</p>";
                    
                    html += "<div style=\"padding-left: 42%;\">";  
                    html += "   <button  type=\"button\" onclick=\"anterior()\" class=\"btn btn-light\">Anterior</button>";
                    html += "   <span id=\"numeracao\">1</span>";
                    html += "   <button type=\"button\" onclick=\"proximo()\" class=\"btn btn-light\">Próximo</button>"; 
                    html += "   <button type=\"button\" style=\"margin-left: 90%;\" onclick=\"cancelargrid()\"  class=\"btn btn-danger\">Voltar</button>"; 
                    
                    
                    html += "</div>";

                    html += "       </div>";
                    html += "   </div>";
                    html += "</div>";

                    $("#gridsearch").html(html);                       
                    $("#rowform").hide();
                    $("#gridsearch").show();
            
            }                        
        }    
    });
}
            
function proximo(){
    var page = $("tr:visible[page]").attr("page");  
    page = parseInt(page)

    if($("[page='" + (page + 1) + "']").length > 0){ 
        $("[page='" + page + "']").hide();    
        page += 1
        $("[page='" + page + "']").show();
        page += 1
        $("#numeracao").html(page)
    }    
}

 
function anterior(){
    var page = $("tr:visible[page]").attr("page"); 
    page = parseInt(page)
    if($("[page='" + (page - 1) + "']").length > 0){ 
        $("[page='" + page + "']").hide();
        
        $("#numeracao").html(page)
        page -= 1
        $("[page='" + page + "']").show();
    }
}

function cancelargrid(){
    $("#rowform").show();
    $("#gridsearch").hide()
}

function edit(id, table){
    
    var url = "http://" + window.location.hostname + ":3003/api/" + table + "/search/" + id
                    
    $.ajax({        
        type: "GET",
        url: url,
        success: function(data){
            if(data){
                if(data.length > 0){
                    for (index in data[0]) {
                        
                        $("[name='" + index + "']").val(data[0][index]);

                        if($("[name='" + index + "']").attr("type") == "checkbox"){
                            if(data[0][index]){
                                $("[name='" + index + "']").prop("checked", true)
                            }else{
                                $("[name='" + index + "']").prop("checked", false)
                            }
                        }
                        
                        if(index.indexOf("img_") > -1){
                            if(data[0][index]){
                                $($("#" + index).prev()).attr("src", data[0][index])
                            }else{
                                imagensPadrao()
                            }
                        }

                        if(index.indexOf("dt_") > -1){
                            if(data[0][index]){
                                var date = new Date(data[0][index]);
                                var dataformat = "";

                                /*
                                if(String((date.getDate())).length == 1){
                                    dataformat += "0" + (date.getDate()) + "/";
                                }else{
                                    dataformat += (date.getDate()) + "/";
                                }

                                if(String((date.getMonth() + 1)).length == 1){
                                    dataformat += "0" + (date.getMonth() + 1) + "/";
                                }else{
                                    dataformat += (date.getMonth() + 1) + "/";
                                }
                                

                                dataformat +=  date.getFullYear()
                                
                                
                                $("[name='" + index + "']").val(dataformat);*/
                                $("[name='" + index + "']").val(data[0][index]);

                            }else{

                            }
                        }
                    }
                    
                    $("#rowform").show();
                    $("#gridsearch").hide()
                    changeplano()
                }
                
            }
        }
    })
}