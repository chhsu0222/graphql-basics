const Post = {
    author(parent, args, { db }, info) {
        // This method will be called if we ask for 'author' of a post.
        // The 'post' information lives right here on the 'parent' argument.
        return db.users.find((user) => {
            return user.id === parent.author
        })
    },
    comments(parent, args, { db }, info) {
        return db.comments.filter((comment) => {
            return comment.post === parent.id
        })
    }
}

export { Post as default }
