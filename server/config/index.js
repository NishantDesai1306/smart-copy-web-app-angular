var config = {
    salt: "$2a$20$IsHu6sxfFDYcVb.8mwIrvO",
    connectionString: null
};

config.connectionString = process.env.ENV === 'production' ? 
    'mongodb://NishantDesai:eternal0blizzard@ds145389.mlab.com:45389/smartcopy' :
    'mongodb://localhost/smart-copy';

module.exports = config;