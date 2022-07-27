const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../api/app');

const { Users } = require('../models');
const { loginMock } = require('./mock/userMock');

chai.use(chaiHttp);

const { categoriesPost, allCategories } = require('./mock/categoriesMock');

const { expect } = chai;

describe('Authentication test in POST "/categories"', () => {
  let chaiHttpResponse;
  let token;

  before(async () => {
    sinon.stub(Users, 'create').resolves(loginMock);
  });

  after(() => {
    Users.create.restore();
  });

  describe('should return the expected data', () => {
    it('with the status code 201', async () => {
      token = await chai.request(app).post('/login').send(loginMock);
      chaiHttpResponse = await chai
        .request(app)
        .post('/categories')
        .set('authorization', token.body.token)
        .send(categoriesPost);
      expect(chaiHttpResponse).to.have.status(201);
    });

    it('a object with id and name of category', async () => {
      token = await chai.request(app).post('/login').send(loginMock);
      chaiHttpResponse = await chai
        .request(app)
        .post('/categories')
        .set('authorization', token.body.token)
        .send(categoriesPost);
      expect(chaiHttpResponse.body).to.have.property('id');
      expect(chaiHttpResponse.body.id).to.be.a('number');
      expect(chaiHttpResponse.body.name).to.equal('Tecnologia');
    });
  });

  describe('Should not return the expected data', () => {
    it('if the token is non-existent', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post('/categories')
        .send(categoriesPost);
      expect(chaiHttpResponse).to.have.status(401);
      expect(chaiHttpResponse.body.message).to.be.equal('Token not found');
    });

    it('if the token is invalid', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post('/categories')
        .set('authorization', 'abcd21878181chaa')
        .send(categoriesPost);
      expect(chaiHttpResponse).to.have.status(401);
      expect(chaiHttpResponse.body.message).to.be.equal('Expired or invalid token');
    });

    it('if the name is not given', async () => {
      token = await chai.request(app).post('/login').send(loginMock);
      chaiHttpResponse = await chai
        .request(app)
        .post('/categories')
        .set('authorization', token.body.token);
      expect(chaiHttpResponse).to.have.status(400);
      expect(chaiHttpResponse.body.message).to.be.equal('"name" is required');
    });
  });
});

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