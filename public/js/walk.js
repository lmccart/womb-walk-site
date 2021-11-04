const app = firebase.app();

firebase.auth().signInAnonymously()
.then(init)
.catch(function(error) { console.log(error); });

function init() {
  db = firebase.firestore(app);
  $('#submit').click(submit);
}

function submit() {
  if (!validate()) return;

  let code = $('#code').val();
  db.collection('sessions').where('code', '==', code).onSnapshot({}, function(snapshot) {
    if (!snapshot.docs.length) {
      logLine('Your access code has been denied.');
    } else {
      db.collection('sessions').doc(code).set({listening: true}, {merge: true});
      startWalk();
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

function logLine(line) {
  $('#log').append(`<div class='line'>-> ${line} <span class='ts'>${getDate()}</span></div>`);
}

function startWalk() {
  $('#form').hide();
  $('#submit').hide();
  $('#left').show();
  $('#right').show();
  logLine('Your access code has been accepted.');
  logLine('Womb walk is loading.');
}
