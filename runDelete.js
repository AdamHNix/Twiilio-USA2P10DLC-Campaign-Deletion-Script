require('dotenv').config()
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const apiKey = process.env.TWILIO_API_KEY;
const apiSecret = process.env.TWILIO_API_SECRET;
const fs = require('fs');
const client = require('twilio')(apiKey, apiSecret, { accountSid: accountSid });
//for csv parsing
const csv = require('papaparse');
//add csv directory here
const csvFile = fs.createReadStream("startersTest.csv");
//List number of rows to be parsed
const rows = 3
let element = 0;
//seconds between each call
const timeOutSeconds = 1;

//call needed to delete campaign on a given MG SID
function deleteStarter(SID){
    client.messaging.v1.services(SID)
        .usAppToPerson('QE2c6890da8086d771620e9b13fadeba0b')
        .remove()
        .catch( e =>{
            console.log (`error in delete for ${SID}: `, e)
        })}

async function sleep(seconds){
    return new Promise(resolve => { setTimeout(resolve, seconds * 1000)})
} 


async function runParse(file){
    csv.parse(file, {
    delimiter: ',',
    preview: rows,
    header: false,
    complete: 
        async function(results) {
            while(element < rows){
                await sleep(timeOutSeconds)
                var MGSID = (results.data[element][0])
                //run Twilio deletion
                try{deleteStarter(MGSID)}catch(e){
                    console.log("Error: ", e)
                }
                element++;
                //delay function needed due to recommendation of only 10 calls per second
            }
        }
    })
}

runParse(csvFile);