const Query = {
    users(parent, args, { db }, info) {
        if (!args.query) {
            return db.users
        }

        return db.users.filter((user) => {
            // case-insensitive search
            return user.name.toLowerCase().includes(args.query.toLowerCase())
        })
    },
    posts(parent, args, { db }, info) {
        if (!args.query) {
            return db.posts
        }

        const query = args.query.toLowerCase()
        return db.posts.filter((post) => {
            return post.title.toLowerCase().includes(query) || post.body.toLowerCase().includes(query)
        })
    },
    comments(parent, args, { db }, info) {
        return db.comments
    },
    me() {
        return {
            id: 'abc123',
            name: 'Mike',
            email: 'mike@test.com',
            age: 28
        }
    },
    post() {
        return {
            id: 'efg456',
            title: 'What a day',
            body: 'It is a good day.',
            published: true
        }
    }
}

export { Query as default }
