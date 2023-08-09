const mongoose=require("mongoose");
const recoveryPass=new mongoose.Schema({
    email:{
        type:String,
        require:true,
        unique:true,
    },
    accessToken:{
        type:String,
        required:true,
        unique:true,
    },
    expired:{
        type:Boolean
    }
},{
    timestamps:true
}
);
module.exports=mongoose.model("recoverPass",recoveryPass);