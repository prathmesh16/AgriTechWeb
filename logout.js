var express = require('express');
var router = express.Router();
var firebase = require("firebase-admin");
var sess;
router.get('/', function (req, res) {
    sess=req.session;
    sess.Username="";
    sess.destroy(function(err){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.redirect('/login');
        }
    });
})
router.post('/', function (req, res) {
    sess=req.session;
    sess.Username="";
    sess.destroy(function(err){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.redirect('/login');
        }
    });
    
})
module.exports = router;