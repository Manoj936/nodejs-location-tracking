const express = require("express");

const app = express();
const path = require("path");
let ejs = require("ejs");

const socketio = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = socketio(server);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "views")));

app.get('/', function(req, res) {
    res.render('pages/index');
  });
server.listen(3000, () => {
  console.log("App is running at 3000");
});

io.on('connection', (socket)=>{
    console.log('connected',  socket.id)

    socket.on('send-location', (data)=>{
        io.emit('receive-location', {id : socket.id , ...data})
    })

    socket.on('disconnect',()=>{
        console.log(socket.id)
        io.emit('user-disconnected' , socket.id) 
    })
})
