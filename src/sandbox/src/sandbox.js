import data from './sandbox.json'
import { timeParse } from 'd3-time-format'

var parseTime = timeParse("%Y-%m-%dT%H:%M:%S.%LZ");

data.forEach(d => {
    d.date = parseTime(d.date);
    d.close = +d.close;
});

console.log(data)

parseTime = timeParse("%Y-%m-%dT%H:%M:%S.%LZ");
console.log( parseTime("2015-04-30T22:00:00.000Z")); // Tue Jun 30 2015 00:00:00 GMT-0700 (PDT)
