
'use strict';
const expect = require('chai').expect;
const app = require('../app.js');
const alexia = require('alexia');
var nock = require('nock');

describe('action app handler', () => {
  let attrs;

  it('should ask for a winner', (done) => {
    const request = alexia.createIntentRequest('TableTennis', null, attrs);
    app.handle(request, (response) => {
      const responseText = response.response.outputSpeech.text;
      expect(responseText).to.equal('Who won the game?');
      done();
    });
  });

  it('should ask for a loser', (done) => {
  const attrsWithWinner = {
      Winner: 'John'
  };
  const request = alexia.createIntentRequest('TableTennis', null, attrsWithWinner);
  app.handle(request, (response) => {
      const responseText = response.response.outputSpeech.text;
      expect(responseText).to.equal('Who lost the game?');
      done();
    });
  });

  it('should process the result', (done) => {
      const attrsWithWinnerAndLoser = {
          Winner: 'John',
          Loser: 'Bob'
      };
    var scope = nock('https://dtt.herokuapp.com')
        .post('/api/results')
        .reply(200, {
            message:  "John is the winner"
        });

  console.log(process.env.HOST);
  const request = alexia.createIntentRequest('TableTennis', attrsWithWinnerAndLoser, null, false, '');
  app.handle(request, (response) => {
      const responseText = response.response.outputSpeech.text;
      expect(responseText).to.equal('John is the winner');
      scope.done();
      done();
    });
  });

});