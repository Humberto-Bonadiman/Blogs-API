const registrationPost = {
  title: "I Love Trybe",
  categoryIds: [1, 2],
  content: "Love <3"
};

const returnPost = {
  id: 3,
  userId: 1,
  title: "I Love Trybe",
  content: "Love <3"
}

const getPost = [
  {
    id: 1,
    title: "Post do Ano",
    content: "Melhor post do ano",
    userId: 1,
    published: "2011-08-01T19:58:00.000Z",
    updated: "2011-08-01T19:58:51.000Z",
    user: {
      id: 1,
      displayName: "Lewis Hamilton",
      email: "lewishamilton@gmail.com",
      image: "https://upload.wikimedia.org/wikipedia/commons/1/18/Lewis_Hamilton_2016_Malaysia_2.jpg"
    },
    categories: [
      {
        id: 1,
        name: "Inovação"
      }
    ]
  },
  {
    id: 2,
    title: "Vamos que vamos",
    content: "Foguete não tem ré",
    userId: 1,
    published: "2011-08-01T19:58:00.000Z",
    updated: "2011-08-01T19:58:51.000Z",
    user: {
      id: 1,
      displayName: "Lewis Hamilton",
      email: "lewishamilton@gmail.com",
      image: "https://upload.wikimedia.org/wikipedia/commons/1/18/Lewis_Hamilton_2016_Malaysia_2.jpg"
    },
    categories: [
      {
        id: 2,
        name: "Escola"
      }
    ]
  }
];

const putPost = {
  title: "Trybe Love I",
  content: "<3 Love"
};

const updateReturn = {
  title: "Trybe Love I",
  content: "<3 Love",
  userId: 1,
  categories: [
    {
      id: 2,
      name: "Escola"
    }
  ]
};

const searchPost = [
  {
    id: 1,
    title: "Post do Ano",
    content: "Melhor post do ano",
    userId: 1,
    published: "2011-08-01T19:58:00.000Z",
    updated: "2011-08-01T19:58:51.000Z",
    user: {
      id: 1,
      displayName: "Lewis Hamilton",
      email: "lewishamilton@gmail.com",
      image: "https://upload.wikimedia.org/wikipedia/commons/1/18/Lewis_Hamilton_2016_Malaysia_2.jpg"
    },
    categories: [
      {
        id: 1,
        name: "Inovação"
      }
    ]
  }
]

module.exports = {
  registrationPost,
  getPost,
  putPost,
  returnPost,
  updateReturn,
  searchPost,
};