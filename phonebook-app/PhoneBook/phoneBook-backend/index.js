
require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(morgan(':method :status :total-time[2]'))
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    response.send(`Phonebook has info for ${persons.length} people`)
})

app.get('/api/persons', (request, response) => {
 Person.find({}).then(person => {
    response.json(person)
 })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name == 'CastError') {
        return response.status(400).send({ error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
   next(error)
}

// this has to be the last  loaded middleware.
app.use(errorHandler)


app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
    .then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
    })

app.delete('/api/persons/:id', (request, response) => {
   Person.findByIdAndRemove(request.params.id)
   .then(result => {
    response.status(204).end()
   })
   .catch(error => next(error))
})

const generateId = () => {
    const maxId = persons.length > 0
    ? Math.max(...persons.map(p => p.id))
    : 0
    return maxId + 1
}

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const person = new Person({
        name: body.name,
        number: body.number
    })

    const checkDuplicates = persons.find(p => p.name === person.name)

    if (!checkDuplicates) {
    person.save()
    .then(savedPerson => {
        response.json(savedPerson)
    })
    } else {
        return response.status(404).json({
            error: 'Name must be unique'
        })
    }
})

app.put('/api/person', (request, response, next) => {
    const { name, number } = request.body
   
    Person.findByIdAndUpdate(
        request.params.id,
        { name, number },
        { new: true, runValidators: true, context: 'query' }
    )
    .then(updatedPerson => {
        response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, ()=> {
console.log(`server running on port: ${PORT}`)
})
