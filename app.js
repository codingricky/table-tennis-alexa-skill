const Alexa = require('alexa-sdk');
const alexia = require('alexia');

const app = alexia.createApp('TableTennis', {shouldEndSessionByDefault: false});
const request = require('request');
const timeout = 10;
const resultsUrl = host + '/api/results';
const host = process.env.HOST;
const apiKey = process.env.API_KEY;

app.onStart(() => {
  return ask_result;
});

app.intent('TableTennis',  (slots, attrs, data, done) => {
    const winner = attrs.Winner || slots.Winner;
    const loser = attrs.Loser || slots.Loser;
    const options = {url: resultsUrl,
                       method: 'POST',
                       headers: {'Authorization' : 'Token ' + apiKey},
                       form: {'winner': winner, 'loser': loser}}

      setTimeout(() => {
        request(options, function(err, response, body) {
          const json = JSON.parse(body);
          const message = json['message'];
          console.log('received response ' + body);
          const complete = 'Results entered,' + ' ' + message;
          console.log('completing');
          done({text: complete, end: true});
        });
      }, timeout);
    }
});

module.exports = app;
