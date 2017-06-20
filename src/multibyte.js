"use strict";

var multibyte = {}

// This is the largest number that bitwise operators can work on successfully.
multibyte.MAX_INT = 0x7FFFFFFF;

multibyte.decode = function(buffer) {
  var value = 0;
  var byte_count = 0;
  for(; buffer[byte_count] & 0x80; byte_count++) {
    if(byte_count == 4) {
      throw new Error("Cannot represent a number requested.")
    }
    value |= (buffer[byte_count] & 0x7F) << (byte_count * 7);
  }

  if(byte_count == 4 && buffer[byte_count] > 0x07) {
    throw new Error("Cannot represent a number requested.")
  }
  value |= buffer[byte_count] << (byte_count * 7);

  return {
    value: value,
    read_bytes: byte_count + 1,
  };
}

multibyte.encode = function(number) {
  if(number > multibyte.MAX_INT) throw new Error("Cannot encode number (Too large)");
  var res = [];
  while(number >= 0x80) {
    res.push(number & 0x7F | 0x80);
    number >>= 7;
  }
  res.push(number & 0x7F);
  return res;
}

module.exports = multibyte;
