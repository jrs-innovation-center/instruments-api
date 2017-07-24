require('dotenv').config()

const express = require('express')
const app = express()
//const dal = require('./dal.js')
const dal = require('./dal-sql2.js')
const port = process.env.PORT || 4000
const HTTPError = require('node-http-error')
const bodyParser = require('body-parser')
const { pathOr, keys, difference, path } = require('ramda')

const checkRequiredFields = require('./lib/check-required-fields')
const checkInstrumentReqFields = checkRequiredFields([
  'name',
  'category',
  'group',
  'retailPrice',
  'manufacturer'
])

app.use(bodyParser.json())

app.get('/', function(req, res, next) {
  res.send('Welcome to the Instruments API.')
})

//   CREATE  - POST /instruments
app.post('/instruments', function(req, res, next) {
  const arrFieldsFailedValidation = checkInstrumentReqFields(req.body)
  if (arrFieldsFailedValidation.length > 0) {
    return next(
      new HTTPError(400, 'Missing Required Fields', {
        fields: arrFieldsFailedValidation
      })
    )
  }

  dal.addInstrument(req.body, function(err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(201).send(data)
  })
})

// READ - GET /instruments/:id
app.get('/instruments/:id', function(req, res, next) {
  dal.getInstrument(req.params.id, function(err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    if (data) {
      res.status(200).send(data)
    } else {
      next(new HTTPError(404, 'Not Found', { path: req.path }))
    }
  })
})

//   UPDATE -  PUT /instruments/:id

app.put('/instruments/:id', function(req, res, next) {
  const instrumentId = req.params.id
  const requestBody = pathOr('no body', ['body'], req)

  if (requestBody === 'no body') {
    return next(new HTTPError(400, 'Missing instrument json in request body.'))
  }

  const arrFieldsFailedValidation = checkInstrumentReqFields(requestBody)

  if (arrFieldsFailedValidation.length > 0) {
    return next(
      new HTTPError(400, 'Missing Required Fields', {
        fields: arrFieldsFailedValidation
      })
    )
  }

  if (requestBody.type != 'instrument') {
    return next(new HTTPError(400, "'type' field value must be equal to 'cat'"))
  }

  if (instrumentId != requestBody._id) {
    return next(
      new HTTPError(
        400,
        'The instrument id in the path must match the instrument id in the request body'
      )
    )
  }

  dal.updateInstrument(requestBody, function(err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(data)
  })
})

// DELETE -  DELETE /instruments/:id
app.delete('/instruments/:id', function(req, res, next) {
  const instrumentId = req.params.id
  console.log('instrumentId id: ', instrumentId)
  dal.deleteInstrument(instrumentId, function(err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))

    res.status(200).send(data)
  })
})

//   LIST - GET /instruments
app.get('/instruments', function(req, res, next) {
  var limit = pathOr(5, ['query', 'limit'], req)
  limit = Number(limit)

  const filter = pathOr(null, ['query', 'filter'], req)
  const lastItem = pathOr(null, ['query', 'lastItem'], req)

  dal.listInstruments(lastItem, filter, limit, function(err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(data)
  })
})

app.use(function(err, req, res, next) {
  console.log(req.method, ' ', req.path, ' ', 'error: ', err)
  res.status(err.status || 500)
  res.send(err)
})

app.listen(port, () => console.log('API Running on port:', port))
