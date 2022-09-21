require('dotenv').config();

const app = require('./api/app');

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (request, response) => {
  response.send();
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`ouvindo porta ${port}!`));