var mongoose = require("mongoose"),
campground = require("./models/campground"),
comment = require("./models/comment");

var data =  [
    {
        name: "Cloud rest",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYFDXKkFYVD7EIZ9Sdu-wDDVdDcWKlo2xOy3sCz8MDCmAiT4VIEA",
        description: "bla"  
    }
]

function seedDB(){
    campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed");
        data.forEach(function(seed){
            campground.create(seed, function(err, campground){
               if(err) {
                    console.log(err);
               } else {
                console.log("added");
                comment.create({
                    text: "Tired",
                    author: "Homer"
                    }, function(err, comment){
                        campground.comments.push(comment);
                        campground.save();
                });
               }
            });
        });
    });
}

module.exports = seedDB;