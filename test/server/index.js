import request from 'supertest';
import nock from 'nock';
import config from 'config';
import { expect } from 'chai';

import app from '../../server';

describe('server', () => {
  const group = {
    name: 'Women who code Austin'
  };

  afterEach(() => nock.cleanAll());

  it('`wwcode-austin123@` should not match the regex route', done => {
    request(app)
      .get('/wwcode-austin123@!!')
      .expect(200)
      .end((err, res) => {
        expect(res.text).to.contain('Error 404');
        done();
      });
  });

  it('`wwcode-austin` should match the regex route', done => {
    const apiCall = nock('http://localhost:3060')
      .get(`/groups/wwcode-austin/?api_key=${config.apiKey}`)
      .reply(200, group);

    request(app)
      .get('/wwcode-austin')
      .expect(200)
      .end((err, res) => {
        apiCall.done(); // make sure the API get called
        expect(res.text).to.contain(group.name);
        expect(res.text).to.not.contain('Error');
        done();
      });
  });

  it('should return a error page if fetching the group fails', done => {
    const error = {
      code: 403,
      message: 'Unauthorized',
      type: 'forbidden'
    };

    const apiCall = nock('http://localhost:3060')
      .get(`/groups/wwcode/?api_key=${config.apiKey}`)
      .reply(403, { error });

    request(app)
      .get('/wwcode')
      .expect(200)
      .end((err, res) => {
        apiCall.done();
        expect(res.text).to.contain('Error');
        expect(res.text).to.contain(error.message);
        done();
      });
  });
});