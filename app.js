var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var campgrounds = [
    {name:"Salmon Creek", image:"https://pixabay.com/get/57e8dc414e5ba814f6da8c7dda793f7f1636dfe2564c704c73287dd3934dc450_340.jpg"},
    {name:"Granite Hill", image:"https://pixabay.com/get/57e4d64a4a54ad14f6da8c7dda793f7f1636dfe2564c704c73287dd3934dc450_340.jpg"},
    {name:"Mountain Goat's Rest", image:"https://pixabay.com/get/5fe3dc46425ab108f5d084609620367d1c3ed9e04e50744f72297cd0974ccd_340.jpg"}
]

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.get("/", function(req,res){
    res.render("landing");
});

app.get("/campgrounds",function(req,res){
    res.render("campgrounds",{campgrounds:campgrounds});
});

app.get("/camgrounds/new", function(req,res){
    res.render("new");
});

app.post("/camgrounds", function(req,res){
    var campground = {name:req.body.name, image:req.body.link};
    campgrounds.push(campground);
    res.redirect("/campgrounds");
});

app.listen(2900, function(){
    console.log("Server is running! ");
});