require('dotenv').config()

const express = require('express')
const app = express()
const dal = require('./dal-sql.js')
const port = process.env.PORT || 4000
const HTTPError = require('node-http-error')
const bodyParser = require('body-parser')
const checkRequiredFields = require('./lib/check-required-fields')
const ckInstrumentFields = checkRequiredFields([
  'name',
  'category',
  'group',
  'retailPrice',
  'manufacturer'
])
const ckInstrumentUpdateFields = checkRequiredFields([
  '_id',
  '_rev',
  'type',
  'name',
  'category',
  'group',
  'retailPrice',
  'manufacturer'
])

const { pathOr, path } = require('ramda')

app.use(bodyParser.json())

app.get('/', function(req, res, next) {
  res.send('Welcome to the Instruments API.')
})

//   CREATE  - POST /instruments
app.post('/instruments', function(req, res, next) {
  const instrument = pathOr(null, ['body'], req)
  const ckInstrumentFieldsResults = ckInstrumentFields(instrument)

  ckInstrumentFieldsResults.length > 0
    ? next(
        new HTTPError(400, 'missing required fields', {
          ckInstrumentFieldsResults
        })
      )
    : dal.addInstrument(instrument, function(err, result) {
        if (err) return next(new HTTPError(err.status, err.message, err))
        res.status(201).send(result)
      })
})

app.get('/instruments/:id', function(req, res, next) {
  const id = path(['params', 'id'], req)

  dal.getInstrument(
    id,
    (err, result) =>
      err
        ? next(new HTTPError(err.status, err.message, err))
        : res.status(200).send(result)
  )
})

app.put('/instruments/:id', function(req, res, next) {
  const id = path(['params', 'id'], req)
  const body = pathOr(null, ['body'], req)

  const updateResults = ckInstrumentUpdateFields(body)

  if (id != pathOr(null, ['body', '_id'], req)) {
    return next(
      new HTTPError(400, 'The id value within path and body must match.')
    )
  }

  updateResults.length === 0
    ? dal.updateInstrument(body, function(err, result) {
        if (err) next(new HTTPError(err.status, err.message, err))
        res.status(200).send(result)
      })
    : next(
        new HTTPError(400, 'Missing Required Fields', {
          missingRequiredFields: updateResults
        })
      )
})

app.delete('/instruments/:id', function(req, res, next) {
  dal.deleteInstrument(path(['params', 'id'], req), callbackHelper(next, res))
})

app.get('/instruments', function(req, res, next) {
  console.log('req.query', JSON.stringify(req.query, null, 2))

  const limit = pathOr(5, ['query', 'limit'], req)
  const lastItem = pathOr(null, ['query', 'lastItem'], req)
  const filter = pathOr(null, ['query', 'filter'], req)

  dal.listInstruments(
    lastItem,
    filter,
    Number(limit),
    callbackHelper(next, res)
  )
})

app.use(function(err, req, res, next) {
  console.log(req.method, ' ', req.path, ' ', 'error: ', err)
  res.status(err.status || 500)
  res.send(err)
})

app.listen(port, () => console.log('API Running on port:', port))

/////////////////////////
// HELPERS
////////////////////////
const callbackHelper = (next, response) => (err, result) => {
  if (err) next(new HTTPError(err.status, err.message, err))
  response.status(200).send(result)
}
