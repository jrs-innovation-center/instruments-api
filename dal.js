const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'))

const db = new PouchDB(process.env.COUCHDB_URL + process.env.COUCHDB_NAME)
const pkGenerator = require('./lib/build-primary-key')

const instrumentPKGenerator = pkGenerator('instrument_')
const {
  map,
  append,
  find,
  reject,
  compose,
  trim,
  merge,
  split,
  head,
  last,
  assoc
} = require('ramda')

//////////////////////
//   Instruments
//////////////////////
const addInstrument = (instrument, callback) => {
  // example _id -- "instrument_piccolo_piccolo_beethoven"
  instrument = assoc(
    '_id',
    instrumentPKGenerator(
      trim(instrument.category) + ' ' + trim(instrument.name)
    ),
    instrument
  )
  instrument = assoc('type', 'instrument', instrument)
  add(instrument, callback)
}
const getInstrument = (instrumentId, callback) => get(instrumentId, callback)
const updateInstrument = (updatedInstrument, callback) =>
  update(updatedInstrument, callback)
const deleteInstrument = (instrumentId, callback) =>
  deleteDoc(instrumentId, callback)

const listInstruments = (lastItem, filter, limit, callback) => {
  var query = {}

  if (filter) {
    // filter = "category:cello"
    const arrFilter = split(':', filter) // ['category','cello']
    const filterField = head(arrFilter) // "category"
    const filterValue = last(arrFilter) // "cello"

    //   why?  the filter is limiting our records.  no need to paginate
    const selectorValue = {}

    //selectorValue.category = "cello"
    // or use ramda's assoc(filterField,Number(filterValue) ? Number(filterValue) : filterValue, selectorValue )
    selectorValue[filterField] = Number(filterValue)
      ? Number(filterValue)
      : filterValue

    query = { selector: selectorValue, limit } // { selector: {category: "cello"}, limit: 5 }
  } else if (lastItem) {
    // They are asking to paginate.  Give them the next page of results
    query = { selector: { _id: { $gt: lastItem }, type: 'instrument' }, limit }
  } else {
    // Give the first page of results.
    query = { selector: { _id: { $gte: null }, type: 'instrument' }, limit }
  }

  console.log('query:', query)
  findDocs(query, callback)
}

////////////////////////////
//    helper functions
////////////////////////////
// function list(options, callback) {
//   db.allDocs(options, function(err, data) {
//     if (err) callback(err)
//     callback(null, map(row => row.doc, data.rows))
//   })
// }

function add(doc, callback) {
  console.log('add doc', doc)
  db.put(doc, function(err, doc) {
    if (err) callback(err)
    callback(null, doc)
  })
}

function get(id, callback) {
  db.get(id, function(err, doc) {
    if (err) callback(err)
    callback(null, doc)
  })
}

function update(doc, callback) {
  db.put(doc, function(err, doc) {
    if (err) callback(err)
    callback(null, doc)
  })
}

function deleteDoc(id, callback) {
  db
    .get(id)
    .then(function(doc) {
      return db.remove(doc)
    })
    .then(function(result) {
      callback(null, result)
    })
    .catch(function(err) {
      callback(err)
    })
}

const findDocs = (query, cb) =>
  query
    ? db.find(query).then(res => cb(null, res.docs)).catch(err => cb(err))
    : cb(null, [])

const dal = {
  addInstrument,
  listInstruments,
  getInstrument,
  deleteInstrument,
  updateInstrument
}

module.exports = dal
