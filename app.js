var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose");

// var campgrounds = [
//     {name:"Salmon Creek", image:"https://pixabay.com/get/57e8dc414e5ba814f6da8c7dda793f7f1636dfe2564c704c73287dd3934dc450_340.jpg"},
//     {name:"Granite Hill", image:"https://pixabay.com/get/57e4d64a4a54ad14f6da8c7dda793f7f1636dfe2564c704c73287dd3934dc450_340.jpg"},
//     {name:"Mountain Goat's Rest", image:"https://pixabay.com/get/5fe3dc46425ab108f5d084609620367d1c3ed9e04e50744f72297cd0974ccd_340.jpg"}
// ]



app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/campgrounds", {useNewUrlParser:true});

var campgroundSchema = new mongoose.Schema({
    name:String,
    image:String,
    description:String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//         name:"Salmon Creek",
//         image:"https://pixabay.com/get/57e6d7454e53ae14f6da8c7dda793f7f1636dfe2564c704c73287cd3924acd5a_340.jpg",
//         description: "The standard Lorem Ipsum passage, used since the 1500s Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
//     },
//     function(err, campground){
//         if(err){
//             console.log("Campground not added!");
//             console.log(err);
//         }else{
//             console.log("Campground added!");
//             console.log(campground);
//         }
//     }
// );

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