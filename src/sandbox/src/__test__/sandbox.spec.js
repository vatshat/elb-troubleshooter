import dataJSON from '../../content/components/tempPage/Data.json'

describe('>>> d3',()=> {

    it('+++ verify timestamp and values array length are the same', () => {
        let metricDataResults = dataJSON["1min_MetricDataResults"][0]

        expect(metricDataResults["Timestamps"].length)
            .toEqual(metricDataResults["Values"].length)
    });

    it('+++ for containers add these tests to test dispatch https://hackernoon.com/unit-testing-redux-connected-components-692fa3c4441c', () => {});
    
    it('+++ Snapshot of d3 difference graph', () => {
        
    });
});