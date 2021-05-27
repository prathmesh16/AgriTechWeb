var express = require('express');
var router = express.Router();
var firebase = require("firebase-admin");


var sess;
router.get('/', function (req, res) {
    sess=req.session;
    if((sess || sess.Username))
      {
        res.redirect("/homepage");
      }
      else{
        res.setHeader("Content-Type", "text/html"); 
        res.render('login', { title:"Login Page"})
      }
})
 
 



router.post('/', function(req, res){
    sess=req.session;
        var uname=req.body.Username;
        var password=req.body.Password;
        if(uname!=""||password!="")
        {

            firebase.database().ref().child("Users").child(uname).once('value').then(function(snapshot) {
                if(!snapshot.exists())
                {
                    //$("#loadMe").modal("hide");
                   // setTimeout(function() {$("#loadMe").modal("hide");}, 2000);
                    alert("account does not exist!");
                }
                if(uname==snapshot.val().Name)
                {
                   // document.getElementById("loadermsg").innerHTML="Logging In...";
                    if(password==snapshot.val().Password)
                    {
                        //localStorage.setItem("Username",uname);
                        sess.Username=uname;

                        //localStorage.setItem("Password",password);
                        sess.Password=password;
                        
                        //alert("logged in succefully!");
                        //$("#loadMe").modal("hide");
                        //document.getElementById("loadermsg").innerHTML="Logged In!!";
                        // window.location.replace("homepage.html");
                        res.redirect('/homepage')
                    }
                    else
                    {
                        //$("#loadMe").modal("hide");
                        //setTimeout(function() { $("#loadMe").modal("hide");}, 2000);
                        alert("Password is incorrect!");
                    }
                }
                else
                {
                    //$("#loadMe").modal("hide");
                    // setTimeout(function() {
                    // $("#loadMe").modal("hide");
                    // }, 2000);
                    alert("Account does not exist!");
                }
            });
        }
        else
        {
        alert("All fields are required!");
        }
      
});

//export this router to use in our index.js
module.exports = router;