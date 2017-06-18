"use strict";

var utils = require('./utils');

var crc32_poly = [
  '01DB710640',
  '03b6E20C80',
  '076dc41900',
  '0EDB883200',
  '1DB7106400',
  '3b6E20C800',
  '76dc419000',
  'EDB8832000',
].map(function(v) {
  return Buffer.from(v, 'hex');
});

var crc32_table = new Array(256).fill(0);

for(var i = 0; i < 256; i++) {
  var crc = Buffer.alloc(5, 0);
  crc.writeInt32BE(i, 1);

  for(var j = 0; j < 8; j ++) {
    if(crc[4] & (1 << j)) {
      crc = utils.buffer_xor(crc, crc32_poly[j]);
    }
  }

  crc32_table[i] = crc.slice(0, 4);
}

module.exports.crc32 = {};

module.exports.crc32.calculate = function(buffer) {
  var crc = Buffer.from('00FFFFFFFF', 'hex');
  for(var i = 0; i < buffer.length; i++) {
    var lookup = crc32_table[buffer[i] ^ crc[4]];
    utils.buffer_xor(lookup, crc.slice(0, -1)).copy(crc, 1);
  }
  return utils.buffer_xor(Buffer.alloc(4, 0xFF), crc.slice(1));
}
