// Any dependencies, notably the event emitter utility
var util = require('util');
var EventEmitter = require('events').EventEmitter;

// Constructor function to instantiate the hardware object
function Button (hardware, callback) {
  var self = this;

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
