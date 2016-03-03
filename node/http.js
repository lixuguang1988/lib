var http = require("http");

http.createServer(function(req, res){
	console.log(req);
	console.log(res);
	res.writeHead(200, {'content-type' : "text/plain"});
	res.end("Hello World\n");
}).listen(8124, "127.0.0.1");

console.log("server running at http://127.0.0.1:8124/")