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
  self.delay = 100;
  self.pressed = false;
  
  // Begin listening for events
  self.hardware.on('fall', function () {
    self._press();
  });
  
  self.hardware.on('rise', function () {
    self._release();
  });
  
  // Make sure the events get emitted, even if late
  setInterval(function () {
    if(!self.hardware.read()) {
      self._press();
    } else {
      self._release();
    }
  }, self.delay);
  
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

Button.prototype._press = function () {
  var self = this;
  
  if(!self.pressed) {
    self.emit('press');
    self.pressed = true;
  }
}

Button.prototype._release = function () {
  var self = this;
  
  if(self.pressed) {
    self.emit('release');
    self.pressed = false;
  }
}

// Use function which calls the constructor
function use (hardware, callback) {
  return new Button(hardware, callback);
}

// Export functions
exports.Button = Button;
exports.use = use;
