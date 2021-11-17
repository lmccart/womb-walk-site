const app = firebase.app();
let code, playerId, player;
let idfa;

firebase.auth().signInAnonymously()
.then(init)
.catch(function(error) { console.log(error); });

function init() {
  db = firebase.firestore(app);

  let hash = window.location.hash.substring(1);
  if (hash) {
    if (hash.includes('-idfa')) {
      hash = hash.split('-')[0];
      $('main').attr('id', 'idfa');
      idfa = true;
    }
    login(hash);
  }

  $('#submit').click(submit);
  $('#left').click(kick);
  $('#right').click(kick);
  $('#link-help').click(help);
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
      events: { 'onReady': onPlayerReady },
      host: `${window.location.protocol}//www.youtube.com`
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
  if (!idfa) $('#link-help').show();
  logLine('Your access code has been accepted.', new Date().getTime());
  logLine('Womb Walk is loading.', new Date().getTime());

  db.collection(`session-${code}`)
    .orderBy('ts', 'asc')
    .onSnapshot(snapshot => {
    snapshot.docChanges().forEach((change) => {
      let data = change.doc.data();
      if (change.type === 'added') {
        if (data.type === 'kick') {
          logLine(`You have kicked ${data.dir}.`, Number(data.ts));
        } else if (data.type === 'help') {
          logLine(`You have sought help.`, Number(data.ts));
        }
      }
    });
  });
}

function startWalk() {
  $('#left').show();
  $('#right').show();
  logLine('You are the imagined baby inside me. I will describe the outside world to you. I will feel for your kicks.<br><br>Sound is activated. Please make sure your volume is on!', false, true);
}

function kick(e) {
  let dir = e.target.innerHTML.toLowerCase();
  logFS({dir: dir, type: 'kick'});
  $.get(`https://womb-walk.ngrok.io/turn/${dir}`, (res) => { console.log(res); });
  $.get(`https://us-central1-womb-walk.cloudfunctions.net/${dir}`, (res) => { console.log(res); });
}


function logLine(line, ts, direct) {
  let prefix = direct ? '' : '-> '
  let elt = $(`<div class='line ${direct ? "direct" : ""}'>${prefix}${line}</div>`);
  let container = '#log';
  if (window.innerWidth >= 768) container = direct ? '#left-column' : '#right-column';
  $(container).append(elt);
  if (!direct) {
    elt.append(`<span class='ts'>${getDate(ts)}</span>`);
  }
  setTimeout(() => {
    $(container).animate({scrollTop: $(container)[0].scrollHeight})
  }, 100);
}

function logFS(data, cb) {
  data.ts = String(new Date().getTime());
  db.collection(`session-${code}`).doc(data.ts).set(data)
  .then(() => {
    if (cb) cb();
  })
}

function getDate(ts) {
  let s = '';
  for (let i = 0; i < 20; i++) {
    s += '&nbsp;';
  }
  s += dayjs(ts).format('HH:mm A DD.MM.YY');
  return s;
}

function help() {
  logFS({type: 'help'}, () => {
    window.location = `/help/#${code}`;
  });
}

function end() {
  $('#form').hide();
  $('iframe').remove();
  $('h1').html('Goodbye');
  $('.line').remove();
  $('#bottom').hide();
  logLine('It was nice sharing this walk with you.', false, true);
}