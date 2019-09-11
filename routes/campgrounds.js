var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

router.get("/campgrounds",function(req,res){
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/campgrounds",{campgrounds:campgrounds});
        }
    })
});

router.get("/camgrounds/new", function(req,res){
    res.render("campgrounds/new");
});

router.get("/campgrounds/:id", function(req,res){
    id = req.params.id;
    Campground.findById(id).populate("comments").exec(function(err, campground){
        res.render("campgrounds/display", {campground:campground});
    });
});

router.post("/camgrounds", function(req,res){
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

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect("/login");
    }
}

module.exports = router;