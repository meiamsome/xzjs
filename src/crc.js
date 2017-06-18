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
  return Buffer.from(new Array(this.length).fill(null).map(function(_, i) {
    return crc[crc.length - 1 - i] ^ 0xFF;
  }));
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
