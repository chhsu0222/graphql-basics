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

const comments = [{
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

const db = {
    users,
    posts,
    comments
}

export { db as default }
