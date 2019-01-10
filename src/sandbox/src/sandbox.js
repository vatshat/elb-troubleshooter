var makeCRCTable = function () {
    var c;
    var crcTable = [];
    for (var n = 0; n < 256; n++) {
        c = n;
        for (var k = 0; k < 8; k++) {
            c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        crcTable[n] = c;
    }
    return crcTable;
}

var crc_32 = function (str) {
    var crcTable = global.crcTable || (global.crcTable = makeCRCTable());
    var crc = 0 ^ (-1);

    for (var i = 0; i < str.length; i++) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
    }

    return (crc ^ (-1)) >>> 0;
};


var temp = "temp"
temp = {
    "id": 1,
    "requestId": "9568",
    "initiator": "https://play.google.com",
    "timeStamp": "1:54:14 AM 1/10/2019",
    "type": "image",
    "url": "https://lh3.googleusercontent.com/2dRSubz5LD6Pah_rmSWwJ6A7z5PaqjquzdbqX1lC9b1cXW1dIYh-k7jmnIlfHwNXswtu--p1wko=s1200-e100-rwu-v1",
    "statusCode": "N/A",
    "statusLine": "N/A",
    "requestHeaders": [{
        "name": "User-Agent",
        "value": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36"
    }, {
        "name": "Accept",
        "value": "image/webp,image/apng,image/*,*/*;q=0.8"
    }, {
        "name": "X-Client-Data",
        "value": "CJW2yQEIo7bJAQjEtskBCKmdygEIqKPKAQi/p8oBCOynygEI4qjKARj5pcoB"
    }, {
        "name": "Referer",
        "value": "https://play.google.com/music/listen"
    }, {
        "name": "Accept-Encoding",
        "value": "gzip, deflate, br"
    }, {
        "name": "Accept-Language",
        "value": "en,en-GB;q=0.9,en-ZA;q=0.8,af;q=0.7,xh;q=0.6,st;q=0.5"
    }, {
        "name": "Cookie",
        "value": "_ga=GA1.3.133456515.1515000132; NID=141=YKA3_6liFmutJmgBmhponEI-0GEp5O1CHVzPaYJt0MlO8gysaMvTRtTJWNP24ON0o7oFJctFq555F2szeYh2YvR6FH97tZe3gcF6ISaFHh9fCW-UUn2jQoTZL8Bm6eOK"
    }],
    "headerType": "request"
}

temp = [temp]
temp = JSON.stringify(temp)
var crc32 = require('buffer-crc32');
console.log(crc32.unsigned(temp))
console.log(crc_32(temp))