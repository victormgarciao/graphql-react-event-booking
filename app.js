const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Event = require('./models/event');

const app = express();

app.use(bodyParser.json());

app.use('/graphql',
    graphqlHttp({
        schema: buildSchema(`
            type Event {
                _id: ID!
                title: String!
                description: String!
                price: Float!
                date: String!
            }

            input EventInput {
                title: String!
                description: String!
                price: Float!
                date: String!
            }

            type RootQuery {
                events: [Event!]!
            }

            type RootMutation {
                createEvent(eventInput: EventInput!): Event
            }

            schema {
                query: RootQuery
                mutation: RootMutation
            }
        `),
        rootValue: {
            events: () => {
                return Event.find()
                    .then(events => {
                        return events.map(event => {
                            return { ...event._doc }
                        })
                    })
                    .catch(err => { throw err; })
            },
            createEvent: (args) => {
                const { title, description, price, date } = args.eventInput;

                const event = new Event({
                    title,
                    description,
                    price: +price,
                    date: new Date(date),
                })

                return event.save()
                    .then(result => {
                        console.log('save event succeded', result);
                        return {...result._doc}
                    })
                    .catch(err => {
                        console.log('save event error', err);
                        throw err;
                    });
            }
        },
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
