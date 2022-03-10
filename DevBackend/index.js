require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require("body-parser");
const userRoutes = require('./routes/user');
const fetchRoutes = require('./routes/fetch');
const chatRoutes = require('./routes/routes');

const connectionString = process.env.ATLAS_URI


const app = express()
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
io.on('connection', function (socket) {
    socket.on("message", msg => {
        console.log("new message");
    })


    // socket.join("Java");
    // console.log(io);
    // console.log(socket);
    console.log('a user is connected')
})
const InitiateMongoServer = async () => {
    try {
        await mongoose.connect(connectionString
        );
        console.log('Connection to Mongo established.');
    }
    catch (e) {
        console.log(e);
        throw e;
    }
};
InitiateMongoServer();     // Connect to the MongoDB Server 

const con = mongoose.connection
con.on('open', () => {
    console.log("Connected to MongoDB Server")
})

const corsOptions = {
    origin: true,
    credentials: true
};

app.options("*", cors(corsOptions));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.get("/", function (req, res) {
    res.send("fff");
})

app.use('', userRoutes);
app.use('/fetch', fetchRoutes);
app.use("",chatRoutes);
module.exports = app;