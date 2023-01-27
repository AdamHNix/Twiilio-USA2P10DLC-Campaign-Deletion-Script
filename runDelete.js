require('dotenv').config()
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fs = require('fs');
const client = require('twilio')(accountSid, authToken);
//for csv parsing
const csv = require('papaparse');
//add csv directory here
const csvFile = fs.createReadStream("startersTest.csv");
//List number of rows to be parsed
const rows = 3

//call needed to delete campaign on a given MG SID
function deleteStarter(SID){
    client.messaging.v1.services(SID)
        .usAppToPerson('QE2c6890da8086d771620e9b13fadeba0b')
        .remove()
}

async function runParse(file){
    var element = 0;
    csv.parse(file, {
    delimiter: ',',
    preview: rows,
    header: false,
    complete: 
        function(results) {
            while(element < rows){
                var MGSID = (results.data[element][0])
                deleteStarter(MGSID);
                element++;
                //delay function
                setTimeout(() => {
                }, "100")
            }
        }
    })
}

runParse(csvFile);