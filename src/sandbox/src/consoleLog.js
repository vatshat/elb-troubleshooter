import fs from "fs"
import path from "path"

if (typeof fetch !== 'function') {
    global.fetch = require('node-fetch');
}

// never remove this logging function 
const consoleLog = data => {
    fs.writeFile(
        path.join(__dirname) + "\\consoleLog.json",
        JSON.stringify(data),
        (err) => {
            if (err) throw err;
            console.log('Written to consoleLog.json');
        }
    )
};

export default consoleLog