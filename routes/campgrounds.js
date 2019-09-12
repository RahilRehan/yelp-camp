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

//edit campground route
router.get("/:id/edit",checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground:foundCampground});
    });
})

//update campground route
router.put("/:id", function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
})

//destroy campground route
router.delete("/:id",checkCampgroundOwnership , function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    })
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect("/login");
    }
}

function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("back");
            }else{
                if(foundCampground.author.id.equals(req.user._id)){
                    next()
                }else{
                    res.redirect("back");
                }
            }
        });
    }else{
        res.redirect("back");
    }
}


module.exports = router;