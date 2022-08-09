const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../api/app');

const { Users } = require('../models');
const { BlogPosts } = require('../models');
const { loginMock, deleteMock } = require('./mock/userMock');

chai.use(chaiHttp);

const {
  registrationPost,
  getPost,
  putPost,
  returnPost,
  updateReturn,
  searchPost,
} = require('./mock/blogPostMock');

const { expect } = chai;

/* describe('Authentication test in DELETE "/user/me"', () => {
  let chaiHttpResponse;
  let token;

  before(async () => {
    sinon.stub(Users, 'create').resolves(deleteMock);
    sinon.stub(BlogPosts, 'destroy').resolves();
  });

  after(() => {
    Users.create.restore();
    BlogPosts.destroy.restore();
  });

  describe('should return the expected data', () => {
    it('with the status code 204', async () => {
      token = await chai.request(app).post('/login').send(deleteMock);
      chaiHttpResponse = await chai
        .request(app)
        .delete('/user/me')
        .set('authorization', token.body.token);
      expect(chaiHttpResponse).to.have.status(204);
    });
  });
}); */

describe('Authentication test in GET "post/search?q=:searchTerm"', () => {
  let chaiHttpResponse;
  let token;

  describe('should return the expected data', () => {

    before(async () => {
      sinon.stub(Users, 'create').resolves(loginMock);
      sinon.stub(BlogPosts, 'findAll').resolves(searchPost);
    });
  
    after(() => {
      Users.create.restore();
      BlogPosts.findAll.restore();
    });

    it('with the status code 200', async () => {
      token = await chai.request(app).post('/login').send(loginMock);
      chaiHttpResponse = await chai
        .request(app)
        .get('/post/search?q=Post do Ano')
        .set('authorization', token.body.token);
      expect(chaiHttpResponse).to.have.status(200);
    });

    it('a object with a return of "/post/search?q=:searchTerm"', async () => {
      token = await chai.request(app).post('/login').send(loginMock);
      chaiHttpResponse = await chai
        .request(app)
        .get('/post/search?q=Post do Ano')
        .set('authorization', token.body.token);
      const chaiBody = chaiHttpResponse.body[0];
      expect(chaiBody.id).to.be.a('number');
      expect(chaiBody.title).to.be.equal(searchPost[0].title);
      expect(chaiBody.content).to.be.equal(searchPost[0].content);
      expect(chaiBody.userId).to.be.equal(searchPost[0].userId);
      expect(chaiBody.published).to.be.equal(searchPost[0].published);
      expect(chaiBody.updated).to.be.equal(searchPost[0].updated);
      expect(chaiBody.user.id).to.be.equal(searchPost[0].user.id);
      expect(chaiBody.user.displayName).to.be.equal(searchPost[0].user.displayName);
      expect(chaiBody.user.email).to.be.equal(searchPost[0].user.email);
      expect(chaiBody.user.image).to.be.equal(searchPost[0].user.image);
      expect(chaiBody.categories[0].id).to.be.equal(searchPost[0].categories[0].id);
      expect(chaiBody.categories[0].name).to.be.equal(searchPost[0].categories[0].name);
    });
  });

  describe('should return a empty array', () => {
    it('a object with a return of "/post/search?q=BATATA', async () => {
      token = await chai.request(app).post('/login').send(loginMock);
      chaiHttpResponse = await chai
        .request(app)
        .get('/post/search?q=BATATA')
        .set('authorization', token.body.token);
      expect(chaiHttpResponse.body).to.be.an('array').that.is.empty;
    });
  });

  describe('should not return the expected data', () => {
    it('if the token is non-existent', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/post/search?q=Post do Ano')
      expect(chaiHttpResponse).to.have.status(401);
      expect(chaiHttpResponse.body.message).to.be.equal('Token not found');
    });

    it('if the token is invalid', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/post/search?q=Post do Ano')
        .set('authorization', 'abcd21878181chaa');
      expect(chaiHttpResponse).to.have.status(401);
      expect(chaiHttpResponse.body.message).to.be.equal('Expired or invalid token');
    });
  });
});
