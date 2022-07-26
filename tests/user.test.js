const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../api/app');

const { userMock, loginMock, getAllUsers } = require('./mock/userMock');
const { Users } = require('../models');

chai.use(chaiHttp);

const { expect } = chai;

describe('Authentication test in POST "/user"', () => {
  let chaiHttpResponse;
  const userPost = {
    displayName: 'Rubinho Barrichello',
    email: 'rubinho@gmail.com',
    password: '123456',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Rubinho.jpg/220px-Rubinho.jpg'
  };
  let errorLogin = {};

  before(async () => {
    sinon.stub(Users, 'create').resolves(userMock);
  });

  after(() => {
    Users.create.restore();
  });

  describe('Should return the expected data', () => {
     it('should return the status code 201', async() => {
      chaiHttpResponse = await chai.request(app).post('/user').send(userPost);
      expect(chaiHttpResponse).to.have.status(201);
    });

    it('should return the key token', async () => {
      chaiHttpResponse = await chai.request(app).post('/user').send(userPost);
      expect(chaiHttpResponse.body).to.have.property('token');
    });
  });

  describe('Should not return when', () => {
    it(`It will be validated that it is not possible to register a user with the "password" field
    shorter than 8 characters`, async () => {
      errorLogin = {
        displayName: 'Rubinho',
        email: 'rubinho@gmail.com',
        password: '123456',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Rubinho.jpg/220px-Rubinho.jpg'
      };
      chaiHttpResponse = await chai.request(app).post('/user').send(errorLogin);

      expect(chaiHttpResponse).to.have.status(400);
      expect(chaiHttpResponse.body.message).to.be.equal('"displayName" length must be at least 8 characters long');
    });

    it('It will be validated that the "email" field is mandatory', async () => {
      errorLogin = {
        displayName: 'Rubinho Barrichello',
        password: '123456',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Rubinho.jpg/220px-Rubinho.jpg'
      };
      chaiHttpResponse = await chai.request(app).post('/user').send(errorLogin);

      expect(chaiHttpResponse).to.have.status(400);
      expect(chaiHttpResponse.body.message).to.be.equal('"email" is required');
    });

    it(`it will be validated that it is not possible to register a user with the "email" field
    with "email: rubinho" format`, async () => {
      errorLogin = {
        displayName: 'Rubinho Barrichello',
        email: 'rubinho',
        password: '123456',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Rubinho.jpg/220px-Rubinho.jpg'
      };
      chaiHttpResponse = await chai.request(app).post('/user').send(errorLogin);

      expect(chaiHttpResponse).to.have.status(400);
      expect(chaiHttpResponse.body.message).to.be.equal('"email" must be a valid email');
    });

    it(`it will be validated that it is not possible to register a user with the "email" field with
    the format "email: @gmail.com"`, async () => {
      errorLogin = {
        displayName: 'Rubinho Barrichello',
        email: '@gmail.com',
        password: '123456',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Rubinho.jpg/220px-Rubinho.jpg'
      };
      chaiHttpResponse = await chai.request(app).post('/user').send(errorLogin);

      expect(chaiHttpResponse).to.have.status(400);
      expect(chaiHttpResponse.body.message).to.be.equal('"email" must be a valid email');
    });

    it('It will be validated that the "password" field is mandatory', async () => {
      errorLogin = {
        displayName: 'Rubinho Barrichello',
        email: 'rubinho@gmail.com',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Rubinho.jpg/220px-Rubinho.jpg'
      };
      chaiHttpResponse = await chai.request(app).post('/user').send(errorLogin);

      expect(chaiHttpResponse).to.have.status(400);
      expect(chaiHttpResponse.body.message).to.be.equal('"password" is required');
    });

    it(`It will be validated that it is not possible to register a user with the "password"
    field different from 6 characters`, async () => {
      errorLogin = {
        displayName: 'Rubinho Barrichello',
        email: 'rubinho@gmail.com',
        password: '1234',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Rubinho.jpg/220px-Rubinho.jpg'
      };
      chaiHttpResponse = await chai.request(app).post('/user').send(errorLogin);

      expect(chaiHttpResponse).to.have.status(400);
      expect(chaiHttpResponse.body.message).to.be.equal('"password" length must be 6 characters long');
    });

    it('Validate that it is not possible to register a user with an existing email', async () => {
      errorLogin = {
        displayName: 'Lewis Hamilton',
        email: 'lewishamilton@gmail.com',
        password: '123456',
        image: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Lewis_Hamilton_2016_Malaysia_2.jpg'
      };
      chaiHttpResponse = await chai.request(app).post('/user').send(errorLogin);

      expect(chaiHttpResponse).to.have.status(409);
      expect(chaiHttpResponse.body.message).to.be.equal('User already registered');
    });
  });
});

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
     chaiHttpResponse = await chai.request(app).post('/login').send(userLogin);
     expect(chaiHttpResponse).to.have.status(200);
    });

  it('should return the key token', async () => {
    chaiHttpResponse = await chai.request(app).post('/login').send(userLogin);
     expect(chaiHttpResponse.body).to.have.property('token');
    });
  });

  it('It will be validated that the "email" field is mandatory', async () => {
    errorLogin = {
      password: '123456'
    };
    chaiHttpResponse = await chai.request(app).post('/login').send(errorLogin);

    expect(chaiHttpResponse).to.have.status(400);
    expect(chaiHttpResponse.body.message).to.be.equal('"email" is required');
  });

  it('It will be validated that the "password" field is mandatory', async () => {
    errorLogin = {
      email: 'lewishamilton@gmail.com'
    };
    chaiHttpResponse = await chai.request(app).post('/login').send(errorLogin);

    expect(chaiHttpResponse).to.have.status(400);
    expect(chaiHttpResponse.body.message).to.be.equal('"password" is required');
  });

  it('It will be that the "email" is not allowed to be empty', async () => {
    errorLogin = {
      email: '',
      password: '123456',
    };
    chaiHttpResponse = await chai.request(app).post('/login').send(errorLogin);

    expect(chaiHttpResponse).to.have.status(400);
    expect(chaiHttpResponse.body.message).to.be.equal('"email" is not allowed to be empty');
  });

  it('It will be that the "password" is not allowed to be empty', async () => {
    errorLogin = {
      email: 'lewishamilton@gmail.com',
      password: '',
    };
    chaiHttpResponse = await chai.request(app).post('/login').send(errorLogin);

    expect(chaiHttpResponse).to.have.status(400);
    expect(chaiHttpResponse.body.message).to.be.equal('"password" is not allowed to be empty');
  });

  it(`It will be validated that it is not possible to login with a
  user that does not exist`, async () => {
    errorLogin = {
      email: 'aasd@gmail.com',
      password: '123456',
    };
    chaiHttpResponse = await chai.request(app).post('/login').send(errorLogin);

    expect(chaiHttpResponse).to.have.status(400);
    expect(chaiHttpResponse.body.message).to.be.equal('Invalid fields');
  });
});

