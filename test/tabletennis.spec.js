
'use strict';
const expect = require('chai').expect;
const app = require('../app.js');
const alexia = require('alexia');
var nock = require('nock');
const tableTennisIntent = 'TableTennis';
const host = process.env.HOST;
const resultsPath = '/api/results';

describe(tableTennisIntent, () => {
  it('should ask for a winner', (done) => {
    const request = alexia.createIntentRequest(tableTennisIntent, null, null);
    app.handle(request, (response) => {
      const responseText = response.response.outputSpeech.text;
      expect(responseText).to.equal('Who won the game?');
      done();
    });
  });

  it('should ask for a loser', (done) => {
    const attrs = {
        Winner: 'John'
    };
    const request = alexia.createIntentRequest(tableTennisIntent, null, attrs);
    app.handle(request, (response) => {
        const responseText = response.response.outputSpeech.text;
        expect(responseText).to.equal('Who lost the game?');
        done();
      });
  });

  it('should ask how many times', (done) => {
    const attrs = {
        Winner: 'John',
        Loser: 'Bob'
    };
    const request = alexia.createIntentRequest(tableTennisIntent, null, attrs);
    app.handle(request, (response) => {
      const responseText = response.response.outputSpeech.text;
      expect(responseText).to.equal('How many times did John beat Bob?');
      done();
    });
  });

  it('should process the result', (done) => {
    const attrs = {
        Winner: 'John',
        Loser: 'Bob',
        Times: 1
    };
    const request = alexia.createIntentRequest(tableTennisIntent, null, attrs);
    var scope = nock(host)
        .post(resultsPath)
        .reply(200, {
            message:  "John won the match"
        });

    app.handle(request, (response) => {
      scope.done();
      const responseText = response.response.outputSpeech.text;
      expect(responseText).to.equal('Results entered, John won the match');
      done();
    });
  });

});
