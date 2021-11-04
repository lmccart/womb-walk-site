const app = firebase.app();
let code;

firebase.auth().signInAnonymously()
.then(init)
.catch(function(error) { console.log(error); });

function init() {
  db = firebase.firestore(app);
  $('#submit').click(submit);
  $('#left').click(kick);
  $('#right').click(kick);
}

function submit() {
  if (!validate()) return;

  let _code = $('#code').val();
  db.collection('sessions').where('code', '==', _code.toUpperCase()).onSnapshot({}, function(snapshot) {
    if (!snapshot.docs.length) {
      logLine('Your access code has been denied.');
    } else {
      db.collection('sessions').doc(_code).set({listening: true}, {merge: true});
      code = _code;
      loadWalk();
    }
  });
}

function validate() {
  if (!$('#code').val()) alert('Please enter your access code.');
  else return true;
}

function getDate() {
  let s = '';
  for (let i = 0; i < 20; i++) {
    s += '&nbsp;';
  }
  s += dayjs().format('DD.MM.YY HH:mm A');
  return s;
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

function loadWalk() {
  $('#form').hide();
  $('#submit').hide();
  logLine('Your access code has been accepted.');
  logLine('Womb walk is loading.');
  
  console.log(code)
  db.collection(`session-${code}`).where('type', '!=', '').onSnapshot(snapshot => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        logLine(change.doc.data().type);
      }
    });
  });

  setTimeout(startWalk, 1000);
}

function startWalk() {
  $('#left').show();
  $('#right').show();
  // logFS({type: 'start'});
  logLine('You are the imagined baby inside me. I will describe the outside world to you. I will feel for your kicks.<br><br>Sound is activated. Please make sure your volume is on!', true);
}

function kick(e) {
  let dir = e.target.innerHTML.toLowerCase();
  logFS({dir: dir, type: 'kick'});

  // $.get('http://lauren-mccarthy.com'); // hit ngrok endpoint
}

function logFS(data) {
  data.ts = String(new Date().getTime());
  db.collection(`session-${code}`).doc(data.ts).set(data);
}

// listen for updates