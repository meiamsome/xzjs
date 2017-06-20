"use strict";

var assert = require('assert');

var CHECK = require('../src/check.js');

function hexBuffer(v) {
  return Buffer.from(v, 'hex');
}

describe('checks', function() {
  var vectors = {};

  before(function() {
    vectors[CHECK.NONE.id] = [
      "",
      "0000",
      "1912",
    ].map(hexBuffer);

    // Test vectors from http://reveng.sourceforge.net/crc-catalogue/17plus.htm
    vectors[CHECK.CRC32.id] = [
      '000000001CDF4421',
      'F20183779DAB24',
      '0FAA005587B2C9B6',
      '00FF55111262A032',
      '332255AABBCCDDEEFF3D86AEB0',
      '926B559BA2DE9C',
      'FFFFFFFFFFFFFFFF',
    ].map(hexBuffer);

    // Test vectors from http://reveng.sourceforge.net/crc-catalogue/17plus.htm
    vectors[CHECK.CRC64.id] = [
      '000000004B9F1B1E3586A5F4',
      'F20183C6F1648166279C31',
      '0FAA005575157C66F7D0C554',
      '00FF5511E604077EBE2238A6',
      '332255AABBCCDDEEFFD5E5A819B2CE1E70',
      '926B554E3E9FB5A996AA5F',
      'FFFFFFFF00000000FFFFFFFF',
    ].map(hexBuffer);
  });

  var all_checks = CHECK.as_array();
  all_checks.map(function(check) {
    describe(check.name, function() {
      it('has test vectors', function() {
        assert.ok(vectors.hasOwnProperty(check.id));
        assert.ok(vectors[check.id].length > 0);
      });

      it('computes correct crc', function() {
        vectors[check.id].map(function(vector) {
          var calc = check.calculate(vector.slice(0, -check.size));
          if(check.size === 0) {
            assert.ok(calc.length === 0);
          } else {
            assert.equal(calc.compare(vector.slice(-check.size)), 0);
          }
        });
      });

      it('verifies correct crc', function() {
        vectors[check.id].map(function(vector) {
          assert.ok(check.verify(vector));
        });
      });
    });
  });
});
