
const prediction2 = async (predictionProgressDispatch, id) => {
    console.log("testing 0");
    return await new Promise(resolve => {
        predictionProgressDispatch({
            id: id,
            message: "testing on going",
        });
        
        setTimeout(() => {
            resolve({
                test: "testing 1"
            })
        }, 3000);
    });
}

window.prediction2 = prediction2;
export default prediction2;