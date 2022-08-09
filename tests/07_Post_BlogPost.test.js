const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../api/app');

const { Users } = require('../models');
const { BlogPosts } = require('../models');
const { loginMock } = require('./mock/userMock');

chai.use(chaiHttp);

const { registrationPost, returnPost } = require('./mock/blogPostMock');

const { expect } = chai;

describe('Authentication test in POST "/post"', () => {
  let chaiHttpResponse;
  let token;
  let errorPost = {};

  before(async () => {
    sinon.stub(Users, 'create').resolves(loginMock);
    sinon.stub(BlogPosts, 'create').resolves(returnPost);
  });

  after(() => {
    Users.create.restore();
    BlogPosts.create.restore();
  });

  describe('should return the expected data', () => {
    it('with the status code 201', async () => {
      token = await chai.request(app).post('/login').send(loginMock);
      chaiHttpResponse = await chai
        .request(app)
        .post('/post')
        .set('authorization', token.body.token)
        .send(registrationPost);
      expect(chaiHttpResponse).to.have.status(201);
    });

    it('a object with a return of "/post"', async () => {
      token = await chai.request(app).post('/login').send(loginMock);
      chaiHttpResponse = await chai
        .request(app)
        .post('/post')
        .set('authorization', token.body.token)
        .send(registrationPost);
      expect(chaiHttpResponse.body.id).to.be.a('number');
      expect(chaiHttpResponse.body.userId).to.equal(1);
      expect(chaiHttpResponse.body.title).to.equal("I Love Trybe");
      expect(chaiHttpResponse.body.content).to.equal("Love <3");
    });
  });

  describe('should not return the expected data', () => {
    it('if the title is not given', async () => {
      errorPost = {
        categoryIds: [1, 2],
        content: "Love <3"
      };
      token = await chai.request(app).post('/login').send(loginMock);
      chaiHttpResponse = await chai
        .request(app)
        .post('/post')
        .set('authorization', token.body.token)
        .send(errorPost);
      expect(chaiHttpResponse).to.have.status(400);
      expect(chaiHttpResponse.body.message).to.be.equal('"title" is required');
    });

    it('if the content is not given', async () => {
      errorPost = {
        title: "I Love Trybe",
        categoryIds: [1, 2]
      };
      token = await chai.request(app).post('/login').send(loginMock);
      chaiHttpResponse = await chai
        .request(app)
        .post('/post')
        .set('authorization', token.body.token)
        .send(errorPost);
      expect(chaiHttpResponse).to.have.status(400);
      expect(chaiHttpResponse.body.message).to.be.equal('"content" is required');
    });

    it('if the categoryIds is not given', async () => {
      errorPost = {
        title: "I Love Trybe",
        content: "Love <3"
      };
      token = await chai.request(app).post('/login').send(loginMock);
      chaiHttpResponse = await chai
        .request(app)
        .post('/post')
        .set('authorization', token.body.token)
        .send(errorPost);
      expect(chaiHttpResponse).to.have.status(400);
      expect(chaiHttpResponse.body.message).to.be.equal('"categoryIds" is required');
    });

    it('If the categoryIds field has a non-existent category', async () => {
      errorPost = {
        title: "I Love Trybe",
        categoryIds: [150],
        content: "Love <3"
      };
      token = await chai.request(app).post('/login').send(loginMock);
      chaiHttpResponse = await chai
        .request(app)
        .post('/post')
        .set('authorization', token.body.token)
        .send(errorPost);
      expect(chaiHttpResponse).to.have.status(400);
      expect(chaiHttpResponse.body.message).to.be.equal('"categoryIds" not found');
    });

    it('if the token is non-existent', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post('/post')
        .send(registrationPost);
      expect(chaiHttpResponse).to.have.status(401);
      expect(chaiHttpResponse.body.message).to.be.equal('Token not found');
    });

    it('if the token is invalid', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post('/post')
        .set('authorization', 'abcd21878181chaa')
        .send(registrationPost);
      expect(chaiHttpResponse).to.have.status(401);
      expect(chaiHttpResponse.body.message).to.be.equal('Expired or invalid token');
    });
  });
});