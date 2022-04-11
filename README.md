# Proyecto Final - Ariel Rando 36620374
## Introduccion
Este es el proyecto final para la cursada de backend de Coderhouse, el mismo es una API Rest para entregar y modificar información de usuarios, productos, carritos y ordenes de compra. Solo se devuelve información en formato de json con la excepción de 3 vistas (información, chat y instrucciones de las APIs). 
El proyecto cuenta con 2 motores de bases de datos: MongoDB(para ambiente de desarrollo) y Firebase(para ambiente de producción) y envió de mails con nodemailer(para ethereal)


## Iniciando el proyecto de forma local
1) Descargar el proyecto y generar el archivo .env dentro de la raiz del mismo, el archivo tendra que contener los siguientes datos:

>/# credenciales para firestore
project_id = *****
private_key_id = *****
private_key = *****
client_email = *****
client_id = *****
client_x509_cert_url = *****

>/# url a mongoDB
mongodbUrl = *****

>/# datos para mails
mail_origin = *****
mail_pass = *****
mail_port = *****
mail_admin = *****
mail_mode = ethereal

2) Una vez generado dicho archivo debe ejecutar una consola desde la carpeta del proyecto y correr el comando " npm i " para instalar todas las dependencias necesarias para que el proyecto funcione

3) Si todo se completa bien deberá correr comando " node index.js " para iniciar el proyecto. El mismo por default se inicia en modo Desarrollo lo que involucra que funcionara con el motor de bases de datos MongoDB, recuerde que debe tener iniciada la base de datos del mismo para el correcto funcionamiento  del proyecto. La url del proyecto es http://localhost:8080/

4) Si lo desea, puede configurar algunos argumentos junto a al inicio del proyecto, dejamos un listado de los mismos
- **- -puerto** o **-p**: puede configurar el puerto en el que se inicia el proyecto, por default es 8080
- **- -modo** o **-m**: permite iniciar el proyecto en modo **FORK** o **CLUSTER** pasando como argumentos esas mismas palabras, por default es FORK
- **- -ambiente** o **-a**: ambiente del proyecto. Cambia el motor de base de datos a usar. Se debe pasar **dev** para el ambiente de desarrollo (usa MongoDB) o **prod** para el ambiente de producción (usa Firebase), por default es dev

5) Al iniciarse el proyecto buscara ciertas colecciones dentro de la base de datos, que de no existir ingresara datos de productos y usuarios, por lo que se recomienda **no tener colecciones seteadas en las bases de datos o al menos no las colecciones USERS y PRODUCTOS

## Uso de las APIs
Si el proyecto ya funciona correctamente podra ingresar a la siguiente URL desde un navegador para ver las instrucciones de usa de las distintas apis: http://localhost:8080/instrucciones_api . 
A continuación se deja una pequeña introducción de cada una de ellas:

- Usuarios (api/users): api para loguearse o registrar un usuario nuevo, tambien para ver los datos del usuario logueado y desloguearse
- Productos (api/productos): podrá ver todos los productos o los detalles de uno, crearlos, modificarlos y eliminarlos (ESTAS ULTIMAS 3 ACCIONES SOLO PUEDEN HACERCE UN EL USUARIO ADMIN)
- Carrito (api/carrito): desde aquí podrá generar un carrito de compra e ir agregándole productos o eliminar alguno en especifico, también podrá eliminar todo el carrito o finalizarlo para generar una orden de compra (TODAS ESTAS ACCIONES SOLO PUEDEN SER HECHAS CON UN USUARIO LOGUEADO)
- ordenes (api/ordenes): podrá ver todas las ordenes del usuario logueado o ver una en especifico

## Usuario admin
el proyecto cuenta con un usuario con permisos especiales: **el usuario admin**. El mismo posee un campo especial que le permite realizar modificaciones a los productos (el nombre del parámetro en el item es **admin** en true). Este usuario se genera de manera automática si no esta la colección users, pero si ya tiene dicha coleccion y no quiere borrarla debe generar el siguiente item a mano:
>{email:"admin@admin.com",password:"$2b$10$2Hwd.GFUgskhlmr4xH8Fqey.NtCNerdMf.hy2Etz1MvujUMcVrPKO",nombre:  "admin",apellido:  "admin",direccion:  "admin 123",edad:36,telefono:"222555666",telefonoInt:"54222555666",foto:"admin.jpg",fechaCreacion:  Date(),fechaUltimoLogin:  Date(), **admin:  true**}

Luego debe loguearse con el mismo en la URL api/users/login para poder modificar y crear productos.


## Vistas
Mas allá de que el proyecto solo sirve datos en formato JSON existen 3 vistas que pueden ser visualizadas desde un navegador web:

- http://localhost:8080/info: Podrá ver informacion del proyecto como plataforma, carpeta desde donde se ejecuta, argumentos de entrada, etc
- http://localhost:8080/instrucciones_api: Podrá ver todos los endpoints de las apis y que datos en formato JSON tiene que mandar en el body de la petición.
- http://localhost:8080/chat: Un pequeño chat que permite escribir mensajes. El mismo usa Websockets lo que permite abrir mas de una instancia del proyecto, enviar mensajes y visualizar todos los mensajes en tiempo real en todas las ventanas.

## Link a Heroku
https://proyecto-final-ariel-coder.herokuapp.com/info
