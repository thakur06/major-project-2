const mongoose=require("mongoose");
const multer=require("multer")
const path=require("path")
const avatarsPath=path.join("/uploads/users/Avatars");
const User=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        require:true,

    },
    pass:{
        type:String,
        require:true,
    },
    avatars:{
        type:String,
        required:true
    },
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],

    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    ]
},{
    timestamps:true
});

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
cb(null,path.join(__dirname,"..",avatarsPath));

},
filename:(req,file,cb)=>{
    cb(null,file.fieldname+"-"+Date.now());
}}
);
User.statics.uploadedAvatar=multer({storage:storage}).single("avatars");
User.statics.avatarPath=avatarsPath;
module.exports=mongoose.model("User",User);