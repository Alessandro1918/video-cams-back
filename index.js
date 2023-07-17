const cors = require("cors")
const express = require("express")
require('dotenv').config()

const PORT = process.env.PORT || 4000
const URL_FRONT = process.env.URL_FRONT || `http://localhost:3000`

const app = express()

app.use(cors({
  origin: URL_FRONT
}))

app.get("/", (req, res) => {
  res.send(`<h1>Hello, World!</h1>`)
})

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))