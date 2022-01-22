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
const database  = require('./databaseFunctions');
const codeList  = require('./errors');
var mysql = require('mysql');
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

// ||||||||||||||||||||||
// ||    Connection    ||
// ||||||||||||||||||||||

// var connection = mysql.createConnection({
// 	host     : 'localhost',
// 	user     : 'root',
// 	password : '',
// 	database : 'thetanapi'
// });

// connection.connect(function(err) {
//   if (err) throw err;
//   console.info(colours.fg.green, "Connected to database thetanAPI", colours.fg.white);
// });

// ||||||||||||||||||||||
// ||      Colors      ||
// ||||||||||||||||||||||

const colours = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",
  
  fg: {
      black: "\x1b[30m",
      red: "\x1b[31m",
      green: "\x1b[32m",
      yellow: "\x1b[33m",
      blue: "\x1b[34m",
      magenta: "\x1b[35m",
      cyan: "\x1b[36m",
      white: "\x1b[37m",
      crimson: "\x1b[38m" // Scarlet
  },
  bg: {
      black: "\x1b[40m",
      red: "\x1b[41m",
      green: "\x1b[42m",
      yellow: "\x1b[43m",
      blue: "\x1b[44m",
      magenta: "\x1b[45m",
      cyan: "\x1b[46m",
      white: "\x1b[47m",
      crimson: "\x1b[48m"
  }
};

// ||||||||||||||||||||||
// ||      Expire      ||
// ||||||||||||||||||||||

var expireTime = new Date(Date.now() + (60 * 60 *24 * 1000)) 


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


// || Login With Session ||

app.get('/ulgn_p',(req, res) => {
  
  var ip = req.socket.remoteAddress;

  if(req.cookies.sessionID && req.cookies.privateKey && req.cookies.email){
    if(req.cookies.expires === null){
      res.clearCookie();
      res.send(codeList.codeClient('failed', 1)); 
    }
    else{

      try {
        var sessionID = req.cookies.sessionID;
        var privateKey = req.cookies.privateKey;
        var email = req.cookies.email;
        (async() => {

          var checkSession = await database.checkSession(email, sessionID, privateKey, ip);
          if(checkSession == 1){

            res.send(codeList.codeClient('success', 1));
          }
          else{
            res.send(codeList.codeClient('failed', 1)); 
          }

        })();
        
      } catch (error) {
        console.log(error);
      }

    }
       
  }
  else{
    res.send(codeList.codeClient('failed', 3))
  }
});

// || Form Login ||

app.get('/ulgn_f',(req, res) => {
  var mail = req.query.mail;
  var password = req.query.password;
  var ip = req.socket.remoteAddress;

  if(mail && password){
    res.clearCookie();

    var sessionID = genid.v4();
    var privateKey = genid.v4();

    
    try {
      (async() => {      

        var loginReturn = await database.login(mail, password, sessionID, privateKey, ip);

        if(loginReturn == 1){
          res.cookie('sessionID', sessionID, {
            expires: expireTime
          }); 
          res.cookie('email', mail, {
            expires: expireTime
          }); 
          res.cookie('privateKey', privateKey, {
            expires: expireTime
          }); 
      
          res.send(codeList.codeClient('success', 0));
        }
        else{
            // console.log(colours.fg.red, `Tried to login with ${mail} from ${ip}.`, colours.fg.white);
            res.send(codeList.codeClient('failed', 0));
        }
      })();
    } catch (error) {
        console.warn(colours.fg.yellow, error);
        res.send(codeList.codeClient('failed', 0));
    }
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
        //TODO: Data will be added to json and MySQL database. 
        //
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

