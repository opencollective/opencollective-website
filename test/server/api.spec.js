const mocks = require('../data/mocks.json');
mocks.backers = mocks.users.filter(u => u.tier === 'backer');

const api = require('../../server/lib/api');
const expect = require('chai').expect;

const sinon = require('sinon');

describe("api", () => {
  let sandbox, stub;
  before(() => {
    sandbox = sinon.sandbox.create();
    stub = sandbox.stub(api, 'fetch', () => {
      const response = {
        status: 200,
        json: () => mocks.backers
      };
      return Promise.resolve(response);
    });
  });

  after(() => {
    sandbox.restore();
  });

  it("calls the api only once if cache on", (done) => {
    const p1 = api.get('/groups/yeoman/users', { cache: 5 });
    const p2 = api.get('/groups/yeoman/users', { cache: 5 });
    const p3 = api.get('/groups/yeoman/users', { cache: 5 });
        
    Promise.all([p1, p2, p3])
      .then(() => {
        expect(stub.calledOnce).to.be.true;
        done();
      });
  });
  
  it("calls the api every time if cache off", (done) => {
    const p1 = api.get('/groups/yeoman/users');
    const p2 = api.get('/groups/yeoman/users');
    const p3 = api.get('/groups/yeoman/users');
        
    Promise.all([p1, p2, p3])
      .then(() => {
        expect(stub.calledOnce).to.be.false;
        done();
      });
  });
});
