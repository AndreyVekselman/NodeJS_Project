# Node.js module summary project

Server-side development for a web application that includes a website management system that allows business users publish content, edit and delete it.

## Installation

Install my-project with npm

```bash
git clone https://github.com/AndreyVekselman/NodeJS_Project
cd NodeJS_Project
npm init -y
```

For proper application operation Install the next following modules:
"bcrypt",
"chalk",
"config",
"cors",
"dotenv",
"express",
"joi",
"jsonwebtoken",
"lodash",
"mongoose",
"morgan".

MongoDB compass application must to be installed on your PC also.

## Usage/Examples

To start using server application create a .env file (file not include in GitHub) similar like a .env.example file:

```
MONGO_URI=mongodb://127.0.01/my_rest_api_Project
PORT=3000
JWT_SECRET=SECRET
```

Then from terminal run:

```
npm run seed-db
```

This will create a three users and three cards in database.

To continue using a server application, from terminal run:

```
npm run dev
```

or

```
npm run start
```

Create a example.http file or use application like a Postman to test a server, create a users with different access levels,login users, edit users and delete user.

### Test

To test Users Router send next following command from http file or from Postman (test route designed for educational purposes only and will not be used in real conditions):

```
### Test
GET {{local}}/users/test/test
```

### DeleteAll

To delete All users send next following command from http file or from Postman (Delete route designed for educational purposes only and will not be used in real conditions).
Be carefull. This command will delete all users from database.

```
### Delete ALL Users
DELETE {{local}}/users/delete/deleteAll
```

### Create a New User

To create a new User send next following command from http file or from Postman.
Please note: when creating a new user, the data must meet the necessary requirements. If the entered data does not meet the requirements, the user will not be created and the corresponding error will be displayed in response.

Here are the requirements that the data must meet when creating a new user:

    first Name:minimum 2 characters;
    last Name: minimum 2 characters;

    phone: minimum 9 and maximum 10 numbers, must begin from 0, second number from 2 to 9;

    email: minimum 6 characters, must be a valid email;

    country: minimum 3 characters;
    city: minimum 5 characters;
    street: minimum 3 characters;
    houseNumber: minimum 1 number;


```
### Create a New User
POST {{local}}/users
Content-Type: application/json

{
    "name": {
      "first": "Shon",
      "last": "Alimov"
    },
    "phone": "0522222222",
    "email": "shon@gmail.com",
    "password": "aB123123$",
    "isBusiness": false,
    "isAdmin": true,
    "address": {
      "state": "Israel",
      "country": "Israel",
      "city": "Afula",
      "street": "Hapoalim",
      "houseNumber": "101"
    }
  }
```

### login

POST {{local}}/users/login
Content-Type: application/json

{
"email":"aleks@mail.com",
"password":"aB123123$"
}

### get allUsers

GET {{local}}/users/
x-auth-token: {{tokenAdmin}}

### get user information by id

GET {{local}}/users/650c6d9d575fc658bd6a0fbc
x-auth-token: {{tokenAdmin}}

### Update existing user

PUT {{local}}/users/650c6d9d575fc658bd6a0fbc
Content-Type: application/json
x-auth-token: {{tokenAdmin}}

{
"name": {
"first": "Shir",
"last": "Alim"
},
"phone": "0502222299",
"email": "shor@gmail.com",
"password": "Aa123456&",
"isBusiness": false,
"isAdmin": false,
"address": {
"state": "Israel",
"country": "Israel",
"city": "Los Angeles",
"street": "Main Street",
"houseNumber": "10"
}
}

### Update Business status

PATCH {{local}}/users/650c6d9d575fc658bd6a0fbc
x-auth-token: {{token}}

### Delete user by ID

DELETE {{local}}/users/6505bd009c56b9a7e6e49461
x-auth-token: {{tokenBiz}}
