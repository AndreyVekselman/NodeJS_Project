# Node.js module summary project

Server-side development for a web application that includes a website management system that allows business users publish content, edit and delete it.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage/Examples](#usageexamples)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

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
- Show static HTML page

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
Please note:

- when login a user, the data must meet the necessary requirements. If the entered data does not meet the requirements, the user will not be login and the corresponding error will be displayed in response.  
  Here are the requirements that the data must meet when creating a new user:

* email: minimum 6 characters, must be a valid email;
* password: minimum 6 characters;

When the user login is successful, you will receive a token.
Save the token, you will need it for further operations with users.  
Please note:

- A user who tried to log in three times in a row using the same email but with an incorrect password will blocked for 24 hours.

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
Please note:

- get all users is only possible for users with admin privileges. Use admin token recieved during Login

```
GET {{local}}/users/
x-auth-token: {{tokenAdmin}}
```

### Get user information by id

To get information about specific User(use User ID), send next following command from http file or from Postman.  
Please note:

- get users information is only possible for users with admin privileges. Use admin token recieved during Login

```
GET {{local}}/users/650c6d9d575fc658bd6a0fbc
x-auth-token: {{tokenAdmin}}
```

### Update existing user

To update existing User send next following command from http file or from Postman.  
Please note:

- use a User ID to update the User information;
- use a token recieved during Login;
- when updating existing user, the data must meet the necessary requirements. If the entered data does not meet the requirements, the user will not be created and the corresponding error will be displayed in response.
  Here are the requirements that the data must meet when creating a new user:

* first Name:minimum 2 characters;
* last Name: minimum 2 characters;
* phone: minimum 9 and maximum 10 numbers, must begin from 0, second number from 2 to 9;
* email: minimum 6 characters, must be a valid email;
* password: minimum 6 characters;
* country: minimum 3 characters;
* city: minimum 5 characters;
* street: minimum 3 characters;
* houseNumber: minimum 1 number;

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
Please note:

- use a User ID to update the User information;
- use a token recieved during Login;

```
PATCH {{local}}/users/650c6d9d575fc658bd6a0fbc
x-auth-token: {{token}}
```

### Delete user by ID

To update a User Business status send next following command from http file or from Postman.  
Please note:

- use a User ID to update the User information;
- use a token recieved during Login;
- delete user possible by user itself or by user with admin privileges.

```
DELETE {{local}}/users/6505bd009c56b9a7e6e49461
x-auth-token: {{tokenBiz}}
```

### Test Cards routes

To test Cards Router send next following command from http file or from Postman (test route designed for educational purposes only and will not be used in real conditions):

```
GET {{local}}/cards/test/
```

### Delete All Cards

To delete All Cards send next following command from http file or from Postman (Delete route designed for educational purposes only and will not be used in real conditions). Be carefull. This command will delete all Cards from database.

```
DELETE {{local}}/cards/deleteAll
```

### Get All cards

To Get list(Array) of all Cards send next following command from http file or from Postman:

```
GET {{local}}/cards
```

### Get User Cards

To Get User list(Array) of all Cards send next following command from http file or from Postman.  
Please note:

- use a token recieved during Login

```
GET {{local}}/cards/my-cards
x-auth-token: {{tokenBiz}}
```

### Get Card by ID

To get specific Cards information send next following command from http file or from Postman.  
Please note:

- use a Card ID

```
GET {{local}}/cards/6507239a7cb5c67ddec6848a
```

### Create a new card

To create a new Card send next following command from http file or from Postman.  
Please note:  
when creating a new Card, the data must meet the necessary requirements. If the entered data does not meet the requirements, the card will not be created and the corresponding error will be displayed in response.  
Here are the requirements that the data must meet when creating a new user:

- title: minimum 2 characters;
- subtitle: minimum 2 characters;
- description: minimum 2 characters;
- phone: minimum 9 and maximum 10 numbers, must begin from 0, second number from 2 to 9;
- email: minimum 6 characters, must be a valid email;
- country: minimum 3 characters;
- city: minimum 5 characters;
- street: minimum 3 characters;
- houseNumber: minimum 1 number;

```
POST {{local}}/cards
x-auth-token: {{tokenBiz}}
Content-Type: application/json

 {
    "title": "Card3 Title",
    "subtitle": "Card3 subTitle",
    "description": "Card3 Description",
    "phone": "044444499",
    "email": "biz2@biz",
    "web": "biz1_web.site",
    "address": {
       "state": "Israel",
      "country": "Israel"
      "city": "Migdal HaEmek",
      "street": "HaAliya",
      "houseNumber": "15"
    }
  }
```

### Update Existing Card

To update existing Card send next following command from http file or from Postman.  
Please note:  
when apdating a Card, the data must meet the necessary requirements. If the entered data does not meet the requirements, the card will not be created and the corresponding error will be displayed in response.  
Please note:

- use a UserCard ID to update the Card information;
- use a token recieved during Login;
  Here are the requirements that the data must meet when creating a new user:

* title: minimum 2 characters;
* subtitle: minimum 2 characters;
* description: minimum 2 characters;
* phone: minimum 9 and maximum 10 numbers, must begin from 0, second number from 2 to 9;
* email: minimum 6 characters, must be a valid email;
* country: minimum 3 characters;
* city: minimum 5 characters;
* street: minimum 3 characters;
* houseNumber: minimum 1 number;

```
PUT {{local}}/cards/6507239a7cb5c67ddec6848a
x-auth-token: {{tokenBiz}}
Content-Type: application/json

 {
    "title": "Card3 Title",
    "subtitle": "Card3 subTitle",
    "description": "Card3 Description",
    "phone": "044444499",
    "email": "biz1@biz.com",
    "web": "biz1_web.site",
    "address": {
      "state": "Israel",
      "country": "Israel",
      "city": "Nof HaGalil",
      "street": "Ashuah",
      "houseNumber": "7"
    }
  }
```

### Add Card to favorites

To update existing Card send next following command from http file or from Postman.  
Please note:

- use a UserCard ID to add the Card to favorites;
- use a token recieved during Login;

```
PATCH {{local}}/cards/6507239a7cb5c67ddec6848a
x-auth-token: {{token}}
Content-Type: application/json
```

### Delete a Card by ID

To delete existing Card send next following command from http file or from Postman.  
Please note:

- use a UserCard ID to delete the Card;
- use a token recieved during Login;
- Card can be delete by created User or User with Admin privileges.

```
DELETE  {{local}}/cards/6507239a7cb5c67ddec6848a
x-auth-token: {{tokenAdmin}}
```

### Update bizNumber

To update a Card bizNumber send next following command from http file or from Postman.  
Please note:

- use a Card ID to update a bizNumber;
- use a token recieved during Login;
- a bizNumber can be update by User with Admin privileges only.

```
PATCH {{local}}/cards/bizUpdate/650c56968be520296c248b57
x-auth-token: {{tokenAdmin}}
Content-Type: application/json

{
  "bizNumber":"123321"
}
```

### Get static

Show static HTML page by send command from http file or from Postman.

```
GET {{local}}/hello.html
```

## Contributing

Contributions to the Node.js module summary project are welcome! If you have any bug reports, feature requests, or suggestions, please submit them through the GitHub Issues page.
If you'd like to contribute code to the project, please follow these steps:

- Fork the repository on GitHub.
- Create a new branch from the **`first`** branch to work on your changes.
- Make your modifications, adding new features or fixing bugs.
- Test your changes thoroughly.
- Commit your changes with descriptive commit messages.
- Push your branch to your forked repository.
- Submit a pull request to the **`first`** branch of the main repository.
  The project maintainers will review your contribution and provide feedback.

## License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/)

## Contact

If you have any questions, suggestions, or feedback, feel free to reach out:

Email: andrey.vekselman@gmail.com  
GitHub: [Andrey Vekselman](https://github.com/AndreyVekselman)  
Your feedback is valuable and greatly appreciated!
