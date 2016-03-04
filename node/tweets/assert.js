var http = require("http"),
	assert = require("assert"),
	opts = {
		host : "localhost",
		port : 8000,
		path : "/send",
		method : "POST",
		headers : {"content-type" : "application/x-www-form-urlencoded"}
	},
	req;

req = http.request(opts, function(res){
	res.setEncoding("utf8");

	var data = "";

	res.on("data", function(d){
		data += d;
	});

	res.on("end", function(data){
		console.log(data);
		//这个data不是输入的data
		//而是服务器返回的内容
		//不对，完全不对
		assert.strictEqual(data, '{"status":"ok","message":"Tweet received"}');
//		assert.strictEqual(1, 2);
	});

});

req.write("tweet=xxxx");
req.end();

















