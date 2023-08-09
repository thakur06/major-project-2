const nodeMailer=require("../middleware/Nodemailer");
exports.newComment=(comment)=>{

   let file= nodeMailer.renderTemplate({comment:comment},"/comments/new_comment.ejs")
    nodeMailer.transporter.sendMail({
        from:"engineerMonk@gmail.com",
        to:comment.user.email,
        subject:"new comment added",
        html:file,

    },(err,data)=>{
        if (err){
            console.log(err);
            return ;
        }else{
            console.log("message sent ", data) ;
            return ;

        }
    })
}