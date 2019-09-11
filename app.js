var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    seedDB     = require("./seed"),
    Campground = require("./models/campground");


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/campgrounds", {useNewUrlParser:true});

seedDB();

app.get("/", function(req,res){
    res.render("landing");
});

app.get("/campgrounds",function(req,res){
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds",{campgrounds:campgrounds});
        }
    })
});

app.get("/camgrounds/new", function(req,res){
    res.render("new");
});

app.get("/campgrounds/:id", function(req,res){
    id = req.params.id;
    Campground.findById(id, function(err, campground){
        res.render("display", {campground:campground});
    });
});

app.post("/camgrounds", function(req,res){
    var campground = {name:req.body.name, image:req.body.link, description:req.body.description};
    Campground.create(campground, function(err, campground){
        if(err){
            console.log(err);
        }else{
            console.log(campground);
            res.redirect("/campgrounds");
        }
    })
});

app.listen(2900, function(){
    console.log("Server is running! ");
});