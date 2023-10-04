
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(morgan(':method :status :total-time[2]'))
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

let persons = [
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

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    response.send(`Phonebook has info for ${persons.length} people`)
})

app.get('/api/persons', (request, response) => {
 response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p =>  p.id === id)
        if (person) {
            response.json(person)
        } else {
            response.status(204).end()
        }
    }
)

app.delete('/api/persons/:id', (request, response) => {
   const id = Number(request.params.id)
   const person = persons.find(p => p.id === id)

   if (person) {
     response.send(`${person.name} deleted from server.`)
   } else {
    response.status(204).end()
   }
})

const generateId = () => {
    const maxId = persons.length > 0
    ? Math.max(...persons.map(p => p.id))
    : 0
    return maxId + 1
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    const checkDuplicates = persons.find(p => p.name === person.name)

    if (!checkDuplicates) {
    persons = persons.concat(person)
    response.json(person)
    } else {
        return response.status(404).json({
            error: 'Name must be unique'
        })
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=> {
console.log(`server running on port: ${PORT}`)
})
