const db = require('../connection.js');

const retrieveContacts = (name, callback) => {
    const query = `select data from users where name = '${name}'`;
    db.query(query, (error, res) =>{
        if (error) {
            console.error('Error retrieving data for', name, error);
            callback(error);
        }
        if (res.rows.length) { // if row exists
            callback(null, res.rows[0].data)
        } else { // return empty array
            callback(null, [])
        }
    });
}

module.exports = retrieveContacts;
