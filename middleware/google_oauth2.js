const passport = require("passport");
const gstats = require("passport-google-oauth").OAuth2Strategy;
const User = require("../Schemas/User");
const crypto = require("crypto");
const jwt=require("jsonwebtoken")

const pass=passport.use(new gstats({
    clientID: "686990956848-qgu4j298it38d65r5m6dbs91340anmr4.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8000/user/google/cb",
}, (acessToken, refreshToken, Profile, done) => {
    User.findOne({ email: Profile.emails[0].value }).exec((err, data) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log(Profile);
        if (data) {
            console.log(data);
            data.pass = "depricated_err"
            const token = jwt.sign({user:data.email}, "abi@0101");
           
            res.cookie("user", token);
            return done(null, data);
        } else {
            User.create({
                email: Profile.emails[0].value,
                name: Profile.displayName,
                pass: crypto.randomBytes(20).toString("hex"),
                avatars:"https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
            }, (err, data) => {
                if (err) {
                    console.log(err);  return;
                } else {
                    
                    return done(null, data);
                }
            })
        }

    })
}));
module.exports = pass;
