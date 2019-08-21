const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express();

app.use(bodyParser.json());

app.use(isAuth);

app.use('/graphql',
    graphqlHttp({
        schema: graphQlSchema,
        rootValue: graphQlResolvers,
        graphiql: true,
    })
);

const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoDB = process.env.MONGO_DB;

mongoose.connect(
    `mongodb+srv://${mongoUser}:${mongoPassword}@vicluster-j65o8.mongodb.net/${mongoDB}?retryWrites=true&w=majority`
)
.then(() => {
    app.listen(3000);
})
.catch(err => console.log(err));
