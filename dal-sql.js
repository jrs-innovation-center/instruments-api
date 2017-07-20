const mysql = require('mysql')
const pkGenerator = require('./lib/build-primary-key')
const instrumentPKGenerator = pkGenerator('instrument_')
const { assoc, omit, head, path } = require('ramda')
const HTTPError = require('node-http-error')

//////////////////////
//   Instruments
//////////////////////
const addInstrument = (instrument, callback) => {
  add(instrument, callback)
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
    var connection = createConnection()

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
        if (data) {
          // unbox the first (head) object from the array.
          // format the object using the supplied formatter, such as formatInstrument()\
          const formatted = formatter(head(data))
          console.log('getDocByID formatted data: ', formatted)

          return callback(null, formatted)
          //TODO: remove this commentted code ... return callback(null, data.map(compose(parseToJSON, formatter))[0]);
        }
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

const prepInstrumentForDB = instrument => omit('type', instrument)

function createInstrument(instrument, callback) {
  // Call to mysql retrieving a document with the given _id value.
  if (typeof data == 'undefined' || data === null) {
    return callback(new Error('400Missing data for create'))
  } else if (data.hasOwnProperty('_id') === true) {
    return callback(
      new Error(
        '400Unnecessary id property within data. ' +
          'createPerson() will generate a unique id'
      )
    )
  } else if (data.hasOwnProperty('lastName') !== true) {
    return callback(new Error('400Missing lastName property within data'))
  } else if (data.hasOwnProperty('firstName') !== true) {
    return callback(new Error('400Missing firstName property within data'))
  } else if (data.hasOwnProperty('email') !== true) {
    return callback(new Error('400Missing email property within data'))
  } else {
    //TO DO:  Exercise. map function to format phone number
    var connection = createConnection()

    connection.query('INSERT INTO person SET ? ', prepDataForDB(data), function(
      err,
      result
    ) {
      if (err) return callback(err)
      if (typeof result !== 'undefined' && result.insertId !== 'undefined') {
        return callback(null, {
          ok: true,
          id: result.insertId
        })
      }
    })
    connection.end(function(err) {
      if (err) return err
    })
  }
}

const dal = {
  getInstrument
}

//   listInstruments,
//   getInstrument,
//   deleteInstrument,
//   updateInstrument
// }

module.exports = dal
