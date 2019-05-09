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
    }
}

export { Subscription as default }
