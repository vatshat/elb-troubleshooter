let temp = [
    ...(false && ["testings1", "testings2"]),
    "testing3"
]


var path = require('path');

console.log(path.resolve(__dirname, '../src/'))