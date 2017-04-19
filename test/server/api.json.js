import mocks from '../data/mocks.json'; // eslint-disable-line
import request from 'supertest';
import sinon from 'sinon';
import { expect } from 'chai';

import api from '../../server/src/lib/api';
import app from '../../server/src/index';

mocks.backers = mocks.users.filter(u => u.tier == 'backer')

describe("api.json.js", () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(api, 'get', () => {
      return Promise.resolve(mocks.users);
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("gets the json of the backers", (done) => {
    request(app)
      .get('/yeoman/backers.json')
      .expect('content-type', 'application/json; charset=utf-8')
      .expect('Access-Control-Allow-Origin', '*')
      .expect((res) => {
        const backers = res.body;
        expect(backers).to.have.length(4);
        expect(backers[0]).to.deep.equal(mocks.backers[0]);
      })
      .expect(200, done);
  });

})
