const { response, json } = require("express");
const friendRequests=require("../Schemas/friendRequests");
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
const recoverPass = require("../Schemas/Password_recovery/passrecovery")
const commentmailer = require("../mailers/commentsMailer")
const fs = require("fs");
const forgotPass = require("../mailers/forgotPassMailer");
const Likes = require("../Schemas/Likes");
const { request } = require("http");
const { send } = require("process");
router.get("/like", logger, async (req, res) => {


    try {
        let data;
        let flag;

        if (req.query.type == "Post") {
            data = await Post.findById(req.query.id).populate("Like");
        } else {
            data = await Comment.findById(req.query.id).populate("Like");
        }

        let info = await Likes.findOne({
            Likeable: req.query.id,
            onModel:req.query.type,
            user:req.user.online._id
        });

        if (info){

            await data.Like.pull(info);
            await data.save();
            await info.remove();
            res.redirect("/")
        }else{
            const like=await Likes.create({
                user:req.user.online._id,
                onModel:req.query.type,
                Likeable:req.query.id
            });
            await data.Like.push(like);
            await data.save();
            res.redirect("/")
   
        }

    } catch (err) {
        res.send(err);
    }
});

// ROUTE TO DELETE A USER INCLUDING ALL ITS DATA

// router.get("/user/delete/parmanent/:del",async (req,res)=>{
//     try {
        
//         let users=await User.findById(req.params.del);
//         if (!users){
// return res.send("user not found");
//         }
// let clike=await Likes.find({user:req.params.del , onModel:"Comment"});
// //let plike=await Likes.find({user:req.params.del , onModel:"Post"});
// //Comment.deleteMany({user:req.params.del});
// //let posts=await Post.deleteMany({user:req.params.del});




//       let postComments=await Comment.find({id:{$in :clike.Likeable}} );
//    //let ans =await Comment.find({id:postComments.id ,$pull{Like:}});

      
//         res.send(ans);

    
//     } catch (error) {
//         res.send(error);
//     }    
    
//     });


// router.get("",async(req,res)=>{

//     try {
//         await friendRequests.create({
// from:req.query.snd,
// to:req.query.rcv
//         });

//     } catch (error) {
//         res.send(error);
//     }
// });


router.get("/friend/request/:rcv",logger,async(req,res)=>{

    try {
        const friend=await friendRequests.findOne({by:req.user.online._id , who:req.params.rcv});
if (!friend){
     const newfriend=   await friendRequests.create({
by:req.user.online._id,
who:req.params.rcv
        });

        const sender=await User.findByIdAndUpdate(req.user.online._id,{$push:{following:req.params.rcv}},{new:true,upsert: true});
        const reciever=await User.findByIdAndUpdate(req.params.rcv,{$push:{followers:req.user.online._id}},{new:true,upsert: true});
        // sender.save();
        // reciever.save();
        res.send(sender.following);
    }else{
        const sender=await User.findByIdAndUpdate(req.user.online._id,{$pull:{following:req.params.rcv}},{new:true,upsert: true});
        const reciever=await User.findByIdAndUpdate(req.params.rcv,{$pull:{followers:req.user.online._id}},{new:true,upsert: true});
        //   sender.save();
        // reciever.save();
        const friend=await friendRequests.findOne({by:req.user.online._id , who:req.params.rcv});
        await friend.remove();
        res.send(sender.following);
    }

    } catch (error) {
        res.send(error);
    }
});

module.exports = router;