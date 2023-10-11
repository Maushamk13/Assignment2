const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const http = require('http');
const server = http.createServer(app);
var routes = require('./routes/routes');
var cors = require('cors');
const socketIo = require('socket.io');
const uuid = require('uuid'); // Import the uuid library

app.use(cors());

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:4200', // Adjust this to match the origin of your Angular app
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
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

const groupToSocketMap = {}; // Map to store sockets by group

io.on('connection', (socket) => {
  socket.on('join', (data) => {
    socket.join(data.room);
    socket.broadcast.to(data.room).emit('user joined', { user: data.user });

    // Store the socket in the groupToSocketMap based on the group
    if (!groupToSocketMap[data.room]) {
      groupToSocketMap[data.room] = [];
    }
    groupToSocketMap[data.room].push(socket);
  });

  socket.on('message', (data) => {
    io.in(data.room).emit('new message', { user: data.user, message: data.message });
  });

  socket.on('image', (data) => {
    io.in(data.room).emit('receive image', { user: data.user, image: data.image, isImage: data.isImage });
  });

  // // Handle video call initiation with UUID
  // socket.on('startVideoCall', (data) => {
  //   // Generate a UUID for the video call
  //   const videoCallId = uuid.v4();

  //   // Broadcast the video call initiation to other members of the room
  //   io.to(data.room).emit('videoCallStarted', { user: data.user, videoCallId });
  // });

  // // Handle disconnect and remove the socket from the groupToSocketMap
  // socket.on('disconnect', () => {
  //   for (const group in groupToSocketMap) {
  //     groupToSocketMap[group] = groupToSocketMap[group].filter((s) => s !== socket);
  //   }
  // });
});
