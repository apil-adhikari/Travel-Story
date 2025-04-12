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

### Routes Creation

We have setup base route `/api/v1/` using express middleware and base on the URL such as `/api/v1/user/___`, we identify it is user route, then we will got the user route. This is called `mounting the router`. This is helpful as we don't have to put the base route in every route.

Example: `userRoutes.js`

```JavaScript
import express from "express";

// creating a express router
const router = express.Router();

export default router;
```

We use this router in our app `app.js`. We use middleware to mount the router after we create our express application.
If the url is `'/api/v1/users'` we wil navigate to user routes.

```JavaScript
import userRouter from "./routers/userRoute.js";

app.use("/api/v1/users",userRouter);
```

### Model Creation

Required package: `mongoose`

    npm install mongoose

`mongoose` object modeling is used to create a model
In NoSQL database(for mongoDB), we have `schema`(like in traditional db, we used have table definition), `Collection`: is like table and `document`: is like each record in the table.

To create a model using mongoose we have to follow these steps:

1. We need to import mongoose
2. We need to create a mongoose schema (defining the structure of our model):
   Everything in Mongoose starts with a Schema. Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
3. We need to create model out of our mongoose schame

Example:

```JavaScript
import mongoose from "mongoose";

// Schema creation
const userSchema = new mongoose.Schema({

})

// Model creation out of schema
const User = mongoose.model("User", userSchema);
```
