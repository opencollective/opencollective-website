const mocks = require('../data/mocks.json');
mocks.backers = mocks.users.filter(u => u.tier === 'backer');

const api = require('../../server/lib/api');
const app = require('../../server/index');
const request = require('supertest-as-promised');
const expect = require('chai').expect;

const sinon = require('sinon');

const stub = sinon.stub(api, 'fetch', (endpoint, options) => {
  const response = {
    status: 200,
    json: () => mocks.backers
  };
  return Promise.resolve(response);
});


describe("api", () => {
  it("calls the api only once if cache on", (done) => {
    const p1 = api.get('/groups/yeoman/users', { cache: 5 });
    const p2 = api.get('/groups/yeoman/users', { cache: 5 });
    const p3 = api.get('/groups/yeoman/users', { cache: 5 });
        
    Promise.all([p1, p2, p3])
      .then((res) => {
        expect(stub.calledOnce).to.be.true;
        done();
      });
  });
  
  it("calls the api every time if cache off", (done) => {
    const p1 = api.get('/groups/yeoman/users');
    const p2 = api.get('/groups/yeoman/users');
    const p3 = api.get('/groups/yeoman/users');
        
    Promise.all([p1, p2, p3])
      .then((res) => {
        expect(stub.calledOnce).to.be.false;
        done();
      });
  });
});
