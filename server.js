// ~~~~IMPORTANT!~~~~ 
// Server will never send any data with socket or publish any data
// Client will be send `GET` request 
// Server will lookup the time and capacity to correct
// Then server will send OK -> DATA or ERROR -> Wait Time


const express = require('express')
const app = express()
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var path = require('path');
var genid=require('uuid');
// const database  = require('./databaseFunctions');
const codeList  = require('./errors');
const port = 1604

app.use(express.json());
app.use(logErrors)
app.use(clientErrorHandler)
app.use(errorHandler)
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

var permissions = {
  normal_user:{
    renew_time: 15,
    priority: 0,
    max_capacity: 240
  },
  gold_user:{
    renew_time: 10,
    priority: 1,
    max_capacity: 360
  },
  plat_user:{
    renew_time: 5,
    priority: 2,
    max_capacity: 720
  }
}

// console.log(database.checkUser("aaaa", "bbbb"));

var expireTime = new Date(Date.now() + (60 * 60 *24 * 1000)) 

// ||||||||||||||||||||||
// ||     Database     ||
// ||||||||||||||||||||||

// var connection = mysql.createConnection({
// 	host     : 'localhost',
// 	user     : 'root',
// 	password : '',
// 	database : 'thetanAPI'
// });

// ||||||||||||||||||||||
// || Session & Cookie ||
// ||||||||||||||||||||||

// function createCookie() {
//   res.cookie('sessionID', genid.v4(), {
//     expires: new Date(Date.now() + 5 * 100000)
//   });    
// } 

// || Main Page ||

app.get('/', (req, res) => {


  res.send('Completed');

})


// || Login Get ||

app.get('/ulgn_p',(req, res) => {
  
  if(req.cookies.sessionID && req.cookies.privateKey && req.cookies.username){
    if(req.cookies.expires === null){
      res.clearCookie();
      res.send(codeList.codeClient('failed', 1)); 
    }
    else{

      //Control database
      if(true){

        res.send(codeList.codeClient('success', 1));
      }
      else{
        res.send(codeList.codeClient('failed', 1)); 
      }
      //Control database
    }
       
  }
  else{
    res.send(codeList.codeClient('failed', 3))
  }
});

app.get('/ulgn_f',(req, res) => {
  var mail = req.query.mail;
  var password = req.query.password;

  if(mail && password){
    res.clearCookie();
    res.cookie('sessionID', genid.v4(), {
      expires: expireTime
    }); 
    res.cookie('username', 'getFromDatabase', {
      expires: expireTime
    }); 
    res.cookie('privateKey', genid.v4(), {
      expires: expireTime
    }); 

    res.send(codeList.codeClient('success', 0));
  }
  else{
    res.send(codeList.codeClient('failed', 2));
  }

});




app.get('/test',(req, res) => {
  res.sendFile(path.join(__dirname) + '/client-side/index.html');
});


// || Panel Page ||



// |||||||||||||||||||||| SECRET
// ||        API       || SECRET
// |||||||||||||||||||||| SECRET

app.get('/hero', (req, res) => {

  // TODO: Control users permission

  if(req.sess){
    res.status(200).send(
      {
        'status': true
      });
  }

})

app.post('/hero', (req, res) => {
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

