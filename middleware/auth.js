
const User=require("../Schemas/User");
const jwt=require("jsonwebtoken");
const env=require("./environment");
require("dotenv").config();
const imp=(req,res,next)=>{
    const token=req.cookies.user;

    try {
        if (!token){
res.render("Login");
        }
        else {
           jwt.verify(token,process.env.SECRET,(err,user)=>{
if (!err){
    req.user=user;
next();
}
else{
    res.send(err);
}
           })
        
    } }
    catch (error) {
        res.send(error);
    }
};
module.exports=imp;