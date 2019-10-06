const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
            },
              name: String
            },
              rating: Number
            },
            {
              timestamps: true
            });



module.exports = mongoose.model('Comment', commentSchema);