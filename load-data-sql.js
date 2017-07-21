require('dotenv').config()

const mysql = require('mysql')

const sql = `INSERT INTO instrument
(name, instrumentGroup, category, retailPrice, manufacturer )
VALUES
('Cello Platinum 3', 'strings', 'cello', 399.99, 'Whammo, Inc.'),
('Cello Silver 2', 'strings', 'cello', 299.99, 'Whammo, Inc.'),
('Cello Gold', 'strings', 'cello', 599.99, 'Whammo, Inc.'),
('Oboe Beethoven', 'winds', 'oboe', 399.99, 'Oboetown'),
('Oboe Bach', 'winds', 'oboe', 499.99, 'Oboetown'),
('Piccolo Bach', 'winds', 'piccolo', 199.99, 'Music World'),
('Piccolo Beethoven', 'winds', 'piccolo', 299.99, 'Music World'),
('Cello Mellow Gold', 'strings', 'cello', 699.99, 'Whammo'),
('Cello Bronze', 'strings', 'cello', 199.99, 'Whammo'),
('Oboe Shubert', 'winds', 'oboe', 199.99, 'Oboetown'),
('Oboe Delux 2000', 'winds', 'oboe', 350.99, 'Music World'),
('Piccolo Performa 100', 'winds', 'piccolo', 299.99, 'Music World'),
('Piccolo Performa 200', 'winds', 'piccolo', 399.99, 'Music World')`

function createConnection() {
  return mysql.createConnection({
    user: process.env.MYSQL_USER,
    host: process.env.MYSQL_HOST,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  })
}

function createInstruments() {
  const connection = createConnection()

  connection.query(sql, function(err, result) {
    if (err) return console.log('createInstruments() error', err)
    console.log(
      'createInstruments() SUCCESS!!',
      JSON.stringify(result, null, 2)
    )
  })

  connection.end(function(err) {
    if (err) return err
    console.log('bye!')
  })
}

createInstruments()
