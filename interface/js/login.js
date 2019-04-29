
function logar(tipo){
    var login = "";
    var senha = "";

    if(tipo == "admin"){
        login = $("#login").val();
        senha = $("#senha").val();

        if(!login && !senha){
            iziToast.error({
                title: '',
                message: 'Digite um login e senha validos!',
            });
            return;
        }
    }else{
        login = $("#loginaluno").val();
        login = login.replace(".","").replace(".","").replace(".","").replace("-","")
        senha = "-";
    }
   
    var url = "http://" + window.location.hostname + ":3003/api/administrador/login/" + login + "/" + senha + "/" + tipo
                 
    $.ajax({        
        type: "GET",
        url: url,
        success: function(data){
            if(data){
                if(data.length > 0){
                    if(data[0]){
                        localStorage.setItem("username", data[0].nm_nome);
                        localStorage.setItem("userid", data[0].id);

                        localStorage.setItem("tipo", data[0].nm_tipousuario);
                        localStorage.setItem("foto", data[0].img_foto);

                        if(data[0].idestudio){
                            localStorage.setItem("idestudio", data[0].idestudio);
                        }else{
                            localStorage.setItem("idestudio", "");
                        }
                        

                        if(tipo == "admin"){
                            window.location.href = "http://" + window.location.host + "/pages/index.html";
                        }else{
                            window.location.href = "http://" + window.location.host + "/pages/aulas.html";
                        }
                    }else{
                        iziToast.error({
                            title: '',
                            message: 'Informações de login não localizado!',
                        }); 
                    }  
                }else{
                    iziToast.error({
                        title: '',
                        message: 'Informações de login não localizado!',
                    }); 
                }
            }                        
        }    
    });
}


function verificarAmbiente(tipo){
    if(tipo == "Admin"){
        $("#frmaluno").hide();
        $("#frmadmin").show();
    }else{
        $("#frmaluno").show();
        $("#frmadmin").hide();
    }
}