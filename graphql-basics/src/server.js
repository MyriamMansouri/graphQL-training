import { GraphQLServer, PubSub } from 'graphql-yoga';
import db from './db.js';
import Query from './resolvers/Query.js';
import Mutation from './resolvers/Mutation.js';
import Post from './resolvers/Post.js'
import User from './resolvers/User.js'
import Comment from './resolvers/Comment.js'
import Subscription from './resolvers/Subscription.js'

const pubsub = new PubSub()

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query,
        Subscription,
        Mutation,
        Post,
        User,
        Comment,
    },
    context: {
        db,
        pubsub,
    }
})


export { server as default}
