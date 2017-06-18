"use strict";

var utils = require('./utils');

function CRC(poly) {
  this.length = null;
  this.poly = poly;
  this.table = new Array(256).fill(null);
  this._init();
}

CRC.prototype._init = function() {
  var poly_temp = Buffer.from('00' + this.poly, 'hex');
  var poly_arr = new Array(8).fill(null).map(function(_, i) {
    for(var i = 0; i < poly_temp.length - 1; i++) {
      poly_temp[i] = (poly_temp[i] << 1) | (poly_temp[i + 1] >> 7);
    }
    poly_temp[poly_temp.length - 1] <<= 1;
    return Buffer.from(poly_temp);
  });

  this.table = this.table.map(function(_, i) {
    var crc = Buffer.alloc(poly_temp.length, 0);
    crc[crc.length - 1] = i;

    for(var j = 0; j < 8; j ++) {
     if(crc[crc.length - 1] & (1 << j)) {
       utils.buffer_xor_inplace(crc, poly_arr[j]);
     }
    }

    return crc.slice(0, -1);
  });

  this.length = poly_temp.length - 1;

  return this;
}

CRC.prototype.calculate = function(buffer) {
  var crc = Buffer.alloc(this.length + 1, 0xFF);
  crc[0] = 0;
  for(var i of buffer) {
    var lookup = this.table[i ^ crc[this.length]];
    utils.buffer_xor(lookup, crc.slice(0, -1)).copy(crc, 1);
  }
  return utils.buffer_xor_inplace(Buffer.alloc(this.length, 0xFF), crc.slice(1));
}

CRC.prototype.verify = function(buffer) {
  return buffer.slice(-this.length).equals(
    this.calculate(buffer.slice(0, -this.length))
  );
}

module.exports = {
  crc32: new CRC('EDB88320'),
  crc64: new CRC('C96C5795D7870F42'),
}

// var crc32_poly = [
//   '01DB710640',
//   '03b6E20C80',
//   '076dc41900',
//   '0EDB883200',
//   '1DB7106400',
//   '3b6E20C800',
//   '76dc419000',
//   'EDB8832000',
// ].map(function(v) {
//   return Buffer.from(v, 'hex');
// });
//
// var crc32_table = new Array(256).fill(0).map(function(_, i) {
//   var crc = Buffer.alloc(5, 0);
//   crc.writeInt32BE(i, 1);
//
//   for(var j = 0; j < 8; j ++) {
//     if(crc[4] & (1 << j)) {
//       utils.buffer_xor_inplace(crc, crc32_poly[j]);
//     }
//   }
//
//   return crc.slice(0, 4);
// });
//
// module.exports.crc32 = {};
//
// module.exports.crc32.calculate = function(buffer) {
//   var crc = Buffer.from('00FFFFFFFF', 'hex');
//   for(var i of buffer) {
//     var lookup = crc32_table[i ^ crc[4]];
//     utils.buffer_xor(lookup, crc.slice(0, -1)).copy(crc, 1);
//   }
//   return utils.buffer_xor_inplace(Buffer.alloc(4, 0xFF), crc.slice(1));
// }
