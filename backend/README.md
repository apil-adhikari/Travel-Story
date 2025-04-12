# Travel Story Backend

Initial packages required are:

    npm install express dotenv

`express` is used to create our backend application and `dotenv` is used to load the environment variables from `.env` to `process.env`.

## Setup express application

```JavaScript
import express from "express";

// Create an applicaton instance of express
const app = express();

// Export express app
export defaut express;
```

### Basic Server and Database Setup

`process.env.___` is taken from `config.env` file as we loaded it using dotenv package.

```JavaScript
import dotenv from "dotenv";
// configure the dotenv to read .env files
dotenv.config({path: "./config.env"}) // Loads the env files from .env to process.env(should be done before using our express application)
import mongoose from "mongoose";

// Database Configuration
const databaseConnectionString = process.env.DATABASE_URL.replace("<PASSWORD_PLACEHOLDER>", process.env.DATABASE_PASSWORD);

// mongoose.connect() method returns a promise, so we need to handle it
mongoose.connect(databaseConectionString).then(()=>{
  console.log("Database connection successful");
}).then((err)=>consolel.log("Error connecting to database: ", err));

// Server Configuration
const port = process.env.PORT || 8001;
const server = app.listen(port, ()=>{
  console.log(`Server is running on http://localhost:${port}`)
})

```
