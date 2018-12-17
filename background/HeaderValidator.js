import * as Ajv from 'ajv'

export default class ChromeWebRequestValidator {
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
        this.ajv = ajv;
        this.validate = ajv.compile(metadataHeadersSchema);

        let _temp = 0;
        this.setTemp = (temp) => { let returned = _temp; _temp = temp; return returned }
        this.throwIfMissing = () => { throw new Error('Missing parameter'); }
    }
    
    errorRequest(rawHeader, httpRequestError = this.throwIfMissing()) {
        return {
                "frameId": 0,
                "initiator": (
                    rawHeader.initiator ? 
                    rawHeader.initiator : 
                    "Sorry there was an error with this request"
                    ),
                "method": "ERROR",
                "parentFrameId": 0,
                [
                    httpRequestError ? "requestHeaders" : "responseHeaders"]: 
                [{
                    "name": "Error",
                    "value": "Sorry there was an error with this request"
                }],
                "requestId": "Sorry there was an error with this request",
                "tabId": 0,
                "timeStamp": (rawHeader.timeStamp ? rawHeader.timeStamp : Date.now()),
                "type": (rawHeader.type ? rawHeader.type : "other"),
                "url": (rawHeader.url ? rawHeader.url : "https://errors.com")
            }
    }
}