import aws4 from 'aws4'
import { parseString } from 'xml2js'
import STS from 'aws-sdk/clients/sts';

export const sts = props => {
    const getSTSBeforeFetch = ({expiration, stsStatus, roleArn}) => {
        return new Promise((resolve,reject) => {
            if (new Date(expiration).getTime() < new Date().getTime()) {

                if (stsStatus !== "loading") {
                    props.requestCredsDispatch()
                    
                    // https://hackernoon.com/https-medium-com-amanhimself-converting-a-buffer-to-json-and-utf8-strings-in-nodejs-2150b1e3de57

                    let
                        assumeRoleCreds = JSON.stringify({
                            "type": "Buffer",
                            "data": [123, 34, 97, 99, 99, 101, 115, 115, 75, 101, 121, 73, 100, 34, 58, 34, 65, 75, 73, 65, 74, 89, 85, 70, 51, 75, 73, 55, 85, 78, 71, 79, 72, 50, 82, 81, 34, 44, 34, 115, 101, 99, 114, 101, 116, 65, 99, 99, 101, 115, 115, 75, 101, 121, 34, 58, 34, 109, 43, 107, 67, 111, 88, 97, 74, 108, 84, 54, 49, 111, 50, 115, 117, 85, 79, 98, 102, 65, 116, 119, 78, 77, 49, 100, 101, 122, 70, 103, 70, 80, 72, 56, 110, 121, 83, 76, 71, 34, 125],
                        });

                    assumeRoleCreds = Buffer.from(JSON.parse(assumeRoleCreds).data),
                    assumeRoleCreds = JSON.parse(assumeRoleCreds.toString());

                    let
                        sts = new STS({ credentials: assumeRoleCreds }),
                        params = {
                            Policy: `{"Version":"2012-10-17","Statement":[{"Sid":"747368911612","Effect":"Allow","Action":["cloudwatch:GetMetricData","cloudwatch:ListMetrics"],"Resource":"*"}]}`,
                            RoleArn: roleArn,
                            RoleSessionName: "anomaly-detector"
                        };
        
                    sts.assumeRole(params, (err, {Credentials}) => {
                        if (err) props.errorCredsActionDispatch(err.code) // check docs for code meaning
                        else {

                            let newCreds = (
                                ({
                                    AccessKeyId,
                                    SecretAccessKey,
                                    SessionToken,
                                    Expiration
                                }) => ({
                                    'expiration': Expiration,
                                    'creds': {
                                        'accessKeyId': AccessKeyId,
                                        'secretAccessKey': SecretAccessKey,
                                        'sessionToken': SessionToken,
                                    }
                                })
                            )(Credentials)

                            try {
                                chrome.storage.local.set({stsCreds: JSON.stringify(newCreds)}, () => {});
                            }
                            catch (ex) {}

                            props.responseCredsDispatch(newCreds); // add ajv validator for this response
                        }

                        resolve(false)
                    });    
                }
            } 
            else resolve(true)
        })
    }

    const checkSTSLocalStorage = () => {        
        return new Promise((resolve,reject) => {
            let {credsReducer} = props

            try {
                chrome.storage.local.get(['stsCreds'], result => {
                    if (typeof result.stsCreds === "string") {
                        let cachedCreds = JSON.parse(result.stsCreds);
    
                        if (new Date(cachedCreds.expiration).getTime() > new Date().getTime()) {
                            credsReducer.creds = cachedCreds.creds
                            credsReducer.expiration = cachedCreds.expiration;
                        }
                    }                    
                    getSTSBeforeFetch(credsReducer).then(currentCredsValid => {
                        resolve(currentCredsValid)
                    })
                });
            } catch (ex) { 
                getSTSBeforeFetch(credsReducer).then(currentCredsValid => {
                    resolve(currentCredsValid)
                })
            }
        });
    
    }

    return checkSTSLocalStorage;
}

export const fetchMetricData = (props, abortController) => {
    let {creds} = props.credsReducer

    props.requestMetricsDispatch()

    let                
        opts =
            aws4.sign(
                {
                    host: 'monitoring.eu-west-1.amazonaws.com',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    method: 'POST',
                    path: '/',
                    body: Object.keys(props.metricsReducer.query)
                                .map( k => encodeURIComponent(k) + '=' + encodeURIComponent(props.metricsReducer.query[k]) )
                                .join('&'),
                }, 
                creds
            )

    fetch(
        `https://${opts.headers.Host}${opts.path}`,
        {
            method: "POST",
            headers: {...opts.headers},
            body: opts.body,
            signal: abortController.signal
        }
    )
    .then( response => response.text() )
    .then(xml => {
        parseString(xml, (err, json) => {
            // add ajv validator before sending to store as success!!!!!!!!
            props.responseMetricsDispatch(json);
        })
    })
    .catch(error => { props.errorMetricsActionDispatch(error.message) });
}
