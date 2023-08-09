const mongoose=require("mongoose");
const requests=new mongoose.Schema({
    by:{
type :mongoose.Schema.Types.ObjectId,
ref:"User",
required:true,
    },
    who:{
        type :mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }

},{
    timestamps:true
});

module.exports=mongoose.model("friendRequets",requests);