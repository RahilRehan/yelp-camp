var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");

router.get("/", function(req,res){
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/campgrounds",{campgrounds:campgrounds});
        }
    })
});

router.get("/new", isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});

router.get("/:id", function(req,res){
    id = req.params.id;
    Campground.findById(id).populate("comments").exec(function(err, campground){
        res.render("campgrounds/display", {campground:campground});
    });
});

router.post("/", isLoggedIn, function(req,res){
    var author = {
        id:req.user._id,
        username:req.user.username
    };
    var campground = {name:req.body.name, image:req.body.link, description:req.body.description, author:author};
    Campground.create(campground, function(err, campground){
        if(err){
            console.log(err);
        }else{
            console.log(campground);
            res.redirect("/campgrounds");
        }
    })
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect("/login");
    }
}

module.exports = router;