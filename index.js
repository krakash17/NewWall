const {ApolloServer, PubSub} = require('apollo-server');
const mongoose  = require('mongoose');

const {MONGODB} = require('./config.js');
const typeDefs = require('./graphql/typedefs.js');

const resolvers = require('./graphql/resolvers')
const pubsub = new PubSub();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({ req, pubsub  })
});

mongoose.connect(MONGODB, { useNewUrlParser: true})
        .then(() => {
            console.log(`MongoDb Connected`)
            return server.listen({port: 5000})
        })
        .then(res => {
            console.log(`Server Running At ${res.url}`)
        })


    









