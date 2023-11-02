const production = process.env.NODE_ENV === "production";
const clientUrl = production ? "realsite.com" : "http://localhost:1234";
const { Server } = require("socket.io");

const io = new Server(3000, {
  cors: {
    origin: clientUrl,
  },
});

const rooms = {};
const WORDS = ["human", "bike", "dog"];
io.on("connection", (socket) => {
  socket.on("join-room", (data) => {
    const user = { id: socket.id, name: data.name, socket: socket };
    let room = rooms[data.roomId];
    if (room == null) {
      room = { users: [], id: data.roomId };
      rooms[data.roomId] = room;
    }
    room.users.push(user);
    socket.join(room.id);

    socket.on("ready", () => {
      user.ready = true;
      if (room.users.every((u) => u.ready)) {
        room.word = getRandomEntry(WORDS);
        room.guesser = getRandomEntry(room.users);
        io.to(room.guesser.id).emit("start-drawer", room.word);
        room.guesser.socket.to(room.id).emit("start-guesser");
      }
    });
    socket.on("disconnect", () => {
      room.users = room.users.filter((u) => u !== user);
    });
  });
});

function getRandomEntry(array) {
  return array[Math.floor(Math.random() * array.length)];
}
