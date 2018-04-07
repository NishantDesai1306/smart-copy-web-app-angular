var config = {
    salt: "$2a$20$IsHu6sxfFDYcVb.8mwIrvO",
    connectionString: null,
    facebookAppId: process.env.FACEBOOK_APP_ID,
    facebookAppSecret: process.env.FACEBOOK_APP_SECRET,
    googleAppId: process.env.GOOGLE_APP_ID
};
    
config.connectionString = process.env.CONNECTION_STRING;

module.exports = config;