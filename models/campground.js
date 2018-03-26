var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
    author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                 ref: "user"
                },
            username: String
            },
    name: String,
    image : String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comment"
        }
    ]
});

module.exports = mongoose.model("campground", campgroundSchema);