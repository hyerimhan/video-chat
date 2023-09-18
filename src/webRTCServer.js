import http from 'http'
import SocketIO from 'socket.io'
import express from 'express'

const app = express()

app.set('view engine', 'pug')
app.set('views', __dirname + '/views')
app.use('/public', express.static(__dirname + '/public'))
app.get('/', (_, res) => res.render('webRTCHome'))

// home만 사용할 것이기 때문에 redirect를 설정해줬다.
app.get('/*', (_, res) => res.redirect('/'))

// http 서버 생성
const httpServer = http.createServer(app)
// SocketIO 서버 생성
const wsServer = SocketIO(httpServer)

wsServer.on('connection', (socket) => {
  socket.on('join_room', (roomName) => {
    socket.join(roomName)
    socket.to(roomName).emit('welcome')
  })
  socket.on('offer', (offer, roomName) => socket.to(roomName).emit('offer', offer))
  socket.on('answer', (answer, roomName) => socket.to(roomName).emit('answer', answer))
  socket.on('ice', (ice, roomName) => socket.to(roomName).emit('ice', ice))
})

const handleListen = () => console.log(`Listening on http://localhost:3000/`)
httpServer.listen(3000, handleListen)
