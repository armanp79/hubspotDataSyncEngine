const CLIENT_ID = "2e18459d-18fb-448b-b14d-f2fcae68753e"
const CLIENT_SECRET = "9f76c912-61e2-401a-89a3-30728b8d7e7d"
var REFRESH_TOKEN = "898c32e7-6ab5-4376-b8cb-77e4c6711d4b"

const refreshToken = () => {
    const hubspotClient = new hubspot.Client({ accessToken: 'token' })
    hubspotClient.oauth.tokensApi
        .createToken('refresh_token', undefined, undefined, CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN)
        .then((results) => {
            console.log(results)
            return results.accessToken
        })
}
refreshToken()