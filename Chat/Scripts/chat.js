﻿var currentUserKey = '';
var chatKey = '';
var friend_id = '';

document.addEventListener('keydown', function (key) {
    if (key.which === 13) {
        SendMessage();
    }
});
window.onload=()=>{
    load_user();
    PopulateFriendList();
}
////////////////////////////////////////
function ChangeSendIcon(control) {
    if (control.value !== '') {
        document.getElementById('send').removeAttribute('style');
        document.getElementById('audio').setAttribute('style', 'display:none');
    }
    else {
        document.getElementById('audio').removeAttribute('style');
        document.getElementById('send').setAttribute('style', 'display:none');
    }
}
document.getElementById('send').addEventListener('click',function()
{
    SendMessage();
})
/////////////////////////////////////////////
// Audio record

let chunks = [];
let recorder;
var timeout;

function record(control) {
    let device = navigator.mediaDevices.getUserMedia({ audio: true });
    device.then(stream => {
        if (recorder === undefined) {
            recorder = new MediaRecorder(stream);
            recorder.ondataavailable = e => {
                chunks.push(e.data);

                if (recorder.state === 'inactive') {
                    let blob = new Blob(chunks, { type: 'audio/webm' });
                    //document.getElementById('audio').innerHTML = '<source src="' + URL.createObjectURL(blob) + '" type="video/webm" />'; //;
                    var reader = new FileReader();

                    reader.addEventListener("load", function () {
                        var chatMessage = {
                            userId: currentUserKey,
                            msg: reader.result,
                            msgType: 'audio',
                            dateTime: new Date().toLocaleString()
                        };

                        firebase.database().ref('chatMessages').child(chatKey).push(chatMessage, function (error) {
                            if (error) alert(error);
                            else {

                                document.getElementById('txtMessage').value = '';
                                document.getElementById('txtMessage').focus();
                            }
                        });
                    }, false);

                    reader.readAsDataURL(blob);
                }
            }

            recorder.start();
            control.setAttribute('class', 'fas fa-stop fa-2x');
        }
    });

    if (recorder !== undefined) {
        if (control.getAttribute('class').indexOf('stop') !== -1) {
            recorder.stop();
            control.setAttribute('class', 'fas fa-microphone fa-2x');
        }
        else {
            chunks = [];
            recorder.start();
            control.setAttribute('class', 'fas fa-stop fa-2x');
        }
    }
}

/////////////////////////////////////////////////////////////////
// Emoji
loadAllEmoji();

function loadAllEmoji() {
    var emoji = '';
    for (var i = 128512; i <= 128566; i++) {
        emoji += `<a href="#" style="font-size: 22px;" onclick="getEmoji(this)">&#${i};</a>`;
    }

    document.getElementById('smiley').innerHTML = emoji;
}

function showEmojiPanel() {
    document.getElementById('emoji').removeAttribute('style');
}

function hideEmojiPanel() {
    document.getElementById('emoji').setAttribute('style', 'display:none;');
}

function getEmoji(control) {
    document.getElementById('txtMessage').value += control.innerHTML;
}
//////////////////////////////////////////////////////////////////////
function StartChat(friendKey, friendName, friendPhoto) {
    var friendList = { friendId: friendKey, userId: currentUserKey };
    friend_id = friendKey;

    var db = firebase.database().ref('friend_list');
    var flag = false;
    db.on('value', function (friends) {
        friends.forEach(function (data) {
            var user = data.val();
            if ((user.friendId === friendList.friendId && user.userId === friendList.userId) || ((user.friendId === friendList.userId && user.userId === friendList.friendId))) {
                flag = true;
                chatKey = data.key;
            }
        });

        if (flag === false) {
            chatKey = firebase.database().ref('friend_list').push(friendList, function (error) {
                if (error) alert(error);
                else {
                    document.getElementById('chatPanel').removeAttribute('style');
                    document.getElementById('divStart').setAttribute('style', 'display:none');
                    hideChatList();
                }
            }).getKey();
        }
        else {
            document.getElementById('chatPanel').removeAttribute('style');
            document.getElementById('divStart').setAttribute('style', 'display:none');
            hideChatList();
        }
        //////////////////////////////////////
        //display friend name and photo
        document.getElementById('divChatName').innerHTML = friendName;
        var storageRef = firebase.storage().ref();
        storageRef.child(friendPhoto).getDownloadURL().then(function(url) {
            document.getElementById('imgChat').src = url;
        }).catch(function(error) {
            console.log(error);
        });
       

        document.getElementById('messages').innerHTML = '';

        document.getElementById('txtMessage').value = '';
        document.getElementById('txtMessage').focus();
        ////////////////////////////
        // Display The chat messages
        LoadChatMessages(chatKey, friendPhoto);
    });
}

