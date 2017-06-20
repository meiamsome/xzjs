"use strict";

var assert = require('assert');

var multibyte = require('../src/multibyte');

describe('multibyte', function() {
  var vectors = [
    // Bytes, Integer, Byte count
    [[0x00, 0x00],       0x00000000, 1],
    [[0x10],             0x00000010, 1],
    [[0x8F, 0x10],       0x0000080F, 2],
    [[0xFF, 0xFF, 0x7F], 0x001FFFFF, 3],
  ]

  it('decodes the correct value', function() {
    vectors.map(function(v) {
      var res = multibyte.decode(v[0]);
      assert.equal(res.value, v[1]);
    });
  })

  it('decodes the correct amount of bytes', function() {
    vectors.map(function(v) {
      var res = multibyte.decode(v[0]);
      assert.equal(res.read_bytes, v[2]);
    });
  })

  it('encodes the correct value', function() {
    vectors.map(function(v) {
      var res = multibyte.encode(v[1]);
      for(var i = 0; i < res.length; i++) {
        assert.equal(res[i], v[0][i]);
      }
    });
  })

  it('encodes the correct amount of bytes', function() {
    vectors.map(function(v) {
      var res = multibyte.encode(v[1]);
      assert.equal(res.length, v[2]);
    });
  })

  it('errors on numbers too large', function() {
    assert.throws(function() {
      multibyte.encode(multibyte.MAX_INT + 1);
    });
    assert.throws(function() {
      multibyte.decode([0xFF, 0xFF, 0xFF, 0xFF, 0x08]);
    });
  });

  it('can encode and decode the largest number', function() {
    var enc = multibyte.encode(multibyte.MAX_INT);
    for(var i = 0; i < enc.length; i++) {
      assert.equal(enc[i], [0xFF, 0xFF, 0xFF, 0xFF, 0x07][i]);
    }
    var dec = multibyte.decode(enc);
    assert.equal(dec.value, multibyte.MAX_INT);
  })
})
