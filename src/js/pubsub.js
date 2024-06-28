const pubsub = () => {
    const interactions = {}

    const pub = (type, values) => {
        if (!interactions[type]) {
            return
        }

        interactions[type].forEach(callback => callback(...values))
    }

    const sub = (type, callback) => {
        if (!interactions[type]) {
            interactions[type] = []
        }

        interactions[type].push(callback)
    }

    return { pub, sub }
}

export default pubsub
