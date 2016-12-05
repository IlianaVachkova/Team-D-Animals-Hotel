# Team-D-Animals-Hotel

run from app.js

# Course Project
_Web applications with Node.js_

This document describes the **course project(and the project architecture)** for the [Web applications with Node.js at Telerik Academy.

## Project Description

Animals hotel a **Standard Web application** using [Node.js](http://nodejs.org), [Express](expressjs.com) and [MongoDB](https://www.mongodb.com/). 
The aim of the application is to register pets and hotels, to share you found things (as hotels with concreate services) with other for easy orientation which are the appropriate hotels for their needs.

The application have a:

- **public part** (accessible without authentication)
- **private part** (available for registered users)

### Public Part

The **public part** of the project is **visible without authentication**.

This public part is the application start page, application statistics, the user login and user registration forms, as well as the public data of the users, e.g. all regsitered from them pets and hotels(with correspond services).

### Private Part (Registered users area)

**Registered users** is personal area in the web application accessible after **successful login**.
This area holds registering pets and hotels, profile details.

## Project Architecture

Short description of each part(main folder).

### Config

- Creats an application using express.js.
- This app is an express instance.
- Loads all engines, which will be used.
- Make only client folder to be reached with prefix 'static'.

### Controllers

- Holds the logic for all models, all methods that can be executed.

### Data

- There is the data-layer.
- It is connected with Mongoose.
- Loads models.

### Models

- Mongoose models.

### Routers

- Loads dynamic all routers in routers directory(folder).
- Concreate router loads needed functions and put them on a rout.

### Views

- All Pug pages, view pages.

### Utilities

- Password security.
