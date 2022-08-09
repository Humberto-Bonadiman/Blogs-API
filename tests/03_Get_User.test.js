const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../api/app');

const { loginMock, getAllUsers } = require('./mock/userMock');
const { Users } = require('../models');

chai.use(chaiHttp);

const { expect } = chai;

describe('Authentication test in GET "/user"', () => {
  let chaiHttpResponse;
  let token;

  before(async () => {
    sinon.stub(Users, 'create').resolves(loginMock);
  });

  after(() => {
    Users.create.restore();
  });

  describe('Should return the expected data', () => {
    it('should return the status code 200', async () => {
      token = await chai.request(app).post('/login').send(loginMock);
      chaiHttpResponse = await chai
        .request(app)
        .get('/user')
        .set('authorization', token.body.token);
      expect(chaiHttpResponse).to.have.status(200);
    });

    it('should return a list of all users', async () => {
      token = await chai.request(app).post('/login').send(loginMock);
      chaiHttpResponse = await chai
        .request(app)
        .get('/user')
        .set('authorization', token.body.token);
      const firstUser = chaiHttpResponse.body[0];
      expect(chaiHttpResponse.body[0]).to.include(getAllUsers[0]);
      expect(firstUser.displayName).to.equal('Lewis Hamilton');
      expect(firstUser.email).to.equal('lewishamilton@gmail.com');
      expect(firstUser.image).to.equal(
        'https://upload.wikimedia.org/wikipedia/commons/1/18/Lewis_Hamilton_2016_Malaysia_2.jpg'
      );
    });
  });

  describe('Should not return the expected data', () => {
    it('if the token is non-existent', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/user');
      expect(chaiHttpResponse).to.have.status(401);
      expect(chaiHttpResponse.body.message).to.be.equal('Token not found');
    });

    it('if the token is invalid', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/user')
        .set('authorization', 'abcd21878181chaa');
      expect(chaiHttpResponse).to.have.status(401);
      expect(chaiHttpResponse.body.message).to.be.equal('Expired or invalid token');
    });
  });
});
