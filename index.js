const express = require('express')
const morgan = require('morgan')
const app = express()
var fs = require('fs')
const cors = require('cors')

app.use(cors())

let persons = [  
	{    
	name: "Arto Hellas",    
	number: "040-123456",    
	id: 1  },  
	{    
	name: "Ada Lovelace",    
	number: "39-44-5323523",    
	id: 2   },  
	{    
	name: "Dan abramov",    
	number: "12-43-234345",    
	id: 3  },
 	{
    name: "Mary Poppendieck",
    numbeid: "39-23-6423122",
    id: 4
    }
]

const total = persons.reduce((sum, p) => sum + 1, 0)
var date = new Date()
var now =  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
 date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds())

var newDate = new Date(now)

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

morgan.token('body', (req, res) => {
	return JSON.stringify(req.body)
  })
  
app.get('/api', (req, res) => {
	res.send('<h1>Hello World!</h1>')
  })

app.get('/api/persons', (req, res) => {
	res.json(persons)
  })

app.get('/api/info', (req, res) => {
	res.send('<p> Phonebook has info for ' + total + 
	' people </p>' + newDate)
})

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	const person = persons.find(person => person.id === id)
	
	if (person) {
		response.json(person)
	} else {
		response.status(404).end()
	}	
})

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	persons = persons.filter(person => person.id !== id)

	response.status(204).end()
})


const generateId = () => {
	return Math.floor(Math.random() * 2147483111111111647)
  }

app.post('/api/persons', (request, response) => {
	const body = request.body

	if (!body.name || !body.number) {
		return response.status(400).json({
			error:'name or number missing'
		})
	}

	const person = {
		name: body.name,
		number: body.number,
		id: generateId(),
	}

	const name_already_exists = persons.find(person => person.name.toUpperCase() === body.name.toUpperCase())
	
	if (name_already_exists) {
		return response.status(400).json({
			error:'name must be unique'
		})
	} else {
		persons = persons.concat(person)
		response.json(person)
	}

})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
  })