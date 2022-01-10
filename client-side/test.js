function checkSession() {
    fetch('http://localhost:1604/ulgn_p')
.then((response) =>{
    if(response['success'] == true){
        document.getElementById('test').innerHTML = 'OK'
    }
    else{
        document.getElementById('test').innerHTML = 'N-OK'
    }
});

}