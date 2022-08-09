const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../api/app');

const { loginMock } = require('./mock/userMock');
const { Users } = require('../models');

chai.use(chaiHttp);

const { expect } = chai;

describe('Authentication test in GET "/user/:id"', () => {
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
        .get('/user/1')
        .set('authorization', token.body.token);
      expect(chaiHttpResponse).to.have.status(200);
    });

    it('should return a list of all users', async () => {
      token = await chai.request(app).post('/login').send(loginMock);
      chaiHttpResponse = await chai
        .request(app)
        .get('/user/1')
        .set('authorization', token.body.token);
      const user = chaiHttpResponse.body;
      expect(user).to.include({
        id: 1,
        displayName: "Lewis Hamilton",
        email: "lewishamilton@gmail.com",
        image: "https://upload.wikimedia.org/wikipedia/commons/1/18/Lewis_Hamilton_2016_Malaysia_2.jpg"
      });
      expect(user.displayName).to.equal('Lewis Hamilton');
      expect(user.email).to.equal('lewishamilton@gmail.com');
      expect(user.image).to.equal(
        'https://upload.wikimedia.org/wikipedia/commons/1/18/Lewis_Hamilton_2016_Malaysia_2.jpg'
      );
    });
  });

  describe('Should not return the expected data', () => {
    it('if the user is non-existent', async () => {
      token = await chai.request(app).post('/login').send(loginMock);
      chaiHttpResponse = await chai
        .request(app)
        .get('/user/10000')
        .set('authorization', token.body.token);
      expect(chaiHttpResponse).to.have.status(404);
      expect(chaiHttpResponse.body.message).to.be.equal('User does not exist');
    });

    it('if the token is non-existent', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/user/1');
      expect(chaiHttpResponse).to.have.status(401);
      expect(chaiHttpResponse.body.message).to.be.equal('Token not found');
    });

    it('if the token is invalid', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/user/1')
        .set('authorization', 'abcd21878181chaa');
      expect(chaiHttpResponse).to.have.status(401);
      expect(chaiHttpResponse.body.message).to.be.equal('Expired or invalid token');
    });
  });
});
