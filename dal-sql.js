const mysql = require('mysql')
const pkGenerator = require('./lib/build-primary-key')
const instrumentPKGenerator = pkGenerator('instrument_')
const { assoc, omit, head, path, compose } = require('ramda')
const HTTPError = require('node-http-error')

//////////////////////
//   Instruments
//////////////////////
const addInstrument = (instrument, callback) => {
  createInstrument(instrument, callback)
}

const getInstrument = (instrumentId, callback) =>
  getDocByID('instrument', instrumentId, formatInstrument, callback)

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
  } else if (lastItem) {
    // They are asking to paginate.  Give them the next page of results
  } else {
    // Give the first page of results.
  }

  console.log('query:', query)
  findDocs(query, callback)
}

////////////////////////////
//    helper functions
////////////////////////////

// MYSQL_HOST=0.0.0.0
// MYSQL_USER="root"
// MYSQL_PASSWORD=mypassword
// MYSQL_DATABASE=relief_tracker

function createConnection() {
  return mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  })
}

function getDocByID(tablename, id, formatter, callback) {
  console.log('getDocByID was called:', tablename, id)
  if (id) {
    const connection = createConnection()

    //  THIS IS WHAT AN INSTRUMETN DOC LOOKS LIKE IN COUCHDB
    //  WE HAVD TO TRANSFORM THE ROW RETURNED FROM MYSQL INTO THIS FORMAT
    //

    // {
    //   "_id": "instrument_cello_cello_platinum",
    //   "_rev": "1-58f65a903e5dbb7014fbaed615679fc4",
    //   "name": "Cello Platinum",
    //   "type": "instrument",
    //   "category": "cello",
    //   "group": "strings",
    //   "retailPrice": 600,
    //   "manufacturer": "Strings, Inc."
    // }

    connection.query(
      'SELECT * FROM ' + connection.escapeId(tablename) + ' WHERE id = ?',
      [id],
      function(err, data) {
        if (err) return callback(err)
        if (data.length === 0) {
          return callback(
            new HTTPError(404, 'not_found', {
              error: 'not_found',
              reason: 'missing',
              name: 'not_found',
              status: 404,
              message: 'missing'
            })
          )
        }
        // unbox the first (head) object from the array.
        // format the object using the supplied formatter, such as formatInstrument()\
        const formatted = formatter(head(data))
        console.log('getDocByID formatted data: ', formatted)
        return callback(null, formatted)
      }
    )
    connection.end(function(err) {
      if (err) return err
    })
  } else {
    return callback(new HTTPError(400, 'Missing id parameter'))
  }
}

const formatInstrument = instrument => {
  // COUCH DATA- target
  // {
  //   "_id": "instrument_cello_cello_platinum",
  //   "_rev": "1-58f65a903e5dbb7014fbaed615679fc4",
  //   "name": "Cello Platinum",
  //   "type": "instrument",
  //   "category": "cello",
  //   "group": "strings",
  //   "retailPrice": 600,
  //   "manufacturer": "Strings, Inc."
  // }

  // rename id to _id
  instrument = assoc('_id', path(['ID'], instrument), instrument)
  instrument = omit('ID', instrument)

  // rename instrumentGroup to group
  instrument = assoc('group', path(['instrumentGroup'], instrument), instrument)
  instrument = omit('instrumentGroup', instrument)

  // add a key of _rev
  instrument = assoc('_rev', null, instrument)
  // add a key of type
  instrument = assoc('type', 'instrument', instrument)

  return instrument
}

const prepInstrumentForInsert = instrument => {
  instrument = assoc('instrumentGroup', path(['group'], instrument), instrument)

  return compose(omit('group'), omit('_rev'), omit('_id'), omit('type'))(
    instrument
  )
}

function createInstrument(instrument, callback) {
  if (instrument) {
    const connection = createConnection()

    connection.query(
      'INSERT INTO instrument SET ? ',
      prepInstrumentForInsert(instrument),
      function(err, result) {
        if (err) return callback(err)
        if (typeof result !== 'undefined' && result.insertId !== 'undefined') {
          callback(null, {
            ok: true,
            id: result.insertId
          })
        } else {
          callback(null, {
            ok: false,
            id: null
          })
        }
      }
    )
    connection.end(function(err) {
      if (err) return err
    })
  } else {
    return callback(new HTTPError(400, 'Missing instrument'))
  }
}

const dal = {
  getInstrument,
  addInstrument
}

module.exports = dal
