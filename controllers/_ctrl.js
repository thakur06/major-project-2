const { response, json } = require("express");
const express = require("express");
const router = express.Router();
const User = require("../Schemas/User");
const jwt = require("jsonwebtoken");
const Post = require("../Schemas/posts");
const logger = require("../middleware/auth")
const { LocalStorage } = require("node-localstorage");
const lc = require("node-localstorage").LocalStorage;
const localStorage = new LocalStorage("./scratch");
const Comment = require("../Schemas/Comment");
const passport = require("passport");
const path = require("path");
const crypto = require("crypto");
require("dotenv").config();
const recoverPass = require("../Schemas/Password_recovery/passrecovery")
const commentmailer = require("../mailers/commentsMailer")
const fs = require("fs");
const Likes=require("../Schemas/Likes")
const forgotPass = require("../mailers/forgotPassMailer");
router.get("/login", (req, res) => {
    res.render("Login");
});

router.post("/signup", (req, res) => {
    try {
        User.create({
            email: req.body.email,
            pass: req.body.pass,
            name: req.body.name,
            avatars: "https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
        }, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                res.redirect("/");
            }
        })

    } catch (error) {
        res.send(err);
    }
});
router.post("/signin", (req, res) => {
    try {
        User.findOne({ email: req.body.email }, (err, user) => {

            if (!user) {

                res.redirect("/");
            }
            else {

                if (user.pass != req.body.pass) {
                    res.send("wrong pass");
                } else {
                    user.pass = "depricated_err"
                    const token = jwt.sign({ online: user }, process.env.SECRET);
                    const decoder = jwt.verify(token, process.env.SECRET);
                    res.cookie("user", token);
                    res.redirect("/");
                }
            }
        })


    } catch (error) {
        res.send(error);
    }
});

router.get("/posts", logger, (req, res) => {
    res.render("posts")
})
router.get("/signOut", logger, (req, res) => {
    res.clearCookie('user');
    res.render("Login");
})
router.post("/post", logger, (req, res) => {
    try {
        Post.create({
            msg: req.body.posts,
            user: req.user.online._id
        })
        res.redirect("/");
    } catch (error) {
        res.send(error)
    }
});



router.get("/", logger, (req, res) => {
    try {
        console.log(__dirname)
        Post.find({}).populate('user')
            .populate({

                path: "comment",
                populate: {
                    path: "user"
                }
            })
            .exec((err, data) => {
                User.find({ _id: { $ne: req.user.online._id } }, (err, users) => {
                    if (!err) {
// console.log(req.user.online)
                        res.render("Main", {
                            post: data,
                            use: req.user.online,
                            allusers: users
                        });
                    }
                }).select("-pass");


            }
            );
    }

    catch (err) {
        res.send(err);
    }
});

router.post("/Comment", logger, async (req, res) => {
    try {
        Post.findById(req.body.post, (err, post) => {
            if (err) {
                res.send(err);
            }
            else {



                if (post) {
                    let comment = Comment.create({
                        msg: req.body.content,

                        user: req.user.online._id,
                        post: req.body.post,
                    }, function (err, commen) {


                        //Code refactor required to send mails with population
                        let comms = post.populate("user", (err, data) => {
                            if (err) {
                                console.log(err)
                                res.send(err);
                            } else {
                                commentmailer.newComment(data);
                            }
                        });


                        post.comment.push(commen);
                        post.save();

                        res.redirect('/');
                    });
                }





            }

        })
    }
    catch (err) {
        res.send(err);
    }
});

router.post("/post/delete", logger, async (req, res) => {
    let post =await Post.findById(req.body.val);
   
    if (JSON.stringify(req.user.online._id) == JSON.stringify(post.user)){

    
    await Likes.deleteMany({Likeable:post, onModel:"Post"});
    await Likes.deleteMany({Likeable:{$in :post.comment} , onModel:"Comment"});
    await Comment.deleteMany({post:req.body.val});
    await(post.remove());
    res.redirect("/");

        
    }else{
        res.send("err");
    }
});



