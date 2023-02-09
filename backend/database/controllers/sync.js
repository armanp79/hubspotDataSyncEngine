const getHubspotContacts = require('../../api/Hubspot.js');
const db = require('../connection.js');

async function ThrottleRequests(requests, res, timeLimit=5000, requestLimit=2){
    // This function will throttle api calls given as promises in an array. It will send the requestLimit of calls in the time window provided. For example:
    // If the time limit is 5 seconds and the request limit is 2 - This function will send out 2 api calls every 5 seconds.

    var success = 0 // keep track of successful requests
    var errors = 0

    var start = 0
    var end = requestLimit
    var reqsToSend = requests.slice(start,end); // slice requests array to only include the number of calls that can be sent given request limit
    let intervalID = setInterval(() => {
        for (let request of reqsToSend) {
            // send request, then increment success counter
            request().then(data => {success += 1}).catch(err => {errors += 1}) 
        }
        
        if (end > requests.length) { // Once we have reached the end of the requests array, stop interval
            clearInterval(intervalID); // Stop the interval if the condition above holds true
            res.send({totalRequests: requests.length, success: success, errors : errors})
        }

        start = end;
        end = end + requestLimit;
        reqsToSend = requests.slice(start,end);
    }, timeLimit);
}

const sync = (userAccounts, res) => {
    // This function prepares a queue of promises that it then sends to a throttle function
    const requestsArray = [];
    userAccounts.forEach(function(value, name) {
        requestsArray.push(async () => { // Add promise to get contacts to a queue
            getHubspotContacts(value.access_token, (err, data) => {
                if (err) {
                    console.log('Error getting Hubspot Contacts For User ', name, err)
                } else {
                    const date = new Date().toJSON().toString();
                    const query = `UPDATE users SET data = '${JSON.stringify(data)}', timestamp = '${date}' where name = '${name}'`
                    db.query(query, (error, res) =>{ // Once contacts have been retrieved, add them in the database
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