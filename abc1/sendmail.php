<?php     
$to_email1 = 'rajgavit26.rg@gmail.com';
$to_email2 = 'yashrode774@gmail.com';

$distance=$_REQUEST["distance"];
$lat=$_REQUEST["lat"];
$long=$_REQUEST["long"];

$subject = 'Medical Emergency..!!!';
$message = "http://maps.apple.com/maps?q=".$lat.",%20".$long."&center=".$lat.",".$long."  Distance : ".$distance;
$headers = 'From:agri.tech.mh@gmail.com';
$flag=$_REQUEST["flag"];



if($flag==1)
    {
        mail($to_email1,$subject,$message,$headers);
        mail($to_email2,$subject,$message,$headers);
    }
    
    echo $distance."km";
?>