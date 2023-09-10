import http from 'http'
import WebSocket from 'ws'
import express from 'express'

const app = express()

app.set('view engine', 'pug')
app.set('views', __dirname + '/views')
app.use('/public', express.static(__dirname + '/public'))
app.get('/', (_, res) => res.render('home'))

// home만 사용할 것이기 때문에 redirect를 설정해줬다.
app.get('/*', (_, res) => res.render('home'))

const handleListen = () => console.log(`Listening on http://localhost:3000/`)

// http 서버 생성
const server = http.createServer(app)
// webSocket 서버 생성
// http 서버와 ws 2개의 protocol 사용 가능. http 서버 위에 ws서버를 만들기 위함. http, ws가 같은 port에 있길 원할때 사용 (선택)
// 이렇게 하는 이유는 위에 설정해 둔 views, static files, home, redirection을 원하기 때문
const wss = new WebSocket.Server({ server })
server.listen(3000, handleListen)

// server.js의 socket은 연결된 어떤 사람 (연결된 브라우저와의 contact(연락)라인)
const handleConnection = (socket) => {
  console.log(socket)
}

wss.on('connection', handleConnection)
