var qs = require('qs')

<<<<<<< HEAD

let test = (state, action) => {    
    switch (action.type) {

        case 'PREDICTION_START':
            return {
                ...state,
                predictionProgress: {
                    ...state.predictionProgress,
                    [action.id]: ["starting training"]
                }
            }

        case 'PREDICTION_PROGRESS':
            return {
                ...state,
                predictionProgress: {
                    ...state.predictionProgress,
                    [action.predictionProgress.id]: 
                    [
                        ...state.predictionProgress[action.predictionProgress.id],
                        action.predictionProgress.message
                    ],
                }
            }
    }
}

console.log(
    JSON.stringify(
        test({
            predictionProgress: {
                1: ["test1"],
                2: ["test2"]
            }
        }, {
            type: "PREDICTION_START",
            id: 3,
        })
    )
);


console.log(
    JSON.stringify(
        test(
            {
                predictionProgress: {
                    1: ["test1"],
                    2: ["test2"]
            }
            },
            {
                type: "PREDICTION_PROGRESS",
                predictionProgress:
                {
                    id:2,
                    message: "test3",
                }
            }
        )
    )
);

let testing = {
        predictionProgress: {
            1: ["test1"],
            2: ["test2"]
        }
    }

console.log(testing.prediction['3'])
=======
var 
    string = false ? "CorrelationId=1&PickedNumbers%5B%5D=1&PickedNumbers%5B%5D=2&PickedNumbers%5B%5D=3&PickedNumbers%5B%5D=4"
                : "MetricDataQueries.member.1.MetricStat.Stat=Average&EndTime=2019-04-17T09%3A00%3A00Z&MetricDataQueries.member.1.MetricStat.Metric.MetricName=IncomingBytes&MetricDataQueries.member.1.Id=m1&MetricDataQueries.member.1.ReturnData=true&MetricDataQueries.member.1.MetricStat.Metric.Namespace=AWS%2FLogs&Version=2010-08-01&MetricDataQueries.member.1.MetricStat.Period=300&Action=GetMetricData&MetricDataQueries.member.1.Label=Logs&StartTime=2019-04-17T00%3A00%3A00Z"
    encodedString = qs.parse(string),
    decodedString = qs.stringify(encodedString)

console.log(`decodedString

${decodedString}`)

console.log(`encodedString

${JSON.stringify(encodedString)}`)
>>>>>>> 16ea7a26e932f16e7c75a319b1326015f62e1faa
