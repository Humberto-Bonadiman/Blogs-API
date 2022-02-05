const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const userController = require('./controllers/userController');
const middlewares = require('./middlewares/auth');

app.listen(3000, () => console.log('ouvindo porta 3000!'));

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (request, response) => {
  response.send();
});

app.use(
  '/user',
  middlewares.validateUser,
  middlewares.displayNameBiggerThan,
  middlewares.checkEmail,
  middlewares.checkPassword,
  userController,
);