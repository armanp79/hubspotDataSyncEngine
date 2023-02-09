const getHubspotContacts = require('../../api/Hubspot.js');
const db = require('../connection.js');

async function ThrottleRequests(requests, res, timeLimit=5000, requestLimit=2){
    var success = 0
    var errors = 0

    var start = 0
    var end = requestLimit
    var reqsToSend = requests.slice(start,end);
    let intervalID = setInterval(() => {
        for (let request of reqsToSend) {
            request().then(data => {success += 1}).catch(err => {errors += 1})
        }
        
        if (end > requests.length) {
            clearInterval(intervalID); // Stop the interval if the condition holds true
            res.send({totalRequests: requests.length, success: success, errors : errors})
        }

        start = end;
        end = end + requestLimit;
        reqsToSend = requests.slice(start,end);
    }, timeLimit);
}

const sync = (userAccounts, res) => {
    const requestsArray = [];
    userAccounts.forEach(function(value, name) {
        requestsArray.push(async () => {
            getHubspotContacts(value.access_token, (err, data) => {
                if (err) {
                    console.log('Error getting Hubspot Contacts For User ', name, err)
                } else {
                    const date = new Date().toJSON().toString();
                    const query = `UPDATE users SET data = '${JSON.stringify(data)}', timestamp = '${date}' where name = '${name}'`
                    db.query(query, (error, res) =>{
                        if (error) {
                            console.error('Error updating data for', name, error);    
                        }
                        console.log('Successful update for ', name);
                    });
                }
            })
        })
    })  
    ThrottleRequests(requestsArray, res) 
}


module.exports = sync




// Run Data Sync Every Hour:
// setInterval(() => {
//     const res = await fetch(`http://localhost:4000/sync`);
// }, 3600000);