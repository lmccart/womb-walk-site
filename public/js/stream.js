let code;
const app = firebase.app();
firebase.auth().signInAnonymously()
.then(init)
.catch(function(error) { console.log(error); });

function init() {
  db = firebase.firestore(app);
  db.collection('sessions').where('code', '!=', '').onSnapshot({}, function(snapshot) {
    snapshot.docChanges().forEach(function(change) {
      if (change.type === 'added') {
        $('#sessions').append(`<option value='${change.doc.data().code}' data-url='${change.doc.data().url}'>${change.doc.data().timestamp.toDate()} - ${change.doc.data().name}</option>`);
      }
    });
  });
  $('#sessions').on('change', update);
  $('#submit').click(submit);
  $('#end').click(end);
}

function update(e) {
  let url = $('#sessions').find(':selected')[0].dataset.url;
  if (url) $('#url').val(url);
}

function validate() {
  if (!$('#url').val() || !$('#sessions').val()) alert('Please enter your url.');
  else return true;
}

function submit() {
  console.log('submi')
  if (!validate()) return;
  let url = $('#url').val();
  code = $('#sessions').val();
  db.collection('sessions').doc(code).set({url: url, active: true}, {merge: true}).then(() => {
    start();
  });
}

function start() {
  $('#info').hide();
  $('#submit').hide();
  $('#end').show();

  db.collection(`session-${code}`).where('type', '!=', '').onSnapshot(snapshot => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        logLine(change.doc.data().type);
      }
    });
  });
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

function getDate() {
  let s = '';
  for (let i = 0; i < 20; i++) {
    s += '&nbsp;';
  }
  s += dayjs().format('DD.MM.YY HH:mm A');
  return s;
}

function end() {
  db.collection('sessions').doc(code).set({ended: true, active: false}, {merge: true}).then(() => {
    $('#end').hide();
    $('#success').show();
  });
}