//////////////////////////////////////

function LoadChatMessages(chatKey, friendPhoto) {
    var db = firebase.database().ref('chatMessages').child(chatKey);
    db.on('value', function (chats) {
        var messageDisplay = '';
        var cnt=0;
        var storageRef = firebase.storage().ref();
        chats.forEach(function (data) {
            var chat = data.val();
            var dateTime = chat.dateTime.split(",");
            var msg = '';
            if (chat.msgType === 'image') {
                msg = `<img src='${chat.msg}' class="img-fluid" />`;
            }
            else if (chat.msgType === 'audio') {
                msg = `<audio controls>
                        <source src="${chat.msg}" type="video/webm" />
                    </audio>`;
            }
            else {
                msg = chat.msg;
            }
            if (chat.userId !== currentUserKey) {
                cnt++;
                messageDisplay += `<div class="row">
                                    <div class="col-2 col-sm-1 col-md-1">
                                        <img id="imgm${cnt}" class="chat-pic rounded-circle" />
                                    </div>
                                    <div class="col-6 col-sm-7 col-md-7">
                                        <p class="receive">
                                            ${msg}
                                            <span class="time float-right" title="${dateTime[0]}">${dateTime[1]}</span>
                                        </p>
                                    </div>
                                </div>`;
                                (function(pid) {
                                    storageRef.child(friendPhoto).getDownloadURL().then(function(url) {
                                        document.getElementById("imgm" + pid).src = url;
                                    }).catch(function(error) {
                                        console.log(error);
                                    });
                                })(cnt);
            }
            else {
                messageDisplay += `<div class="row justify-content-end">
                            <div class="col-6 col-sm-7 col-md-7">
                                <p class="sent float-right">
                                    ${msg}
                                    <span class="time float-right" title="${dateTime[0]}">${dateTime[1]}</span>
                                </p>
                            </div>
                            <div class="col-2 col-sm-1 col-md-1">
                                <img src="${ document.getElementById('imgProfile').src }" class="chat-pic rounded-circle" />
                            </div>
                        </div>`;
            }
        });

        document.getElementById('messages').innerHTML = messageDisplay;
        document.getElementById('messages').scrollTo(0, document.getElementById('messages').scrollHeight);
    });
}

function showChatList() {
    document.getElementById('side-1').classList.remove('d-none', 'd-md-block');
    document.getElementById('side-2').classList.add('d-none');
}

function hideChatList() {
    document.getElementById('side-1').classList.add('d-none', 'd-md-block');
    document.getElementById('side-2').classList.remove('d-none');
}


function SendMessage() {
    if(document.getElementById('txtMessage').value=="")
        return;
    var chatMessage = {
        userId: currentUserKey,
        msg: document.getElementById('txtMessage').value,
        msgType: 'normal',
        dateTime: new Date().toLocaleString()
    };

    firebase.database().ref('chatMessages').child(chatKey).push(chatMessage, function (error) {
        // if (error) alert(error);
        // else {
        //     firebase.database().ref('fcmTokens').child(friend_id).once('value').then(function (data) {
        //         $.ajax({
        //             url: 'https://fcm.googleapis.com/fcm/send',
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 'Authorization': 'key=AIzaSyBXkd3HN8IO3Xa4AFTvqFpo5LXZQ9-Rj7s'
        //             },
        //             data: JSON.stringify({
        //                 'to': data.val().token_id, 'data': { 'message': chatMessage.msg.substring(0, 30) + '...', 'icon': firebase.auth().currentUser.photoURL }
        //             }),
        //             success: function (response) {
        //                 console.log(response);
        //             },
        //             error: function (xhr, status, error) {
        //                 console.log(xhr.error);
        //             }
        //         });
        //    });
            document.getElementById('txtMessage').value = '';
            document.getElementById('txtMessage').focus();
        //}
    });
}

///////////////////////////////////////////////////////////////
//Send image
function ChooseImage() {
    document.getElementById('imageFile').click();
}

