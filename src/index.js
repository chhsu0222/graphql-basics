import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

// Scalar types - String, Boolean, Int, Float, ID

// Demo user data
let users = [{
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

let posts = [{
    id: '11',
    title: 'What a day',
    body: 'It is a good day.',
    published: true,
    author: '1'
}, {
    id: '12',
    title: 'GraphQL',
    body: 'Still work on it...',
    published: false,
    author: '1'
}, {
    id: '13',
    title: 'Golang',
    body: 'I need to spend more time on it!',
    published: false,
    author: '2'
}]

let comments = [{
    id: '21',
    text: 'Awesome!',
    author: '3',
    post: '12'
}, {
    id: '22',
    text: 'It is great!',
    author: '2',
    post: '11'
}, {
    id: '23',
    text: 'Good job.',
    author: '2',
    post: '12'
}, {
    id: '24',
    text: 'Nice work!',
    author: '3',
    post: '13'
},]

// Type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments: [Comment!]!
        me: User!
        post: Post!
    }

    type Mutation {
        createUser(data: CreateUserInput!): User!
        deleteUser(id: ID!): User!
        createPost(data: CreatePostInput!): Post!
        createComment(data: CreateCommentInput!): Comment!
    }

    input CreateUserInput {
        name: String! 
        email: String! 
        age: Int
    }

    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }

    input CreateCommentInput {
        text: String!
        author: ID!
        post: ID!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
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
        comments(parent, args, ctx, info) {
            return comments
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
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some((user) => user.email === args.data.email)

            if (emailTaken) {
                throw new Error('Email taken')
            }

            const user = {
                id: uuidv4(),
                ...args.data
            }

            users.push(user)

            return user
        },
        deleteUser(parent, args, ctx, info) {
            const userIndex = users.findIndex((user) => user.id === args.id)

            if (userIndex === -1) {
                throw new Error('User not found')
            }

            const deletedUsers = users.splice(userIndex, 1)

            // delete user's posts
            posts = posts.filter((post) => {
                const match = post.author === args.id

                if (match) {
                    // delete the comments belong to the post
                    comments = comments.filter((comment) => comment.post !== post.id)
                }

                return !match
            })

            // delete the user's comments
            comments = comments.filter((comment) => comment.author !== args.id)

            return deletedUsers[0] 
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some((user) => user.id === args.data.author)

            if (!userExists) {
                throw new Error('User not found')
            }

            const post = {
                id: uuidv4(),
                ...args.data
            }

            posts.push(post)

            return post
        },
        createComment(parent, args, ctx, info) {
            const userExists = users.some((user) => user.id === args.data.author)

            if (!userExists) {
                throw new Error('User not found')
            }

            const postExists = posts.some((post) => post.id === args.data.post && post.published)

            if (!postExists) {
                throw new Error('Post not found')
            }

            const comment = {
                id: uuidv4(),
                ...args.data 
            }

            comments.push(comment)

            return comment
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            // This method will be called if we ask for 'author' of a post.
            // The 'post' information lives right here on the 'parent' argument.
            return users.find((user) => {
                return user.id === parent.author
            })
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.post === parent.id
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
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('The server is up on locolhost:4000')
})
