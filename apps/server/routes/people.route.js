const { Router } = require('express')
const { axios } = require('../utils/axios.util')

const router = Router()

router.get('/', async (req, res) => {
    try {
        const people = await paginatePeople()
        if (req.query.sortBy) {
            const { sortBy } = req.query
            res.status(200).json(people.sort((a, b) => {
                const A = isNaN(parseFloat(a[sortBy].replace(/,/g, ''))) ? a[sortBy] : parseFloat(a[sortBy].replace(/,/g, ''))
                const B = isNaN(parseFloat(b[sortBy].replace(/,/g, ''))) ? b[sortBy] : parseFloat(b[sortBy].replace(/,/g, ''))
                if (A === 'unknown') return 1
                if (B === 'unknown') return -1
                return (A > B) ? 1 : -1
            }))
        } else {
            res.status(200).json(people)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

const paginatePeople = async () => {
    const people = []
    let page = 1
    const response = await axios.get(`people?page=${page}`)
    let next = response.data.next
    if (response.status !== 200) {
        throw response.data
    } else {
        people.push(...response.data.results)
        while (next) {
            page++
            const innerResponse = await axios.get(`people?page=${page}`)
            if (innerResponse.status !== 200) {
                throw innerResponse.data
            } else {
                if (!innerResponse.data.next) {
                    next = false
                }
                people.push(...innerResponse.data.results)
            }
        }
    }
    return people
}

exports.people = router