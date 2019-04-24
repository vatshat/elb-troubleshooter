

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