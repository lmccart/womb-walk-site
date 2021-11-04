const peer = new Peer('laurenleemack');

peer.on('open', function(id) {
  console.log('My peer ID is: ' + id);
});

peer.on('connection', function(conn) {
  console.log('connected');

  conn.on('open', function() {
    conn.on('data', function(data) {
      console.log('Received', data);
    });
  });
  getAudio();
});

function getAudio() {
  navigator.mediaDevices.getUserMedia({
    video: false,
    audio: true
  }).then(openStream).catch(e => {
    console.log(e);
  });
}

function openStream(stream) {
  console.log('starting call');
  peer.call('walk1234', stream);
}