
<html>
	<body>
<?php
header("Pragma: no-cache");
header("Cache-Control: no-cache");
header("Expires: 0");

// following files need to be included
require_once("./lib/config_paytm.php");
require_once("./lib/encdec_paytm.php");

$paytmChecksum = "";
$paramList = array();
$isValidChecksum = "FALSE";

$paramList = $_POST;
$paytmChecksum = isset($_POST["CHECKSUMHASH"]) ? $_POST["CHECKSUMHASH"] : ""; //Sent by Paytm pg

//Verify all parameters received from Paytm pg to your application. Like MID received from paytm pg is same as your application�s MID, TXN_AMOUNT and ORDER_ID are same as what was sent by you to Paytm PG for initiating transaction etc.
$isValidChecksum = verifychecksum_e($paramList, PAYTM_MERCHANT_KEY, $paytmChecksum); //will return TRUE or FALSE string.


if($isValidChecksum == "TRUE") {
	echo "<b>Checksum matched and following are the transaction details:</b>" . "<br/>";
	if ($_POST["STATUS"] == "TXN_SUCCESS") {
		echo "<b>Transaction status is success</b>" . "<br/>";
		?>
		
		<script src="https://www.gstatic.com/firebasejs/7.6.1/firebase.js"></script>
		<script>
		var firebaseConfig = {
			apiKey: "AIzaSyBw4RVlD1ZdnNNn4ow5hahtxPxBSpL_tpA",
			authDomain: "website-e1c2c.firebaseapp.com",
			databaseURL: "https://website-e1c2c.firebaseio.com",
			projectId: "website-e1c2c",
			storageBucket: "website-e1c2c.appspot.com",
			messagingSenderId: "640557542653",
			appId: "1:640557542653:web:215d1a31f7ace2f72fe294"
		};
		// Initialize Firebase
		firebase.initializeApp(firebaseConfig);
		</script>
		<script>
			function genOrderId() {
            return "ORDER" + Math.floor(100000000 + Math.random() * 900000000);
        }
		firebase.database().ref().child("Users").child(localStorage.getItem("Username")).child("cart").orderByChild("name").on("value", function(snapshot1) {
              if(snapshot1.exists())
              {
                snapshot1.forEach(function(childSnapshot) {
                    var orderaddress={
                        address: localStorage.getItem("address"),
                        phone: localStorage.getItem("phone"),
                        postalCode: localStorage.getItem("postcode")
                    };
                    var today = new Date();
                    var date = today.getFullYear()+"/"+(today.getMonth()+1)+"/"+today.getDate();
                    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                    var dateTime = date+" "+time;
                    var stage1={
                        date:dateTime,
                        messege:"Order placed successfully",
                        orderStatus:"COMPLETED",
                        orderStatusno:1
                    };
                    var stage2={
                        date:dateTime,
                        messege:"Order Confirming",
                        orderStatus:"ACTIVE",
                        orderStatusno:2
                    };
                    var stage3={
                        date:dateTime,
                        messege:"Order Shipped",
                        orderStatus:"INACTIVE",
                        orderStatusno:3
                    };
                    var stage4={
                        date:dateTime,
                        messege:"Order out for delivery",
                        orderStatus:"INACTIVE",
                        orderStatusno:4
                    };
                    var stage5={
                        date:dateTime,
                        messege:"Order Successfully Deliverd",
                        orderStatus:"INACTIVE",
                        orderStatusno:5
                    };
                    var orderstatus={
                        Stage1:stage1,
                        Stage2:stage2,
                        Stage3:stage3,
                        Stage4:stage4,
                        Stage5:stage5
                    };
                   

                    var order={
                        ordid:genOrderId(),
                        orderstatus:orderstatus,
                        orderaddress:orderaddress,
                        Delivery:"Pending",
                        catagory:childSnapshot.val().catagory,
                        customer:localStorage.getItem("Username"),
                        image:childSnapshot.val().image,
                        name:childSnapshot.val().name,
                        payment:"Done",
                        price:childSnapshot.val().price,
                        qty:childSnapshot.val().qty,
                        totalprice:parseInt(childSnapshot.val().price)*parseInt(childSnapshot.val().qty),
                        seller:childSnapshot.val().seller
                    };
                    firebase.database().ref().child("Users").child(localStorage.getItem("Username")).child("orders").child(order.ordid).set(order);
                    firebase.database().ref().child("Users").child(order.seller).child("delivery").child(order.ordid).set(order);
                });
				firebase.database().ref().child("Users").child(localStorage.getItem("Username")).child("cart").remove();
			}
		});
		</script>
		<?php
		//Process your transaction here as success transaction.
		//Verify amount & order id received from Payment gateway with your application's order id and amount.
	}
	else {
		echo "<b>Transaction status is failure</b>" . "<br/>";
	}

	if (isset($_POST) && count($_POST)>0 )
	{ 
		foreach($_POST as $paramName => $paramValue) {
				echo "<br/>" . $paramName . " = " . $paramValue;
		}
	}
	

}
else {
	echo "<b>Checksum mismatched.</b>";
	//Process transaction as suspicious.
}

?>
</body>
</html>