var database = require('./databaseFunctions');

var controlUserToken = await database.controlUserToken("errdoerdo12@gmail.com", "sessionID", "privateKey", "ip");
console.log(controlUserToken);