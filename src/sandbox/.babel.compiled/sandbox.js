'use strict';var _sandbox = require('./sandbox.json');var _sandbox2 = _interopRequireDefault(_sandbox);
var _d3TimeFormat = require('d3-time-format');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var parseTime = (0, _d3TimeFormat.timeParse)("%Y-%m-%dT%H:%M:%S.%LZ");

_sandbox2.default.forEach(function (d) {
    d.date = parseTime(d.date);
    d.close = +d.close;
});

console.log(_sandbox2.default);

parseTime = (0, _d3TimeFormat.timeParse)("%Y-%m-%dT%H:%M:%S.%LZ");
console.log(parseTime("2015-04-30T22:00:00.000Z")); // Tue Jun 30 2015 00:00:00 GMT-0700 (PDT)
;var _temp = function () {if (typeof __REACT_HOT_LOADER__ === 'undefined') {return;}__REACT_HOT_LOADER__.register(parseTime, 'parseTime', 'src/sandbox/src/sandbox.js');}();;
//# sourceMappingURL=sandbox.js.map