const express = require ('express');
const app = express();
const { getToken, getTweets, filterTweets } = require('./twitter.js');
const { promisify } = require("util");

app.use(express.static('./ticker_files'));


let fnToken = promisify(getToken);
let fnTweets = promisify(getTweets);
// let fnFilteredTweets = promisify(filteredTweets);

app.get('/data.json', (req, res) => {

    fnToken()
        .then( token => {
            return Promise.all([
                fnTweets(token, "nytimes"),
                fnTweets(token, "theonion"),
                fnTweets(token, "bbcworld")
            ]);
        })
        .then( tweets => {
            let nyTimes = tweets[0];
            let theOnion = tweets[1];
            let theBbc = tweets[2];
            let mergedResults = nyTimes.concat(theOnion, theBbc);
            let sorted = mergedResults.sort((a, b) => {
                // b - a : reverse chronological order (new -> old)
                // a - b : chronological order (old -> new)
                return new Date(b.created_at) - new Date(a.created_at);
            });
            res.json(filterTweets(sorted));
        })
        .catch(err => {
            console.log('err in Promises: ', err);
            res.sendStatus(500);
        });
});

app.listen(8080, ()=> console.log("Twitter is tweeeting"));
