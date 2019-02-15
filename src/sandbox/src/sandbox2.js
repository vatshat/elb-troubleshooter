import AWS from 'aws-sdk/global';
import STS from 'aws-sdk/clients/sts';

const 
    creds = new AWS.Credentials({
        accessKeyId: "AKIAJCBHMGLCFXZ2NDQA",
        secretAccessKey: "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",
    }),
    sts = new STS({ credentials: creds }),
    params = {
        Policy: `{"Version":"2012-10-17","Statement":[{"Sid":"747368911612","Effect":"Allow","Action":["cloudwatch:GetMetricData","cloudwatch:ListMetrics"],"Resource":"*"}]}`,
        RoleArn: "arn:aws:iam::037559324442:role/anomaly-detector",
        RoleSessionName: "anomaly-detector"
    };

 sts.assumeRole(params, (err, data) => {
     if (err) console.log(err, err.stack)
     else console.log(data); 
 });