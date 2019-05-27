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