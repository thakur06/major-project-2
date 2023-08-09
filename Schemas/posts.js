const mongoose = require('mongoose');
const post = new mongoose.Schema({
    msg: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comment: [

        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            required: true
        },



    ],
    Like:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Likes"
    }
    ]


}, {
    timestamps: true
});

module.exports = mongoose.model('Post', post);