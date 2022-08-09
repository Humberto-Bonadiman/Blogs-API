const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../api/app');

const { Users } = require('../models');
const { BlogPosts } = require('../models');
const { loginMock } = require('./mock/userMock');

chai.use(chaiHttp);

const { getPost } = require('./mock/blogPostMock');

const { expect } = chai;

describe('Authentication test in GET "/post"', () => {
  let chaiHttpResponse;
  let token;

  before(async () => {
    sinon.stub(Users, 'create').resolves(loginMock);
    sinon.stub(BlogPosts, 'findAll').resolves(getPost);
  });

  after(() => {
    Users.create.restore();
    BlogPosts.findAll.restore();
  });

  describe('should return the expected data', () => {
    it('with the status code 200', async () => {
      token = await chai.request(app).post('/login').send(loginMock);
      chaiHttpResponse = await chai
        .request(app)
        .get('/post')
        .set('authorization', token.body.token);
      expect(chaiHttpResponse).to.have.status(200);
    });

    it('should return a list of all BlogPosts', async () => {
      token = await chai.request(app).post('/login').send(loginMock);
      chaiHttpResponse = await chai
        .request(app)
        .get('/post')
        .set('authorization', token.body.token);
      const chaiBody = chaiHttpResponse.body[0];
      expect(chaiBody.id).to.be.a('number');
      expect(chaiBody.title).to.equal(getPost[0].title);
      expect(chaiBody.content).to.equal(getPost[0].content);
      expect(chaiBody.userId).to.equal(getPost[0].userId);
      expect(chaiBody.published).to.equal(getPost[0].published);
      expect(chaiBody.updated).to.equal(getPost[0].updated);
      expect(chaiBody.user.id).to.equal(getPost[0].user.id);
      expect(chaiBody.user.displayName).to.equal(getPost[0].user.displayName);
      expect(chaiBody.user.email).to.equal(getPost[0].user.email);
      expect(chaiBody.user.image).to.equal(getPost[0].user.image);
      expect(chaiBody.categories[0].id).to.equal(getPost[0].categories[0].id);
      expect(chaiBody.categories[0].name).to.equal(getPost[0].categories[0].name);
    });
  });

  describe('should not return the expected data', () => {
    it('if the token is non-existent', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/post');
      expect(chaiHttpResponse).to.have.status(401);
      expect(chaiHttpResponse.body.message).to.be.equal('Token not found');
    });

    it('if the token is invalid', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/post')
        .set('authorization', 'abcd21878181chaa');
      expect(chaiHttpResponse).to.have.status(401);
      expect(chaiHttpResponse.body.message).to.be.equal('Expired or invalid token');
    });
  });
});