router.post("/comment/delete", logger, (req, res) => {
    Comment.findById(req.body.val, (err, data) => {
        if (err) {
            res.send(err);

        } else {

            if (data.user == (req.user.online._id)) {
                const helps = data.post;
                data.remove();
                Post.findByIdAndUpdate(data.post, { $pull: { comment: req.body.val } }, (err, values) => {
                    if (err) {
                        res.send(err);
                    } else {
Likes.deleteMany({Likeable:data._id},(err,ans)=>{
    if (err){
        res.send(err);
    }else {
        res.redirect("/");
    }
})
                       
                    }
                });
            } else {
                res.send("unable");
            }

        }
    })
});
router.post("/users", logger, (req, res) => {
    User.findById(req.body.us, (err, data) => {
        if (!err) {
            res.render("Profile", {
                user: data,

                flag: false
            });
        }
    }).select("-pass");


});
router.get("/profilepage", logger, (req, res) => {
    User.findById(req.user.online, (err, data) => {
        if (!err) {
            res.render("Profile", {
                user: data,
                flag: true
            });
        }
    }).select("-pass");


});


router.post("/user/updatedata/:us", logger, async (req, res) => {
    try {
        const data = await User.findById(req.params.us).select("-pass");
        if (!data) {
            res.send("not found");
        } else {
            User.uploadedAvatar(req, res, (err) => {
                if (err) {
                    res.send(err);
                }
                else {
                    data.name = req.body.name;
                    data.pass = req.body.pass;


                    if (data.avatars) {

                        if (data.avatars != "https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg" && fs.existsSync(path.join(__dirname, ".." + data.avatars))) {
                            fs.unlinkSync(path.join(__dirname, ".." + data.avatars));

                            if (req.file) {
                                data.avatars = User.avatarPath + "/" + req.file.filename;
                                data.save();
                                res.redirect("/");

                            } else {
                                data.avatars = "https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg";
                                data.save();
                                res.redirect("/");
                            }
                            // res.send(data.avatars+" from if");
                        } else if (data.avatars == "https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg" && req.file) {
                            data.avatars = User.avatarPath + "/" + req.file.filename;
                            data.save();
                            res.redirect("/");
                        } else {
                            data.avatars = "https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg";
                            data.save();
                            res.redirect("/");
                        }

                        // res.send(data.avatars+" from if"+path.join(__dirname+data.avatars));
                    } else {
                        setTimeout(res.redirect("/"), 1000)
                    }
                    // fs.unlinkSync(path.join(__dirname,".."+data.avatars));

                }
            })
        }




    } catch (error) {
        return res.send(error);
    }
});
router.get("/user/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/user/google/cb",
    passport.authenticate("google", { failureRedirect: "/signup" }), (req, res) => {
        res.redirect("/");
    });




router.post("/recovery/pass/email", async (req, res) => {

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        res.status(404).send("User not found");
    }
    else {
        let reMatch = await recoverPass.findOne({ email: req.body.email });

        //////





        /////////////////////////////           REMINDER TO CHECK THE PREVIOUS RECORDS THE EMAIL IN CASE OF FAILURE AND REMOVE THE PREVIOUS ACCESS TOKEN AND CREATE A NEW RECORD 








        //////////
        if (reMatch) {
            await recoverPass.findByIdAndDelete(reMatch._id);
            reMatch = false;
        }

        if (!reMatch) {
            const token = crypto.randomBytes(30).toString("hex");
            const userDetails = await recoverPass.create({
                email: req.body.email,
                accessToken: token,
                expired: false
            });

            const creds = {
                mail: req.body.email,
                token: "http://localhost:8000/recovery/newpass/" + token,
            }
            const flag = await recoverPass.findOne({ accessToken: token });
            if (flag) {
                forgotPass.newPassword(creds);

                res.send("Password recovery mail sent to your mail");
            }
            else {
                res.send("link expired");
            }
        } else {
            res.status(404).send("link expired");
        }
    }

});

router.get("/recovery/newpass/:flag", async (req, res) => {
    const user = await recoverPass.findOne({ accessToken: req.params.flag });
    if (user) {

        res.render("_forgot_password", { mail: user.email });
    } else {
        return res.status(404).send("link expired...");
    }

});

router.post("/updated/pass/done", async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        await recoverPass.findOneAndDelete({ email: req.body.email });
        user.pass = req.body.pass;
        user.save();
        res.redirect("/")
    } else {
        res.send("User not found ");
    }
});


module.exports = router;
