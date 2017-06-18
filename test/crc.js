"use strict";

var assert = require('assert');

var crc = require('../src/crc.js');

// Test vectors from http://reveng.sourceforge.net/crc-catalogue/17plus.htm
var crc32_vectors = [
  '000000001CDF4421',
  'F20183779DAB24',
  '0FAA005587B2C9B6',
  '00FF55111262A032',
  '332255AABBCCDDEEFF3D86AEB0',
  '926B559BA2DE9C',
  'FFFFFFFFFFFFFFFF',
].map(function(v) {
  return Buffer.from(v, 'hex');
});


var crc64_vectors = [
  '000000004B9F1B1E3586A5F4',
  'F20183C6F1648166279C31',
  '0FAA005575157C66F7D0C554',
  '00FF5511E604077EBE2238A6',
  '332255AABBCCDDEEFFD5E5A819B2CE1E70',
  '926B554E3E9FB5A996AA5F',
  'FFFFFFFF00000000FFFFFFFF',
].map(function(v) {
  return Buffer.from(v, 'hex');
});

describe('crc', function() {
  describe('crc32', function() {
    it('computes correct crc', function() {
      crc32_vectors.map(function(vector) {
        var calc = crc.crc32.calculate(vector.slice(0, -4));
        assert.equal(calc.compare(vector.slice(-4)), 0);
      });
    });

    it('verifies correct crc', function() {
      crc32_vectors.map(function(vector) {
        assert.ok(crc.crc32.verify(vector));
      });
    });
  });

  describe('crc64', function() {
    it('computes correct crc', function() {
      crc64_vectors.map(function(vector) {
        var calc = crc.crc64.calculate(vector.slice(0, -8));
        assert.equal(calc.compare(vector.slice(-8)), 0);
      });
    });

    it('verifies correct crc', function() {
      crc64_vectors.map(function(vector) {
        assert.ok(crc.crc64.verify(vector));
      });
    });
  });
});
