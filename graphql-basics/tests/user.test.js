import 'cross-fetch/polyfill';
import 'regenerator-runtime/runtime'
import ApolloBoost, { gql } from 'apollo-boost';

const client = new ApolloBoost({
    uri: 'http://localhost:4000'
})

const getUsers = gql`
    query {
        users {
            id
        }
    }
`

const deleteUser = gql`
    mutation DeleteUser($id: ID!){
        deleteUser(id: $id) {
            id
        }
    }
`

const createUser = gql`
    mutation {
        createUser(data: {name: "Dummy", email: "dummy@user.com"}) {
            id
        }
    }
`

const createPost = gql`
    mutation CreatePost ($author: ID!, $title: String!, $body: String!, $published: Boolean!) {
        createPost(data: {title: $title, body: $body, published: $published, author: $author}) {
            title
            body
            author {
                id
            }
        }
    }
`


beforeAll(async () => {
    // clean DB before executing tests
    const res = await client.query({
        query: getUsers
    })

    const users = res.data.users

    users.forEach(async (user) => {
        await client.mutate({
            mutation: deleteUser,
            variables: {id: user.id}
        })
    });

    // Create dummy user
    const newRes = await client.mutate({
        mutation: createUser
    })

    const newUserId = newRes.data.createUser.id

    // Create fake posts
    const test = await client.mutate({
        mutation: createPost,
        variables: {
            title: "Hello",
            body: "You",
            published: true,
            author: newUserId
        }
    })

    await client.mutate({
        mutation: createPost,
        variables: {
            title: "Hello",
            body: "Me",
            published: false,
            author: newUserId
        }
    })
})

test('Should create a new user', async () => {
    const createUser = gql`
        mutation {
            createUser(data: {name: "Nana", email: "nana@nana.com"}) {
                name
                email
            }
        }
    `

    const res = await client.mutate({
        mutation: createUser
    })

    expect(res.data.createUser.email).toBe("nana@nana.com")
})

test('Should query all posts', async () => {
    const getPosts = gql`
        query {
            posts {
                id
            }
        }
    `
    const res = await client.query({
        query: getPosts
    })

    expect(res.data.posts.length).toBe(2)
})

test('Should throw error if trying to delete a user that is not in the DB', async () => {
    await expect( client.mutate({
        mutation: deleteUser,
        variables: {id: "1456768"}
    })).rejects.toThrow()
})