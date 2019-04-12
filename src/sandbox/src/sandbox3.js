
const makeRequest = async () => {
    // y = 2 ^ 2 + 1
    tf.tidy(() => {
        // a, b, and one will be cleaned up when the tidy ends.
        const one = tf.scalar(1);
        const a = tf.scalar(2);
        const b = a.square();
    
        console.log('numTensors (in tidy): ' + tf.memory().numTensors);
    
        // The value returned inside the tidy function will return
        // through the tidy, in this case to the variable y.
        return b.add(one);
    });

    console.log('numTensors (outside tidy): ' + tf.memory().numTensors);

    let 
        getJSON = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    "test": "testing"
                });
            }, 100);
        }),
        temp = await getJSON;

    console.log(temp)
    return temp
}

console.log(makeRequest())
