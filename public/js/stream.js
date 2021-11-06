const app = firebase.app();
firebase.auth().signInAnonymously()
.then(init)
.catch(function(error) { console.log(error); });

function init() {
  db = firebase.firestore(app);
  db.collection('sessions').where('code', '!=', '').onSnapshot({}, function(snapshot) {
    snapshot.docChanges().forEach(function(change) {
      if (change.type === 'added') {
        $('#sessions').append(`<option value='${change.doc.data().code}'>${change.doc.data().timestamp.toDate()} - ${change.doc.data().name}</option>`);
      }
    });
  });
  $('#submit').click(submit);
}

function submit() {
  console.log('submi')
  if (!validate()) return;
  let url = $('#url').val();
  let code = $('#sessions').val();
  db.collection('sessions').doc(code).set({url: url}, {merge: true}).then(() => {
    $('#info').hide();
    $('#bottom').hide();
    $('#success').show();
  });
}


function validate() {
  if (!$('#url').val() || !$('#sessions').val()) alert('Please enter your url.');
  else return true;
}