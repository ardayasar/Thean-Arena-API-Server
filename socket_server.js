const { Server } = require("socket.io");

const io = new Server(1604, { /* options */ });

io.on("connection", (socket) => {  
    console.log("Ok")
});
io.listen(3000);