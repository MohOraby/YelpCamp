var express = require("express");
var router = express.Router({mergeParams: true});
var campground = require("../models/campground");
var comment = require("../models/comment");

router.post("/", isLoggedIn, function(req, res){
    campground.findById(req.params.id, function(err, campground){
        if(err) {
            res.redirect("/campgrounds");
        } else {
            comment.create(req.body.comment, function(err, comment){
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save();
                campground.comments.push(comment);
                campground.save();
                res.redirect("/campgrounds/" + campground._id);
            });
        }
    });
});

router.get("/new", isLoggedIn, function(req, res){
    campground.findById(req.params.id, function(err, campground){
            res.render("newcomment", {campground: campground});
    });
});

router.get("/:comment_id/edit", checkCommentOwner, function(req, res){
    comment.findById(req.params.comment_id, function(err, foundcomment){
        res.render("editcomment", {campground_id: req.params.id, comment: foundcomment});
    });
});

router.put("/:comment_id", checkCommentOwner, function(req , res){
    comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedcomment){
        res.redirect("/campgrounds/" + req.params.id);
    });
});

router.delete("/:comment_id", checkCommentOwner, function(req, res){
    comment.findByIdAndRemove(req.params.comment_id, function(err){
        res.redirect("/campgrounds/" + req.params.id);
    });
});

function checkCommentOwner(req, res, next) {
    if(req.isAuthenticated()) {
        comment.findById(req.params.comment_id, function(err, foundcomment){
            if(foundcomment.author.id.equals(req.user._id)) {
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