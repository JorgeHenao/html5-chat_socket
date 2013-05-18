//require - > carga el modulo http de node.js para crear los servidores
var express = require('express'), http = require('http'), path = require('path');
//se ejecutar la funcion express
var app = express();

app.configure(function() {
	app.set('port', process.env.PORT || 8124);
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/', function(req, res) {
        //muestra el mensaje en http://localhost:8124/
	res.send('hello');
});

//var port  = process.env.PORT || 5000;
//var server = app.listen(port);

app.configure('development', function() {
	app.use(express.errorHandler());
});

//server-> variable del servidor
//se crea el servidor en el modulo http de express
//se pone a escuchar la app en el puerto
var server = http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
});

//se crea la variable io que contendra el modulo socket.io 
//diciendole que escuche por el servidor
var io = require('socket.io').listen(server);
io.configure(function() {
	//io.set("transports", ["xhr-polling"]);
	//io.set("polling duration", 1);
});

//Eventos que hace referencia a las socket
//socket -> clientes
//connection, ejecuta una funciaon cuando una 
//socket se conecte al servidor
io.sockets.on('connection', function(socket) {
        //Programacion relacionada con una socket se incluye el la funcion de la 
        //conexion

        //Se indica al servidor que procese una petición recibida
        //socket -> variable de referencia enviada como parametro
        //addme ejecata la funcion recibiendo con el parametro (username)"
	socket.on('addme', function(username) {
                //se obtiene el nombre del usuario del cuadro de dialogo
		socket.username = username;
                //se envia el mensaje a la funcion chat con dos parametros
		socket.emit('chat', 'SERVER', 'You have connected');
                //se envia un mensaje que se ha conectado un usuario
                //a todos los usuarios conectados al servidor, omitiendo el 
                //usuario que lo envio
		socket.broadcast.emit('chat', 'SERVER', username + ' is on deck');
	});

	socket.on('sendchat', function(data) {
		io.sockets.emit('chat', socket.username, data);
	});

	socket.on('disconnect', function() {
		io.sockets.emit('chat', 'SERVER', socket.username + ' has left the building');
	});

});

