
import uuidv4 from 'uuid';

const Mutation = {
    createUser(parent, args, { db }, info) {
        const emailTaken = db.users.some((user) => user.email === args.data.email)
        if (emailTaken) {
            throw new Error('Email taken.')
        }
       const user = {
           id: uuidv4(),
           ...args.data
       }
       db.users.push(user)
       return user
    },
    deleteUser(parent, args, { db }, info) {
        const userIndex = db.users.findIndex((user) => user.id === args.id)
        if (userIndex === -1) {
            throw new Error('User not found')
        }
        const deletedUsers = db.users.splice(userIndex, 1)
        db.posts = db.posts.filter((post) => {
            const match = post.author === args.id
            if (match) {
                db.comments = db.comments.filter((comment) => comment.post !== post.id)
            }
            return !match
        })
        db.comments = db.comments.filter((comment) => comment.author !== args.id)

        return  deletedUsers[0]
    },
    updateUser(parent, { id, data }, { db }, info) {
        const user = db.users.find((user) => user.id === id)
        if (!user) {
            throw new Error('User not found.')
        }
        if (typeof data.email === 'string') {
            const emailTaken = db.users.some((user) => user.email === data.email)
            if (emailTaken) {
                throw new Error('Email already taken')
            }
            user.email = data.email;
        }
        if (typeof data.name === 'string') {
            user.name = data.name;
        }
        if (typeof data.age !== 'undefined') {
            user.age = data.age;
        }
       return user
    },
    createPost(parent, args, { db, pubsub }, info) {
        const userExists = db.users.some((user) => user.id === args.data.author)
        if (!userExists) {
            throw new Error("User not found.")
        }
        const post = {
            id: uuidv4(),
            ...args.data
        }
        db.posts.push(post)
        if (args.data.published) {
            pubsub.publish('post', { post: { data: post, mutation: 'CREATED' } })
        }
       
       return post
    },
    deletePost(parent, args, { db, pubsub }, info) {
        const postIndex = db.posts.findIndex((post) => post.id === args.id)
        if (postIndex === -1) {
            throw new Error('Post not found')
        }
        const deletedPosts = db.posts.splice(postIndex, 1)
        db.comments = db.comments.filter((comment) => comment.post !== args.id)

        if (deletedPosts[0].published) {
            pubsub.publish('post', { post: { data: deletedPosts[0], mutation: 'DELETED' } })
        }
       
        return  deletedPosts[0]
    },
    updatePost(parent, { id, data }, { db, pubsub }, info) {
        const post = db.posts.find((post) => post.id === id)
        const originalPost = { ...post }
        if (!post) {
            throw new Error('Post not found.')
        }
        if (typeof data.title === 'string') {
            post.title = data.title;
        }
        if (typeof data.body === 'string') {
            post.body = data.body;
        }
        if (typeof data.published === 'boolean') {
            post.published = data.published;
            if (originalPost.published && !post.published) {
                pubsub.publish('post', { post: { data: originalPost, mutation: 'DELETED' } })
            } else if (!originalPost.published && post.published) {
                pubsub.publish('post', { post: { data: post, mutation: 'CREATED' } })
            } 
        } else if (post.published) {
            pubsub.publish('post', { post: { data: post, mutation: 'UPDATED' } })
        }


       return post
    },
    createComment(parent, args, { db, pubsub }, info) {
        const authorExists = db.users.some((user) => user.id === args.data.author)
        const postExists = db.posts.some((post) => post.id === args.data.post && post.published)
        if (!authorExists ) {
            throw new Error("Author doesn't exist")
        }
        if (!postExists ) {
            throw new Error("Post doesn't exist")
        }
        const comment = {
           id: uuidv4(),
           ...args.data
       }
       db.comments.push(comment)
       
       pubsub.publish(`comment ${args.data.post}`, { comment: { data: comment, mutation: 'CREATED' }})
       return comment
    },
    deleteComment(parent, args, { db, pubsub }, info) {
        const commentIndex = db.comments.findIndex((comment) => comment.id === args.id)
        if (commentIndex === -1) {
            throw new Error('Comment not found')
        }
        const deletedComments = db.comments.splice(commentIndex, 1)
        pubsub.publish(`comment ${deletedComments[0].post}`, { comment: { data: deletedComments[0], mutation: 'DELETED' }})
        return  deletedComments[0]
    },
    updateComment(parent, { id, data }, { db, pubsub }, info) {
        const comment = db.comments.find((comment) => comment.id === id)
        if (!comment) {
            throw new Error('Comment not found.')
        }
        if (typeof data.text === 'string') {
            comment.text = data.text;
        }
       pubsub.publish(`comment ${comment.post}`, { comment: { data: comment, mutation: 'UPDATED' }})
       return comment
    },

}

export { Mutation as default }