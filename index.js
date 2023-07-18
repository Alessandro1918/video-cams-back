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
  console.log("Client", socket.id, "connected")

  socket.on("disconnecting", () => {
    console.log("Client", socket.id, "disconnected")
  })
})

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))