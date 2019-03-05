import fs from "fs"
import path from "path"

if (typeof fetch !== 'function') {
    global.fetch = require('node-fetch');
}

// never remove this logging function 
const consoleLog = (
                    data = {}, 
                    {
                        json = true, fileName = "consoleLog.json", 
                        append = false
                    } = {}
                ) => {
    
    let
        filePath = `${path.join(__dirname)}\\${fileName}`,
        datum = json ? JSON.stringify(data) : data,
        fsCallBack = err => {
            if (err) throw err;
            console.log(`\n ${!append ? "Overwritten" : "Appended"} to ${fileName} \n`);
        };

    if(append) fs.appendFile(filePath, datum, fsCallBack)
    else fs.writeFile(filePath, datum, fsCallBack)

};

export default consoleLog