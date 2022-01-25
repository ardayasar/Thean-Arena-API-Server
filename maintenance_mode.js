var fs = require('fs');

var ip_list = ['localhost', '127.0.0.1', '94.55.208.58'];

exports.changeMain = (par) => {
    if(par == true){
        fs.writeFileSync('maintenance.txt', "true");
    }
    else{
        fs.writeFileSync('maintenance.txt', "false");
    }
}

exports.getMain = () => {
    var mainten = fs.readFileSync('maintenance.txt');
    if(mainten == "true"){
        return true;
    }
    else{
        return false;
    }
}

exports.valid = (ip) => {
    if(ip_list.includes(ip)){
        return true;
    }
    else{
        return false;
    }
}

