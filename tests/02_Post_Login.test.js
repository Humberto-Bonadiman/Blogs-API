const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../api/app');

const { loginMock } = require('./mock/userMock');
const { Users } = require('../models');

chai.use(chaiHttp);

const { expect } = chai;

describe('Authentication test in POST "/login"', () => {
  let chaiHttpResponse;
  const userLogin = {
    email: 'lewishamilton@gmail.com',
    password: '123456',
  };
  let errorLogin = {};

  before(async () => {
    sinon.stub(Users, 'create').resolves(loginMock);
  });

  after(() => {
    Users.create.restore();
  });

  describe('Should return the expected data', () => {
    it('should return the status code 200', async() => {
      chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send(userLogin);
      expect(chaiHttpResponse).to.have.status(200);
    });

    it('should return the key token', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send(userLogin);
      expect(chaiHttpResponse.body).to.have.property('token');
    });
  });

  describe('Should not return the expected data', () => {
    it('It will be validated that the "email" field is mandatory', async () => {
      errorLogin = {
        password: '123456'
      };
      chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send(errorLogin);
  
      expect(chaiHttpResponse).to.have.status(400);
      expect(chaiHttpResponse.body.message).to.be.equal('"email" is required');
    });

    it('It will be validated that the "password" field is mandatory', async () => {
      errorLogin = {
        email: 'lewishamilton@gmail.com'
      };
      chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send(errorLogin);
  
      expect(chaiHttpResponse).to.have.status(400);
      expect(chaiHttpResponse.body.message).to.be.equal('"password" is required');
    });

    it('It will be that the "email" is not allowed to be empty', async () => {
      errorLogin = {
        email: '',
        password: '123456',
      };
      chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send(errorLogin);
  
      expect(chaiHttpResponse).to.have.status(400);
      expect(chaiHttpResponse.body.message).to.be.equal('"email" is not allowed to be empty');
    });

    it('It will be that the "password" is not allowed to be empty', async () => {
      errorLogin = {
        email: 'lewishamilton@gmail.com',
        password: '',
      };
      chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send(errorLogin);
  
      expect(chaiHttpResponse).to.have.status(400);
      expect(chaiHttpResponse.body.message).to.be.equal('"password" is not allowed to be empty');
    });

    it(`It will be validated that it is not possible to login with a
    user that does not exist`, async () => {
      errorLogin = {
        email: 'aasd@gmail.com',
        password: '123456',
      };
      chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send(errorLogin);
  
      expect(chaiHttpResponse).to.have.status(400);
      expect(chaiHttpResponse.body.message).to.be.equal('Invalid fields');
    });
  });
});