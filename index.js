// Any dependencies, notably the event emitter utility
var util = require('util');
var EventEmitter = require('events').EventEmitter;

// Constructor function to instantiate the hardware object
function Button (hardware, callback) {
  var self = this;
  
  // Check to ensure proper hardware has been passed in
  if (typeof hardware.pin != 'number') {
    // Pin not specified
    var error = new Error("Specify a pin, e.g. tessel.port['GPIO'].pin['G3']");
    self.emit('error', error);
    if(callback) {
      callback(error);
    }
  } else if ([16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 34, 35, 36, 37, 38, 39].indexOf(hardware.pin) < 0) {
    // Not a digital pin
    var error = new Error('Specified pin is not a digital pin: ' + hardware.pin);
    self.emit('error', error);
    if(callback) {
      callback(error);
    }
  }

  // Set hardware connection of the object
  self.hardware = hardware;
  
  // Object properties
  self.delay = 500;
  self.ready = true;
  
  // Begin listening for events
  self.hardware.on('fall', function (time, type) {
    if(self.ready) {
      // Emit the appropriate event
      self.emit('press', time);
      
      // Set delay timer
      self.ready = false;
      setTimeout(function () {
        self.ready = true;
      }, self.delay);
    }
  });
  
  // Emit the ready event when everything is set up
  setImmediate(function emitReady() {
    self.emit('ready');
  });
  // Call the callback with object
  if (callback) {
    callback(null, self);
  }
}

// Inherit event emission
util.inherits(Button, EventEmitter);

// Use function which calls the constructor
function use (hardware, callback) {
  return new Button(hardware, callback);
}

// Export functions
exports.Button = Button;
exports.use = use;
