// const express = require("express")
require('dotenv').config()

const PORT = process.env.PORT || 4000
const URL_FRONT = process.env.URL_FRONT || `http://localhost:3000`

// const app = express()
// app.use(cors({
//   origin: URL_FRONT
// }))
// app.get("/", (req, res) => {
//   res.send(`<h1>Hello, World!</h1>`)
// })

// const server = require("http").createServer(app)
const server = require("http").createServer()

const io = require("socket.io")(server, {
  cors: {
    origin: URL_FRONT
  }
})

io.on("connection", (socket) => {

  //Logs at every connections, no matter the room:
  // console.log("Client", socket.id, "connected")

  socket.on("join-room", roomId => {
    console.log("Client", socket.id, "entered room", roomId)

    //Adds that socket to that room
    socket.join(roomId)

    //Broadcast to everyone on that room, except the sender:
    socket.broadcast.to(roomId).emit("new-user-joined-room", socket.id)

    //List of other users already in the room. Send this back to the sender:
    io.in(roomId).fetchSockets().then(sockets => {
      let users = []
      sockets.map(s => {
        if (socket.id != s.id) {
          users.push(s.id)
        }
      })
      if (users.length > 0) {
        io.to(socket.id).emit("list-room-users", users)
      }
      console.log(`+ Room ${roomId} has now ${users.length + 1} users`)
    })
  })

  socket.on("disconnecting", () => {
    console.log("Client", socket.id, "disconnected")

    //Tell everyone else in the room that a user just left:
    const rooms = socket.rooms
    if (rooms.size > 1) { //each socket has 2 rooms: it's own room (userId), and the meeting room (roomId)
      for (let room of rooms) {
        if (room !== socket.id) {
          socket.broadcast.to(room).emit("left-room", socket.id)
          io.in(room).fetchSockets().then(sockets => {
            let users = []
            sockets.map(s => {
              if (socket.id != s.id) {
                users.push(s.id)
              }
            })
            console.log(`- Room ${room} has now ${users.length} users`)
          })
        }
      }
    }
  })
})

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))