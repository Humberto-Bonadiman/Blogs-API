const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../api/app');

const { Users } = require('../models');
const { loginMock } = require('./mock/userMock');

chai.use(chaiHttp);

const { allCategories } = require('./mock/categoriesMock');

const { expect } = chai;

describe('Authentication test in GET "/categories"', () => {
  let chaiHttpResponse;
  let token;

  before(async () => {
    sinon.stub(Users, 'create').resolves(loginMock);
  });

  after(() => {
    Users.create.restore();
  });

  describe('should return the expected data', () => {
    it('with the status code 200', async () => {
      token = await chai.request(app).post('/login').send(loginMock);
      chaiHttpResponse = await chai
        .request(app)
        .get('/categories')
        .set('authorization', token.body.token);
      expect(chaiHttpResponse).to.have.status(200);
    });

    it('should return a list of all categories', async () => {
      token = await chai.request(app).post('/login').send(loginMock);
      chaiHttpResponse = await chai
        .request(app)
        .get('/categories')
        .set('authorization', token.body.token);
      expect(chaiHttpResponse.body[0]).to.include(allCategories[0]);
      expect(chaiHttpResponse.body[0].id).to.equal(1);
      expect(chaiHttpResponse.body[0].name).to.equal('Inovação');
    });

    it('if the token is invalid', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/categories')
        .set('authorization', 'abcd21878181chaa');
      expect(chaiHttpResponse).to.have.status(401);
      expect(chaiHttpResponse.body.message).to.be.equal('Expired or invalid token');
    });

    it('if the token is non-existent', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/categories');
      expect(chaiHttpResponse).to.have.status(401);
      expect(chaiHttpResponse.body.message).to.be.equal('Token not found');
    });
  });
});