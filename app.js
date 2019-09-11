var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    seedDB     = require("./seed"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    User       = require("./models/user"),
    passport   = require("passport"),
    LocalStrategy=require("passport-local");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(require("express-session")({
    secret: "Yelp Camp Project",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

mongoose.connect("mongodb://localhost:27017/campgrounds", {useNewUrlParser:true});

seedDB();

app.get("/", function(req,res){
    res.render("campgrounds/landing");
});

app.get("/campgrounds",function(req,res){
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/campgrounds",{campgrounds:campgrounds});
        }
    })
});

app.get("/camgrounds/new", function(req,res){
    res.render("campgrounds/new");
});

app.get("/campgrounds/:id", function(req,res){
    id = req.params.id;
    Campground.findById(id).populate("comments").exec(function(err, campground){
        res.render("campgrounds/display", {campground:campground});
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

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/newComment", {campground:campground});
        }
    })
})

app.post("/campgrounds/:id/comments", function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    console.log(comment);
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            });
        }
    });
});


//auth routes
app.get("/register", function(req, res){
    //res.send("register");
    res.render("authentication/register");
});

app.post("/register", function(req, res){
    var newUser = new User({username:req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("authentication/register");
        }else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/campgrounds");
            });
        }
    });
});

app.get("/login", function(req, res){
    res.render("authentication/login");
}); 

app.post("/login", passport.authenticate("local",
{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}) ,function(req, res){
        
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
})

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect("/login");
    }
}

app.listen(2900, function(){
    console.log("Server is running! ");
});