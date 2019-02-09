
[![Build Status](https://travis-ci.org/oriechinedu/Politico.svg?branch=develop)](https://travis-ci.org/oriechinedu/Politico)
[![Coverage Status](https://coveralls.io/repos/github/oriechinedu/Politico/badge.svg?branch=develop)](https://coveralls.io/github/oriechinedu/Politico?branch=develop)
[![Maintainability](https://api.codeclimate.com/v1/badges/775d43d994af19a55457/maintainability)](https://codeclimate.com/github/oriechinedu/Politico/maintainability)

# Politico

Politico enables citizens give their mandate to politicians running for different government offices while building trust in the process through transparency

## Getting Started

### prerequisites
 The following tools are required to get the project running
 * [NPM](https://www.npmjs.com/)
 * [Node](https://nodejs.org/en/)

### Dependencies
* Express - Nodejs web server
* Body-parser - A middleware that collates request parameter and places them in the request body property
* Babel - Modern Javascript Transpiler

### Dev Dependencies
- Coveralls: Used for coverage test
- Eslint: Javacript linting package
- Airbnb: Javascript style guide
- Mocha: Testing Framework
- Chai and cha-http: Assetion libaries
- Nodemon: A package for automatically restarts the project when changes are made
- Morgan: For monitoring request details during development
- debug: An alternative to console.log

### How to Start the Project on local environment
* git clone  git@github.com:oriechinedu/Politico.git
* git checkout develop
* npm install
* touch .env && cp .env.example .env
* Add the postgress connectionString

### To get connectionString
* Visit https://www.elephantsql.com/
* create an account and then create two database instances one for test and dev
* In the .env, assign the connectionString above each for DB_TEST and DB_DEV

### Migration
# To generate the database tables run,
- npm run migrate && npm run migrate:seed

# To drop the tables, run
- npm run migrate:reset

### How to run the automated test
* npm run test

### User Interface
The UI is hosted on gh-pages
* [Landing page](https://oriechinedu.github.io/Politico/UI/index.html)
* [User Dashboard](https://oriechinedu.github.io/Politico/UI/index.html)
* [Admin Dashboard](https://oriechinedu.github.io/Politico/UI/parties.html)

### Features
- Admin or Electoral Board can create political parties
- Admin can create political offices
- Admin can approve or rejects aspirants application requests
- Admin can delete political parties
- Admin can edit political parties
- Admin can register candidates for a given political office
- Users/Admin can view all political parties and political offices
- Users/Admin can view candidates contesting for a given political office
- Users/Admin can vote
- Users/Admin can view the results of a concluded election
- Users/Admin can sign up
- Users/Admin can log in
- Users/Politicans can file petitions for an unsatisfied election result


### Endpoints
- Sign up [POST] https://oriechinedu-politico.herokuapp.com/api/v1/auth/signup
- Login [POST] https://oriechinedu-politico.herokuapp.com/api/v1/auth/login
- Create Political Office [POST] https://oriechinedu-politico.herokuapp.com/api/v1/offices/
- `Get single political office [GET] https://oriechinedu-politico.herokuapp.com/api/v1/offices/<officeId>
- Get all political offices [GET] https://oriechinedu-politico.herokuapp.com/api/v1/offices/
- Create a political party [POST] https://oriechinedu-politico.herokuapp.com/api/v1/parties
- Get a political party [GET] https://oriechinedu-politico.herokuapp.com/api/v1/parties/<partyId>
- Edit a political party [PATCH] https://oriechinedu-politico.herokuapp.com/api/v1/parties/<partyId>
- Delete a political party [DELETE] https://oriechinedu-politico.herokuapp.com/api/v1/parties/<partyId>
- Get all political party [GET] https://oriechinedu-politico.herokuapp.com/api/v1/parties
- Register a candidate [POST] https://oriechinedu-politico.herokuapp.com/api/v1/office/<userId>/register
- Vote a candidate [POST] https://oriechinedu-politico.herokuapp.com/api/v1/vote
- View Election Result [GET] https://oriechinedu-politico.herokuapp.com/api/v1/office/<officeId>/result
- View Candidates [GET] https://oriechinedu-politico.herokuapp.com/api/v1/candidates


### How to contribute
 Detail coming soon
