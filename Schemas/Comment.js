const mongoose = require("mongoose");

const Comment = new mongoose.Schema({
    msg: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    Like: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Likes"
    }
    ]
}, {
    timestamps: true
});
module.exports = mongoose.model("Comment", Comment);