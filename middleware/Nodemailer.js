const nodeMailer=require("nodemailer");
const path=require("path");
const ejs=require("ejs");
const { relative } = require("path");
require("dotenv").config();
let transporter=nodeMailer.createTransport({
    service:"email",
host:"smtp.ethereal.email",
port:587,
secure:false,
auth:{
user:process.env.NAME ,
pass:process.env.NAME
}
});

let renderTemplate=(data,relativePath)=>{
    let mailhtml;
    ejs.renderFile(path.join(__dirname,"../views/mailer",relativePath),data,(err,template )=>{

        if (err){
            console.log(err);
            return;

        }
        else {
            mailhtml=template;
        }
    });
    return mailhtml;
}

module.exports={transporter:transporter,renderTemplate:renderTemplate};