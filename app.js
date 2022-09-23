const express = require('express')
const socketio = require('socket.io');
const dotenv = require('dotenv');
const app = express();

const PORT = process.env.PORT || 3000;

dotenv.config();


app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('index')
})

const server = app.listen(PORT, () => {
    console.log("server is running on port ", PORT);
})


//initialize socket for the server
const io = socketio(server)

io.on('connection', socket => {
    console.log("New user connected")

    socket.username = "Anonymous";

    socket.on('change_username', data => {
        socket.username = data.username
    })

    //handle the new message event
    socket.on('new_message', data => {
        console.log("new message")
        io.sockets.emit('receive_message', { message: data.message, username: socket.username })
    })


    socket.on('typing', data => {
        socket.broadcast.emit('typing', {username: socket.username})
    })

})
