const express = require('express')
const app = express()
const port = 1604

app.use(express.json());
app.use(logErrors)
app.use(clientErrorHandler)
app.use(errorHandler)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/submit-hero', (req, res) => {
    try {
      if(req.body.Lkey == "abcdef"){
        res.send({'key': true, 'information': req.body})
        console.log(req.body)
      }
      else{
        res.status(401).send({'status': false})
        console.log("Unauthorized")
      }
    } catch (error) {
      res.status(401).send({'status': false})
    }
});

function logErrors (err, req, res, next) {
  console.error(err.stack)
  next(err)
}

function errorHandler (err, req, res, next) {
  res.status(500)
  res.send({'status': false})
}

function clientErrorHandler (err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' })
  } else {
    next(err)
  }
}



app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
});

