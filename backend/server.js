const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const http = require('http');
const server = http.createServer(app);
var routes = require('./routes/routes');
var cors = require('cors');
const socketIo = require('socket.io');

app.use(cors(
    {
        origin: 'http://localhost:4200'
    }
) )

const PORT = process.env.PORT || 3000;
//app.listen(PORT, () => {
//  console.log(`Server is running on port ${PORT}`);
//});

server.listen(PORT, ()=>{
  console.log(`HTTP Started on port: ${PORT}`);
});



mongoose.connect("mongodb://0.0.0.0:27017/Assignment", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("Successfully Connected to DB");
})
.catch((error) => {
  console.error("Error Connecting to DB:", error);
});
app.use(express.json());
app.use(routes);

const io = socketIo(server);

io.on('connection', (socket)=>{
  socket.on('join', (data) => {
    socket.join(data.room);
    socket.broadcast.to(data.room).emit('user joined', { user: data.user });
  });
  socket.on('message', (data)=>{
    io.in(data.room).emit('new message', {user: data.user, message: data.message});
  });
});