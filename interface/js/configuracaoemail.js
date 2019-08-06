function envioteste(){
    var tipo = $("#id_tipo").val();
    var emailto = $("#emailto").val();
    var url = "http://" + window.location.hostname + ":3003/api/email/enviar/" + tipo + "/" + emailto;
    
    $.ajax({        
        type: "GET",
        url: url,
        success: function(data){         
           
            iziToast.success({
                title: '',
                message: 'Email enviado com sucesso!',
            });
                                
        }
    
    });
}