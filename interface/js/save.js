function save(table){
    iziToast.question({
        timeout: 20000,
        close: false,
        overlay: true,
        displayMode: 'once',
        id: 'question',
        zindex: 999,
        title: '',
        message: 'Deseja gravar este registro?',
        position: 'center',
        buttons: [
            ['<button><b>SIM</b></button>', function (instance, toast) {
     
                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');                
                
                var url = "http://" + window.location.hostname + ":3003/api/" + table + "/gravar"
                var data = $("form").serialize();

                for (let index = 0; index < $("[name][type='checkbox']").length; index++) {
                    const element = $("[name][type='checkbox']")[index];
                    if(!$(element).is(":checked")){
                        var name = $(element).attr("name");
                        data += "&" + name + "=false"
                    }                    
                }

                
                $.ajax({        
                    type: "POST",
                    url: url,
                    data: data,
                    success: function(data){
                        if(data){
                                if(data.lastID || data.lastID == 0){
                                    $("#id").val(data.lastID);
                                    iziToast.success({
                                        title: '',
                                        message: 'Registro salvo com sucesso!',
                                    });
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
}

function ondelete(table){
    var id = $("#id").val();
    if(!id){
        
        iziToast.warning({
            title: '',
            message: 'Edite um registro antes de deletar!',
        });
        return;
    }

    iziToast.question({
        timeout: 20000,
        close: false,
        overlay: true,
        displayMode: 'once',
        id: 'question',
        zindex: 999,
        title: '',
        message: 'Deseja deletar este registro?',
        position: 'center',
        buttons: [
            ['<button><b>SIM</b></button>', function (instance, toast) {
     
                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');                
                
                var url = "http://" + window.location.hostname + ":3003/api/" + table + "/delete/" + id
                 
                $.ajax({        
                    type: "GET",
                    url: url,
                    success: function(data){
                        if(data){
                            if(data.command){
                                if(data.command == "DELETE"){
                                    novo()
                                    iziToast.success({
                                        title: '',
                                        message: 'Registro deletado com sucesso!',
                                    });
                                }
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
}

function novo(){
    var data = $("form input");
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if($(element).attr("type") == "checkbox"){
            $(element).attr("checked", false)
            $(element).prop("checked", false)
            $(element).val(false);
            $(element).removeProp("checked")
        }else{
            $(element).val("");
        }      
    }
    imagensPadrao()
    $("textarea").val("");
    $("select").val("");
}



function voltar(){
    window.location.assign("http://" + window.location.host)
}

function checkchange(element){
    $(element).val($(element).is(":checked"))

    if($(element).is(":checked")){
        $(element).prop("checked", true)
    }else{
        $(element).prop("checked", false)
    }
    
}
