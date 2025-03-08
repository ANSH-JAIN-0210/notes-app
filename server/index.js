const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyparser = require('body-parser')
const userRoutes = require('./routes/UserRoutes')
const noteRoutes = require('./routes/NoteRoutes')

const app = express();
app.use(cors());
app.use(bodyparser.json())

mongoose.connect('mongodb://localhost:27017/note',{
    useNewUrlParser: true,
    useUnifiedTopology:true,
})

const db = mongoose.connection;
db.on('error',console.error.bind(console,'Connected to Database'))
db.once('open',()=> console.log('Connected to MongoDB'))

app.use('/api',userRoutes)
app.use('/api',noteRoutes)


const port = process.env.PORT || 5000
app.listen(5000,()=>console.log('Connected to Server on port 5000'))