const okta = require('@okta/okta-sdk-nodejs');

const client = new okta.Client({
  orgUrl: 'https://dev-613949.okta.com',
  token: '008A421hKQLXiXMkm2Uy81DE8LdMJe1W3-fGFcHzgi'
});

const config = {
  url: 'https://dev-613949.okta.com',
  issuer: 'https://dev-613949.okta.com/oauth2/default',
  client_id: '0oajlmbbzksJN8t1Z356'
};

module.exports = client;
module.exports.config = config;
