const hubspot = require('@hubspot/api-client')

const getHubspotContacts = async (token, cb) => {
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