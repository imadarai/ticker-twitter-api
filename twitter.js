
const secrets = require('./secrets.json');
const https = require('https');



//////////////////////////////////////////////////
//                                              //
//          GET TOKEN FROM TWITTER API          //
//                                              //
// ///////////////////////////////////////////////
module.exports.getToken = function(callback) {
    // this function gets the bearerToken from twitter
    // this we will write in class :)

    let creds = `${secrets.Key}:${secrets.Secret}`;
    let encodedCreds = Buffer.from(creds).toString('base64');

    const options = {
        host: 'api.twitter.com',
        path: '/oauth2/token',
        method: 'POST',
        headers: {
            Authorization: `Basic ${encodedCreds}`,
            "Content-Type" : "application/x-www-form-urlencoded;charset=UTF-8"
        }
    };
    const cb = function(response) {
        if (response.statusCode != 200) {
            // this means that something has gone wrong....
            // maybe wrong creds?
            callback(response.statusCode);
            return;
        }
        let body = '';
        response.on('data', function(chunk) {
            body += chunk;
        });
        response.on('end', function() {
            // console.log("body when response is finished: ", body);
            let parsedBody = JSON.parse(body);
            // console.log("parsedBody: ", parsedBody.access_token);
            callback(null, parsedBody.access_token);
        });
    };

    const req = https.request(options, cb);

    req.end('grant_type=client_credentials');
};

//////////////////////////////////////////////////
//                                              //
//                  GET TWEEITS                 //
//                                              //
// ///////////////////////////////////////////////
module.exports.getTweets = function(bearerToken, twitterHandle, callback) {
    // this function will use the token to get tweets from twitter.
    // you will write this yourself :)
    // console.log('getTweets', bearerToken );
    const options = {
        method: 'GET',
        host: 'api.twitter.com',
        path: `/1.1/statuses/user_timeline.json?screen_name=${twitterHandle}&tweet_mode=extended`,
        headers: {
            'Authorization': 'Bearer ' + bearerToken
        }
    };
    const requestTweets = https.request( options, ( responseWithTweets ) => {

        if ( responseWithTweets.statusCode != 200 ) {
            callback( responseWithTweets.statusCode );
            return;
        }
        // console.log( `STATUS: ${res.statusCode}` );
        let allTweets = '';
        responseWithTweets.on( 'data', ( chunck ) => {
            allTweets += chunck;
        });
        responseWithTweets.on( 'end', () => {
            allTweets = JSON.parse(allTweets);
            // console.log(allTweets);
            callback( null, allTweets );
        });
    });

    requestTweets.on( 'error', ( err ) => {
        callback( err );
    });

    requestTweets.end();

};


//////////////////////////////////////////////////
//                                              //
//             FILTER TWEETS IN JSON            //
//                                              //
// ///////////////////////////////////////////////
module.exports.filterTweets = function(tweetData) {
    // this function will filter tweets (clean up)/
    // this is after for you to complete :)
    let  tickerTweets = [];

    tweetData = tweetData.filter( function ( tweet ) {
        return tweet.entities.urls.length == 1;
    });

    tweetData.forEach( function ( tweet ) {
        // console.log(tweet);
        let eachTweet = {};

        const title = tweet.full_text.slice( 0,40);

        eachTweet.url = tweet.entities.urls[ 0 ].url;
        eachTweet.title = `${title}...(${tweet.user.name})`;
        tickerTweets.push( eachTweet );
    });

    return tickerTweets;

};
