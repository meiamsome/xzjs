"use strict";

var assert = require('assert');

module.exports.buffer_xor = function(buf1, buf2) {
  assert.equal(buf1.length, buf2.length);

  return Buffer.from(new Array(buf1.length).fill(0).map(function(_, i) {
    return buf1[i] ^ buf2[i];
  }))
}
