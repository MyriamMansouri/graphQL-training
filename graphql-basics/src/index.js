import { GraphQLServer } from 'graphql-yoga';

const comments =[{
    id: 'a',
    text: "Cool",
    author: 'abc123',
    post: 'qwerty123',
},{
    id: 'b',
    text: "Not Nice",
    author: 'abc123',
    post: 'qwerty457',
},{
    id: 'c',
    text: "Imo",
    author: '1',
    post: 'qwerty456',
},{
    id: 'd',
    text: "OMG !!!!!!!!!!!!!",
    author: 'abc456',
    post: 'qwerty123',
}]

const posts =[{
    id: 'qwerty123',
    title: "Poker Faceee",
    body: "Popopopoker face, Popopoker face",
    author: 'abc123',
    published: true,
},{
    id: 'qwerty456',
    title: "Telephone",
    author: 'abc123',
    body: "Hello Hello Baby, You Call, I Can't Ear a Thing",
    published: false
},{
    id: 'qwerty457',
    title: "La Tribu de Dana",
    author: 'abc456',
    body: "Je suis devenu roi, de la tribu de Dana, Dana, Dana, Dana",
    published: false
}]

const users =[{
    id: '1',
    name: 'Riri',
    email: 'riri@gaga.com',
    age: 12,
    comments: ['c']
}, {
    id: 'abc123',
    name: 'Lady Gaga',
    email: 'lady@gaga.com',
    age: 33,
    posts: ['qwerty123', 'qwerty456'],
    comments: ['a', 'b']
}, {
    id: 'abc456',
    name: 'Manau',
    email: 'manau@manau.com',
    age: 45,
    posts: ['qwerty457'],
    comments: ['d']
}, {
    id: 'abc487',
    name: 'Kiki',
    email: 'kiki@gaga.com',
    age: 78,
    posts: null,
}]

// type definitions (schema)
// exclamation marks means hello never returns null
const typeDefs = `
    type Query {
        comments: [Comment!]!
        posts(query: String) : [Post!]!
        users(query: String) : [User!]!
        me: User!
    }
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        employed: Boolean
        posts: [Post]
        comments: [Comment!]!
    }
    type Post {
        id: ID!
        title: String!
        body: String!
        author: User!
        published: Boolean!
    }
    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`

// Resolvers
const resolvers = {
    Query: {
        comments() {
            return comments
        },
        users(parent, args, ctx, info) {
            return !args.query ? users : users.filter((user) => user.name.toLowerCase().includes(args.query.toLowerCase()))
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts
            }
            return posts.filter((post) => {
                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
                const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
                return  isTitleMatch || isBodyMatch;
            })
        },
        me() {
            return {
                id: 'abc123',
                name: 'Lady Gaga',
                email: 'lady@gaga.com',
                age: 33,
            }
        },
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter((post) => {
                return post.author === parent.id
            })
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.author === parent.id
            })
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        },
        post(parent, args, ctx, info) {
            return posts.find((post) => {
                return post.id === parent.post
            })
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('The server is up')
})