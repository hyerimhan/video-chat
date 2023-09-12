import http from 'http'
import SocketIO from 'socket.io'
import express from 'express'

const app = express()

app.set('view engine', 'pug')
app.set('views', __dirname + '/views')
app.use('/public', express.static(__dirname + '/public'))
app.get('/', (_, res) => res.render('socketIOHome'))

// home만 사용할 것이기 때문에 redirect를 설정해줬다.
app.get('/*', (_, res) => res.render('socketIOHome'))

// http 서버 생성
const httpServer = http.createServer(app)
// SocketIO 서버 생성
const wsServer = SocketIO(httpServer)

wsServer.on('connection', (socket) => {
  // 모든 event를 감시
  socket.onAny((event) => console.log(`Socket Event: ${event}`))
  socket.on('enter_room', (roomName, done) => {
    socket.join(roomName.payload)
    // app.js emit 세번째 argument인 서버에서 호출하는 function
    done()
    // 방에 다른 유저들이 입장하는지 확인
    socket.to(roomName.payload).emit('welcome')
  })
})

const handleListen = () => console.log(`Listening on http://localhost:3000/`)
httpServer.listen(3000, handleListen)
