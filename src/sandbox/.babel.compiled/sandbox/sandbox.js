"use strict";

var _extends3;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ajv = require("ajv");

var Ajv = _interopRequireWildcard(_ajv);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HeaderValidator = function () {
    function HeaderValidator() {
        _classCallCheck(this, HeaderValidator);

        var actualHeadersSchema = {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string"
                    },
                    "value": {
                        "type": "string"
                    }
                }
            }
        };

        var metadataHeadersSchema = {
            "type": "object",
            "properties": _defineProperty({
                "initiator": {
                    "type": ["string", "null"],
                    "format": "uri"
                },
                "method": {
                    "type": "string",
                    "enum": ["GET", "DELETE", "POST", "HEAD", "PUT", "CONNECT", "OPTIONS", "TRACE"]
                },
                "requestHeaders": {
                    "type": "array"
                },
                "type": {
                    "type": "string",
                    "enum": ["main_frame", "sub_frame", "stylesheet", "script", "image", "font", "object", "xmlhttprequest", "ping", "csp_report", "media", "websocket", "other"]
                },
                "responseHeaders": actualHeadersSchema
            }, "requestHeaders", actualHeadersSchema),
            "required": ["frameId", "method", "parentFrameId", "timeStamp", "tabId", "type", "url", "requestId"],
            "additionalProperties": false
            /*
               // try to add to logic to validator to require certain headers depending if it's a request or response
            
               "if": {
                   "properties" : {
                       "responseHeaders": {
                           "type": "array",
                           "minItems": 0
                       },
                   }
               },
               "then": { "required": [ "requestHeaders" ] },
               "else": { "required": [ "responseHeaders", "statusCode", "statusLine" ] }
            */
        };

        var schemaStaticProperties = {
            "number": ["frameId", "statusCode", "timeStamp", "tabId", "parentFrameId"],
            "string": ["url", "statusLine", "requestId"]
        };

        var _loop = function _loop(typeProperties) {
            schemaStaticProperties[typeProperties].map(function (property) {
                metadataHeadersSchema = _extends({}, metadataHeadersSchema, {
                    "properties": _extends({}, metadataHeadersSchema.properties, _defineProperty({}, property, { "type": typeProperties }))
                });
            });
        };

        for (var typeProperties in schemaStaticProperties) {
            _loop(typeProperties);
        }

        var ajv = new Ajv.default({ allErrors: true });
        this._ajv = ajv;
        this._validate = ajv.compile(metadataHeadersSchema);
    }

    _createClass(HeaderValidator, [{
        key: "getAJV",
        value: function getAJV() {
            return this._ajv;
        }
    }, {
        key: "getValidation",
        value: function getValidation(header) {
            return this._validate(header);
        }
    }, {
        key: "getValidate",
        value: function getValidate() {
            return this._validate;
        }
    }]);

    return HeaderValidator;
}();

var requestValidate = new HeaderValidator();

// JSON.parse(fs.readFileSync(path.join(__dirname) + "\\sandbox.json")).map((mockHTTPRequest) => {        
//     if (
//         requestValidate.getValidation(mockHTTPRequest)
//     ) console.log('Valid');
//     else console.log(
//         'Invalid: ' + requestValidate.getAJV().errorsText(
//             requestValidate.getValidate().errors
//             ));
// });

var cond = true;
var obj1 = _extends({
    prop1: 'hello'
}, cond ? { prop2: 'world' } : null, cond ? { prop2: 'world' } : null);
console.log(obj1);

var temp = "test";
obj1 = _extends({}, obj1, {
    temp: temp
}, obj1.prop3 ? null : { prop3: "again" }, (_extends3 = {}, _defineProperty(_extends3, temp.test ? "yes" : "no", "conditional key"), _defineProperty(_extends3, "value", temp ? "yes" : "no"), _extends3));
console.log(obj1);
// { prop1: 'hello', prop2: 'world' }

cond = false;
var obj2 = _extends({
    prop1: 'hello'
}, cond ? { prop2: 'world' } : null);
// { prop1: 'hello' }

;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(HeaderValidator, "HeaderValidator", "./sandbox/sandbox.js");

    __REACT_HOT_LOADER__.register(requestValidate, "requestValidate", "./sandbox/sandbox.js");

    __REACT_HOT_LOADER__.register(cond, "cond", "./sandbox/sandbox.js");

    __REACT_HOT_LOADER__.register(obj1, "obj1", "./sandbox/sandbox.js");

    __REACT_HOT_LOADER__.register(temp, "temp", "./sandbox/sandbox.js");

    __REACT_HOT_LOADER__.register(obj2, "obj2", "./sandbox/sandbox.js");
}();

;
//# sourceMappingURL=sandbox.js.map