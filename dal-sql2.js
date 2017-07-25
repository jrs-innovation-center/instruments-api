const mysql = require('mysql')
const HTTPError = require('node-http-error')
const {
  path,
  assoc,
  omit,
  compose,
  head,
  propOr,
  prop,
  map,
  split,
  last,
  pick
} = require('ramda')

////////////////
// instruments
///////////////

const addInstrument = (instrument, callback) => {
  createInstrument(instrument, callback)
}
const getInstrument = (instrumentId, callback) =>
  read('instrument', 'ID', instrumentId, formatInstrument, callback)

const updateInstrument = (instrument, callback) => update(instrument, callback)

const deleteInstrument = (instrumentId, callback) =>
  deleteRow('instrument', instrumentId, callback)

const listInstruments = (lastItem, filter, limit, callback) => {
  // filter = "group:strings"
  if (filter) {
    const arrFilter = split(':', filter) // ['','']
    const filterField = head(arrFilter) === 'group'
      ? 'instrumentGroup'
      : head(arrFilter) // group  --> instrumentGroup
    const filterValue = last(arrFilter)
    //filter = "instrumentGroup:strings"
    filter = `${filterField}:${filterValue}`
  }

  queryDB('instrument', lastItem, filter, limit, formatInstrument, callback)
}

////////////////////
//     orchestra
////////////////////

const getOrchestra = (orchestraId, callback) => {
  console.log('orchestraId: ', orchestraId)

  read('vOrchestra', 'orchestraId', orchestraId, formatOrchestra, callback)
}

//////////////////////////////
///  HELPERS
//////////////////////////////

function createConnection() {
  return mysql.createConnection({
    user: process.env.MYSQL_USER,
    host: process.env.MYSQL_HOST,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  })
}

