var crc = require('./checks/crc')

var types = [
  {
    id: 0,
    name: "NONE",
    size: 0,
    calculate: function(buffer) {
      return Buffer.alloc(0);
    },
    verify: function(buffer) {
      return true;
    },
  },
  {
    id: 1,
    name: "CRC32",
    size: 4,
    calculate: function(b) {
      return crc.crc32.calculate(b);
    },
    verify: function(b) {
      return crc.crc32.verify(b);
    },
  },
  {
    id: 4,
    name: "CRC64",
    size: 8,
    calculate: function(b) {
      return crc.crc64.calculate(b);
    },
    verify: function(b) {
      return crc.crc64.verify(b);
    },
  }
]

var CHECK_TYPE = {}
types.map(function(v) {
  CHECK_TYPE[v.name] = v;
});

CHECK_TYPE.as_array = function() {
  return types;
}

CHECK_TYPE.from_id = function(id) {
  for(var i = 0; i < types.length; i++) {
    if(types[i].id === id) return types[i];
  }
  return null;
}

module.exports = CHECK_TYPE;
