var express = require("express"),
    app = express(),
    bodyparser = require("body-parser"),
    mongoose = require("mongoose"),
    campground = require("./models/campground"),
    methodoverride = require("method-override"),
    passport = require("passport"),
    user = require("./models/user"),
    LocalStrategy = require("passport-local");

var commentRoutes = require("./routes/comment"),
campgroundRoutes = require("./routes/campground"),
authRoutes = require("./routes/auth")



// mongoose.connect("mongodb://localhost/yelpcamp");
mongoose.connect("mongodb://Mohamed:tada@ds123919.mlab.com:23919/yelpcamp");
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodoverride("_method"));
app.use(require("express-session")({
    secret: "Waah",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next ();
});

app.use("/", authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.get("/", function(req, res){
    res.redirect("/campgrounds");
})

app.listen(process.env.PORT, function(){
    console.log("Server is Running");
});
