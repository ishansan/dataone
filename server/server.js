var bodyParser = require("body-parser");
var express = require("express");
var loki = require("lokijs");
var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(__dirname+"/views"));

//setup in-Memory Database - LokiJS
var db = new loki("dataone.db");
var movies = db.addCollection("movies");
var actors = db.addCollection("actors");
var directors = db.addCollection("directors");
create_actors(); create_directors(); create_movies();

//routes
app.get("/",function(req,res,next)
{
	var movies_result = movies.find({});
	if(movies_result.length>0)
	{
		res.redirect("/1");
	}else
	{
		res.render("index.ejs",{data:[]});
	}
});
app.get("/:q",function(req,res,next)
{
	var q = req.params.q;
	var records_from = (q-1)*10;
	var movies_result = movies.chain().find({}).offset(records_from).limit(10).data();
	if(movies_result.length==0)
	{
		res.redirect("/");
	}else
	{
		var all_movies = [];
		for(var k=0;k<movies_result.length;k++)
		{
			all_movies.push(movies_result[k]);
		}
		res.render("index.ejs",{data:all_movies});
	}
});


//REST APIs
app.get("/ops/getmovies",function(req,res,next)
{
	var movies_result = movies.find({});
	res.json({data:movies_result});
});
app.get("/ops/getmoviesnumber",function(req,res,next)
{
	var movies_result = movies.find({});
	res.json({number:movies_result.length});
});
app.get("/ops/getdirectors",function(req,res,next){
	var directors_result = directors.find({});
	res.json({data:directors_result});
});
app.get("/ops/getactors",function(req,res,next){
	var actors_result = actors.find({});
	res.json({data:actors_result});
});
app.post("/ops/createmovie",function(req,res,next)
{
	if(!req.body.moviename || !req.body.releasedate || !req.body.actors || !req.body.director)
	{
		res.json({status:0,message:"Required field missing"});
	}else
	{
		movies.insert([{name:req.body.moviename,coverimage:req.body.coverimg,release_date:req.body.releasedate,genre:req.body.genre,actors:req.body.actors,director:req.body.director}]);
		res.json({status:1,message:"Created Successfully"});
	}
});
app.post("/ops/getmovieId",function(req,res,next)
{
	var thismovie = movies.find({$loki:parseInt(req.body.loki)});
	res.json({status:1,data:thismovie});
});
app.post("/ops/updatemovie",function(req,res,next)
{
	if(!req.body.moviename || !req.body.releasedate || !req.body.actors || !req.body.director)
	{
		res.json({status:0,message:"Required field missing"});
	}else
	{
		var get_record = movies.find({$loki:parseInt(req.body.$loki)});
		if(get_record.length>0)
		{
			get_record = get_record[0];
			get_record.name = req.body.moviename;
			get_record.coverimage = req.body.coverimg;
			get_record.release_date = req.body.releasedate;
			get_record.genre = req.body.genre;
			get_record.actors = req.body.actors;
			get_record.director = req.body.director;
			movies.update(get_record);
			res.json({status:1,message:"Updated Successfully"});
		}else
		{
			res.json({status:0,message:"No records found"});
		}
	}
});
app.post("/ops/deletemovie",function(req,res,next)
{
	var get_record = movies.find({$loki:req.body.loki});
	if(get_record.length>0)
	{
		movies.remove(get_record);
		res.json({status:1,message:"Deleted Successfully"});
	}else
	{
		res.json({status:0,message:"No records found"});
	}
});

//functions
function create_actors()
{
	actors.insert([{name:"russell crowe"},{name:"ian mckellen"},{name:"michael caine"},{name:"sean bean"},{name:"daniel craig"},{name:"daniel radcliffe"}]);
}
function create_directors()
{
	directors.insert([{name:"ridley scott"},{name:"john booman"},{name:"mike leigh"},{name:"martin scorsee"},{name:"steven spielberg"},{name:"christopher nolan"}]);
}
function create_movies()
{
	var actors = [{"name":"Interstellar","coverimage":"http://i.imgur.com/RlMFEpxr.png","release_date":"12 June 2013","genre":"adventure","actors":["ian mckellen"],"director":"ridley scott"},
				  {"name":"Batman - The Dark Night","coverimage":"http://5.darkroom.shortlist.com/980/29d767ab9c0e8c643ebd64031456fc1f:e39205608b1edbb97ce5fccd8a9a357a/thumbs-pascal-richon-16.jpg","release_date":"12 June 2013","genre":"adventure","actors":["ian mckellen"],"director":"ridley scott"},
				  {"name":"Star Wars","coverimage":"http://3.darkroom.shortlist.com/980/a5e990ee4dd50dbf29fa02dcad89300f:6c78703d01bb239348d1bb8e0f1f7633/thumbs-pascal-richon-01.jpg","release_date":"12 June 2013","genre":"adventure","actors":["ian mckellen"],"director":"ridley scott"},
				  {"name":"Inception","coverimage":"http://trentwalton.com/assets/uploads/2010/07/inception/inception_1440_900.jpg","release_date":"12 June 2013","genre":"adventure","actors":["ian mckellen"],"director":"ridley scott"},
				  {"name":"Black Swan","coverimage":"http://www.art-spire.com/wp-content/gallery/2011/juin_2011/15-06-11_pascal_richon/thumbs/thumbs_pascal_richon_03.jpg","release_date":"12 June 2013","genre":"adventure","actors":["ian mckellen"],"director":"ridley scott"},
				  {"name":"Jurassic Park","coverimage":"http://www.art-spire.com/wp-content/gallery/2011/juin_2011/15-06-11_pascal_richon/thumbs/thumbs_pascal_richon_07.png","release_date":"12 June 2013","genre":"adventure","actors":["ian mckellen"],"director":"ridley scott"},
				  {"name":"Taxi Driver","coverimage":"http://www.wallpaperup.com/uploads/wallpapers/2012/10/22/20432/big_thumb_22bbb325a803d1f424e5301908ddd01e.jpg","release_date":"12 June 2013","genre":"adventure","actors":["ian mckellen"],"director":"ridley scott"},
				  {"name":"Lost in Translation","coverimage":"http://6.darkroom.shortlist.com/980/30fdb166355019a7d5d2015313908899:03bc9e6ceea51250c91c7da80cdfe7d9/thumbs-pascal-richon-11.jpg","release_date":"12 June 2013","genre":"adventure","actors":["ian mckellen"],"director":"ridley scott"},
				  {"name":"The Social Network","coverimage":"http://4.darkroom.shortlist.com/980/adec527eeea8a5d20fe668280d64d2a0:8b401d9e59344ca1c614bdb2597963e4/thumbs-pascal-richon-05.png","release_date":"12 June 2013","genre":"adventure","actors":["ian mckellen"],"director":"ridley scott"},
				  {"name":"Reservoir Dogs","coverimage":"https://s-media-cache-ak0.pinimg.com/originals/8e/27/38/8e2738882b08d578618b7a9b43ff3148.jpg","release_date":"12 June 2013","genre":"adventure","actors":["ian mckellen"],"director":"ridley scott"},
				  {"name":"Hitman","coverimage":"http://wallpaper-gallery.net/images/minimalism-wallpaper/minimalism-wallpaper-7.jpg","release_date":"12 June 2013","genre":"adventure","actors":["ian mckellen"],"director":"ridley scott"}];

	movies.insert(actors);
}

app.listen(3000); //run
console.log("Server Up");