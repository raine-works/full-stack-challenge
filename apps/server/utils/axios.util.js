const { create } = require('axios')

const instance = create({
    baseURL: 'https://swapi.dev/api/',
    headers: {
        'Content-Type': 'application/json'
    },
    validateStatus: (status) => {
        return (status >= 200 && status < 400) || status === 404
    }
})

exports.axios = instance