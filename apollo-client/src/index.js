import ApolloBoost, { gql } from 'apollo-boost';

const client = new ApolloBoost({
    uri: 'http://localhost:4000'
})

const getUsers = gql`
    query {
        users {
            id
            name
        }
    }
`

const getPosts = gql`
    query {
        posts {
            title
            author {
                name
            }
        }
    }
`

client.query({
    query: getUsers
}).then((res) => {
    const html =  res.data.users.map((user) => {
        return `<h2>${user.name}</h2>`
    }).join(' ')

    document.getElementById('users').innerHTML = html;
})

client.query({
    query: getPosts
}).then((res) => {
    const html =  res.data.posts.map((post) => {
        return `<div>
                <h3>${post.title}</h3>
                <span>${post.author.name}</span>
                </div>`
    }).join(' ')

    document.getElementById('posts').innerHTML = html;
})





