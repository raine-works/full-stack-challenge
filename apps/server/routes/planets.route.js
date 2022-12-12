const { Router } = require('express')
const { axios } = require('../utils/axios.util')

const router = Router()

router.get('/', async (req, res) => {
    try {
        const planets = await paginatePlanets()
        res.status(200).json(planets)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

const paginatePlanets = async () => {
    const planets = []
    let page = 1
    const response = await axios.get(`planets?page=${page}`)
    let next = response.data.next
    if (response.status !== 200) {
        throw response.data
    }
    for (const i in response.data.results) {
        for (const ii in response.data.results[i].residents) {
            const resident = await axios.get(response.data.results[i].residents[ii])
            if (resident.status !== 200) {
                throw resident.data
            }
            response.data.results[i].residents[ii] = resident.data.name
        }
    }
    planets.push(...response.data.results)
    while (next) {
        page++
        const innerResponse = await axios.get(`planets?page=${page}`)
        if (innerResponse.status !== 200) {
            throw innerResponse.data
        }
        if (!innerResponse.data.next) {
            next = false
        }
        for (const i in innerResponse.data.results) {
            for (const ii in innerResponse.data.results[i].residents) {
                const resident = await axios.get(innerResponse.data.results[i].residents[ii])
                if (resident.status !== 200) {
                    throw resident.data
                }
                innerResponse.data.results[i].residents[ii] = resident.data.name
            }
        }
        planets.push(...innerResponse.data.results)
    }


    return planets
}

exports.planets = router