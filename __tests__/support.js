require('dotenv').load()

const db = require('../src/db')
const knex = require('knex')
const config = require('../knexfile')[process.env.NODE_ENV]
let connection = knex(config)

// finds the connection and reseeding the db
beforeEach(() => {
  connection = knex(config)
  return connection.seed.run()
})

// destroying the connection with testing
afterEach(() => connection.destroy())

// destroying the connection to the db
afterAll(() => db.destroy())
