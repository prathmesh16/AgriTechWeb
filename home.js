
function load_products() {
    firebase.database().ref().child("Posts").limitToLast(8).on('value', function(snapshot1) {
        if (snapshot1.exists()) 
        {
            var cnt=0;
            document.getElementById("row1").innerHTML="";
            document.getElementById("row2").innerHTML="";
            var storageRef = firebase.storage().ref();
            snapshot1.forEach(function(childSnapshot) {

                storageRef.child(childSnapshot.val().image).getDownloadURL().then(function(url) {
                    var test = url;
                   // document.getElementById("profilepic").src = test;
                    if(cnt<=3)
                        document.getElementById("row1").innerHTML+="<div class=col-lg-3 col-md-6 align-items-center d-flex justify-content-center ><div class=card align-items-center mb-2 productCardClass><div class=view overlay><img src="+test+" class=productImage id=pImage1></div><div class=card-body><a href= class=grey-text categoryClass><h6>"+childSnapshot.val().name+"</h6></a><h6 class=mb-3 productNameClass><a href= class=black-text >"+childSnapshot.val().catagory+"</a></h6><h5 class=font-weight-bold blue-text mb-0 priceClass>Rs.649</h5></div></div></div>";
                    else
                        document.getElementById("row2").innerHTML+="<div class=col-lg-3 col-md-6 align-items-center d-flex justify-content-center ><div class=card align-items-center mb-2 productCardClass><div class=view overlay><img src="+test+" class=productImage id=pImage1></div><div class=card-body><a href= class=grey-text categoryClass><h6>"+childSnapshot.val().name+"</h6></a><h6 class=mb-3 productNameClass><a href= class=black-text >"+childSnapshot.val().catagory+"</a></h6><h5 class=font-weight-bold blue-text mb-0 priceClass>Rs.649</h5></div></div></div>";
                    cnt++;
                    }).catch(function(error) {
                });
                });
        }
    });
}
window.onload=()=>
{
    load_products()
}