var express = require('express');
var router = express.Router();
var firebase = require("firebase-admin");

var sess;
router.get('/', function (req, res) {
    sess=req.session;
    if(!(sess || sess.Username))
      {
        res.redirect("/login");
      }
      else{
        res.setHeader("Content-Type", "text/html"); 
        res.render('homepage', { title:"Home Page",name:sess.Username});
      }
})
module.exports = router;