const http = require("http")
const express = require('express')
const socketio = require("socket.io")
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const {v4: uuidV4} = require('uuid')

app.set('view engine','ejs')
app.use(express.static('public'))

app.get('/', (req,res)=>{
    res.redirect(`/${uuidV4()}`)
})
app.get('/:room', (req,res)=>{
    res.render('room', {roomId: req.params.room})
})
io.on('connection', socket =>{
    socket.on('join-room', (roomId, userId)=>{
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)
        
        socket.on('user-disconnected', userId=>{
            console.log(userId)
        })

        socket.on('disconnect',()=>{
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})
const PORT = 3000 || process.env.PORT
server.listen(PORT, ()=> console.log(`Server is listening on port ${PORT}`))