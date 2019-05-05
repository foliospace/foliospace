const okta = require('@okta/okta-sdk-nodejs');

const client = new okta.Client({
  orgUrl: '{yourOktaDomain}',
  token: '{yourApiToken}'
});

module.exports = client;