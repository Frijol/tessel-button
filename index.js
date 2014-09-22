var tessel = require('tessel');
var button = tessel.port['GPIO'].pin['G4'];

button.on('change', function buttonPress () {
  console.log('You pressed the button!');
});
