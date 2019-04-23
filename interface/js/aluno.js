function savealuno(table){
    save(table, function(data){
        var id = $("#id").val();
        var url = "http://" + window.location.hostname + ":3003/api/alunos/pregeraraulasaluno/" + id

        $.ajax({        
            type: "GET",
            url: url,
            success: function(data){
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