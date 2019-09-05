function savealuno(table){
    save(table, function(data){

        var creditos = $("#nr_creditos").val();
        var id = $("#id").val();

        if(creditos <= 0){
            var url = "http://" + window.location.hostname + ":3003/api/alunos/pregeraraulasaluno/" + id
    
            $.ajax({        
                type: "GET",
                url: url,
                success: function(data){
                    var plano = $("#nm_plano").val();
                    var estudio = $("#nm_estudio").val();
                    var inicioplano = $("#dt_inicioplano").val();
    
                    var elementhorario = $("[aula][style!='display:none'] select");
                    var valid = true;
    
                    for (let index = 0; index < elementhorario.length; index++) {
                        const element = elementhorario[index];
                        var valor = $(element).val();
                        if(!valor){
                            valid = false;
                            break;
                        }
    
                    }
    
                    if(plano && estudio && inicioplano && valid){
    
                        var html = "";
                        html += "<table class=\"table\" style=\"width: 100%;\">";
                        html += "<tr>";
                        html += "<th>Data</th>";
                        html += "<th>Horário</th>";
                        html += "</tr>";
                        for (let index = 0; index < data.length; index++) {
                            const element = data[index];
                            var dataArray = element.dataformat.split("/")
                            var dia = dataArray[1];
                            var mes = dataArray[0];
                            var ano = dataArray[2];
    
                            html += "<tr>";
                            html += "<td>";
                            html += element.diasemana + " - " + dia + "/" + mes + "/" + ano;
                            html += "</td>";
                            html += "<td>";
                            html += element.horario;
                            html += "</td>";
                            html += "</tr>";
                            
                        }
                        html += "</table>";
        
                        $("#conteudomodal").html(html);
                        $("#modalaluno").modal('show');
                                             
                    }else{
                        iziToast.error({
                            title: '',
                            message: 'Para gerar as aulas, selecione o plano, estudio e data de inicio da aulas!',
                        });
                    }
    
                }
            
            });
        }else{
            var url = "http://" + window.location.hostname + ":3003/api/alunos/deletaraulas/" + id
    
            $.ajax({        
                type: "GET",
                url: url,
                success: function(data){

                }
            })
        }
    })
}

function geraraulas(){
    var id = $("#id").val();
    var url = "http://" + window.location.hostname + ":3003/api/alunos/geraraulasaluno/" + id
    
    $.ajax({        
        type: "GET",
        url: url,
        success: function(data){         
            $("#modalaluno").modal('hide');
            iziToast.success({
                title: '',
                message: 'Aulas atualizadas conforme cadastro!',
            });                               
        }    
    });
}

function sairaulas(){
    $("#modalaluno").modal('hide');
}

function abasaude(){
    var id = $("#id").val();

    if(!id){
        iziToast.error({
            title: '',
            message: 'Selecione um aluno antes de prosseguir!',
        });
        return;
    } 

    $(".cadalunodiahora").hide();
    $(".cadaluno").hide();
    $(".cadsaude").show();

}

function voltar(){    
    $(".cadaluno").show();
    $(".cadsaude").hide();
    changeplano()
}




function changeestudio(){
    var id = $("#nm_estudio").val();
    var url = "http://" + window.location.hostname + ":3003/api/alunos/diasbloqueados/" + id
    
    $.ajax({        
        type: "GET",
        url: url,
        success: function(data){         
            if(data){
                if(data.length > 0){
                    for (let index = 0; index < data.length; index++) {
                        const element = data[index];
                        var dia1 = $("#nm_dia1").val();
                        var dia2 = $("#nm_dia2").val();
                        var dia3 = $("#nm_dia3").val();
                        var dia4 = $("#nm_dia4").val();
                        var dia5 = $("#nm_dia5").val();
                        var dia6 = $("#nm_dia6").val();
                        var dia7 = $("#nm_dia7").val();
                        
                        for (let index = 1; index < 24; index++) {  
                            if(dia1 != ""){ 
                                horariosddl(index, element, 1, dia1);               
                            }   
                            if(dia2 != ""){ 
                                horariosddl(index, element, 2, dia2);               
                            }                            
                            if(dia3 != ""){ 
                                horariosddl(index, element, 3, dia3);               
                            }                            
                            if(dia4 != ""){ 
                                horariosddl(index, element, 4, dia4);               
                            }                            
                            if(dia5 != ""){ 
                                horariosddl(index, element, 5, dia5);               
                            }                            
                            if(dia6 != ""){ 
                                horariosddl(index, element, 6, dia6);               
                            }                            
                            if(dia7 != ""){ 
                                horariosddl(index, element, 7, dia7);               
                            }                                                     
                        }   
                        
                        
                    }
                }
            }                                
        }    
    });
}

function horariosddl(index, element, item, diasemana){
    var semana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado","Domingo"];
    var idsemana = semana.indexOf(diasemana);
    var idsemanade = semana.indexOf(element.diade);
    var idsemanaate = semana.indexOf(element.diaate);
    
    var idfimsemanade = semana.indexOf(element.diafimde);
    var idfimsemanaate = semana.indexOf(element.diafimate);
    var valor = index;
    if(index <= 9){
        valor = "0" + index;
    }
    $("#nm_horade" + item + " option[value='" + valor + "']").show();
    $("#nm_horaate" + item + "  option[value='" + valor + "']").show();

    if(idsemana >= idsemanade && idsemana <= idsemanaate ){
        if(index < parseInt(element.horade)){
            var valor = index;
            if(index <= 9){
                valor = "0" + index;
            }
            $("#nm_horade" + item + " option[value='" + valor + "']").hide();
            $("#nm_horaate" + item + "  option[value='" + valor + "']").hide();
        }
    
        if(index > parseInt(element.horaate)){
            var valor = index;
            if(index <= 9){
                valor = "0" + index;
            }
            $("#nm_horade" + item + "  option[value='" + valor + "']").hide();
            $("#nm_horaate" + item + "  option[value='" + valor + "']").hide();
        }
                           
        if(element.nm_dia == diasemana){ 
            if(index >= parseInt(element.nm_horade) && index < parseInt(element.nm_horaate)){
                var valor = index;
                if(index <= 9){
                    valor = "0" + index;
                }
                $("#nm_horade" + item + "  option[value='" + valor + "']").hide();
                $("#nm_horaate" + item + "  option[value='" + valor + "']").hide();
            }   
        }  
    }



    if(idsemana >= idfimsemanade && idsemana <= idfimsemanaate ){
        if(index < parseInt(element.horafimde)){
            var valor = index;
            if(index <= 9){
                valor = "0" + index;
            }
            $("#nm_horade" + item + " option[value='" + valor + "']").hide();
            $("#nm_horaate" + item + "  option[value='" + valor + "']").hide();
        }
    
        if(index > parseInt(element.horafimate)){
            var valor = index;
            if(index <= 9){
                valor = "0" + index;
            }
            $("#nm_horade" + item + "  option[value='" + valor + "']").hide();
            $("#nm_horaate" + item + "  option[value='" + valor + "']").hide();
        }
                        
        if(element.nm_dia == diasemana){ 
            if(index >= parseInt(element.nm_horade) && index < parseInt(element.nm_horaate)){
                var valor = index;
                if(index <= 9){
                    valor = "0" + index;
                }
                $("#nm_horade" + item + "  option[value='" + valor + "']").hide();
                $("#nm_horaate" + item + "  option[value='" + valor + "']").hide();
            }   
        }  
    }
   
           
}