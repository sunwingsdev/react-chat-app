import { Server } from "socket.io";
import express from "express";

const app = express();

const PORT = process.env.PORT || 3001;
const httpServer = app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  //
  console.log(`User ${socket.id} is connected`);

  //   handling a user to join in a room
  socket.on("user_join_room", (data) => {
    const { userName, roomId } = data || {};
    socket.join(roomId);

    console.log(`${userName} has joined the room ${roomId}`);
  });
});
