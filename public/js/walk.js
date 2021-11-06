const app = firebase.app();
let code, playerId, player;

firebase.auth().signInAnonymously()
.then(init)
.catch(function(error) { console.log(error); });

function init() {
  db = firebase.firestore(app);

  let hash = window.location.hash.substring(1);
  if (hash) login(hash);

  $('#submit').click(submit);
  $('#left').click(kick);
  $('#right').click(kick);
}

function submit() {
  if (!validate()) return;
  login($('#code').val());
}

function validate() {
  if (!$('#code').val()) alert('Please enter your access code.');
  else return true;
}

function login(_code) {
  db.collection('sessions').doc(_code.toUpperCase()).onSnapshot((doc) => {
    if (!doc || !doc.data()) {
      logLine('Your access code has been denied.');
    } else if (doc.data().ended) {
      end();
    } else {
      if (doc.data().url) {
        playerId = doc.data().url.replace('https://youtu.be/', '');
        initAudio();
      }
      code = _code;
      if ($('#form').is(':visible')) loadWalk();
    }
  });
}


function initAudio() {
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
      videoId: playerId,
      events: { 'onReady': onPlayerReady }
  });
}
function onPlayerReady(event) {
  event.target.playVideo();
  startWalk();
}


function loadWalk() {
  $('h1').html('Womb Walk');
  $('#form').hide();
  $('#submit').hide();
  $('#link-register').hide();
  $('#link-help').show();
  logLine('Your access code has been accepted.');
  logLine('Womb walk is loading.');

  db.collection(`session-${code}`).where('type', '!=', '').onSnapshot(snapshot => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        logLine(change.doc.data().type);
      }
    });
  });
}

function startWalk() {
  $('#left').show();
  $('#right').show();
  logLine('You are the imagined baby inside me. I will describe the outside world to you. I will feel for your kicks.<br><br>Sound is activated. Please make sure your volume is on!', true);
}

function kick(e) {
  let dir = e.target.innerHTML.toLowerCase();
  logFS({dir: dir, type: 'kick'});

  // $.get('http://lauren-mccarthy.com'); // hit ngrok endpoint
}


function logLine(line, direct) {
  let prefix = direct ? '' : '-> '
  let elt = $(`<div class='line ${direct ? "direct" : ""}'>${prefix}${line}</div>`);
  $('#log').append(elt);
  if (!direct) {
    elt.append(`<span class='ts'>${getDate()}</span>`);
  }
  $('#log').scrollTop($('#log')[0].scrollHeight);
}

function logFS(data) {
  data.ts = String(new Date().getTime());
  db.collection(`session-${code}`).doc(data.ts).set(data);
}

function getDate() {
  let s = '';
  for (let i = 0; i < 20; i++) {
    s += '&nbsp;';
  }
  s += dayjs().format('DD.MM.YY HH:mm A');
  return s;
}

function end() {
  $('h1').html('Goodbye');
  $('#log').html('');
  $('#bottom').hide();
  logLine('It was nice sharing this walk with you.', true);
}