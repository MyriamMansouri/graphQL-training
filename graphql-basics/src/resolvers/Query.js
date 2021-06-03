const Query = {
    comments(parent, args, { db }, info) {
        return db.comments
    },
    users(parent, args, { db }, info) {
        return !args.query ? db.users : db.users.filter((user) => user.name.toLowerCase().includes(args.query.toLowerCase()))
    },
    posts(parent, args, { db }, info) {
        if (!args.query) {
            return db.posts
        }
        return db.posts.filter((post) => {
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
    }
}

export { Query as default }