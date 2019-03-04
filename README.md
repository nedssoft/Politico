
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
* [Link to UI](https://oriechinedu.github.io/Politico/UI/index.html)

### API Docs
* [API Documentation](https://oriechinedu-politico.herokuapp.com/api/docs)

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
- Users can express interest to run for a political office
- Users/Politicans can file petitions for an unsatisfied election result


