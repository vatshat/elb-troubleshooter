
const prediction2 = async () => {
    console.log("testing 0");
    let test = await new Promise(resolve => {
        setTimeout(() => {
            resolve({
                test: "testing 1"
            })
        }, 3000);
    });
    console.log(test);
}

window.prediction2 = prediction2;
export default prediction2;