import consoleLog from './consoleLog'

import { applyMiddleware, createStore } from "redux";
import axios from "axios";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import AWS from 'aws-sdk'

import aws4 from 'aws4'
import { parseString } from 'xml2js'

import tensorflow from './sandbox.json'
// tensorflow()

import util from 'util'

function redux() {    
    const initialState = {
      fetching: false,
      fetched: false,
      users: [],
      error: null,
    };
    
    const reducer = (state=initialState, action) => {
      switch (action.type) {
        case "FETCH_USERS_PENDING": {
          return {...state, fetching: true}
          break;
        }
        case "FETCH_USERS_REJECTED": {
          return {...state, fetching: false, error: action.payload}
          break;
        }
        case "FETCH_USERS_FULFILLED": {
          return {
            ...state,
            fetching: false,
            fetched: true,
            users: action.payload,
          }
          break;
        }
      }
      return state
    }
    
    const middleware = applyMiddleware(promise, thunk)
    const store = createStore(reducer, middleware)
    
    store.dispatch({
      type: "FETCH_USERS",
      payload: axios.get("http://rest.learncode.academy/api/wstern/users")
    })
    .then(() => {
        var temp = store.getState()
        
        consoleLog(util.inspect(temp))
    })
}

// redux()

function getMetricData() {

    let
        currentTime = new Date(),
        query = {
            "MetricDataQueries.member.1.MetricStat.Stat": "Average",
            "EndTime": currentTime.toISOString(),
            "MetricDataQueries.member.1.MetricStat.Metric.MetricName": "IncomingBytes",
            "MetricDataQueries.member.1.Id": "m1",
            "MetricDataQueries.member.1.ReturnData": "true",
            "MetricDataQueries.member.1.MetricStat.Metric.Namespace": "AWS/Logs",
            "Version": "2010-08-01",
            "MetricDataQueries.member.1.MetricStat.Period": 300,
            "Action": "GetMetricData",
            "MetricDataQueries.member.1.Label": "Logs",
            "StartTime": new Date(currentTime.setDate(currentTime.getDate() - 5)).toISOString(),
        },
        cwOpts =
            aws4.sign(
                {
                    host: 'monitoring.eu-west-1.amazonaws.com',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    method: 'POST',
                    path: '/',
                    body: Object.keys(query).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(query[k])).join('&'),
                }
                , {
                    accessKeyId: 'AKIAIBGW3XOTGH37TWMQ',
                    secretAccessKey: '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',
                }
            ),
        fetchAWS = async opts => {
            const 
                rawResponse = await fetch(
                    `https://${opts.headers.Host}${opts.path}`,
                    {
                        method: "POST",
                        headers: {...opts.headers},
                        body: opts.body,
                    }
                ),
                content = await rawResponse.text();

            parseString(content, (err, result) => {
                console.log(JSON.stringify(result, null, 2))
            })
        }

    fetchAWS(cwOpts);        
 }

getMetricData()