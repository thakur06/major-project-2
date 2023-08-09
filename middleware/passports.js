const passport=require("passport");
const passstat=require("passport-local").Strategy;
const User=require("../Schemas/User");
passport.use(new passstat({
    usernameField:"email",

},(email,password,done)=>{

    User.findOne({ email: req.body.email }, (err, user) => {

        if (err){
            return done(null,err);
        }
        if (!user) {

           return (null,false)
        }
        else {

            if (user.pass != req.body.pass) {
                return done(null,false)
            } else {
                // 
                return done(null,user)
            }
        }
    })

}));

passport.serializeUser((User,done)=>{
    return done(null,User.id);

});
passport.deserializeUser((id,done)=>{
    User.findById(id,(err,data)=>{
        if (!err){
done(null,data)
        }else {
            return done(err);
        }
    })
});
module.exports=passport;
