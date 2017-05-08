
'use strict';
const expect = require('chai').expect;
const app = require('../app.js');
const alexia = require('alexia');

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

});