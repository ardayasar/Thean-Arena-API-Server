const express = require('express')
const app = express()
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = 1604

app.use(express.json());
app.use(logErrors)
app.use(clientErrorHandler)
app.use(errorHandler)

inData = {}

io.on('connection', (socket) => {
    // socket.id = "abcdefgsnsdjlfnsdf"
    // socket.handshake.auth.token
    ID = socket.id;
    console.log('client id - '+ socket.id); 
  }); //<script src="/socket.io/socket.io.js"></script><script>  var socket = io();</script>

app.get('/', (req, res) => {
  res.send('Hello World! <script src="/socket.io/socket.io.js"></script><script>  var socket = io();</script>')
})

app.get('/submit-hero', (req, res) => {
  res.status(200).send({'status': true});
})

app.post('/submit-hero', (req, res) => {
    try {
      if(req.body.Lkey == "permission_key"){
        res.send({'key': true, 'information': req.body})
        console.log(req.body)
        //TODO: Send data to client and add to mysql query
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



server.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
});