function SendImage(event) {
    var file = event.files[0];

    if (!file.type.match("image.*")) {
        alert("Please select image only.");
    }
    else {
        var reader = new FileReader();

        reader.addEventListener("load", function () {
            var chatMessage = {
                userId: currentUserKey,
                msg: reader.result,
                msgType: 'image',
                dateTime: new Date().toLocaleString()
            };

            firebase.database().ref('chatMessages').child(chatKey).push(chatMessage, function (error) {
                if (error) alert(error);
                else {

                    document.getElementById('txtMessage').value = '';
                    document.getElementById('txtMessage').focus();
                }
            });
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
    }
}
///////////////////////////////////////////////////////////////////////
/////////////
function f1()
{
    $("#myInput").val('');
    $("#myInput").trigger('keyup');
}
function LoadChatList() {
    var db = firebase.database().ref('friend_list');
    document.getElementById('lstChat').innerHTML="";
    db.on('value', function (lists) {
        document.getElementById('lstChat').innerHTML="";
                        var cnt=0;
                        var storageRef = firebase.storage().ref();
        lists.forEach(function (data) {
            var lst = data.val();
            var friendKey = '';
            if (lst.friendId === currentUserKey) {
                friendKey = lst.userId;
            }
            else if (lst.userId === currentUserKey) {
                friendKey = lst.friendId;
            }
            
            if (friendKey !== "") {
               
                firebase.database().ref('Users').child(friendKey).once('value', function (data) {
                    if(cnt==0)
                    {
                        document.getElementById('lstChat').innerHTML="";
                    }
                    cnt++;
                    var user = data.val();
                    //document.getElementById('lstChat').innerHTML
                     $("#lstChat").prepend( `<li class="list-group-item list-group-item-action searchc" id="li${cnt}" onclick="StartChat('${data.key}', '${user.Name}', '${user.Image}')">
                            <div class="row">
                                <div class="col-md-2">
                                    <img id="imgch${cnt}" class="friend-pic rounded-circle" />
                                </div>
                                <div class="col-md-10" style="cursor:pointer;">
                                    <div class="name">${user.Name}</div>
                                    <div class="under-name">This is some message text...</div>
                                </div>
                            </div>
                        </li>`);
                        (function(pid) {
                            storageRef.child(user.Image).getDownloadURL().then(function(url) {
                                document.getElementById("imgch" + pid).src = url;
                            }).catch(function(error) {
                                console.log(error);
                            });
                        })(cnt);
                        
                });
                $("#li"+cnt).trigger("click");
            }
        });
        //document.getElementById('lstChat').innerHTML
        $("#lstChat").prepend(`<li class="list-group-item" style="background-color:#f8f8f8;">
    <input type="text" id="myInput" placeholder="Search or new chat" class="form-control form-rounded" onfocusout="f1()" />
</li>`);
    $(document).ready(function() {
        $("#myInput").on("keyup", function() {     
            var value = $(this).val().toLowerCase();
            $("#lstChat .searchc").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
    
    });
    });
  

}
function f2()
{
    $("#myInput2").val('');
    // $("#myInput2").trigger('keyup');
}
function PopulateFriendList() {
    document.getElementById('lstFriend').innerHTML = `<div class="text-center">
                                                         <span class="spinner-border text-primary mt-5" style="width:7rem;height:7rem"></span>
                                                     </div>`;
    var db = firebase.database().ref('Users');
    var lst = '';
    db.on('value', function (users) {
        if (users.hasChildren()) {
            document.getElementById('lstFriend').innerHTML = `<li class="list-group-item" style="background-color:#f8f8f8;">
                            <input type="text" id="myInput2" placeholder="Search or new chat" class="form-control form-rounded" onfocusout="f2()" />
                        </li>`;
        }   
        var cnt=0;    
        var storageRef = firebase.storage().ref();
        users.forEach(function (data) {
            var user = data.val();
   
  
            if (user.Name !== localStorage.getItem("Username")) {
                cnt++;
                document.getElementById('lstFriend').innerHTML += `<li class="list-group-item list-group-item-action search" data-dismiss="modal" onclick="StartChat('${data.key}', '${user.Name}', '${user.Image}')">
                            <div class="row">
                                <div class="col-md-2">
                                    <img id="img${cnt}" class="rounded-circle friend-pic" />
                                </div>
                                <div class="col-md-10" style="cursor:pointer;">
                                    <div class="name">${user.Name}</div>
                                </div>
                            </div>
                        </li>`;
                        (function(pid) {
                            storageRef.child(user.Image).getDownloadURL().then(function(url) {
                                document.getElementById("img" + pid).src = url;
                            }).catch(function(error) {
                                console.log(error);
                            });
                        })(cnt);
                        
                        
            }
        });

        $(document).ready(function() {
            $("#myInput2").on("keyup", function() {     
                var value = $(this).val().toLowerCase();
                $("#lstFriend .search").filter(function() {
                    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
            });
        
        });
    });

}

// function signIn() {
//     var provider = new firebase.auth.GoogleAuthProvider();
//     firebase.auth().signInWithPopup(provider);
// }

// function signOut() {
//     firebase.auth().signOut();
// }

// function onFirebaseStateChanged() {
//     firebase.auth().onAuthStateChanged(onStateChanged);
// }

function load_user() {
        //alert(firebase.auth().currentUser.email + '\n' + firebase.auth().currentUser.displayName);

        var userProfile = { email: '', name: '', photoURL: '' };

        firebase.database().ref().child("Users").child(localStorage.getItem("Username")).on("value",function(snapshot){
            userProfile.email = snapshot.val().Email;
            userProfile.name = snapshot.val().Name;
            currentUserKey = snapshot.val().Name;
           
            document.getElementById('imgProfile').title = userProfile.name;
            document.getElementById('nameProfile').innerHTML = userProfile.name;
            var storageRef = firebase.storage().ref();
            storageRef.child(snapshot.val().Image).getDownloadURL().then(function(url) {
                userProfile.photoURL = url;
                document.getElementById('imgProfile').src = url;
            }).catch(function(error) {
                console.log(error);
            });
            currentUserKey= document.getElementById('nameProfile').innerHTML;
          //  alert(currentUserKey);
            // const messaging = firebase.messaging();

            // navigator.serviceWorker.register('../messaging/firebase-messaging-sw.js')
            //     .then((registration) => {
            //         messaging.useServiceWorker(registration);

            //         // Request permission and get token.....
            //         messaging.requestPermission().then(function () {
            //             return messaging.getToken();
            //         }).then(function (token) {
            //             firebase.database().ref('fcmTokens').child(currentUserKey).set({ token_id: token });
            //         })
            //     });

            document.getElementById('lnkNewChat').classList.remove('disabled');
            LoadChatList();
        });
        
       // userProfile.email = firebase.auth().currentUser.email;
       // userProfile.name = firebase.auth().currentUser.displayName;
       // userProfile.photoURL = firebase.auth().currentUser.photoURL;


        


}

// function onStateChanged(user) {
//     if (user) {
//         //alert(firebase.auth().currentUser.email + '\n' + firebase.auth().currentUser.displayName);

//         var userProfile = { email: '', name: '', photoURL: '' };
//         userProfile.email = firebase.auth().currentUser.email;
//         userProfile.name = firebase.auth().currentUser.displayName;
//         userProfile.photoURL = firebase.auth().currentUser.photoURL;

//         var db = firebase.database().ref('users');
//         var flag = false;
//         db.on('value', function (users) {
//             users.forEach(function (data) {
//                 var user = data.val();
//                 if (user.email === userProfile.email) {
//                     currentUserKey = data.key;
//                     flag = true;
//                 }
//             });

//             if (flag === false) {
//                 firebase.database().ref('users').push(userProfile, callback);
//             }
//             else {
//                 document.getElementById('imgProfile').src = firebase.auth().currentUser.photoURL;
//                 document.getElementById('imgProfile').title = firebase.auth().currentUser.displayName;

//                 document.getElementById('lnkSignIn').style = 'display:none';
//                 document.getElementById('lnkSignOut').style = '';
//             }

//             const messaging = firebase.messaging();

//             navigator.serviceWorker.register('../messaging/firebase-messaging-sw.js')
//                 .then((registration) => {
//                     messaging.useServiceWorker(registration);

//                     // Request permission and get token.....
//                     messaging.requestPermission().then(function () {
//                         return messaging.getToken();
//                     }).then(function (token) {
//                         firebase.database().ref('fcmTokens').child(currentUserKey).set({ token_id: token });
//                     })
//                 });

//             document.getElementById('lnkNewChat').classList.remove('disabled');
//             LoadChatList();
//         });
//     }
//     else {
//         document.getElementById('imgProfile').src = 'images/pp.png';
//         document.getElementById('imgProfile').title = '';

//         document.getElementById('lnkSignIn').style = '';
//         document.getElementById('lnkSignOut').style = 'display:none';

//         document.getElementById('lnkNewChat').classList.add('disabled');
//     }
// }

// function callback(error) {
//     if (error) {
//         alert(error);
//     }
//     else {
//         document.getElementById('imgProfile').src = firebase.auth().currentUser.photoURL;
//         document.getElementById('imgProfile').title = firebase.auth().currentUser.displayName;

//         document.getElementById('lnkSignIn').style = 'display:none';
//         document.getElementById('lnkSignOut').style = '';
//     }
// }

/////////
// Call auth State changed

// onFirebaseStateChanged();