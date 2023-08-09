const mongoose=require("mongoose");
const env=require("./middleware/environment");
require("dotenv").config();
const uri=env.db;

const con=()=>{
    try{
    mongoose.set("strictQuery",true);
if (mongoose.connect(process.env.DB_API)){
console.log("connected to db ");

}else{
    console.log("An error has accured");
}
    }catch(err){
        console.log(err);
    }
}
module.exports=con;
