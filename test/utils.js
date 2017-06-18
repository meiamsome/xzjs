var assert = require('assert');

var utils = require('../src/utils.js');

var test_vectors = [
  ['12345678', '87654321', '95511559'],
  ['1111222244448888', '1248124812481248', '0359306A560C9AC0'],
].map(function(row) {
  return row.map(function(value) {
    return Buffer.from(value, 'hex');
  });
});

describe('utils', function() {
  describe('buffer_xor_inplace', function() {
    it('returns the first buffer', function() {
      var buf1 = Buffer.alloc(0);
      var buf2 = Buffer.alloc(0);
      assert.equal(utils.buffer_xor_inplace(buf1, buf2), buf1);
      assert.notEqual(utils.buffer_xor_inplace(buf1, buf2), buf2);
    });
  });

  describe('buffer_xor', function() {
    it('returns a new buffer', function() {
      var buf1 = Buffer.alloc(0);
      var buf2 = Buffer.alloc(0);
      var buf3 = utils.buffer_xor(buf1, buf2);
      assert.notEqual(buf1, buf3);
      assert.notEqual(buf2, buf3);
    });

    it('requires correct sizes', function() {
      for(var i = 0; i < 10; i++) {
        var buf1 = Buffer.alloc(i);
        var buf2 = Buffer.alloc(i);
        assert.doesNotThrow(function() {
          utils.buffer_xor(buf1, buf2);
        });
        for(var j = i + 1; j < 10; j++) {
          buf2 = Buffer.alloc(j);
          assert.throws(function() {
            utils.buffer_xor(buf1, buf2)
          });
        }
      }
    });

    it('is the identity function with zero buffers', function() {
      test_vectors.map(function(row) {
        row.map(function(buf1) {
          var buf2 = Buffer.alloc(buf1.length, 0);
          assert.equal(utils.buffer_xor(buf1, buf2).compare(buf1), 0);
          assert.equal(utils.buffer_xor(buf2, buf1).compare(buf1), 0);
        });
      });
    });

    it('works for all test vectors', function() {
      test_vectors.map(function(row) {
        assert.equal(utils.buffer_xor(row[0], row[1]).compare(row[2]), 0);
        assert.equal(utils.buffer_xor(row[1], row[0]).compare(row[2]), 0);
      });
    })
  })
})
