var config = {
    salt: "$2a$20$IsHu6sxfFDYcVb.8mwIrvO",
    connectionString: null,
    facebookAppId: '1160752057371490',
    facebookAppSecret: '299d929cf96c05d95162074f718d9354',
    googleAppId: '657668041083-3c3km4753dm7tfavhdmru00p51on64i7.apps.googleusercontent.com'
};

config.connectionString = process.env.ENV === 'production' ? 
    'mongodb://NishantDesai:eternal0blizzard@ds145389.mlab.com:45389/smartcopy' :
    'mongodb://localhost/smart-copy';

module.exports = config;