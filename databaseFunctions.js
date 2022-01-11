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


var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'thetanapi'
});

connection.connect(function(err) {
    if (err) throw err;
    console.info(colours.fg.green, "Connected to database thetanAPI", colours.fg.white);
  });

exports.login = (email, password) => {
    var sql = 'SELECT * FROM users WHERE email = ?';
    try {
        connection.query(sql, [email], function (err, result) {
            if (err){
                console.log(colours.fg.red, 'MYSQL thrown error with ' + email, colours.fg.white);
                return 0;
            }
        
            if(result.length == 1){
                if(result['password'] == password){
                    console.log(colours.fg.green, `Password confirmed for email, "${email}"`, colours.fg.white);
                    return 1;
                }
                else{
                    console.log(colours.fg.red, 'Tried to login with ' + email, colours.fg.white);
                    return 0;
                }
            }
            else{
                return 0;
            }
        
        });
    } catch (error) {
        console.warn(colours.fg.yellow, error);
        return 0;
    }
}

function checkSession(username, sessionID, privateKey){

    return 0;
}
