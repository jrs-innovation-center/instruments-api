require('dotenv').config()
const mysql = require('mysql')

// cant use 'group' for a column name in mysql.  That name is reserved.  Use instrumentGroup instead.
const insertInstrumentsSQL = `INSERT INTO instrument (name, instrumentGroup, category, retailPrice, manufacturer)
VALUES
('Cello Platinum', 'strings', 'cello', 399.99, 'Whammo'),
('Cello Silver', 'strings', 'cello', 299.99, 'Whammo'),
('Oboe Beethoven', 'winds', 'oboe', 399.99, 'Oboetown'),
('Oboe Bach', 'winds', 'oboe', 499.99, 'Oboetown'),
('Piccolo Bach', 'winds', 'piccolo', 199.99, 'Music World'),
('Piccolo Beethoven', 'winds', 'piccolo', 299.99, 'Music World'),
('Cello Gold', 'strings', 'cello', 699.99, 'Whammo'),
('Cello Bronze', 'strings', 'cello', 199.99, 'Whammo'),
('Oboe Shubert', 'winds', 'oboe', 199.99, 'Oboetown'),
('Oboe Delux 2000', 'winds', 'oboe', 350.99, 'Music World'),
('Piccolo Performa 100', 'winds', 'piccolo', 299.99, 'Music World'),
('Piccolo Performa 200', 'winds', 'piccolo', 399.99, 'Music World')`

function createConnection() {
  return mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  })
}

function createInstruments() {
  var connection = createConnection()

  connection.query(insertInstrumentsSQL, function(err, result) {
    if (err) return console.log('createInstruments() error', err)
    console.log(
      'createInstruments() success: ',
      JSON.stringify(result, null, 2)
    )
  })
  connection.end(function(err) {
    if (err) return err
  })
}

createInstruments()
