const usersData = [
  {
    name: {
      first: "Klim",
      last: "Klimov",
    },
    phone: "0551231234",
    email: "klim@mail.ru",
    password: "aB123123$",
    isBusiness: false,
    isAdmin: false,
    address: {
      state: "Israel",
      country: "Israel",
      city: "Tel Aviv",
      street: "Palmahim",
      houseNumber: "12",
    },
  },
  {
    name: {
      first: "Aleksandr",
      last: "Aleksov",
    },
    phone: "0511231234",
    email: "aleks@mail.com",
    password: "aB123123$",
    isBusiness: true,
    isAdmin: true,
    address: {
      state: "Israel",
      country: "Israel",
      city: "Haifa",
      street: "Hapoalim",
      houseNumber: "110",
    },
  },
  {
    name: {
      first: "Or",
      last: "Bar",
    },
    phone: "0521231234",
    email: "or@gmail.com",
    password: "aB123123$",
    isBusiness: true,
    isAdmin: false,
    address: {
      state: "Israel",
      country: "Israel",
      city: "Jerusalem",
      street: "Rotshield",
      houseNumber: "33",
    },
  },
];

const cardsData = [
  {
    title: "Card1 Title",
    subtitle: "Card1 subTitle",
    description: "Card1 Description",
    phone: "0501231234",
    email: "card1@mail.co.il",
    web: "card1.co.site",
    address: {
      state: "Israel",
      country: "Israel",
      city: "Haifa",
      street: "Hakabaim",
      houseNumber: "1",
    },
  },
  {
    title: "Card2 Title",
    subtitle: "Card2 subTitle",
    description: "Card2 Description",
    phone: "0511231234",
    email: "card2@mail.co.il",
    web: "card2.co.site",
    address: {
      state: "Israel",
      country: "Israel",
      city: "Tel Aviv",
      street: "Shtraus",
      houseNumber: "33",
    },
  },
  {
    title: "Card3 Title",
    subtitle: "Card3 subTitle",
    description: "Card3 Description",
    phone: "0521231234",
    email: "card3@mail.co.il",
    web: "card3.co.site",
    address: {
      state: "Israel",
      country: "Israel",
      city: "Haifa",
      street: "Adar",
      houseNumber: "10",
    },
  },
];

module.exports = {
  usersData,
  cardsData,
};
