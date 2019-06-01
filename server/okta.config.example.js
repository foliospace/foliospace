module.exports.config = {
  url: "OKTA_ORG_URL",
  issuer: 'https://OKTA_ORG_URL/oauth2/default',
  client_id: 'CLIENT_ID',
  client_secret: "CLIENT_SECRET",
  redirect_uri: "http://localhost:3000/authorization-code/callback",
  secret: "UNIQUE_STRING",
  token: "OKTA_TOKEN"
};