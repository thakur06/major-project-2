const { urlencoded } = require("express");
const express = require("express");
const router = express.Router();
const path = require("path");
const db = require("./db")
const app = express();
const Post=require("./Schemas/posts");
require("dotenv").config();
const cookies = require("cookie-parser");
const cors=require("cors");
app.use("/Default_Audio",express.static(path.join(__dirname+"/Default_Audio")))
app.use(express.static(path.join(__dirname,"js")))
const expressEjsLayouts = require("express-ejs-layouts");
app.use(cookies());
app.use(expressEjsLayouts)
app.set("view engine", "ejs");
app.use(express.urlencoded());
const passportLocalStatergy = require("./middleware/passports");
const session = require("express-session");
db();
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge:1000*60*100 }
  }))
const gstats = require("./middleware/google_oauth2");
app.use("/uploads", express.static(path.join(__dirname + "/uploads")))
app.set("views", path.join(__dirname, "views"));
app.get("/", require("./controllers/_ctrl"));
app.get("/login", require("./controllers/_ctrl"));
app.get("/posts", require("./controllers/_ctrl"));
app.post("/signup", require("./controllers/_ctrl"));
app.post("/signin", require("./controllers/_ctrl"));
app.post("/post", require("./controllers/_ctrl"));
app.get("/add", require("./controllers/_ctrl"));
app.get("/signOut", require("./controllers/_ctrl"));
app.get("/display", require("./controllers/_ctrl"));
app.post("/Comment", require("./controllers/_ctrl"));
app.post("/comment/delete", require("./controllers/_ctrl"));
app.post("/users", require("./controllers/_ctrl"));
app.get("/profilepage", require("./controllers/_ctrl"));
app.post("/user/updatedata/:us", require("./controllers/_ctrl"));
app.post("/updated/pass/done", require("./controllers/_ctrl"));
app.get("/user/delete/parmanent/:del", require("./controllers/_ctrl2"));
app.get("/user/google", require("./controllers/_ctrl"));
app.get("/user/google/cb", require("./controllers/_ctrl"))
app.get("/friends/me", require("./controllers/_ctrl2"));
app.get("/friend/request/:rcv", require("./controllers/_ctrl2"))
app.get("/Home", (req, res) => {
    res.render("Home");
});
app.get("/hell", (req, res) => {
    res.render("signUp");
});
app.get("/forgot/password_mail", (req, res) => {
    res.render("_get_Forgot_password_mail");
});
app.get("/like",require("./controllers/_ctrl2"));
app.get("/recovery/newpass/:flag",require("./controllers/_ctrl"));
app.post("/recovery/pass/email", require("./controllers/_ctrl"));
app.post("/post/delete", require("./controllers/_ctrl"));



const socket=require("http").Server(app);

const chatSocket=require('./middleware/chat_socket');
chatSocket(socket);

socket.listen(5000,(err)=>{
if (err){
console.log(err)
}else{
console.log("socket listing on port ",5000)
}
});
app.listen(8000, (err) => {
    if (err) {
        console.log(err)
    }
    else {
        console.log(`app listening to port ${8000}`);
    }
})
