function savealuno(table){
    save(table, function(data){
        var id = $("#id").val();
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
                        html += "<tr>";
                        html += "<td>";
                        html += element.diasemana + " - " + element.dataformat;
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