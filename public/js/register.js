const app = firebase.app();

firebase.auth().signInAnonymously()
.then(init)
.catch(function(error) { console.log(error); });

function init() {
  $('#tz').text( Intl.DateTimeFormat().resolvedOptions().timeZone);
  db = firebase.firestore(app);
  db.collection('sessions').where('name', '==', '').onSnapshot({}, function(snapshot) {
    if (!snapshot.docs.length) {
      displaySorry();
    }
    snapshot.docChanges().forEach(function(change) {
      if (change.type === 'added') {
        let start = dayjs(change.doc.data().timestamp.toDate()).format('DD/MM/YY HH:mm A');
        let end = dayjs(change.doc.data().timestamp.toDate().getTime() + 20*60*1000).format('-HH:mm A');
        console.log(start, end)
        if (start.substring(start.length-2, start.length) === end.substring(end.length-2, end.length)) start = start.substring(0, start.length-3);
        $('#time').append(`<option value='${change.doc.data().code}'>${start}${end}</option>`);
      }
    });
  });

  $('#submit').click(submit);
}

function submit() {
  if (!validate()) return;
  let data = {
    name: $('#name').val(),
    email: $('#email').val(),
    phone: $('#phone').val(),
    comment: $('#comment').val() | ''
  }
  let code = $('#time').val();
  let ts = $('#time option:selected').text();
  db.collection('sessions').doc(code).set(data, {merge: true});
  displayConfirm(code, ts);
}

function validate() {
  if (!$('#time').val() || $('#time').val() === '0') alert('Please select a time slot');
  else if (!$('#name').val()) alert('Please enter your name');
  else if (!$('#email').val()) alert('Please enter your email');
  else if (!$('#phone').val()) alert('Please enter your phone');
  else return true;
}

function displaySorry() {
  if (!$('#form').is(':visible')) return;
  $('#form').hide();
  $('#submit').hide();
  $('#sorry').show();
}

function displayConfirm(code, ts) {
  $('#confirm-code').html(code);
  $('#confirm-ts').html(ts);
  $('#form').hide();
  $('#submit').hide();
  $('#back').hide();
  $('#confirm').show();
}