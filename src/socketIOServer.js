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

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer
  const publicRooms = []
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key)
    }
  })
  return publicRooms
}

wsServer.on('connection', (socket) => {
  socket['nickname'] = 'Anon'
  // 모든 event를 감시
  socket.onAny((event) => console.log(`Socket Event: ${event}`))
  socket.on('enter_room', (roomName, done) => {
    socket.join(roomName)
    // app.js emit 마지막 argument인 서버에서 호출하는 function (FE에서 코드 실행)
    done()
    // 방에 다른 유저들이 입장하는지 확인
    socket.to(roomName).emit('welcome', socket.nickname)
    // 모든 방에 알림 메세지
    wsServer.sockets.emit('room_change', publicRooms())
  })

  // 유저가 접속을 중단할 것이지만 아직 방을 완전히 나가지는 않은 상태
  socket.on('disconnecting', () => {
    socket.rooms.forEach((room) => socket.to(room).emit('bye', socket.nickname))
  })

  // 방을 완전히 나간 상태
  socket.on('disconnect', () => {
    wsServer.sockets.emit('room_change', publicRooms())
  })

  // 참여한 방을 확인하고 새로운 메세지를 전달한다.
  socket.on('new_message', (message, roomName, done) => {
    socket.to(roomName).emit('new_message', `${socket.nickname}: ${message}`)
    done()
  })

  // 닉네임 설정
  socket.on('nickname', (nickname) => (socket['nickname'] = nickname))
})

const handleListen = () => console.log(`Listening on http://localhost:3000/`)
httpServer.listen(3000, handleListen)
