const okta = require('@okta/okta-sdk-nodejs');

const client = new okta.Client({
  orgUrl: 'https://dev-613949.okta.com',
  token: '008A421hKQLXiXMkm2Uy81DE8LdMJe1W3-fGFcHzgi'
});

module.exports = client;