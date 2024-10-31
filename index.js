const express = require('express')
const app = express()
require('dotenv').config()
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')


morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}



app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    const date = new Date()
    response.send(`
        <p>Phonebook has info for ${Person.countDocuments({})} people</p>
        <p>${date}</p>
        `)
})



app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = Person.findById(person => person.id === id)
  
    if (person) {
      response.json(person)
    } else {
      response.status(404).send({ error: 'Person not found' })
    }
})



app.post('/api/persons', (request, response) => {
    const { name, number } = request.body

    if (!name || !number) {
      return response.status(400).json({ error: 'Name and number are required' })
    }
    
    const person = new Person({
        name: name,
        number: number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})



app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
})



app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})