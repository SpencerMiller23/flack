const template = Handlebars.compile(document.querySelector('#sidebar__header').innerHTML);

document.addEventListener('DOMContentLoaded', function() {

  const displayName = localStorage.getItem('displayName');
  const content__displayName = template({'displayName': displayName});
  document.querySelector('.sidebar__container--header').innerHTML += content__displayName;

  load_chat(localStorage.getItem('currentChannel'));

  function load_chat(channel) {
    const request = new XMLHttpRequest();
    request.open('GET', `/${channel}`);
    request.onload = () => {
      const data = JSON.parse(request.responseText);
      data.forEach(add_message);
    };
    request.send();
  }

  function add_message(contents) {
    const div = document.createElement('div');
    div.className += "message__container";
    const p1 = document.createElement('p');
    p1.innerHTML = contents.sender;
    const p2 = document.createElement('p');
    p2.innerHTML = contents.text;
    const p3 = document.createElement('p');
    p3.innerHTML = contents.time;
    div.append(p1);
    div.append(p2);
    div.append(p3);
    document.querySelector('.messenger__container--messages').append(div);
  }

  // Connect to websocket
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  // When connected, configure buttons
  socket.on('connect', () => {

    document.querySelector('#createChannel').onclick = function() {
      var channelNameExists = false;
      var channelName = document.querySelector('.channel__field--name').value;
      var channelList = document.querySelectorAll('.channels__container--item');
      for (var i = 0; i < channelList.length; i++) {
        if (channelList[i].innerHTML == channelName) {
          channelNameExists = true;
        }
      }
      if (!channelNameExists) {
        document.querySelector('.channel__field--name').value = '';
        localStorage.setItem('currentChannel', channelName);
        document.querySelector('.messenger__container--messages').innerHTML = '';
        socket.emit('submit createChannel', {'channelName': channelName});
      } else {
        const p = document.createElement('p');
        p.innerHTML = 'That channel name already exists.';
        document.querySelector('.channel__form--container').append(p);
      }
    };

    document.querySelector('#sendMessage').onclick = function() {
      if (document.querySelector('.messenger__form--field').value != '') {
        var currentChannel = localStorage.getItem('currentChannel');
        var messageText = document.querySelector('.messenger__form--field').value;
        var messageSender = localStorage.getItem('displayName');
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' '+ time;
        socket.emit('submit messageSent', {'currentChannel': currentChannel, 'messageText': messageText, 'messageSender': messageSender, 'dateTime': dateTime});
        document.querySelector('.messenger__form--field').value = '';
      }
    };

  });

  socket.on('announce createChannel', data => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.innerHTML = data.channelName;
    btn.className += "channels__container--item";
    btn.setAttribute('data-channel', data.channelName);
    li.append(btn);
    document.querySelector('.channels__container > ul').append(li);

    document.querySelectorAll('.channels__container--item').forEach(button => {
      button.onclick = () => {
        var currentChannel = button.dataset.channel
        localStorage.setItem('currentChannel', currentChannel);
        document.querySelector('.messenger__container--messages').innerHTML = '';
        load_chat(currentChannel);
      };
    });
  });

  socket.on('announce messageSent', data => {
    if (data.currentChannel == localStorage.getItem('currentChannel')) {
      const div = document.createElement('div');
      div.className += "message__container";
      const p1 = document.createElement('p');
      p1.innerHTML = data.messageSender;
      const p2 = document.createElement('p');
      p2.innerHTML = data.messageText;
      const p3 = document.createElement('p');
      p3.innerHTML = data.dateTime;
      div.append(p1);
      div.append(p2);
      div.append(p3);
      document.querySelector('.messenger__container--messages').append(div);
    }
  });

  document.querySelectorAll('.channels__container--item').forEach(button => {
    button.onclick = () => {
      var currentChannel = button.dataset.channel
      localStorage.setItem('currentChannel', currentChannel);
      document.querySelector('.messenger__container--messages').innerHTML = '';
      document.querySelector('.messenger__container--messages').innerHTML = localStorage.getItem('currentChannel');
      load_chat(currentChannel);
    };
  });

  document.querySelector('.logout').onclick = function() {
    localStorage.clear();
    window.location.href = "/";
  };

});
