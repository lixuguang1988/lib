var express = require("express"),
	bodyParser = require("body-parser"),
	app = express(),
	tweets = [];


app.set("view engine", "ejs");

app.listen(8000);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get("/", function(req, res){
	//res.send("Welcome to Node Twitter");
	var title = "Chirpie",
		header = "Welcome to Chirpie";


	res.render("index", {
		"title" : title,
		"header" : header,
		"tweets" : tweets,
		"stylesheets" : ["/public/style.css"]
	})

});

app.post("/send", function(req, res){
	if(req.body &&  req.body.tweet){
		tweets.push(req.body.tweet);
		if(acceptsHtml(req.headers["accept"])){
			res.redirect(302, '/');
		}else{
			res.send({status : "ok", message : "Tweet received"});
		}
	}else{
		res.send({status : "nok", message : "No tweet received"});
	}
});


app.get("/tweets", function(req, res){
	res.send(tweets);
});


function acceptsHtml(header){
	var accepts = header.split(","),
		i = 0,
		length = accepts.length;
	for( ; i < length ; i++){
		if(accepts[i] === "text/html"){
			return true
		}
	}
	return false;
}


