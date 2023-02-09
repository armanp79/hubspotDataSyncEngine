const hubspot = require('@hubspot/api-client')

const getHubspotContacts = async (token, cb) => {
    // Given User Token, this function will get all contacts associated to a Hubspot Account
    const hubspotClient = new hubspot.Client({ accessToken: token , numberOfApiCallRetries: 3})
    await hubspotClient.crm.contacts.getAll()
        .then(data => {
            cb(null, data)
        })
        .catch(err => {
            cb(err)
        })
}

module.exports = getHubspotContacts