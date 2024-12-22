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
  res.redirect("http://localhost:4001/get_data")
})

app.post("/update/:id", (req, res) => {
  const {title, desc, old_price, new_price} = req.body
  const {id} = req.params
  const data = read_file("data.json")

  const product = data.find((item) => item.id === id)

  if(!product) {
   return res.json({
      message: "Product not found"
    })
  }

  data.forEach((item) => {
    if(item.id === id) {
      item.title = title ? title : item.title
      item.desc = desc ? desc : item.desc
      item.old_price = old_price ? old_price : item.old_price
      item.new_price = new_price ? new_price : item.new_price
    }
  })
  write_file("data.json", data)
  res.redirect("http://localhost:4001/get_data")
})

app.post("/delete/:id", (req, res) => {
  const {id} = req.params
  const data = read_file("data.json")

  const product = data.find((item) => item.id === id)

  if(!product) {
   return res.json({
      message: "Product not found"
    })
  }

  data.forEach((item, idx) => {
    if(item.id === id) {
      data.splice(idx, 1)
    }
  })
  write_file("data.json", data)
  res.redirect("http://localhost:4001/get_data")
})

app.listen(PORT, () => {
  console.log("server is running " + PORT);
})