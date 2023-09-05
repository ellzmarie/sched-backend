// DEPENDENCIES  

// GET .env vars
require("dotenv").config()

// GET PORT AND DB URL 
const { PORT, DATABASE_URL } = process.env 
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const morgan = require("morgan")
const cors = require("cors")

// DATABASE CONNECTION
mongoose.connect(DATABASE_URL)
// CONNECTION EVENTS
mongoose.connection
    .on("open", () => { console.log("You are connected to mongodb") })
    .on("close", () => { console.log("You are disconnected") })
    .on("error", (error) => { console.log("error") })

// MODEL
const ContactsSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    desiredTime: String,
    amPm: String,
    timezone: String,
    notes: String
})

const Contacts = mongoose.model("Contacts", ContactsSchema)

// MIDDLEWARE
app.use(cors()) // prevents cross origin region sharing errors, allows to server from origin i.e. react frontend
app.use(morgan("dev")) // logs details of all server hits to terminal
app.use(express.json())
app.use(express.urlencoded({ extended: false })) // to use URL encoded 
 
// ROUTES - REMEMBER INDUCES > WE'LL BE USING IDUC
app.get("/", (req, res) => {
    res.send("hello world!!!")
})

// INDEX
app.get("/contacts", async(req, res) => {
  try {
    res.status(200).json(await Contacts.find({}))
  } catch (error){
    res.status(400).json(error)
  }
})


// DELETE
app.delete("/contacts/:id", async(req, res) => {
  try {
    res.status(200).json(await Contacts.findByIdAndDelete(req.params.id))
  } catch (error) {
    res.status(400).json(error)
  }
})

// UPDATE 
app.put("/contacts/:id", async(req, res) => {
  try {
    res.status(200).json(await Contacts.findByIdAndUpdate(req.params.id, req.body, { new:true }))
  } catch (error) {
    res.status(400).json(error)
  }
})

// CREATE
app.post("/contacts", async(req, res) => {
  try {
    res.status(200).json(await Contacts.create(req.body))
  } catch (error){
    res.status(400).json(error)
  } 
})

// LISTENER 
app.listen(PORT, () => console.log(`Listening to the smooth sounds of port ${PORT}`))
