// examples/button.js
// Count button presses

var tessel = require('tessel');
var buttonLib = require('../');
var myButton = buttonLib.use(tessel.port['GPIO'].pin['G3']);

var i = 0;

myButton.on('ready', function () {
  myButton.on('press', function () {
    i++;
    console.log('Press', i);
  });
});
