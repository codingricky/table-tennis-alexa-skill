const Alexa = require('alexa-sdk');
const _ = require('lodash');
const alexia = require('alexia');

const app = alexia.createApp('TableTennis', {shouldEndSessionByDefault: false});
const request = require('request');
const timeout = 10;

const ask_result = 'What table tennis result do you want to enter?';
const winner_prompt = 'Who won the game?';
const loser_prompt = 'Who lost the game?';

app.onStart(() => {
  return ask_result;
});

const host = process.env.HOST;
const resultsUrl = host + '/api/results';
const lookupUrl = host + '/api/player/'
const apiKey = process.env.API_KEY;


app.intent('TableTennis',  (slots, attrs, data, done) => {
    console.log(slots);
    const winner = attrs.Winner || slots.Winner;
    const loser = attrs.Loser || slots.Loser;
    const times = attrs.Times || slots.Times;
    const newAttrs = {Winner: winner, Loser: loser, Times: times}

    winnerSet = winner && winner.length > 0
    if (!winnerSet) {
      console.log('asking for winner' +  JSON.stringify(newAttrs));
      done({
        text: 'Who won the game?',
        reprompt: 'Who won the game?',
        attrs: newAttrs
      });
    }

    loserSet = loser && loser.length > 0
    if (!loserSet) {
      console.log('asking for loser ' +  JSON.stringify(newAttrs));
      done({
         text: 'Who lost the game?',
          reprompt: 'Who lost the game?',
          attrs: newAttrs
      });
    }

    winnerAndLoserSet = winnerSet && loserSet
    timesSet = times && times > 0
    if (winnerAndLoserSet && !timesSet) {
      console.log('asking for times ' +  JSON.stringify(newAttrs));
      message = 'How many times did ' + winner + ' beat ' + loser + '?';
      done({
         text: message,
          reprompt: message,
          attrs: newAttrs
      });
    }

    if (winnerAndLoserSet && timesSet) {
      console.log('entering results in');
      const options = {url: resultsUrl,
                       method: 'POST',
                       headers: {'Authorization' : 'Token ' + apiKey},
                       form: {'winner': winner, 'loser': loser, 'times': times}}
      console.log(options);

      setTimeout(() => {
        request(options, function(err, response, body) {
          const json = JSON.parse(body);
          const message = json['message'];
          console.log('received response ' + body);
          if (message) {
            if (message.includes('winner')) {
              newAttrs['winner'] = '';
              done({text: winner_prompt,
                    reprompt: winner_prompt,
                    attrs: newAttrs});
            } else if (message.includes('loser')) {
              newAttrs['loser'] = '';
              done({text: loser_prompt,
                    reprompt: loser_prompt,
                    attrs: newAttrs});
            } else {
              const complete = 'Results entered,' + ' ' + message;
              console.log('completing');
              done({text: complete, end: true});
            }
          } else {
            done(errorMessageHash());
          }
        });
      }, timeout);
    }
});

app.intent('TableTennisLookup', (slots, attrs, data, done) => {
    console.log(slots);
    const player = slots.Player;

    if (!player || player.length == 0) {
      const prompt = 'no player found';
      done({
        text: prompt,
        reprompt: prompt,
        end: true,
      });
    } else {
      const options = {url: lookupUrl + player,
                       method: 'GET',
                       headers: {'Authorization' : 'Token ' + apiKey}};
      console.log(options);
      setTimeout(() => {
        request(options, function(err, response, body) {
            console.log(response);
            const json = JSON.parse(body);
            const ranking = json['ranking'];
            const points = json['points'];

            if (ranking && points) {
              if (ranking === 1) {
                message = player + ' is the best player';
              } else {
                message = player + ' has a ranking of ' + ranking + ' and has ' + points + ' points';
              }
              done({text: message, end: true});
            } else {
              done({text: player + ' not found', end: true});
            }
        });
      }, timeout);
    }
});


app.intent('TableTennisBestDay', (slots, attrs, data, done) => {
    console.log(slots);
    const player = slots.Player;

    if (!player || player.length == 0) {
      const prompt = 'no player found';
      done({
        text: prompt,
        reprompt: prompt,
        end: true,
      });
    } else {
      const options = {url: lookupUrl + player,
                       method: 'GET',
                       headers: {'Authorization' : 'Token ' + apiKey}};
      console.log(options);
      setTimeout(() => {
        request(options, function(err, response, body) {
            console.log(response);
            const json = JSON.parse(body);
            const day = json['day'];

            if (day) {
              if (player === 'Ricky') {
                message = 'There is never a good day to play Ricky';
              } else {
                message = 'The best day to play ' + player + ' is ' + day;
              }
              done({text: message, end: true});
            } else {
              done({text: player + ' not found', end: true});
            }
        });
      }, timeout);
    }
});

function errorMessageHash() {
  return {text: 'too hard, I give up', end: true};
}

module.exports = app;
