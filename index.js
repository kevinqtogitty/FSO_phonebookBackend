const cors = require('cors')
const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(cors())
app.use(express.json())
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :body'))



let phoneBookEntries = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
]

app.get('/api/persons', (req, res) => {
    res.send(JSON.stringify(phoneBookEntries))
    
})

app.get('/info', (req, res) => {
    const numberOfEntries = phoneBookEntries.length
    const newDate = new Date()
    res.send(`Phonebook has info for ${numberOfEntries} people <br/> ${newDate}`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = phoneBookEntries.find(person => person.id === id)

    if(person) {
        res.send(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    phoneBookEntries = phoneBookEntries.filter(person => person.id !== id)

    res.status(204).end()
})

const generateId = () => {
    //If the length of phoneBookEntries is greater than 0 use Math.max. We map over the entries and return the id's inside an array,
    //but Math.max does not work on arrays, so we use the spread operator to break them out from the collection into individual values
    const maxId = phoneBookEntries.length > 0 ? 
        Math.max(...phoneBookEntries.map(person => person.id)) : 0
    return maxId + 1
}

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if (!body.name || !body.number) {
        res.status(404).json({error: 'Missing name or number'}).end()
        return
    } else if (phoneBookEntries.find(person => person.name.toLowerCase() === body.name.toLowerCase())) {
        res.status(404).json({error: "This person has already been added into the phonebook"}).end()
        return
    } else if (phoneBookEntries.find(person => person.number === body.number)) {
        res.status(404).json({error: "This number is already in the phonebook"}).end()
        return
    }

    const entry = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    phoneBookEntries = phoneBookEntries.concat(entry)

    res.json(phoneBookEntries)
})

const PORT = process.env.PORT || 3001
app.listen(PORT)