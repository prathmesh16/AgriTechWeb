<?php 

$to_email =$_REQUEST["email"];
$message=$_REQUEST["msg"];
$subject = $_REQUEST["headMsg"];
$headers = 'From:agri.tech.mh@gmail.com';

    mail($to_email,$subject,$message,$headers);
    echo "Message sent Successfully!";
?>