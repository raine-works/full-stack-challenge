const { people } = require('./routes/people.route')
const { planets } = require('./routes/planets.route')

const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 4000;
const app = express();  

app.use(cors())
app.use(express.json())

app.use('/people', people)
app.use('/planets', planets)

/** Catch all */
app.use((req, res) => {
    res.status(404).json({ error: '404 - Resource not found' })
})

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
