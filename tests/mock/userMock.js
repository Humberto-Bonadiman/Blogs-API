const userPost = {
  displayName: 'Rubinho Barrichello',
  email: 'rubinho@gmail.com',
  password: '123456',
  image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Rubinho.jpg/220px-Rubinho.jpg'
};

const userMock = {
  id: 3,
  displayName: 'Fernando Alonso',
  email: 'alonso@gmail.com',
  password: '123456',
  image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Alonso_2016.jpg/479px-Alonso_2016.jpg'
};

const tokenUser = {
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjo0LCJkaXNwbGF5TmFtZSI6IkZlcm5hbmRvIEFsb25zbyIsImVtYWlsIjoiYWxvbnNvQGdtYWlsLmNvbSIsImltYWdlIjoiaHR0cHM6Ly91cGxvYWQud2lraW1lZGlhLm9yZy93aWtpcGVkaWEvY29tbW9ucy90aHVtYi8yLzJiL0Fsb25zb18yMDE2LmpwZy80NzlweC1BbG9uc29fMjAxNi5qcGcifSwiaWF0IjoxNjQ5MDE5NTIwLCJleHAiOjE2NDk2MjQzMjB9.PNl4_lxsC45Ce6YsTnL5bXSdka4ft9jH6EFvY0dAAvM'
}

const loginMock = {
  email: 'lewishamilton@gmail.com',
  password: '123456',
};

const getAllUsers = [
  {
    id: 1,
    displayName: 'Lewis Hamilton',
    email: 'lewishamilton@gmail.com',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Lewis_Hamilton_2016_Malaysia_2.jpg',
  },
  {
    id: 2,
    displayName: 'Michael Schumacher',
    email: 'MichaelSchumacher@gmail.com',
    image: 'https://sportbuzz.uol.com.br/media/_versions/gettyimages-52491565_widelg.jpg',
  },
]

module.exports = { userMock, tokenUser, loginMock, getAllUsers, userPost };