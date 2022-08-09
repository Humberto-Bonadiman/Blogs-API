const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../api/app');

// const { Users } = require('../models');
const { BlogPosts } = require('../models');
const { loginMock } = require('./mock/userMock');

chai.use(chaiHttp);

const { putPost, updateReturn } = require('./mock/blogPostMock');

const { expect } = chai;

describe('Authentication test in PUT "/post/:id"', () => {
  let chaiHttpResponse;
  let token;

  before(async () => {
    // sinon.stub(Users, 'create').resolves(loginMock);
    sinon.stub(BlogPosts, 'update').resolves(updateReturn);
  });

  after(() => {
    // Users.create.restore();
    BlogPosts.update.restore();
  });

  describe('should return the expected data', () => {
    it('with the status code 200', async () => {
      token = await chai.request(app).post('/login').send(loginMock);
      chaiHttpResponse = await chai
        .request(app)
        .put('/post/2')
        .set('authorization', token.body.token)
        .send(putPost);
      console.log(chaiHttpResponse.body, '1');
      expect(chaiHttpResponse).to.have.status(200);
    });

    /* it('a object with a return of "/post/:id"', async () => {
      token = await chai.request(app).post('/login').send(loginMock);
      chaiHttpResponse = await chai
        .request(app)
        .put('/post/2')
        .set('authorization', token.body.token)
        .send(putPost);
      const chaiBody = chaiHttpResponse.body;
      console.log(chaiBody, '2');
      expect(chaiBody.title).to.equal(putPost.title);
      expect(chaiBody.content).to.equal(putPost.content);
      expect(chaiBody.userId).to.equal(getPost[1].userId);
      expect(chaiBody.categories[0].id).to.equal(getPost[1].categories[0].id);
      expect(chaiBody.categories[0].name).to.equal(getPost[1].categories[0].name);
    }); */
  });

  describe('should not return the expected data', () => {
    it(`It will be validated that it is not possible to edit
      the categories of a blogpost`, async () => {
      token = await chai.request(app).post('/login').send(loginMock);
      const putWithCategoryIds = {
        title: "Trybe Love I",
        content: "<3 Love",
        categoryIds: [1, 2]
      };
      chaiHttpResponse = await chai
        .request(app)
        .put('/post/2')
        .set('authorization', token.body.token)
        .send(putWithCategoryIds);
      expect(chaiHttpResponse).to.have.status(400);
      expect(chaiHttpResponse.body.message).to.equal('Categories cannot be edited');
    });

    it('only the user who created the post can edit it', async () => {
      const differentUser = {
        email: 'MichaelSchumacher@gmail.com',
        password: '123456',
      };
      token = await chai.request(app).post('/login').send(differentUser);
      chaiHttpResponse = await chai
        .request(app)
        .put('/post/2')
        .set('authorization', token.body.token)
        .send(putPost);
      expect(chaiHttpResponse).to.have.status(401);
      expect(chaiHttpResponse.body.message).to.equal('Unauthorized user');
    });

    it('if the token is non-existent', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .put('/post/2');
      expect(chaiHttpResponse).to.have.status(401);
      expect(chaiHttpResponse.body.message).to.be.equal('Token not found');
    });

    it('if the token is invalid', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .put('/post/2')
        .set('authorization', 'abcd21878181chaa');
      expect(chaiHttpResponse).to.have.status(401);
      expect(chaiHttpResponse.body.message).to.be.equal('Expired or invalid token');
    });

    it('if the content is not given', async () => {
      errorPost = {
        title: "I Love Trybe",
      };
      token = await chai.request(app).post('/login').send(loginMock);
      chaiHttpResponse = await chai
        .request(app)
        .put('/post/2')
        .set('authorization', token.body.token)
        .send(errorPost);
      expect(chaiHttpResponse).to.have.status(400);
      expect(chaiHttpResponse.body.message).to.be.equal('"content" is required');
    });

    it('if the title is not given', async () => {
      errorPost = {
        content: "Love <3"
      };
      token = await chai.request(app).post('/login').send(loginMock);
      chaiHttpResponse = await chai
        .request(app)
        .put('/post/2')
        .set('authorization', token.body.token)
        .send(errorPost);
      expect(chaiHttpResponse).to.have.status(400);
      expect(chaiHttpResponse.body.message).to.be.equal('"title" is required');
    });
  });
});