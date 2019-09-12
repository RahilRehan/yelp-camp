var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    seedDB     = require("./seed"),
    methodOverride = require("method-override");
    User       = require("./models/user"),
    passport   = require("passport"),
    LocalStrategy=require("passport-local"),
    flash        = require("connect-flash");

var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments"),
    indexRoutes      = require("./routes/index");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(methodOverride("_method"));
app.use(require("express-session")({
    secret: "Yelp Camp Project",
    resave: false,
    saveUninitialized: false
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

mongoose.connect("mongodb://localhost:27017/campgrounds", {useNewUrlParser:true});

//seedDB();

app.listen(2900, function(){
    console.log("Server is running! ");
});