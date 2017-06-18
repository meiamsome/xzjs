"use strict";

var assert = require('assert');

var crc = require('../src/crc.js');

// Test vectors from http://reveng.sourceforge.net/crc-catalogue/17plus.htm
var crc32_vectors = [
  '000000002144DF1C',
  'F2018324AB9D77',
  '0FAA0055B6C9B287',
  '00FF551132A06212',
  '332255AABBCCDDEEFFB0AE863D',
  '926B559CDEA29B',
  'FFFFFFFFFFFFFFFF',
].map(function(v) {
  return Buffer.from(v, 'hex');
});

describe('crc', function() {
  it('verifies test vectors', function() {
    crc32_vectors.map(function(vector) {
      var calc = crc.crc32.calculate(vector.slice(0, -4));
      assert.equal(calc.compare(vector.slice(-4)), 0);
    });
  });
});