const createInstrument = (instrument, callback) => {
  if (instrument) {
    const connection = createConnection()
    connection.query(
      'INSERT INTO instrument SET ? ',
      prepInstrumentForInsert(instrument),
      function(err, result) {
        if (err) return callback(err)
        if (propOr(null, 'insertId', result)) {
          callback(null, { ok: true, id: result.insertId })
        } else {
          callback(null, { ok: false, id: null })
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

const read = (tableName, columnName, id, formatter, callback) => {
  if (id && tableName) {
    const connection = createConnection()

    connection.query(
      'SELECT * FROM ' +
        connection.escapeId(tableName) +
        ' WHERE ' +
        connection.escapeId(columnName) +
        ' = ? ',
      //SELECT * FROM vOrchestra WHERE orchestraID = 2

      [id],
      function(err, result) {
        if (err) return callback(err)
        if (propOr(0, 'length', result) > 0) {
          const formattedResult = formatter(head(result))
          console.log('Formatted Result: ', formattedResult)
          return callback(null, formattedResult)
        } else {
          //send back a 404

          return callback(
            new HTTPError(404, 'missing', {
              name: 'not_found',
              error: 'not found',
              reason: 'missing'
            })
          )
        }
      }
    )
  }
}

const update = (instrument, callback) => {
  if (instrument) {
    const connection = createConnection()
    instrument = prepInstrumentForUpdate(instrument)

    connection.query(
      'UPDATE instrument SET ? WHERE ID = ?',
      [instrument, instrument.ID],
      function(err, result) {
        if (err) return callback(err)
        console.log('Updated result: ', result)

        if (propOr(0, 'affectedRows', result) === 1) {
          return callback(null, { ok: true, id: instrument.ID })
        } else if (propOr(0, 'affectedRows', result) === 0) {
          return callback(
            new HTTPError(404, 'missing', {
              name: 'not_found',
              error: 'not found',
              reason: 'missing'
            })
          )
        }
      }
    )

    connection.end(function(err) {
      if (err) return err
    })
  } else {
    return callback(new HTTPError(400, 'Missing information'))
  }
}

const deleteRow = (tableName, id, callback) => {
  if (tableName && id) {
    const connection = createConnection()
    console.log('tableName: ', tableName)
    console.log('id: ', id)

    connection.query(
      'DELETE FROM ' + connection.escapeId(tableName) + ' WHERE ID = ?',
      [id],
      function(err, result) {
        if (err) return callback(err)
        if (result && result.affectedRows === 1) {
          return callback(null, { ok: true, id: id })
        } else if (result && result.affectedRows === 0) {
          return callback(
            new HTTPError(404, 'missing', {
              name: 'not_found',
              error: 'not found',
              reason: 'missing'
            })
          )
        }
      }
    )

    connection.end(err => err)
  } else {
    return callback(new HTTPError(400, 'Missing id or entity name.'))
  }
}

const prepInstrumentForInsert = instrument => {
  instrument = assoc('instrumentGroup', path(['group'], instrument), instrument)

  return compose(omit('group'), omit('_rev'), omit('_id'), omit('type'))(
    instrument
  )
}

const prepInstrumentForUpdate = instrument => {
  instrument = assoc('instrumentGroup', prop('group', instrument), instrument)
  instrument = assoc('ID', prop('_id', instrument), instrument)

  return compose(omit('_id'), omit('_rev'), omit('type'), omit('group'))(
    instrument
  )
}

const formatInstrument = instrument => {
  instrument = assoc('_id', prop('ID', instrument), instrument)
  instrument = assoc('group', prop('instrumentGroup', instrument), instrument)
  return compose(
    omit('ID'),
    omit('instrumentGroup'),
    assoc('_rev', null),
    assoc('type', 'instrument')
  )(instrument)
}

const formatOrchestra = arrOrchestraRows => {
  /*
  {
    orchestraID: 2,
    name: 'Spring 2016 Pops',
    seasonStart: '2016-04-01',
    seasonEnd: '2016-06-30',
    musicians: [
      {musicianID: 1, firstName: 'Jeff', lastName: 'Smith', chair: 1, instrument: 'piccolo'},
      {musicianID: 1, firstName: 'Sally', lastName: 'Smith', chair: 1, instrument: 'oboe'},
      {musicianID: 1, firstName: 'Steve', lastName: 'Smith', chair: 1, instrument: 'violin'}
    ]
}
  */
  const parent = pick(
    ['orchestraID', 'name', 'seasonStart', 'seasonEnd'],
    head(arrOrchestraRows)
  )

  const child = map(
    r =>
      pick(['musicianID', 'firstName', 'lastName', 'chair', 'instrument'], r),
    arrOrchestraRows
  )

  return assoc('musicians', child, parent)
}

const queryDB = (tableName, lastItem, filter, limit, formatter, callback) => {
  limit = limit ? limit : 5

  const connection = createConnection()

  if (filter) {
    console.log('FILTER MODE')
    // filter  = "category:Oboe"
    const arrFilter = split(':', filter) // ['category','Oboe']
    const filterField = head(arrFilter)
    const filterValue = last(arrFilter)

    // SELECT *
    // FROM instrument
    // WHERE category = 'oboe'
    const sql = `SELECT *
    FROM ${connection.escapeId(tableName)}
    WHERE ${filterField} = ?
    ORDER BY name
    LIMIT ${limit}`

    console.log('sql:', sql)

    connection.query(sql, [filterValue], function(err, result) {
      if (err) return callback(err)
      return callback(null, map(formatter, result))
    })
  } else if (lastItem) {
    console.log('NEXT PAGE MODE')

    const sql = `SELECT *
    FROM ${connection.escapeId(tableName)}
    WHERE name > ?
    ORDER BY name
    LIMIT ${limit}`

    console.log('SQL', sql)

    connection.query(sql, [lastItem], function(err, result) {
      if (err) return callback(err)
      return callback(null, map(formatter, result))
    })
  } else {
    console.log('SIMPLE LIST. FIRST PAGE')
    const sql = `SELECT *
    FROM ${connection.escapeId(tableName)}
    ORDER BY name
    LIMIT ${limit}`

    console.log('SQL', sql)

    connection.query(sql, function(err, result) {
      if (err) return callback(err)
      return callback(null, map(formatter, result))
    })
  }
}

const dal = {
  addInstrument,
  getInstrument,
  updateInstrument,
  deleteInstrument,
  listInstruments,
  getOrchestra
}

module.exports = dal
