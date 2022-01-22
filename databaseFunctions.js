const e = require('express');
const res = require('express/lib/response');
var mysql = require('mysql');

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

const logCodeList = {
    0: "Logged in to account!",
    1: "Tried to access account!",
    2: "Account not found!",
    3: "Session granted to the account!",
    4: "Session not accepted for account!",
    5: "Account not found while checking the session!"
};


var db_config =  {
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'thetanapi'
};

var connection;

function connectionHolder() {
    connection = mysql.createConnection(db_config);
    connection.connect(function(err) {
        if(err){                                  
            console.error(colours.fg.red, "Couldn't connect to database thetanAPI -> ", err.code, colours.reset);
            setTimeout(connectionHolder, 2000); 
        }
        else{
            console.info(colours.fg.green, "Connected to database thetanAPI", colours.fg.white);    
        }
    });

    connection.on('error', function(err) {
        console.log(colours.bg.yellow, colours.fg.black, 'Connection lost to database. Restarting function -> ', err.codem, colours.reset);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
            connectionHolder();                         
        } else {                                      
            throw err;                                  
        }
      });
}

connectionHolder();



exports.login = async (email, password, sessionID, privateKey, ip) => {
    return new Promise(resolve =>{
        try {
            var sql = 'SELECT password, username FROM users WHERE email = ?';
            connection.query(sql, [email], function (err, result) {
    
                if (err){
                    console.log(colours.fg.red, 'Login | MYSQL thrown error with ' + email, colours.fg.white);
                    resolve(0);
                }

                if(result.length == 1){
                    var pass_db = result[0]['password']; //Check if data availible

                    if(pass_db == password && pass_db.length > 0){
                        loginAccept(0, email, sessionID, privateKey, ip);
                        log(email, ip, 0);
                        resolve(1);
                    }
                    else{
                        console.log(colours.bg.red, `⛔ 🔐 Login tried via: [${email}, ${sessionID}, ${privateKey}, ${ip}]`, colours.reset);
                        log(email, ip, 1);
                        resolve(0);
                    }
                }
                else{
                    log(email, ip, 2);
                    resolve(0);
                }
            });
        } catch (error) {
            console.warn(colours.fg.yellow, error);
            resolve(0);
        }
    
    })

}

exports.checkSession = async (email, sessionID, privateKey, ip) => {
    return new Promise(resolve =>{
        try {
            var sql = 'SELECT session, privateKey FROM users WHERE email = ?';
            connection.query(sql, [email], function (err, result) {
    
                if (err){
                    console.log(colours.fg.red, 'CheckSession | MYSQL thrown error with ' + email, colours.fg.white);
                    resolve(0);
                }

                if(result.length == 1){

                    var  sessionDB= result[0]['session'];
                    var  privateDB= result[0]['privateKey'];

                    if(sessionID == sessionDB && privateKey == privateDB){
                        loginAccept(1, email, sessionID, privateKey, ip);
                        log(email, ip, 3);
                        resolve(1);
                    }
                    else{
                        log(email, ip, 4);
                        resolve(0);
                    }
                }
                else{
                    log(email, ip, 5);
                    resolve(0);
                }
            });
        } catch (error) {
            console.warn(colours.fg.yellow, error);
            resolve(0);
        }
    
    })

}

function loginAccept(num, email, sessionID, privateKey, ip) {
    if(num == 0){
        try {
            var sql = 'UPDATE users SET privateKey = ?, session = ? WHERE email = ?';
            connection.query(sql, [privateKey, sessionID, email], function (err, result) {
                if (err){
                    console.log(colours.fg.red, 'LoginAccept | MYSQL thrown error with ' + email, colours.fg.white);
                }
                if(result.affectedRows > 0){
                    console.log(colours.fg.green, `✅ 🔐 New login with: [${email}, ${sessionID}, ${privateKey}, ${ip}]`, colours.reset);
                }
                else{
                    console.log(colours.fg.red, `⛔ 🧮 Problem with: [${email}, ${sessionID}, ${privateKey}, ${ip}]`, colours.reset);
                }
            });
        } catch (error) {
            console.warn(colours.fg.yellow, error);
        }
    }
    else if(num == 1){ //Checksession
        console.log(colours.fg.green, `✅ 🔐 Session accepted with: [${email}, ${sessionID}, ${privateKey}, ${ip}]`, colours.reset);
    }
    else{
        console.log(colours.bg.red, `⛔ 🔐 There was a problem with: [${email}, ${sessionID}, ${privateKey}, ${ip}]`, colours.reset);
    }
    //Change session and privatekey of account.
}

function log(email, ip, code){
    //Log everything
    var text = logCodeList[code];
    try {
        var sql = 'INSERT INTO logs (ip, email, code) VALUES (?, ?, ?)';
        connection.query(sql, [ip, email, text], function (err, result) {
            if (err){
                console.log(colours.fg.red, 'LOG | MYSQL thrown error with ' + email, colours.fg.white);
            }
        });
    } catch (error) {
        console.warn(colours.fg.yellow, error);
    }
}