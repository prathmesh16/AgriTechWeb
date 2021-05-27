const express = require('express')

const app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'pug')
app.set('views','./views');
app.use(express.static(__dirname+'/public'));

const session = require('express-session');
app.use(session({cookieName: 'session',secret: 'agritech',saveUninitialized: false,resave: false}));

var firebase = require("firebase-admin");
var serviceAccount = require("./website-e1c2c-firebase-adminsdk-wvtp1-79e77062e5.json");
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://website-e1c2c.firebaseio.com"
});

var login = require('./login.js');
var homepage = require('./homepage.js');
var logout =require('./logout.js')
//both index.js and things.js should be in same directory
app.use('/login',login);
app.use('/homepage',homepage)
app.use('/logout',logout)


 
app.get('*', function(req, res){
   res.send('Sorry, this is an invalid URL.');
});
app.listen(3000)