const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../api/app');

const { Users } = require('../models');
const { BlogPosts } = require('../models');
const { loginMock } = require('./mock/userMock');

chai.use(chaiHttp);

const { registrationPost, getPost, putPost } = require('./mock/blogPostMock');

const { expect } = chai;

describe('Authentication test in POST "/post"', () => {
  let chaiHttpResponse;
  let token;
  let errorPost = {};

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

describe('Authentication test in GET "/post"', () => {
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

describe('Authentication test in GET "/post/:id"', () => {
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
        .get('/post/1')
        .set('authorization', token.body.token);
      expect(chaiHttpResponse).to.have.status(200);
    });

    it('should return a object with a BlogPosts', async () => {
      token = await chai.request(app).post('/login').send(loginMock);
      chaiHttpResponse = await chai
        .request(app)
        .get('/post/1')
        .set('authorization', token.body.token);
      const chaiBody = chaiHttpResponse.body;
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
        .get('/post/1');
      expect(chaiHttpResponse).to.have.status(401);
      expect(chaiHttpResponse.body.message).to.be.equal('Token not found');
    });

    it('if the token is invalid', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/post/1')
        .set('authorization', 'abcd21878181chaa');
      expect(chaiHttpResponse).to.have.status(401);
      expect(chaiHttpResponse.body.message).to.be.equal('Expired or invalid token');
    });

    it('if the post does not exist', async () => {
      token = await chai.request(app).post('/login').send(loginMock);
      chaiHttpResponse = await chai
        .request(app)
        .get('/post/1585')
        .set('authorization', token.body.token);
      expect(chaiHttpResponse).to.have.status(404);
    });
  });
});

describe('Authentication test in PUT "/post"', () => {
  let chaiHttpResponse;
  let token;

  before(async () => {
    sinon.stub(Users, 'create').resolves(loginMock);

    sinon.stub(BlogPosts, 'update').resolves(getPost[0]);
  });

  after(() => {
    Users.create.restore();
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
      expect(chaiHttpResponse).to.have.status(200);
    });

    it('a object with a return of "/post/:id"', async () => {
      token = await chai.request(app).post('/login').send(loginMock);
      chaiHttpResponse = await chai
        .request(app)
        .put('/post/2')
        .set('authorization', token.body.token)
        .send(putPost);
      const chaiBody = chaiHttpResponse.body;
      expect(chaiBody.title).to.equal(putPost.title);
      expect(chaiBody.content).to.equal(putPost.content);
      expect(chaiBody.userId).to.equal(getPost[1].userId);
      expect(chaiBody.categories[0].id).to.equal(getPost[1].categories[0].id);
      expect(chaiBody.categories[0].name).to.equal(getPost[1].categories[0].name);
    });
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