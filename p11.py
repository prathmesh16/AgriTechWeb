import pyrebase
firebaseConfig = {
  apiKey: "AIzaSyAh_zthaxjkVwfZaRSw_-dsPj76D-PNcwY",
  authDomain: "soil-dddaf.firebaseapp.com",
  databaseURL: "https://soil-dddaf.firebaseio.com",
  projectId: "soil-dddaf",
  storageBucket: "soil-dddaf.appspot.com",
  messagingSenderId: "36853282664",
  appId: "1:36853282664:web:d8386da199975f9454c8dd",
  measurementId: "G-72C75LNL91"
}
firebase = pyrebase.initialize_app(firebaseConfig)
auth = firebase.auth() 
db=firebase.databse()
user = auth.sign_in_with_email_and_password("nalevikas5@gmail.com", "123456")
lana = {"name": "Lana Kane", "agency": "Figgis Agency"} 
db.child("agents").child("Lana").set(lana, user['idToken'])
