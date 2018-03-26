var express = require("express");
var router = express.Router();
var campground = require("../models/campground");

router.get("/", function(req, res){
    campground.find({}, function(err, camps){
        res.render("campgrounds", {campgrounds: camps, currentUser: req.user});
    });
});

router.post("/", isLoggedIn, function(req, res){
    var name = req.body.name;
    var img = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newcamp = {name: name, image: img, description: desc, author: author};
    campground.create(newcamp, function(err, newlycreated){
        res.redirect("/campgrounds");
    });
});

router.get("/new", isLoggedIn, function(req, res){
    res.render("new.ejs");
});

router.get("/:id", function(req, res){
    campground.findById(req.params.id).populate("comments").exec(function(err, foundcamp){
        res.render("show", {campground: foundcamp});
    });
});

router.get("/:id/edit", checkOwner, function(req, res){
    campground.findById(req.params.id, function(err, foundcamp){
        res.render("edit", {campground: foundcamp});
    });
});

router.put("/:id", checkOwner, function(req , res){
    campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedcamp){
        res.redirect("/campgrounds/" + req.params.id);
    });
});

router.delete("/:id", checkOwner, function(req, res){
    campground.findByIdAndRemove(req.params.id, function(err){
        res.redirect("/campgrounds");
    });
});

function checkOwner(req, res, next) {
    if(req.isAuthenticated()) {
        campground.findById(req.params.id, function(err, foundcamp){
            if(foundcamp.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
        });
    } else {
        res.redirect("back");
    }
}

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
