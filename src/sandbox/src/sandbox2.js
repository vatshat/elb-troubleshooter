import AWS from 'aws-sdk/global';
import STS from 'aws-sdk/clients/sts';

// https://hackernoon.com/https-medium-com-amanhimself-converting-a-buffer-to-json-and-utf8-strings-in-nodejs-2150b1e3de57

let 
    creds = JSON.stringify({
        "type": "Buffer",
        "data": [123, 34, 97, 99, 99, 101, 115, 115, 75, 101, 121, 73, 100, 34, 58, 34, 65, 75, 73, 65, 74, 89, 85, 70, 51, 75, 73, 55, 85, 78, 71, 79, 72, 50, 82, 81, 34, 44, 34, 115, 101, 99, 114, 101, 116, 65, 99, 99, 101, 115, 115, 75, 101, 121, 34, 58, 34, 109, 43, 107, 67, 111, 88, 97, 74, 108, 84, 54, 49, 111, 50, 115, 117, 85, 79, 98, 102, 65, 116, 119, 78, 77, 49, 100, 101, 122, 70, 103, 70, 80, 72, 56, 110, 121, 83, 76, 71, 34, 125],
    });

creds = Buffer.from(JSON.parse(creds).data),
creds = JSON.parse(creds.toString());

console.log(creds);

let
    sts = new STS({
        credentials: creds
    }),
    roleArn = "arn:aws:iam::037559324442:role/anomaly-detector",
    params = {
        Policy: `{"Version":"2012-10-17","Statement":[{"Sid":"747368911612","Effect":"Allow","Action":["cloudwatch:GetMetricData","cloudwatch:ListMetrics"],"Resource":"*"}]}`,
        RoleArn: roleArn,
        RoleSessionName: "anomaly-detector"
    };

sts.assumeRole(params, (err, response) => {
    if (err) console.log(err.code) // check docs for code meaning
    else console.log(response); // add ajv validator for this response
}); 