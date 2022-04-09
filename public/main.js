const socket = io();
const desnormalize = normalizr.denormalize;
const schemaNormalizr = normalizr.schema;

socket.on('mensajeNuevo', data =>{
    let objDiv = document.getElementById("chat-history");
    let oldScrolltop = objDiv.scrollHeight-objDiv.offsetHeight;
    data = JSON.parse(data);
    document.getElementById('cajaChat').innerHTML = document.getElementById('cajaChat').innerHTML+ `<li>
    <div class="message-data">
    <span class="message-data-name"><i class="fa fa-circle online"></i> ${data.autor.mail}</span>
    <span class="message-data-time">${data.fecha}</span>
    </div>
    <div class="message my-message">
    ${data.mensaje}
    </div>
    </li>` ;
    if(oldScrolltop<objDiv.scrollTop){
        objDiv.scrollTop = objDiv.scrollHeight;
    }
})

socket.on('mensajesAnteriores', data =>{
    const schemaAutor = new schemaNormalizr.Entity('autor',{},{idAttribute:'mail'});
    const schemaMensaje = new schemaNormalizr.Entity('mensaje',{autor: schemaAutor});
    const schemaMensajes = new schemaNormalizr.Entity('mensajes',{mensajes: [schemaMensaje]});

    const denormalizedData = desnormalize(data.result, schemaMensajes, data.entities);

    let longitudNormalizado = JSON.stringify(data).length;
    let longitudDesnormalizado = JSON.stringify(denormalizedData).length;
    document.getElementById('compresion_chat').innerHTML = parseInt((longitudNormalizado/longitudDesnormalizado)*100);
    let objDiv = document.getElementById("chat-history");
    let oldScrolltop = objDiv.scrollHeight-objDiv.offsetHeight;
    for (let value of denormalizedData.mensajes) {
        let hora = moment(value.fecha).format('DD/MM/YYYY HH:mm:ss');
        document.getElementById('cajaChat').innerHTML = document.getElementById('cajaChat').innerHTML+ `<li>
        <div class="message-data">
        <span class="message-data-name"><i class="fa fa-circle online"></i> ${value.autor.mail}</span>
        <span class="message-data-time">${hora}</span>
        </div>
        <div class="message my-message">
        ${value.mensaje}
        </div>
        </li>` ;
        if(oldScrolltop<objDiv.scrollTop){
            objDiv.scrollTop = objDiv.scrollHeight;
        }
      }
})

socket.on('errorGrabarProducto', data =>{
    alert('ocurrio un error al tratar de guardar el producto, vuelva a intentarlo')
})

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const enviar = () => {
    if(validateEmail(document.getElementById('mailMsj').value)){
        if(document.getElementById('mensaje').value && !/^\s*$/.test(document.getElementById('mensaje').value)){
            socket.emit('grabarMensaje', 
                `{ 
                    "autor":{
                        "mail":"${document.getElementById('mailMsj').value}",
                        "nombre": "${document.getElementById('nombreMsj').value}", 
                        "apellido": "${document.getElementById('apellidoMsj').value}", 
                        "edad": "${document.getElementById('edadMsj').value}", 
                        "alias": "${document.getElementById('aliasMsj').value}",
                        "avatar": "${document.getElementById('avatarMsj').value}"
                    },
                    "mensaje":"${document.getElementById('mensaje').value.replace(/(\r\n|\n|\r)/gm, "")}"
                }`
            );
            document.getElementById('mensaje').value='';
        }else{
            alert('No puede enviar un mensaje vacio.')
        }
    }else{
        alert('Ingrese un email valido.')
    }
}






window.onload = function() {
   


    const cajaChat = document.getElementById('chat-history');
    if(cajaChat){
        socket.emit('recuperarMensajes');
    }

  };
