import * as Ajv from 'ajv'
import fs from "fs";
import path from "path";

class HeaderValidator {
    constructor() {
        const actualHeadersSchema = {
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
        }

        let metadataHeadersSchema = {
            "type":"object",
            "properties": {
                "initiator": { 
                    "type": [ "string", "null" ],
                    "format": "uri"
                },
                "method": {
                    "type": "string",
                    "enum": [
                        "GET", "DELETE", "POST", "HEAD", "PUT", 
                        "CONNECT", "OPTIONS", "TRACE"
                    ]
                },
                "requestHeaders": {
                    "type": "array"
                },
                "type": {
                    "type": "string",
                    "enum": [
                        "main_frame", "sub_frame", "stylesheet", "script", 
                        "image", "font", "object", "xmlhttprequest", "ping", 
                        "csp_report", "media", "websocket", "other"
                    ]
                },
                "responseHeaders": actualHeadersSchema,
                "requestHeaders": actualHeadersSchema
            },
            "required": [
                "frameId", "method", "parentFrameId", "timeStamp", 
                "tabId", "type", "url", "requestId"
            ],
            "additionalProperties": false,
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
        }

        const schemaStaticProperties = {
            "number": ["frameId", "statusCode", "timeStamp", "tabId", "parentFrameId"],
            "string": ["url", "statusLine", "requestId"]
        }

        for ( let typeProperties in schemaStaticProperties ) {    
            schemaStaticProperties[typeProperties].map((property) => {
                metadataHeadersSchema = {
                    ...metadataHeadersSchema,
                    "properties": {
                        ...metadataHeadersSchema.properties,
                        [property]: { "type": typeProperties }
                    },
                }
            });    
        }
        
        let ajv = new Ajv.default({allErrors: true});
        this._ajv = ajv;
        this._validate = ajv.compile(metadataHeadersSchema);
    }
    
    getAJV() {
        return this._ajv
    }

    getValidation(header) {
        return this._validate(header)
    }

    getValidate() {
        return this._validate
    }
}

let requestValidate = new HeaderValidator();

// JSON.parse(fs.readFileSync(path.join(__dirname) + "\\sandbox.json")).map((mockHTTPRequest) => {        
//     if (
//         requestValidate.getValidation(mockHTTPRequest)
//     ) console.log('Valid');
//     else console.log(
//         'Invalid: ' + requestValidate.getAJV().errorsText(
//             requestValidate.getValidate().errors
//             ));
// });

let cond = true;
let obj1 = {
    prop1: 'hello',
    ...(cond ? { prop2: 'world' } : null),
    ...(cond ? { prop2: 'world' } : null)
};
console.log(obj1)

let temp = "test";
obj1 = {
    ...obj1,
    temp,
    ...(obj1.prop3 ? null: { prop3: "again" } ),
    [temp.test ? "yes": "no"]:"conditional key",
    "value": (temp ? "yes":"no")
}
console.log(obj1)
// { prop1: 'hello', prop2: 'world' }

cond = false;
let obj2 = {
    prop1: 'hello',
    ...(cond ? { prop2: 'world' } : null)
};
// { prop1: 'hello' }