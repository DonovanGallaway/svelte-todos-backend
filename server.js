//////////////////////////
// Dependencies
//////////////////////////
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const { PORT, DATABASE_URL} = process.env

//////////////////////////
// Connection
//////////////////////////

mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

mongoose.connection
.on('open', () => console.log('You are connected to Mongo'))
.on('close', () => console.log('You are disconnected from Mongo'))
.on('error', (error) => console.log(error))

//////////////////////////
// Models
//////////////////////////

const TodoSchema = new mongoose.Schema({
   subject: String,
   details: String,
   done: Boolean
}, {timestamps: true})


const Todo = mongoose.model('Todo', TodoSchema)


//////////////////////////
// Middleware
//////////////////////////
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())


// Routes


app.get('/', (req,res) => {
    res.send("Hello World")
})

app.get('/todos', async (req,res) => {
    try {
        res.json(await Todo.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
})


////////////////////////////
// Seed Data
////////////////////////////

const seedData = [
    {subject: "Breakfast", details: "Eat Breakfast"},
    {subject: "Lunch", details: "Eat Lunch"},
    {subject: "Dinner", details: "Eat Dinner"}
]

app.get('/todos', async (req,res) => {
    try {
        res.json(await Todo.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
})

// app.post('/todos/seed', async (req,res) => {
//     try {
//         seedData.map(async x => {
//             await Todo.create(x)
//         })
//         res.json(await Todo.find({}))
//     } catch (error){
//         res.status(400).json(error)
//     }
// })

// app.delete('/todos/seed', async (req,res) => {
//     try {
//         await Todo.remove({}, () => {console.log("stuff deleted")})
//         res.json(await Todo.find({}))
//     } catch (error){
//         res.status(400).json(error)
//     }
// })



app.post('/todos', async (req,res) => {
    try {
        res.json(await Todo.create(req.body))
    } catch (error) {
        res.status(400).json({error})
    }
})

app.put('/todos/:id', async (req,res) => {
    try {
        res.json(await Todo.findByIdAndUpdate(req.params.id, req.body, {new:true}))
    } catch (error) {
        res.status(400).json({error})
    }
})

app.delete('/todos/:id', async (req,res) => {
    try {
        res.json(await Todo.findByIdAndRemove(req.params.id))
    } catch (error) {
        res.status(400).json(error)
    }
})

app.listen(PORT, () => {console.log(`listening on PORT ${PORT}`)})