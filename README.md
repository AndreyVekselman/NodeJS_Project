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

Then from terminal run:

```
npm run dev
```

or

```
npm run start
```

to continue using a server application.

Create a example.http file or use application like a Postman to test a server, create a users with with different access levels, edit users and delete user.

### Test

To test Users Router send next following command from http file or from Postman (test route designed for educational purposes only and will not be used in real conditions):

```
GET {{local}}/users/test/test
```

### DeleteAll

To delete All users send next following command from http file or from Postman (Delete route designed for educational purposes only and will not be used in real conditions).
Be carefull. This command will delete all users from database.

```
DELETE {{local}}/users/delete/deleteAll
```

### Create a New User

To create a new User send next following command from http file or from Postman.
Please note: when creating a new user, the data must meet the necessary requirements. If the entered data does not meet the requirements, the user will not be created and the corresponding error will be displayed in response.

Here are the requirements that the data must meet when creating a new user:

- first Name:minimum 2 characters;
- last Name: minimum 2 characters;
- phone: minimum 9 and maximum 10 numbers, must begin from 0, second number from 2 to 9;
- email: minimum 6 characters, must be a valid email;
- password: minimum 6 characters;
- country: minimum 3 characters;
- city: minimum 5 characters;
- street: minimum 3 characters;
- houseNumber: minimum 1 number;

```
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

### Login

To Login User send next following command from http file or from Postman.
Please note: when login a user, the data must meet the necessary requirements. If the entered data does not meet the requirements, the user will not be login and the corresponding error will be displayed in response.

Here are the requirements that the data must meet when creating a new user:

- email: minimum 6 characters, must be a valid email;
- password: minimum 6 characters;

When the user login is successful, you will receive a token.
Save the token; you will need it for further operations with users.

```
POST {{local}}/users/login
Content-Type: application/json

{
 "email":"aleks@mail.com",
  "password":"aB123123$"
}
```

### Get all Users

To get list (array) of all Users send next following command from http file or from Postman.
Please note: get all users is only possible for users with admin privileges. Use admin token recieved during Login

```
GET {{local}}/users/
x-auth-token: {{tokenAdmin}}
```

### Get user information by id

To get information about specific User(use User ID), send next following command from http file or from Postman.
Please note: get users information is only possible for users with admin privileges. Use admin token recieved during Login

```
GET {{local}}/users/650c6d9d575fc658bd6a0fbc
x-auth-token: {{tokenAdmin}}
```

### Update existing user

To update existing User send next following command from http file or from Postman.

##### Please note:

1. use a User ID to update the User information;
2. use a token recieved during Login;
3. when updating existing user, the data must meet the necessary requirements. If the entered data does not meet the requirements, the user will not be created and the corresponding error will be displayed in response.
   Here are the requirements that the data must meet when creating a new user:

- first Name:minimum 2 characters;
- last Name: minimum 2 characters;
- phone: minimum 9 and maximum 10 numbers, must begin from 0, second number from 2 to 9;
- email: minimum 6 characters, must be a valid email;
- password: minimum 6 characters;
- country: minimum 3 characters;
- city: minimum 5 characters;
- street: minimum 3 characters;
- houseNumber: minimum 1 number;

```
PUT  {{local}}/users/650c6d9d575fc658bd6a0fbc
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
```

### Update Business status

To update a User Business status send next following command from http file or from Postman.

##### Please note:

1. use a User ID to update the User information;
2. use a token recieved during Login;

```
PATCH {{local}}/users/650c6d9d575fc658bd6a0fbc
x-auth-token: {{token}}
```

### Delete user by ID

To update a User Business status send next following command from http file or from Postman.

##### Please note:

1. use a User ID to update the User information;
2. use a token recieved during Login;
3. delete user possible by user itself or by user with admin privileges.

```
DELETE {{local}}/users/6505bd009c56b9a7e6e49461
x-auth-token: {{tokenBiz}}
```

## Features

- Register(create) a new User
- Login user
- Get All Users
- Get User information
- Edit existing User
- Change User business status
- Delete existing User
- Test a Users Router
- Delete all Users
- Create a new Card
- Get All Cards
- Get User Cards
- Get a specific Card information
- Edit a specific Card
- Like a specific Card
- Delete a specific Card
- Change a Card bizNumber
- Delete all Cards
- File logger
- Blocking a User for 24 hours
