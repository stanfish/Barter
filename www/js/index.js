/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var pictureSource;   // picture source
var destinationType; // sets the format of returned value
var nickName = localStorage.getItem('nickName');
if (!nickName){nickName='Anonymous';}
var uploadFileURI;
var deviceID;
var description='';

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        //$("#my-menu").mmenu();

        $('#nickName').val(nickName);

        $('#nickName').on('change',function(v){
          nickName=$('#nickName').val();
          localStorage.setItem('nickName', nickName);

          var params = {};
          params.deviceID = deviceID;
          params.nickName = nickName;
          console.log('onchange '+deviceID);
          $.ajax({
            method: "POST",
            data: params,
            async: true,
            dataType  : 'json',
            url: "http://138.68.14.64/addUser.php",
            success : function(data){
              console.log(data);
            },
            error:function(data){
              console.log(data);
            }
          });
        });
        switchView(1);
        setupPush();

        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
 /*       var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');*/

        console.log('Received Event: ' + id);
    }
};



 function setupPush() {
   var push = PushNotification.init({
       "android": {
           "senderID": "124161708646"
       },
       "ios": {
         "sound": true,
         "alert": true,
         "badge": true
       },
       "windows": {}
   });

   push.on('registration', function(data) {
       console.log("registration event: " + data.registrationId);
       //document.getElementById('rid').innerHTML=data.registrationId;
       
       var oldRegId = localStorage.getItem('registrationId');
       if (oldRegId !== data.registrationId) {
           // Save new registration ID
           localStorage.setItem('registrationId', data.registrationId);
           // Post registrationId to your app server as the value has changed

          var params = {};
          params.deviceID = deviceID;
          params.nickName = nickName;
          $.ajax({
            method: "POST",
            data: params,
            async: true,
            dataType  : 'json',
            url: "http://138.68.14.64/addUser.php",
            success : function(data){
              console.log('user is added');
            },
            error : function(data){
              console.log(data);
            }
          });
       }
       deviceID=data.registrationId;





//$('#nickName').val(data.registrationId);

/*        $.ajax({
          method: "GET",
          url: "http://138.68.14.64/push.php?id="+data.registrationId,
        });*/
   });

   push.on('error', function(e) {
       console.log("push error = " + e.message);
   });

     push.on('notification', function(data) {
         console.log('notification event');
         navigator.notification.alert(
             data.message,         // message
             null,                 // callback
             data.title,           // title
             'Ok'                  // buttonName
         );

         push.finish(function() {
             console.log('success');
         }, function() {
             console.log('error');
         });
     });

 }



    // Called when a photo is successfully retrieved
    //
    function onPhotoDataSuccess(imageData) {
      // Get image handle
      //
      var smallImage = document.getElementById('smallImage');
      // Unhide image elements
      //
      smallImage.style.display = 'block';
      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      smallImage.src = "data:image/jpeg;base64," + imageData;

      onSuccess(imageData);

    }
    
  // Called when a photo is successfully retrieved
    //
    function onPhotoFileSuccess(imageData) {
      // Get image handle
      console.log(JSON.stringify(imageData));
      
      // Get image handle
      //
      var smallImage = document.getElementById('smallImage');
      // Unhide image elements
      //
      smallImage.style.display = 'block';
      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      smallImage.src = imageData;

    }
    // Called when a photo is successfully retrieved
    //
    function onPhotoURISuccess(imageURI) {
      // Uncomment to view the image file URI 
      // console.log(imageURI);
      // Get image handle
      //
      var largeImage = document.getElementById('largeImage');
      // Unhide image elements
      //
      largeImage.style.display = 'block';
      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      largeImage.src = imageURI;
    }
    // A button will call this function
    //
    function capturePhotoWithData() {
      // Take picture using device camera and retrieve image as base64-encoded string
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50 });
    }
    function capturePhotoWithFile() {
        navigator.camera.getPicture(onPhotoFileSuccess, onFail, { quality: 50, destinationType: Camera.DestinationType.FILE_URI });
    }

    // A button will call this function
    //
    function getPhoto(source) {
      // Retrieve image file location from specified source
/*      navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
        destinationType: destinationType.FILE_URI,
        sourceType: source });*/



  console.log('getPhoto');
            navigator.camera.getPicture(onCapturePhoto, onFail, { quality: 50, 
        destinationType: destinationType.FILE_URI,
        sourceType: source });


    }

function onFail(message) {
    alert('Failed because: ' + message);
}

