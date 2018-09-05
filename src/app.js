const express = require("express");
const app = express();
// const port = process.env.PORT || 3000
const { PORT = 5000, NODE_ENV = 'development' } = process.env 
const { snacksRoutes, reviewsRoutes } = require('./routes')
const processErrorMessage = require('./middleware/errors')

// const morgan = require("morgan");
if(NODE_ENV === 'development' ){
  require('dotenv').load()
  app.use(require('morgan')('dev'))
}

app.use(require('cors')())
app.use(require('body-parser').json())
app.disable('x-powered-by')


// ROUTES
app.use('/api/snacks', snacksRoutes)
app.use('/api/snacks/:id/reviews', reviewsRoutes)

// DEFAULT ROUTES
app.use((req, res) => {
  const status = 404
  const message = `Could not ${req.method} ${req.path}`
  res.status(status).json({ status, message })
})

// ERROR HANDLING
app.use((err, req, res, next) => {
  err = processErrorMessage(err)
  if (process.env.NODE_ENV !== 'testing') console.error(err)
  const { status, message } = err
  res.status(status).json({ status, message })
})

// STARTING SERVER
if (NODE_ENV !== 'testing') {
  const listener = () => console.log(`Listening on port ${PORT}!`)
  app.listen(PORT, listener)
}

module.exports = app