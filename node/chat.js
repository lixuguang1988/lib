var net = require("net"),
	chatServer = net.createServer(),
	clientList = [];

chatServer.on("connection", function(client){
	client.write("Hi\n");
//	client.write("bye\n");
//	client.end();
	client.name = client.remoteAddress + ":" + client.remotePort;
	client.write("Hi " + client.name + "\n");

	clientList.push(client);

	client.on("data", function(data){
		broatcast(data, client);
	});

	client.on("end", function(){
		console.log(client.name + " quit");
		clientList.splice(clientList.indexOf(client), 1);
	});

	client.on("error", function(e){
		console.log(e);
	});

});

function broatcast(message, client){
	var i = 0,
		len = clientList.length,
		cleanup = [];

	for( ; i < len ; i++){
		if(client !== clientList[i]){
			if(clientList[i].writable){
				clientList[i].write(client.name + ": " + message + "\n");
			}else{
				cleanup.push(clientList[i]);
				clientList[i].destory()
			}

		}
	}
	len = cleanup.length;
	for(i = 0; i < len; i++){
		clientList.splice(clientList.indexOf(cleanup[i]), 1);
	}
}

chatServer.listen("9000");