describe('Authentication test in GET "/user"', () => {
  let chaiHttpResponse;
  let token;
  let errorLogin = {};

  before(async () => {
    sinon.stub(Users, 'create').resolves(loginMock);
  });

  after(() => {
    Users.create.restore();
  });

  describe('Should return the expected data', () => {
    it('should return the status code 200', async () => {
      token = await chai.request(app).post('/login').send(loginMock);
      chaiHttpResponse = await chai.request(app).get('/user').set('authorization', token.body.token);
      expect(chaiHttpResponse).to.have.status(200);
    });

    it('should return a list of all users', async () => {
      token = await chai.request(app).post('/login').send(loginMock);
      chaiHttpResponse = await chai.request(app).get('/user').set('authorization', token.body.token);
      const firstUser = chaiHttpResponse.body[0];
      expect(chaiHttpResponse.body[0]).to.include({
        id: 1,
        displayName: "Lewis Hamilton",
        email: "lewishamilton@gmail.com",
        image: "https://upload.wikimedia.org/wikipedia/commons/1/18/Lewis_Hamilton_2016_Malaysia_2.jpg"
      });
      expect(firstUser.displayName).to.equal('Lewis Hamilton');
      expect(firstUser.email).to.equal('lewishamilton@gmail.com');
      expect(firstUser.image).to.equal(
        'https://upload.wikimedia.org/wikipedia/commons/1/18/Lewis_Hamilton_2016_Malaysia_2.jpg'
      );
    });
  });
});
