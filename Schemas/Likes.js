const mongoose=require("mongoose");
const Likes=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    Likeable:{
type:mongoose.Schema.ObjectId,
refPath:"onModel",
required:true
    },
    onModel:{
        type:String,
        required:true,
        enun:["Posts","Comment"]
    }
},{
    timestamps:true
});

module.exports=mongoose.model("Likes",Likes)