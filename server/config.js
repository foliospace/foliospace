module.exports = {
  okta: {
    url: process.env.OKTA_ORG_URL,
    issuer: process.env.OKTA_ISSUER,
    client_id: process.env.OKTA_CLIENT_ID,
    client_secret: process.env.OKTA_CLIENT_SECRET,
    redirect_uri: process.env.OKTA_REDIRECT_URI || "http://localhost:3000/users/callback",
    secret: process.env.OKTA_SECRET,
    token: process.env.OKTA_TOKEN
  },
  cloudinary: {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
  },
  mysql: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  }
};