const express = require("express")
const cors = require("cors")
require("dotenv").config()
const {read_file, write_file} = require("./api/api")
const path = require("path")
const bodyParser = require('body-parser');
const {v4} = require("uuid")

const app = express()
const PORT = process.env.PORT || 4000
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(express.static("public"))

app.get("/get_data", (req, res) => {
  const data = read_file("data.json")
  res.render("index", {data})
})

app.get("/single/:id", (req, res) => {
  const {id} = req.params
  const data = read_file("data.json")

  const product = data.find((item) => item.id === id)
  res.render("details", {product})
})

app.post("/add_data", (req, res) => {
  const {title, desc, old_price, new_price} = req.body
  const data = read_file("data.json")

  data.push({
    id: v4(),
    title, desc, old_price, new_price,
    img: "http://localhost:4001/images/1.jpeg"
  })
  write_file("data.json", data)
  res.render("index", {data})
})

app.listen(PORT, () => {
  console.log("server is running " + PORT);
})