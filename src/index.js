import { GraphQLServer } from 'graphql-yoga'

// Scalar types - String, Boolean, Int, Float, ID

// Demo user data
const users = [{
    id: '1',
    name: 'Hsu',
    email: 'hsu@test.com',
    age: 28
}, {
    id: '2',
    name: 'Sara',
    email: 'sara@test.com'
}, {
    id: '3',
    name: 'John',
    email: 'john@test.com',
    age: 35
}]

const posts = [{
    id: '1',
    title: 'What a day',
    body: 'It is a good day.',
    published: true
}, {
    id: '2',
    title: 'GraphQL',
    body: 'Still work on it...',
    published: false
}, {
    id: '3',
    title: 'Golang',
    body: 'I need to spend more time on it!',
    published: false
}]

// Type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`

// Resolvers
const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users
            }

            return users.filter((user) => {
                // case-insensitive search
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts
            }

            const query = args.query.toLowerCase()
            return posts.filter((post) => {
                return post.title.toLowerCase().includes(query) || post.body.toLowerCase().includes(query)
            })
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
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('The server is up on locolhost:4000')
})
