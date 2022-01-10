var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'thetanAPI'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected to database thetanAPI",);
  });

exports.checkUser = (username, password) => {
    
    return username.toString() + password.toString();
}

function checkSession(username, sessionID, privateKey){

    return 0;
}
