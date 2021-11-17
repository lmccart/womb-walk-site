const app = firebase.app();

firebase.auth().signInAnonymously()
.then(init)
.catch(function(error) { console.log(error); });

function init() {
  db = firebase.firestore(app);
  db.collection('sessions').where('active', '==', true).onSnapshot({}, function(snapshot) {
    if (snapshot.docs.length) {
      $('#performances').hide();
      $('#start').attr('data-url', `/walk/#${snapshot.docs[0].data().code}-idfa`);
      $('#start').show();
    }


    // snapshot.docChanges().forEach(function(change) {
    //   if (change.type === 'added') {
    //     let start = dayjs(change.doc.data().timestamp.toDate()).format('DD/MM/YY HH:mm A');
    //     let end = dayjs(change.doc.data().timestamp.toDate().getTime() + 20*60*1000).format('-HH:mm A');
    //     console.log(start, end)
    //     if (start.substring(start.length-2, start.length) === end.substring(end.length-2, end.length)) start = start.substring(0, start.length-3);
    //     $('#time').append(`<option value='${change.doc.data().code}'>${start}${end}</option>`);
    //   }
    // });
  });
  $('#start').click(start);
}

function start() {
  console.log('start')
  window.location = $('#start').attr('data-url');
}
