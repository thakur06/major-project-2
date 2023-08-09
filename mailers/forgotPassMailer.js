const nodeMailer=require("../middleware/Nodemailer");
const path=require("path");
exports.newPassword=(address)=>{
    let file=nodeMailer.renderTemplate({address:address},"/recovery/newPass.ejs");
nodeMailer.transporter.sendMail({
    from:"engineerMonk@gmail.com",
    to:address.mail,
    subject:"forgot password ?",
    html:file,

},(err,data)=>{
if (err){
console.log(err);
return;
}else {
    return;
}
})
console.log(address);
return ;

}