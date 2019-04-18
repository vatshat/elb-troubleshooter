var qs = require('qs')

var 
    string = false ? "CorrelationId=1&PickedNumbers%5B%5D=1&PickedNumbers%5B%5D=2&PickedNumbers%5B%5D=3&PickedNumbers%5B%5D=4"
                : "MetricDataQueries.member.1.MetricStat.Stat=Average&EndTime=2019-04-17T09%3A00%3A00Z&MetricDataQueries.member.1.MetricStat.Metric.MetricName=IncomingBytes&MetricDataQueries.member.1.Id=m1&MetricDataQueries.member.1.ReturnData=true&MetricDataQueries.member.1.MetricStat.Metric.Namespace=AWS%2FLogs&Version=2010-08-01&MetricDataQueries.member.1.MetricStat.Period=300&Action=GetMetricData&MetricDataQueries.member.1.Label=Logs&StartTime=2019-04-17T00%3A00%3A00Z"
    encodedString = qs.parse(string),
    decodedString = qs.stringify(encodedString)

console.log(`decodedString

${decodedString}`)

console.log(`encodedString

${JSON.stringify(encodedString)}`)