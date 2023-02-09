const express = require('express');
const serverPort = process.env.PORT || 4000;
const clientPort = 3000;
const cors = require('cors');
const app = express();
const retrieveContacts = require('../database/controllers/retrieveContacts.js');
const sync = require('../database/controllers/sync.js');


app.use(
    cors({
        origin: [`http://localhost:${clientPort}`],
       credentials: true,
    })
 );



app.get('/user/info/:name', (req, res) => {
    const name = req.params.name;
    retrieveContacts(name, (err, data) => {
        if (err) {
            res.sendStatus(404)
        } else {
            res.status(200);
            res.send(data);
        }
    });
})


app.post('/sync', (req, res) => {
    const userAccounts = require('./userAccounts.js');
    sync(userAccounts, res)
})


app.listen(serverPort, err => {
    if (err) throw err;
    console.log('Server running on port', serverPort);
})