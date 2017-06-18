"use strict";

var assert = require('assert');

module.exports.buffer_xor_inplace = function(buf1, buf2) {
  assert.equal(buf1.length, buf2.length);

  for(var i = 0; i < buf1.length; i++) {
    buf1[i] ^= buf2[i];
  }

  return buf1;
}

module.exports.buffer_xor = function(buf1, buf2) {
  assert.equal(buf1.length, buf2.length);

  var ret = Buffer.from(buf1);
  return module.exports.buffer_xor_inplace(ret, buf2);
}
