require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const userController = require('./controllers/userController');
<<<<<<< HEAD
const { 
  validateDisplay,
  validateEmail,
  validatePassword,
  // validateUser,
} = require('./middlewares/auth');
=======
const middlewares = require('./middlewares/auth');
>>>>>>> 8e187dee312f4a29c51506c695d0b466f897dcae

app.listen(3000, () => console.log('ouvindo porta 3000!'));

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (request, response) => {
  response.send();
});

<<<<<<< HEAD
app.post(
  '/user',
  validateDisplay,
  validateEmail,
  validatePassword,
=======
app.use(
  '/user',
  middlewares.validateUser,
  middlewares.displayNameBiggerThan,
  middlewares.checkEmail,
  middlewares.checkPassword,
>>>>>>> 8e187dee312f4a29c51506c695d0b466f897dcae
  userController,
);