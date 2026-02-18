const express = require("express");
const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server-express");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const app = express();

/* ======================
   MongoDB Connection
====================== */

mongoose.connect("mongodb://127.0.0.1:27017/comp3133_101532464_Assignment1")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


/* ======================
   Apollo Server Setup
====================== */

async function startServer() {

    const server = new ApolloServer({
        typeDefs,
        resolvers
    });

    await server.start();
    server.applyMiddleware({ app });

    app.listen(4000, () => {
        console.log("Server running at http://localhost:4000/graphql");
    });
}

startServer();
