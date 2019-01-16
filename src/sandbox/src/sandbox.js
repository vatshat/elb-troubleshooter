import data from './sandbox.json'
import { timeParse } from 'd3-time-format'

const temp = data
                .map(d => {
                    d.date = timeParse("%Y-%m-%dT%H:%M:%S.%LZ")(d.date);
                    d.price = +d.price;
                    return d;
                })
                .sort((a,b) => b.date - a.date)

console.log(temp)