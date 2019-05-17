function intervalo(){
    var id = $("#id").val();
    if(!id){
        iziToast.warning({
            title: '',
            message: 'Selecione um estudio antes de colocar o intervalo!',
        });
    }else{
        $("#nm_estudio").val(id);

        var url = "http://" + window.location.hostname + ":3003/api/intervalo/listarintervalos/" + id
        
        $.ajax({        
            type: "GET",
            url: url,
            success: function(data){

                var html = "";
                html += "<table class=\"table\" style=\"width: 100%;\">";
                html += "<tr>";
                html += "<th>Ações</th>";
                html += "<th>Data</th>";
                html += "<th>Horário de</th>";
                html += "<th>Horário ate</th>";
                html += "</tr>";
                for (let index = 0; index < data.length; index++) {
                    const element = data[index];
                    html += "<tr>";
                    html += "<td>";

                    html += "<button  onclick=\"ondeletegrid('intervalo','" + element.id  + "',function(){ $('#modal').modal('hide'); } )\"  type=\"button\" class=\"btn btn-danger\">";
                    html += "    <i class=\"fa fa-trash\"></i>";
                    html += "</button>";

                     
                    html += "</td>";
                    html += "<td>";
                    html += element.nm_dia ;
                    html += "</td>";
                    html += "<td>";
                    html += element.nm_horade;
                    html += "</td>";
                    html += "<td>";
                    html += element.nm_horaate;
                    html += "</td>";
                    html += "</tr>";
                    
                }
                html += "</table>";

                $("#conteudomodal").html(html);
                $("#modal").modal('show');

            }
        
        });



        
    }
}






function capacidadeMaxima(){
    var id = $("#id").val();
    if(!id){
        iziToast.warning({
            title: '',
            message: 'Selecione um estudio antes de colocar a capacidade máxima!',
        });
    }else{
        $("#nm_estudios").val(id);

        var url = "http://" + window.location.hostname + ":3003/api/capacidade_estudios/listarcapacidade/" + id
        
        $.ajax({        
            type: "GET",
            url: url,
            success: function(data){

                var html = "";
                html += "<table class=\"table\" style=\"width: 100%;\">";
                html += "<tr>";
                html += "<th>Ações</th>";
                html += "<th>Data</th>";
                html += "<th>Horário de</th>";
                html += "<th>Horário ate</th>";
                html += "<th>Capacidade</th>";
                html += "</tr>";
                for (let index = 0; index < data.length; index++) {
                    const element = data[index];
                    html += "<tr>";
                    html += "<td>";

                    html += "<button  onclick=\"ondeletegrid('capacidade_estudios','" + element.id  + "',function(){ $('#modal').modal('hide'); } )\"  type=\"button\" class=\"btn btn-danger\">";
                    html += "    <i class=\"fa fa-trash\"></i>";
                    html += "</button>";
                     
                    html += "</td>";
                    html += "<td>";
                    html += element.nm_dia ;
                    html += "</td>";
                    html += "<td>";
                    html += element.nm_horade;
                    html += "</td>";
                    html += "<td>";
                    html += element.nm_horaate;
                    html += "</td>";
                    html += "<td>";
                    html += element.nr_maxima;
                    html += "</td>";
                    html += "</tr>";
                    
                }
                html += "</table>";

                $("#conteudomodalcapacidade").html(html);
                $("#modalcapacidade").modal('show');

            }
        
        });



        
    }
}