

var socket = io.connect(),
    userEnterDiv = document.getElementById('userEnterDiv'),
    userNameErrorMsg = document.getElementById('userNameErrorMsg'),
    userNameInput = document.getElementById('userNameInput'),
    enterBtn = document.getElementById('enterBtn'),
    mainDiv = document.getElementById('mainDiv'),
    usersDivContainer = document.getElementById('usersDivContainer'),
    displayUsers = document.getElementById('displayUsers'),
    chatDivContainer = document.getElementById("chatDivContainer"),
    chatOutput = document.getElementById('chatOutput'),
    typingOutput = document.getElementById('typingOutput'),
    msg = document.getElementById('messageTextArea'),
    chatBtn = document.getElementById('chatButton');

//add event listener on enter button
enterBtn.addEventListener('click', function(e){
    e.preventDefault();
    socket.emit('new user', userNameInput.value, function(data){
        if(data) {
            userEnterDiv.style.display = "none";
            mainDiv.style.display = "block";
        } else {
            userNameErrorMsg.innerHTML = 'Error: try again';
        }
    });
});

//add event listener on send message button
chatBtn.addEventListener('click', function(e){
    e.preventDefault();
    socket.emit('send message',  msg.value);
    msg.value = ''; //clear msg value
});

//add event listener on msg typing
msg.addEventListener('keypress', function(){
    socket.emit('typing message', userNameInput.value);
});



//Listen on events
socket.on('usernames', function(data){
    displayUsers.innerHTML = '';
    for(var i=0; i<data.length; i++){
      displayUsers.innerHTML += '<p>' + data[i] + '</p>';
  }
});


socket.on('new message', function(data){
    typingOutput.innerHTML="";
    chatOutput.innerHTML += '<p><b>' + data.name +'</b>: '+ data.message + '</p>';
    //keep scroll on bottom
    var xH = chatMessagesContainer.scrollHeight;
    chatMessagesContainer.scrollTo(0, xH);
});

socket.on('typing message', function(data){
    console.log(data + '  typing message')
    typingOutput.innerHTML = '<p><em>' + data + ' is typing message...</em></p>';
});
