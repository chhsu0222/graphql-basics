const Subscription = {
    count: {
        // Subscriptions resolvers are not a function,
        // but an object with subscribe method, that returns AsyncIterable.
        subscribe(parent, args, { pubsub }, info) {
            let count = 0

            setInterval(() => {
                count++
                pubsub.publish('count', {
                    count
                })
            }, 1000)

            return pubsub.asyncIterator('count') // count is the channel name
        }
    },
    comment: {
        subscribe(parent, { postId }, { db, pubsub }, info) {
            const post = db.posts.find((post) => post.id === postId && post.published)

            if (!post) {
                throw new Error('Post not found')
            }

            // we want a channel specific to the comments for this post
            return pubsub.asyncIterator(`comment ${postId}`)
        }
    }
}

export { Subscription as default }
