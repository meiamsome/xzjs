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


var crc64_vectors = [
  '00000000F4A586351E1B9F4B',
  'F20183319C27668164F1C6',
  '0FAA005554C5D0F7667C1575',
  '00FF5511A63822BE7E0704E6',
  '332255AABBCCDDEEFF701ECEB219A8E5D5',
  '926B555FAA96A9B59F3E4E',
  'FFFFFFFFFFFFFFFF00000000',

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
