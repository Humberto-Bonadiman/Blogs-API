const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../api/app');

const { Users } = require('../models');
const { BlogPosts } = require('../models');
const { loginMock } = require('./mock/userMock');

chai.use(chaiHttp);

const { expect } = chai;

describe('Authentication test in DELETE "post/:id"', () => {
  let chaiHttpResponse;
  let token;

  before(async () => {
    sinon.stub(Users, 'create').resolves(loginMock);

    sinon.stub(BlogPosts, 'destroy');
  });

  after(() => {
    Users.create.restore();
    BlogPosts.destroy.restore();
  });

  describe('should return the expected data', () => {
    it('with the status code 204', async () => {
      token = await chai.request(app).post('/login').send(loginMock);
      chaiHttpResponse = await chai
        .request(app)
        .delete('/post/2')
        .set('authorization', token.body.token);
      expect(chaiHttpResponse).to.have.status(204);
    });
  });

  describe('should not return the expected data', () => {
    it('only the user who created the post can delete it', async () => {
      const differentUser = {
        email: 'MichaelSchumacher@gmail.com',
        password: '123456',
      };
      token = await chai.request(app).post('/login').send(differentUser);
      chaiHttpResponse = await chai
        .request(app)
        .delete('/post/2')
        .set('authorization', token.body.token);
      expect(chaiHttpResponse).to.have.status(401);
      expect(chaiHttpResponse.body.message).to.equal('Unauthorized user');
    });

    it('unable to delete a non-existent blogpost', async () => {
      token = await chai.request(app).post('/login').send(loginMock);
      chaiHttpResponse = await chai
        .request(app)
        .delete('/post/5500')
        .set('authorization', token.body.token);
      expect(chaiHttpResponse).to.have.status(404);
      expect(chaiHttpResponse.body.message).to.equal('Post does not exist');
    });

    it('if the token is non-existent', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .delete('/post/2');
      expect(chaiHttpResponse).to.have.status(401);
      expect(chaiHttpResponse.body.message).to.be.equal('Token not found');
    });

    it('if the token is invalid', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .delete('/post/2')
        .set('authorization', 'abcd21878181chaa');
      expect(chaiHttpResponse).to.have.status(401);
      expect(chaiHttpResponse.body.message).to.be.equal('Expired or invalid token');
    });
  });
});