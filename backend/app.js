require("dotenv").config()

const express = require("express")
const cors = require("cors")

const { connectDB } = require("./db/db")

const routes = require("./router/router")

const app = express()

const port = 5000

app.use(cors())
app.use(express.json())

app.use(routes)

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  })
  .catch((error) => {
    console.log(error)
  })