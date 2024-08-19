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
    const { username, roomId } = data || {};
    socket.join(roomId);

    // notify that a user joined the room
    socket
      .to(roomId)
      .emit("user_join_room", `${username} has joined the room ${roomId}`);

    console.log(`${username} has joined the room ${roomId}`);
  });

  socket.on("send_message", ({ username, roomId, text }) => {
    socket.to(roomId).emit("message", { username, text, type: "regular" });
  });

  // left chat
  socket.on("user_left_room", ({ username, roomId }) => {
    socket.to(roomId).emit("message", {
      username,
      text: `${username} has left the chat`,
      type: "notif",
    });
  });

  // handle Activity
  socket.on("user_typing", ({ username, roomId }) => {
    console.log("user is typing", username);
    socket.to(roomId).emit("user_typing", username);
  });
});
