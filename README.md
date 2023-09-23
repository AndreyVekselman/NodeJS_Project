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
