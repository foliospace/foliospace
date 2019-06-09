const okta = require("@okta/okta-sdk-nodejs");
const ExpressOIDC = require("@okta/oidc-middleware").ExpressOIDC;

const oktaConfig = require('./config/okta.config');
// console.log("CHECK OKTA_CONFIG", oktaConfig);

// Define an Okta client so any user management tasks can be performed
const oktaClient = new okta.Client({
  orgUrl: oktaConfig.url,
  token: oktaConfig.token
});

// Define the OpenID Connect client
const oidc = new ExpressOIDC({
  appBaseUrl: "http://localhost:3000",
  issuer: oktaConfig.issuer,
  client_id: oktaConfig.client_id,
  client_secret: oktaConfig.client_secret,
  redirect_uri: oktaConfig.redirect_uri || "http://localhost:3000/users/callback",
  scope: "openid profile",
  routes: {
    login: {
      path: "/users/login"
    },
    callback: {
      path: "/users/callback",
      defaultRedirect: "/dashboard"
    }
  }
});

module.exports = { oidc, oktaClient };
