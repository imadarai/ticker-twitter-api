const express = require ('express');
const app = express();

const { getToken, getTweets, filterTweets } = require('./twitter.js');

app.use(express.static('./ticker_files'));

//////////////////////////////////////////////////
//                                              //
//          This is my Callback Hell            //
//                                              //
// ///////////////////////////////////////////////
app.get('/data.json', (req, res) => {
    // console.log("Request for JSON has been made");
    //1. We need to get a bearerToken from twitter.
    //////////////////////////////////////////////////
    //                                              //
    //        Getting a Token from Twitter          //
    //          WITH A CALLBACK FUNCTION            //
    // ///////////////////////////////////////////////
    getToken(function (err, bearerToken) {
        if (err) {
            console.log("ERR in getToken: ", err);
            return;
        }
        // console.log("bearerToken in index.js!! : ", bearerToken);
        //2. With BearerToken, we ncan ask for tweets.
        //////////////////////////////////////////////////
        //                                              //
        //        Getting a Tweets from Twitter          //
        //          WITH A CALLBACK FUNCTION            //
        // ///////////////////////////////////////////////
        getTweets(bearerToken, function(err, tweets){
            if (err) {
                console.log("ERR in getTweets: ", err);
                return;
            }

            //////////////////////////////////////////////////
            //                                              //
            //   Getting a filtered Tweets from previous    //
            //               CALLBACK FUNCTION              //
            // ///////////////////////////////////////////////
            //3. Once we have the tweets, we can tidy them up (filter them)
            const filteredTweets = filterTweets(tweets);
            //4. Send some JSON back as a response ...
            res.json(filteredTweets);


        });
    });
});
app.listen(8080, ()=> console.log("Twitter is tweeeting"));