function onSuccess(imageData) {
  $.post( "http://138.68.14.64/up.php", {data: imageData}, function(data) {
    console.log(data);
    alert("Image uploaded!");
  });
}

function clearCache() {
    navigator.camera.cleanup();
}
 
var retries = 0;
function onCapturePhoto(fileURI) {
    var win = function (r) {
        console.log(r);
        clearCache();
        retries = 0;
        alert('Done! '+r.response);
    }
    var fail = function (error) {
        if (retries == 0) {
            retries ++
            setTimeout(function() {
                onCapturePhoto(fileURI)
            }, 1000)
        } else {
            retries = 0;
            clearCache();
            alert('Ups. Something wrong happens! Please try again!');
        }
    }
 
    // Get image handle
    //
    var smallImage = document.getElementById('smallImage');
    // Unhide image elements
    //
    smallImage.style.display = 'block';
    // Show the captured photo
    // The inline CSS rules are used to resize the image
    //
    smallImage.src = fileURI;

    var uploadBlock = document.getElementById('uploadBlock');
    // Unhide image elements
    //
    uploadBlock.style.display = 'block';
    uploadFileURI=fileURI;
}

function resetLayout(){
    var smallImage = document.getElementById('smallImage');
    var uploadBlock = document.getElementById('uploadBlock');
    smallImage.style.display = 'none';
    uploadBlock.style.display = 'none';
}


function uploadPhoto(){
    console.log('uploadFileURI='+uploadFileURI);
    var win = function (r) {
        console.log(r);
        clearCache();
        retries = 0;
        alert('Done! '+r.response);
        resetLayout();
    }
    var fail = function (error) {
        if (retries == 0) {
            retries ++
            setTimeout(function() {
                uploadPhoto();
            }, 1000)
        } else {
            retries = 0;
            clearCache();
            alert('Ups. Something wrong happens! Please try again!');
        }
    }

    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = uploadFileURI.substr(uploadFileURI.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";

    var params = {};
    params.deviceID = deviceID;
    params.nickName = nickName;
    params.description = $('#description').val();
    options.params = params;

    var ft = new FileTransfer();
    ft.upload(uploadFileURI, encodeURI("http://138.68.14.64/up.php"), win, fail, options);
}
 
function capturePhoto() {
    navigator.camera.getPicture(onCapturePhoto, onFail, {
        quality: 40,
        destinationType: destinationType.FILE_URI
    });
}




//layout


function findMatch(itemID){
  console.log('findMatch itemID='+itemID+' deviceiD='+deviceID);
  var params = {};
  params.deviceID = deviceID;
  params.itemID = itemID;
  $.ajax({
    method: "POST",
    data: params,
    async: true,
    dataType  : 'json',
    url: "http://138.68.14.64/findMatch.php",
    success: function(data){
      console.log('success'+data.success);
      if (data.success=='true'){
        alert('Success: check your inbox');
      } else {
        alert('Cannot find any match');
      }

    },
    error:function(data){
      console.log('error:'+data.responseText);
    }
  });
}

function showUploadedItems(){
  $('#uploadedList').empty();
  var params = {};
  params.deviceID = deviceID;
  $.ajax({
    method: "POST",
    data: params,
    async: true,
    dataType  : 'json',
    url: "http://138.68.14.64/getItems.php",
    success: function(data){
      var uploadListDiv='';
      for(var i=0;i<data.length;i++){
        uploadListDiv+='<li><div class="item-content"><div class="item-inner"><img style="width:60px;height:60px;" src="http://138.68.14.64/'+data[i].FILEPATH+'"><div class="item-title">'+data[i].DESCRIPTION+'</div><button onclick="findMatch(\''+data[i].ITEM_ID+'\');" class="findMatchButton" iid="'+data[i].ITEM_ID+'">Find Match</button></div></div></li>';


        console.log( data[i].DESCRIPTION + ": " + data[i].FILEPATH+ ": " + data[i].ITEM_ID );
      }

      $('#uploadedList').html(uploadListDiv);

    }
  });
}


function switchView(num){
  for (var i =1;  i <= 4; i++) {
    if (i!=num){
      $('#view'+i+'Page').hide();
      $('.tab-icon'+i).removeClass('active');
    } else {
      $('#view'+i+'Page').show();
      $('.tab-icon'+i).addClass('active');
      if (i==3){
        showUploadedItems();
      }
    }
  }
}


/*

$('#smallImage').show();
$('#uploadBlock').show();*/