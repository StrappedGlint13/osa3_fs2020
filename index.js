const express = require('express')
const morgan = require('morgan')
const app = express()
var fs = require('fs')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

app.use(cors())


var date = new Date()
var now =  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
 date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds())

var newDate = new Date(now)

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(express.static('build'))


morgan.token('body', (req, res) => {
	return JSON.stringify(req.body)
  })
  
app.get('/api', (req, res) => {
	res.send('<h1>Hello World!</h1>')
  })

app.get('/api/persons', (req, res) => {
	Person.find({}).then(persons => {
	res.json(persons)
  })
})

app.get('/api/info', (req, res) => {
	Person.
	res.send('<p> Phonebook has info for ' + total + 
	' people </p>' + newDate)
})

app.get('/api/persons/:id', (request, response, next) => {
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
	.then(note => {
		response.json(note)
	  })
	  .catch(error => {
		console.log(error)
		response.status(404).end()
	  })
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

	const person = new Person({
		name: body.name,
		number: body.number,
		id: generateId(),
	})

	
	person.save().then(savedPerson => {
		response.json(savedPerson)
	})

})

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body
  
	const person = {
	  name: body.name,
	  number: body.number,
	}
  
	Person.findByIdAndUpdate(request.params.id, person, { new: true })
	  .then(updatedPerson => {
		response.json(updatedPerson.toJSON())
	  })
	  .catch(error => next(error))
  })

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
	console.error(error.message)
  
	if (error.name === 'CastError') {
	  return response.status(400).send({ error: 'malformatted id' })
	}
  
	next(error)
  }
  
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
  })