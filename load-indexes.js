require('dotenv').config()
const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'))

const db = new PouchDB(process.env.COUCHDB_URL + process.env.COUCHDB_NAME)

db
  .createIndex({ index: { fields: ['type'] } })
  .then(() => {
    console.log('Created an index on the type field.')
  })
  .catch(err => console.log(err))

db
  .createIndex({ index: { fields: ['name'] } })
  .then(() => {
    console.log('Created an index on the name field.')
  })
  .catch(err => console.log(err))

db
  .createIndex({ index: { fields: ['category'] } })
  .then(() => {
    console.log('Created an index on the category field.')
  })
  .catch(err => console.log(err))

db
  .createIndex({ index: { fields: ['group'] } })
  .then(() => {
    console.log('Created an index on the group field.')
  })
  .catch(err => console.log(err))

db
  .createIndex({ index: { fields: ['retailPrice'] } })
  .then(() => {
    console.log('Created an index on the retailPrice field.')
  })
  .catch(err => console.log(err))

db
  .createIndex({ index: { fields: ['manufacturer'] } })
  .then(() => {
    console.log('Created an index on the manufacturer field.')
  })
  .catch(err => console.log(err))
