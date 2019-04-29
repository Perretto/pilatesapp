document.addEventListener('DOMContentLoaded', function () {
    var options = "";
    var url = "http://" + window.location.hostname + ":3003/api/estudios/carregarestudios"
    $.ajax({
      url: url,
      context: document.body
    }).done(function (data) {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        options += "<option value='" + element.id + "'>" + element.nm_nome + "</option>"
      }
      $("#nm_estudio").html(options);
      $(".estudio").html(options);
  
      if(localStorage.getItem("idestudio")){
        $('#nm_estudio').val(localStorage.getItem("idestudio"));
      }else{
        $('#nm_estudio option:eq(0)').prop('selected', true);
      }
      
  
      var calendarEl = document.getElementById('calendar');
          var calendar = new FullCalendar.Calendar(calendarEl, {
            locale: 'pt',
            plugins: ['dayGrid'],
            defaultView: 'dayGridMonth',
            events: function(fetchInfo, successCallback, failureCallback) {
              var id = localStorage.getItem("userid");
              var startStr = fetchInfo.startStr;
              var endStr = fetchInfo.endStr;
              var url = "http://" + window.location.hostname + ":3003/api/aulas/horariosdisponiveisdatasaluno/" + id + "/" + startStr + "/" + endStr
                
              $.ajax({
                url: url,
                dataType: 'json',
                success: function(doc) {
                  $(".fc-day.fc-widget-content").attr("onclick", "horariosaulas(this)")  
                  $(".fc-time").html(""); 
                  successCallback(doc);
                }
              });
              
            }
          });
      
          calendar.render();  
          $(".fc-day.fc-widget-content").attr("onclick", "horariosaulas(this)")  
          $(".fc-time").html(""); 
             
      
  
    });
  
  
  
      
    });
  
  
    function horariosaulas(element) {
      $("#aulaslista").show();
      $("#editaraula").hide();
      $("#listahorarios").show();
      var data = $(element).attr("data-date");
      var estudio = $("#nm_estudio").val();
      var id = localStorage.getItem("userid");
  
      //Swal.fire(data)
      var htmllista = "";
  
      var url = "http://" + window.location.hostname + ":3003/api/aulas/listaaulasaluno/" + data + "/" + estudio + "/" + id
      $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        async: false,
        crossDomain: true,
      }).success(function (data) {
        $("#listahorarios").html("");
        var estudio = $("#nm_estudio").val();
  
        if (data) {
          if (data.length) {
            var htm = "";
            htm += "<section class=\"task-panel tasks-widget\">";
            htm += "  <div class=\"panel-heading\">";
            htm += "  <div class=\"pull-left\">";
            htm += "    <h4 style=\"display: inline;\"><i id=\"dataselecionada\" data-dataselecionada=\"" + data[0].data +  "\" class=\"fa fa-tasks\"></i>  - " + data[0].data + "</h4><h3 style=\"display: inline;font-weight: bold;\"> - Horários</h3>";
            htm += "    </div>";
            htm += "    <br>";
            htm += "    </div>";
            htm += "    <div class=\"panel-body\">";
            htm += "    <div id=\"aulaslista\" class=\"task-content\">";
            htm += "      <ul class=\"task-list\">";
  
            var horadefunc = data[0].horadefunc;
            var horaatefunc = data[0].horaatefunc;
  
            var inthoradefunc = parseInt(horadefunc);
            var inthoraatefunc = parseInt(horaatefunc);
            var list = [];
  
            for (let index = 0; index < 24; index++) {
              if (index >= inthoradefunc && index <= inthoraatefunc) {
                if (data.length > 0) {
                  var disponivel = true;
  
                  for (let j = 0; j < data.length; j++) {
                    const element = data[j];
                    var intloophorade = parseInt(element.horade);
  
                    if (intloophorade == index) {
                      if (disponivel) {
                        var quantidadealunos = 0;
                        var htmlAlunos = "";
  
                        for (let k = 0; k < data.length; k++) {
                          const elementAluno = data[k];
                          var intloophoradeAluno = parseInt(elementAluno.horade);
                          if (intloophoradeAluno == index) {
                            if (!elementAluno.obs) {
                              elementAluno.obs = "";
                            }
                            htmlAlunos += "<a href='#' onclick=\"deleteaulas('" + elementAluno.id + "')\">";
                            htmlAlunos += "<div style=\"padding-top: 10px;\">";
                            htmlAlunos += " <h4 style=\"display: inline;font-weight: bold;padding-top:10px\"><i class=\"fa fa-external-link\"></i></h4><h4 style=\"display: inline;font-weight: bold;font-weight: bold;\"> - Estúdio: </h4><h4 style=\"display: inline;\">" + elementAluno.estudio + "</h4>";
                            
                            if(elementAluno.obs){
                                htmlAlunos += "<h4 style=\"display: inline;font-weight: bold;\"> - Obs: </h4><h4 style=\"display: inline;\">" + elementAluno.obs + "</h4>";
                            }

                            htmlAlunos += "<\div>";
                            htmlAlunos += "<\a>";
  
                            quantidadealunos += 1;
                          }
                        }
  
                        htm += "<li class='liid_" + index + "'>";
  
                        htm += "<a href=\"#\" onclick=\"opendiv('divid_" + index + "')\">";
                        htm += "  <i style=\"display: inline;font-size: large;\" class=\"fa fa-arrow-circle-down\"></i>";
                        htm += "  <div  style=\"font-size: 20x;display: inline;\" class=\"task-title\">";
                        htm += "    <span style=\"font-size: 20x;padding-left: 10px;\" class=\"task-title-sp\"> " + element.horade + " - " + element.horaate + "</span>";
                        htm += "    <span style=\"font-size: 20x;\" class=\"task-title-sp\"> - Ocupado (" + quantidadealunos + ")</span>";
  
                        htm += "    <div style='display:none' class=\"pull-right hidden-phone\">";
                        htm += "      <a href=\"#\" onclick=\"novaaula('" + element.horade + "','" + element.horaate + "','" + estudio + "')\" class=\"btn btn-success btn-xs\"><i class=\" fa fa-check\"></i></a>";
                        htm += "      <a href=\"#\" onclick=\"deleteaulas('" + element.horade + "','" + element.horaate + "','" + estudio + "')\" class=\"btn btn-danger btn-xs\"><i class=\"fa fa-trash-o \"></i></a>";
                        htm += "    </div>";
                        htm += "  </div>";
                        htm += "</a>";
  
                        htm += "  <div style='display:none;padding: 10px;' id='divid_" + index + "'>";
  
                        htm += htmlAlunos
                        htm += "  </div>";
                        htm += "</li>";
  
  
                        disponivel = false;
                        list.push(index);
                      }
                    } else {
                      if (list.indexOf(index) == -1) {
                        htm += "<a href=\"#\"> ";
                        htm += "<li onclick=\"novaaula('" + index + "','" + (index + 1) + "','" + estudio + "')\"  class='liid_" + index + " disponivel'>";
                        htm += "  <i style=\"display: inline;font-size: large;\" class=\"fa fa-arrow-circle-right\"></i>";
                        htm += "  <div style=\"display: inline;\" class=\"task-title\">";
                        htm += "    <span style=\"font-size: 20x;padding-left: 10px;\" class=\"task-title-sp\">" + index + " - " + (index + 1) + "</span>";
                        htm += "    <span style=\"font-size: 20x;\" class=\"task-title-sp\"> - Disponível</span>";
  
                        htm += "    <div style='display:none' class=\"pull-right hidden-phone\">";
                        htm += "      <a href=\"#\" onclick=\"novaaula('" + index + "','" + (index + 1) + "','" + estudio + "')\" class=\"btn btn-success btn-xs\"><i class=\" fa fa-check\"></i></a>";
                        htm += "    </div>";
                        htm += "  </div>";
                        htm += "</li>";
                        htm += "</a>";
                        list.push(index);
                      }
  
                    }
                  }
                } else {
                  if (list.indexOf(index) == -1) {
                    htm += "<li class='liid_" + index + " disponivel'>";
                    htm += "  <i style=\"display: inline;font-size: large;\" class=\"fa fa-arrow-circle-right\"></i>";
                    htm += "  <div style=\"display: inline;\" class=\"task-title\">";
                    htm += "    <span style=\"font-size: 20x;padding-left: 10px;\" class=\"task-title-sp\">" + index + " - " + (index + 1) + "</span>";
                    htm += "    <span style=\"font-size: 20x;\" class=\"task-title-sp\"> - Disponível</span>";
  
                    htm += "    <div style='display:none' class=\"pull-right hidden-phone\">";
                    htm += "      <a href=\"#\" onclick=\"novaaula('" + index + "','" + (index + 1) + "','" + estudio + "')\" class=\"btn btn-success btn-xs\"><i class=\" fa fa-check\"></i></a>";
                    htm += "    </div>";
                    htm += "  </div>";
                    htm += "</li>";
                    list.push(index);
                  }
                }
              }
            }
  
            htm += "      </ul>";
            htm += "  </div>";
            htm += "  </div>";
            htm += "</section>";
            $("#listahorarios").append(htm);
            $(".task-title-sp").attr("style", "font-size:20px");
  
            for (let index = 0; index < 24; index++) {
              if ($(".liid_" + index).length > 1) {
                $(".liid_" + index + ".disponivel").remove();
              }
            }
          }
        }
  
        var btnvoltar = "<button id=\"btnvoltar\"  onclick=\"voltar()\"  type=\"button\" class=\"btn btn-warning\">";
        btnvoltar += "    <i class=\"fa fa-long-arrow-left\"></i>";
        btnvoltar += "</button>";
        $("#listahorarios").append(btnvoltar);
      });
  
      $("#calendar").hide();
      $("#listahorarios").show();
      $("#nm_estudio").hide();
      $("#div_estudio").hide();
    }
  
    function voltar() {
     document.location.reload();
    }
  
    function voltarhorarios(){
      $("#aulaslista").show();
      $("#editaraula").hide();
      $("#listahorarios").show();
  
    }
  
    function opendiv(id) {
      $("#" + id).toggle();
    }
  
    function editarAula(id) {
      $("#aulaslista").hide();
      $("#editaraula").show();
      $("#listahorarios").hide();
  
      var url = "http://" + window.location.hostname + ":3003/api/aulas/editaraula/" + id
      $.ajax({
        url: url,
        context: document.body
      }).done(function (data) {   
          if(data){
              if(data.length > 0){            
                  $("[name='id']").val(data[0].id);       
                  $("[name='nm_obs']").html(data[0].nm_obs);    
                  $("[name='nm_alunos']").val(data[0].nm_alunos);
                  $("[name='nm_estudios']").val(data[0].nm_estudios);
                  $("[name='nm_horade']").val(data[0].nm_horade);
                  $("[name='nm_horaate']").val(data[0].nm_horaate);
                  $("[name='dt_data']").val(data[0].dt_data);
                  $("[id='nm_alunos']").val(data[0].nomealuno);
              }
          }
  
      });
      
    }
  
    function novaaula(horade, horaate, estudio) {
        var dataatual = new Date();
        var strdata = $("#dataselecionada").attr("data-dataselecionada");
        var arrdata = strdata.split("/");
        var dataselect = new Date(arrdata[1] + "/" +  arrdata[0] + "/" + arrdata[2] + " " + (horade - 2) + ":00")

        console.log(dataselect);
        console.log(dataatual);
        if(dataselect >= dataatual){

            iziToast.question({
                timeout: 20000,
                close: false,
                overlay: true,
                displayMode: 'once',
                id: 'question',
                zindex: 999,
                title: '',
                message: 'Deseja marcar esta aula?',
                position: 'center',
                buttons: [
                    ['<button><b>SIM</b></button>', function (instance, toast) {
            
                        instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');                
                        
                        var url = "http://" + window.location.hostname + ":3003/api/aulas/gravar"
                        var data = {};
                        data.id = "";
                        data.dt_data = $("#dataselecionada").attr("data-dataselecionada");
                        data.nm_obs = "";
                        data.nm_alunos = localStorage.getItem("userid");
                        data.nm_estudio = estudio;
                        data.nm_horade = horade;
                        data.nm_horaate = horaate;

                        $.ajax({        
                            type: "POST",
                            url: url,
                            data: data,
                            success: function(data){
                                if(data){
                                    if(data.lastID || data.lastID == 0){
                                        iziToast.success({
                                            title: '',
                                            message: 'Registro salvo com sucesso!',
                                        });
                                        voltar();
                                    }                                
                                }                        
                            }
                        
                        });
                    }, true],
                    ['<button>NÃO</button>', function (instance, toast) {
            
                        instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
            
                    }],
                ],
                onClosing: function(instance, toast, closedBy){
                    console.info('Closing | closedBy: ' + closedBy);
                },
                onClosed: function(instance, toast, closedBy){
                    console.info('Closed | closedBy: ' + closedBy);
                }
            });
    
        }else{
            iziToast.warning({
                title: '',
                message: 'Não é possível marcar a aula nesta data e horário!',
            });
        }
    }
  
  
    $( function() {
      $( "#nm_alunos" ).autocomplete({
        source: function( request, response ) {
          var url = "http://" + window.location.hostname + ":3003/api/aulas/autocompletealunos/" + request.term
          $.ajax({
            url: url,
            context: document.body
          }).done(function (data) {   
            response($.map(data, function (item) {
                return {
                    label: item.text,
                    id: item.value
                }
            }));
          });
          
        },
        select: function( event, ui ) {
          if(ui.item.id == "-"){
            $("#nm_nome").val($("#nm_alunos").val())
            $("#modalcliente").modal('show');
          }else{
            $("[name='nm_alunos']").val(ui.item.id);
          }
          
        }
      });
    } );
  
  
    function deleteaulas(id){
          
      iziToast.question({
        timeout: 20000,
        close: false,
        overlay: true,
        displayMode: 'once',
        id: 'question',
        zindex: 999,
        title: '',
        message: 'Deseja desmarcar esta aula?',
        position: 'center',
        buttons: [
          ['<button><b>SIM</b></button>', function (instance, toast) {
    
            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');    
  
  
            var dataselec = $("#dataselecionada").attr("data-dataselecionada");
            dataselec = dataselec.replace("/","-");
            dataselec = dataselec.replace("/","-");
            dataselec = dataselec.replace("/","-");
  
            var url = "http://" + window.location.hostname + ":3003/api/aulas/delete/" + id
            $.ajax({
              url: url,
              context: document.body
            }).done(function (data) {   
              iziToast.success({
                  title: '',
                  message: 'Registro deletado com sucesso!',
              });
              voltar();
            });
  
          }, true],
          ['<button>NÃO</button>', function (instance, toast) {
  
              instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
  
          }],
        ],
        onClosing: function(instance, toast, closedBy){
          console.info('Closing | closedBy: ' + closedBy);
        },
        onClosed: function(instance, toast, closedBy){
          console.info('Closed | closedBy: ' + closedBy);
        }
      });
  
    }
  
  
    function saveCalendario(table){
      var id = $("[name='nm_alunos']").val();
      
      if(id){
        saveid(table, "formcalendario");
      }else{
        iziToast.warning({
            title: '',
            message: 'Selecione um aluno antes de salvar!',
        });
      }    
  
    }
  
    function changeestudio(){
      $("#calendar").html("");
      var estudio = $("#nm_estudio").val();
      var url = "http://" + window.location.hostname + ":3003/api/aulas/horariosdisponiveis/" + estudio
  
      $.ajax({
        url: url,
        dataType: 'json',
        success: function(doc) {
          var calendarEl = document.getElementById('calendar');
          var calendar = new FullCalendar.Calendar(calendarEl, {
            locale: 'pt',
            plugins: ['dayGrid'],
            defaultView: 'dayGridMonth',
            events: function(fetchInfo, successCallback, failureCallback) {
              var estudio = $("#nm_estudio").val();
              var startStr = fetchInfo.startStr;
              var endStr = fetchInfo.endStr;
              var url = "http://" + window.location.hostname + ":3003/api/aulas/horariosdisponiveisdatas/" + estudio + "/" + startStr + "/" + endStr
  
              $.ajax({
                url: url,
                dataType: 'json',
                success: function(doc) {
                  $(".fc-day.fc-widget-content").attr("onclick", "horariosaulas(this)")  
                  $(".fc-time").html(""); 
                  successCallback(doc);
                }
              });
              
            }
          });
      
          calendar.render();  
          $(".fc-day.fc-widget-content").attr("onclick", "horariosaulas(this)")  
          $(".fc-time").html("");  
        }
      });
    }
  
    
  function novoaula(){
    var data = $("#formcalendario input");
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
  
        if($(element).attr("readonly") != "readonly"){
          if($(element).attr("type") == "checkbox"){
              $(element).attr("checked", false)
              $(element).prop("checked", false)
              $(element).val(false);
              $(element).removeProp("checked")
          }else{
              $(element).val("");
          }  
        }
            
    }
    imagensPadrao()
    $("textarea").val("");
  }






  
function imagensPadrao(){
    
    
}