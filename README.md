# [video-chat (Demo)]()

👆🏻 제목을 클릭하면 배포된 사이트를 확인하실 수 있습니다.

<br />

## ✏️ 학습 목적

- Node.js, WebRTC, Websockets로 실시간 화상 채팅 or 채팅방 구현하기

<br/>

## ✅ 구현 목록

### SocketIO

- [x] 닉네임을 추가해서 채팅 구현
- [x] 입장, 퇴장 이벤트 추가
- [x] 채팅방에 접속중인 인원 확인
- [x] 서버에 실시간으로 몇 개의 방이 존재하는지 확인

### WebRTC

- [x] 비디오 화면에 출력
- [x] 음소거, 카메라 on/off 버튼

<br />

## 🛠️ Stacks

<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-round&logo=JavaScript&logoColor=white"/> <img src="https://img.shields.io/badge/Node.js-339933?style=flat-round&logo=nodedotjs&logoColor=white"/> <img src="https://img.shields.io/badge/Nodemon-76D04B?style=flat-round&logo=nodemon&logoColor=white"/> <img src="https://img.shields.io/badge/Socket.io-010101?style=flat-round&logo=socketdotio&logoColor=white"/> <img src="https://img.shields.io/badge/WebRTC-333333?style=flat-round&logo=webrtc&logoColor=white"/> <img src="https://img.shields.io/badge/Express.js-000000?style=flat-round&logo=Express&logoColor=white"/>
<img src="https://img.shields.io/badge/Pug-A86454?style=flat-round&logo=Pug&logoColor=white"/>

<br />

## 📖 학습 내용

### 🔆 WebSocket이란?

- 실시간 chat, notification 등과 같은 real-time을 만들 수 있다.<br/>
<img width="100%" src="https://github.com/hyerimhan/video-chat/assets/64674174/6a5dc5e9-f9c9-48d8-8651-ded932c1101e"/>
<table border>
  <thead>
    <th></th>
    <th><center>HTTP</center></th>
    <th><center>WebSocket</center></th>
  </thead>
  <tbody>
    <tr>
      <th><center>공통점</center></th>
      <td colspan="2" align="center">protocol</td>
    </tr>
    <tr>
      <th><center>차이점</center></th>
      <td align="left">
        - 도메인 주소에 "https"나 "http"를 사용한다.<br/>
        - 서버가 유저를 기억하지 못한다.<br/>
        - 유저가 request를 보내면 서버가 반응(response)한다.<br/>
        - stateless<br/>
        - 유저와 서버 사이에 아무런 연결이 없다.<br/>
        - 서버는 오직 request를 받을때만 한번의 response를 주고 다음 request를 기다린다.
      </td>
      <td align="left">
        - 도메인 주소에 "https"나 "http"대신 "ws"를 사용한다.<br/>
        - 서버가 유저를 기억한다.<br/>
        - 브라우저가 서버로 websocket request를 보내면, 서버가 받거나 거절한다.<br/>
        - 브라우저와 서버가 서로 커뮤니케이션 한다. (브라우저와 서버가 연결되어 있다.)<br/>
        - 한번 연결이 성립되면, 두 방향(양방향) 연결이 된다.
      </td>
    </tr>
    <tr align="center">
      <th><center>예</center></th>
      <td>일반 웹</td>
      <td>실시간 채팅</td>
    </tr>
  </tbody>
</table>

### 🔆 프로젝트 생성

<details>
  <summary>Server Setup</summary>
  <div markdown="1">

#### 1. package.json 설치

> ❗node.js가 설치되어 있어야 합니다.

```
npm init -y
```

#### 2. nodemon을 설치한다.

```
npm i nodemon -D
```

#### 3. Root 파일트리에 `babel.config.json`과 `nodemon.json`파일을 생성한다.

#### 4. "src"폴더를 생성한 후, `server.js`파일을 생성한다.

#### 5. `git init .`을 한 다음, 다음과 같이 babel을 설치한다.

```
npm i @babel/core @babel/cli @babel/node -D
```

#### 6. `babel.config.json`과 `nodemon.json`에 다음과 같이 환경 세팅을 한 후,

```json
// babel.config.json
{
  "presets": ["@babel/preset-env"]
}
```

```json
// nodemon.json
// "ignore"은 저장할 때마다 변경사항이 있을 시, 서버가 재시작되는 것을 막기 위함
{
  "ignore": ["src/public/*"],
  "exec": "babel-node src/server.js"
}
```

### 7. babel preset-env를 설치한다.

```
npm i @babel/preset-env -D
```

#### 8. 다음과 같이 `package.json`의 `scripts`를 수정한다.

```json
"scripts": {
  "dev": "nodemon"
}
```

#### 8. `express`와 `pug`를 설치한다.

```
npm i express pug
```

#### 9. `server.js`에 `express`를 가져온 다음, app을 만든다.

```JavaScript
import express from 'express'

const app = express()
```

  </div>
</details>

<details>
  <summary>Frontend Setup</summary>
  <div markdown="1">

#### 1. "src"폴더 안에 "public"폴더를 생성한 후, "js"폴더 안에 유저에게 보일 `app.js`파일을 생성한다.

#### 2. "src"폴더 안에 "views" 폴더를 생성한 후, html 역할을 해줄 `home.pug`파일을 생성한다.

```JavaScript
// server.js
import express from 'express'

const app = express()

app.set('view engine', 'pug')
app.set('views', __dirname + '/views')
app.use('/public', express.static(__dirname + '/public'))
app.get('/', (req, res) => res.render('home'))

// home만 사용할 것이기 때문에 redirect를 설정해줬다.
app.get('/*', (req, res) => res.render('home'))

const handleListen = () => console.log(`Listening on http://localhost:3000/`)
```

```pug
//- home.pug
doctype html
html(lang="ko")
  head
    meta(charset="UTF-8")
    meta(name="viewport", content="width=device-width, initial-scale=1.0")
    title Video chat
    //- mvp css는 선택
    link(rel="stylesheet", href="https://unpkg.com/mvp.css")
  body
    header
      h1 Video chat
    main
      h2 Welcome to Video chat
    script(src="/public/js/app.js")
```

  </div>
</details>

### 🔆 Chat with WebSockets

#### ws(webSocket) 설치

```
npm i ws
```

<details>
  <summary>WebSockets chat 구현 설명</summary>
  <div markdown="1">

#### 1. `server.js`에 webSocket 서버 생성할 코드를 추가한다.

```JavaScript
import http from 'http'
import WebSocket from 'ws'

// http 서버 생성
const server = http.createServer(app)
// webSocket 서버 생성
// http 서버와 ws 2개의 protocol 사용 가능. http 서버 위에 ws서버를 만들기 위함. http, ws가 같은 port에 있길 원할때 사용 (선택)
// 이렇게 하는 이유는 위에 설정해 둔 views, static files, home, redirection을 원하기 때문
const wss = new WebSocket.Server({ server })
server.listen(3000, handleListen)
```

#### 2. `app.js`에 서버로 연결하는 코드를 작성한다.

```JavaScript
// 각 기기마다 localhost가 다른 경우가 있으니 `window.location.host`로 한다.
// socket은 서버로의 연결
let socket = new WebSocket(`ws://${window.location.host}`)
```

#### 3. 서버와 브라우저를 연결한다.

```JavaScript
// server.js

// server.js의 socket은 연결된 어떤 사람 (연결된 브라우저와의 contact(연락)라인)
wss.on('connection', (socket) => {
  console.log('Connected to Browser ✅')
  socket.on('close', () => console.log('Disconnected from the Browser ❌'))
  socket.on('message', (message) => socket.send(message.toString()))
})
```

```JavaScript
// app.js

// 서버가 열렸을 때
socket.addEventListener('open', () => {
  console.log('Connected to Server ✅')
})

// 서버의 메세지를 가져올 때
socket.addEventListener('message', (message) => {
  console.log('Just got this:', message.data, 'from the Server')
})

// 서버가 닫혔을 떄
socket.addEventListener('close', () => {
  console.log('Disconnected from Server ❌')
})

// 서버로 10초 후에 메세지를 보낸다.
setTimeout(() => {
  socket.send('Hello from the browser')
}, 10000)
```

#### 4. 다른 브라우저 환경에서도 작동할 수 있는 코드를 작성한다.

```JavaScript
// server.js

// fake database
// 다른 브라우저 환경을 담을 빈 배열
const sockets = []

wss.on('connection', (socket) => {
  sockets.push(socket)
  // ...
  socket.on('message', (message) =>
    sockets.forEach((aSocket) => aSocket.send(message.toString()))
  )
})
```

  </div>
</details>

### 🔆 SocketIO

> 참고문서: [https://socket.io/](https://socket.io/)

- websocket은 SocketIO가 실시간, 양방향, event 기반의 통신을 제공하는 방법 중 하나다. (SocketIO는 websocket의 부가기능이 아니다.)
- 브라우저가 websocket을 지원하지 않거나 연결이 끊어지면 SocketIO는 다른 방법을 이용해서 계속 작동하거나 재연결한다. (SocketIO가 framework이고 탄력성이 뛰어나기 때문)
- 실시간 통신을 하기 위해서 꼭 사용할 필요는 없지만 실시간 기능 같은 것들을 더 쉽게 만드는 편리한 코드를 제공한다.
- 브라우저에 설치되어있는 websocket보다 더 무겁다.

#### SocketIO 설치

```
npm i socket.io
```

<details>
  <summary>SocketIO chat 구현 설명</summary>
  <div markdown="1">

#### 1. `server.js`에 socketIO 서버 생성할 코드를 추가한다.

```JavaScript
import http from 'http'
import SocketIO from 'socket.io'

// http 서버 생성
const httpServer = http.createServer(app)
// SocketIO 서버 생성
const wsServer = SocketIO(httpServer)
```

#### 2. `home.pug`에 socket.io 스크립트를 추가한다.

```pug
doctype html
html(lang="ko")
  head
    meta(charset="UTF-8")
    meta(name="viewport", content="width=device-width, initial-scale=1.0")
    title Video chat
    //- mvp css는 선택
    link(rel="stylesheet", href="https://unpkg.com/mvp.css")
  body
    header
      h1 Video chat
    main

    script(src="/socket.io/socket.io.js")
    script(src="/public/js/app.js")
```

#### 3. 서버와 브라우저를 연결한다.

```JavaScript
// server.js
wsServer.on('connection', (socket) => {
  // ...
})

const handleListen = () => console.log(`Listening on http://localhost:3000/`)
httpServer.listen(3000, handleListen)
```

```JavaScript
// app.js
// io function은 알아서 socket.io를 실행하고 있는 서버를 찾는다.
const socket = io()
```

#### 4. 방을 생성 & 입장하는 코드

```JavaScript
// app.js

const welcome = document.getElementById('welcome')
const form = welcome.querySelector('form')
const room = document.getElementById('room')

room.hidden = true

let roomName

function showRoom() {
  welcome.hidden = true
  room.hidden = false
  const h3 = room.querySelector('h3')
  h3.innerText = `Room ${roomName}`
}

function handleRoomSubmit(event) {
  event.preventDefault()
  const input = form.querySelector('input')
  // websocket에서 서버로 보낼 때 사용했던 "send" 대신 emit을 사용한다.
  // 첫번째 argument에는 event이름, 두번째 보내고 싶은 payload, 세번째 서버에서 호출하는 function 등 원하는만큼 argument를 사용할 수 있다. (websocket은 string만 가능)
  // 단, function은 emit의 마지막 argument 여야 한다.
  socket.emit('enter_room', { payload: input.value }, showRoom)
  roomName = input.value
  input.value = ''
}

form.addEventListener('submit', handleRoomSubmit)
```

```JavaScript
// server.js

wsServer.on('connection', (socket) => {
  // 모든 event를 감시
  socket.onAny((event) => console.log(`Socket Event: ${event}`))
  socket.on('enter_room', (roomName, done) => {
    socket.join(roomName.payload)
    // app.js emit 세번째 argument인 서버에서 호출하는 function
    done()
  })
})
```

#### 5. 다른 유저가 입장 or 퇴장하면 알림

```JavaScript
// server.js

wsServer.on('connection', (socket) => {
  // ...
  socket.on('enter_room', (roomName, done) => {
    // ...
    // 하나의 방에 다른 유저들이 입장하는지 확인
    socket.to(roomName.payload).emit('welcome')
  })

  // 유저가 접속을 중단할 것이지만 아직 방을 완전히 나가지는 않은 상태(퇴장)
  socket.on('disconnecting', () =>
    socket.rooms.forEach((room) => socket.to(room).emit('bye'))
  )
})
```

```JavaScript
// app.js

function addMessage(message) {
  const ul = room.querySelector('ul')
  const li = document.createElement('li')
  li.innerText = message
  ul.appendChild(li)
}

function handleMessageSubmit(event) {
  event.preventDefault()
  const input = room.querySelector('input')
  socket.emit('new_message', input.value, roomName, () => {
    addMessage(`You: ${input.value}`)
    input.value = ''
  })
}

function showRoom() {
  // ...
  const form = room.querySelector('form')
  form.addEventListener('submit', handleMessageSubmit)
}

// 방에 다른 유저들이 입퇴장하면 전체 메세지로 알려줌
socket.on('welcome', () => addMessage('Someone joined!'))
socket.on('bye', () => addMessage('Someone left ㅠㅠ'))
```

#### 6. 실시간 채팅 서비스

```JavaScript
// server.js

wsServer.on('connection', (socket) => {
  // ...

  // 참여한 방을 확인하고 새로운 메세지를 전달한다.
  socket.on('new_message', (message, roomName, done) => {
    socket.to(roomName).emit('new_message', message)
    done()
    })
})
```

```JavaScript
// app.js

function handleMessageSubmit(event) {
  event.preventDefault()
  const input = room.querySelector('input')
  socket.emit('new_message', input.value, roomName, () => {
    addMessage(`You: ${input.value}`)
    input.value = ''
  })
}

function showRoom() {
  // ...
  const form = room.querySelector('form')
  form.addEventListener('submit', handleMessageSubmit)
}

socket.on('new_message', addMessage)
```

#### 7. 닉네임 표시하기

```JavaScript
// server.js

wsServer.on('connection', (socket) => {
  socket['nickname'] = 'Anon'
  socket.on('enter_room', (roomName, done) => {
    // ...
    socket.to(roomName).emit('welcome', socket.nickname)
  })

  socket.on('disconnecting', () =>
    socket.rooms.forEach((room) => socket.to(room).emit('bye', socket.nickname))
  )

  socket.on('new_message', (message, roomName, done) => {
    socket.to(roomName).emit('new_message', `${socket.nickname}: ${message}`)
    done()
  })

  // 닉네임 설정
  socket.on('nickname', (nickname) => (socket['nickname'] = nickname))
})
```

```JavaScript
// app.js

function handleNicknameSubmit(event) {
  event.preventDefault()
  const input = room.querySelector('#name input')
  socket.emit('nickname', input.value)
}

function showRoom() {
  // ...
  const nameForm = room.querySelector('#name')
  nameForm.addEventListener('submit', handleNicknameSubmit)
}

socket.on('welcome', (user) => addMessage(`${user} arrived!`))
socket.on('bye', (user) => addMessage(`${user} left ㅠㅠ`))
```

#### 8. 생성된 방 리스트로 표시하기

```JavaScript
// server.js

function publicRooms() {
  // SocketIO에서 "adapter"는 서버들 사이에 실시간 어플리케이션을 동기화 한다.
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
  // ...
  socket.on('enter_room', (roomName, done) => {
    // ...
    // 모든 방에 알림 메세지
    wsServer.sockets.emit('room_change', publicRooms())
  })

  // 방을 완전히 나간 상태
  socket.on('disconnect', () => {
    wsServer.sockets.emit('room_change', publicRooms())
  })
})
```

```JavaScript
// app.js

socket.on('room_change', (rooms) => {
  const roomList = welcome.querySelector('ul')
  roomList.innerHTML = ''
  if (rooms.length === 0) return
  rooms.forEach((room) => {
    const li = document.createElement('li')
    li.innerText = room
    roomList.appendChild(li)
  })
})
```

#### 9. 방에 참여한 인원수

```JavaScript
// server.js

// 인원수 체크 함수
function countRoom(roomName) {
  return wsServer.sockets.adapter.rooms.get(roomName)?.size
}

wsServer.on('connection', (socket) => {
  // ...
  socket.on('enter_room', (roomName, done) => {
    // ...
    // 입장할 때 인원수 체크 함수 추가
    socket.to(roomName).emit('welcome', socket.nickname, countRoom(roomName))
  })

  socket.on('disconnecting', () => {
    socket.rooms.forEach((room) =>
      // 퇴장할 때 인원수 체크 함수 추가
      // 아직 방을 완전히 나가지는 않은 상태이기 때문에 인원수에 나도 포함되어 있는 상태이기 때문에 "countRoom(room) - 1" 한다.
      socket.to(room).emit('bye', socket.nickname, countRoom(room) - 1)
    )
  })
})
```

```JavaScript
// app.js

function roomTitle(newCount) {
  const h3 = room.querySelector('h3')
  h3.innerText = `Room ${roomName} ${newCount ? `(${newCount})` : ''}`
}

// newCount 추가
socket.on('welcome', (user, newCount) => {
  // ...
  roomTitle(newCount)
})
socket.on('bye', (user, newCount) => {
  // ...
  roomTitle(newCount)
})
```

#### 💡 Bonus. Admin Panel

##### socketIO 관리자 ui 설치

```
npm i @socket.io/admin-ui
```

##### `server.js` 적용

```JavaScript
import { Server } from 'socket.io'
import { instrument } from '@socket.io/admin-ui'

const wsServer = new Server(httpServer, {
  cors: {
    origin: ['https://admin.socket.io'],
    credentials: true,
  },
})
instrument(wsServer, {
  auth: false,
})
```

##### [어드민 페이지](https://admin.socket.io)에 `서버가 있는 주소/admin`를 입력한 후 , "CONNECT"버튼을 클릭한다.

> 이때, "option"에서 기본으로 설정되어있는 옵션을 전부 삭제한다.

<img src="https://github.com/hyerimhan/video-chat/assets/64674174/a2be9754-a327-4c78-bbdc-59813f84454c">
<img src="https://github.com/hyerimhan/video-chat/assets/64674174/2cdc4bc6-b0ae-4ec0-9bf1-3eef32db28a7">
  </div>
</details>

<br />

### 🔆 Video call

> 참고문서: [https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices)

<details>
  <summary>영상 & 오디오 불러오기 구현 설명</summary>
  <div markdown="1">

#### 1. 유저로부터 비디오를 가져와 화면에 비디오 출력

```JavaScript
// app.js

const socket = io()

const myFace = document.getElementById('myFace')
const muteBtn = document.getElementById('mute')
const cameraBtn = document.getElementById('camera')

let myStream
let muted = false
let cameraOff = false

// 유저 비디오 연결 함수
async function getMedia() {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    })
    myFace.srcObject = myStream
  } catch (e) {
    console.log(e)
  }
}

getMedia()

function handleMuteClick() {
  if (!muted) {
    muteBtn.innerText = 'Unmute'
    muted = true
  } else {
    muteBtn.innerText = 'Mute'
    muted = false
  }
}
function handleCameraClick() {
  if (!cameraOff) {
    cameraBtn.innerText = 'Turn Camera On'
    cameraOff = true
  } else {
    cameraBtn.innerText = 'Turn Camera Off'
    cameraOff = false
  }
}

muteBtn.addEventListener('click', handleMuteClick)
cameraBtn.addEventListener('click', handleCameraClick)
```

#### 2. 음소거, 카메라 on/off

```JavaScript
// app.js

function handleMuteClick() {
  // 음소거 on/off
  myStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled))
  // ...
}
function handleCameraClick() {
  // 카메라 on/off
  myStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled))
  // ...
}
```

#### 3. 유저가 가지고 있는 카메라 목록

```JavaScript
// app.js

const camerasSelect = document.getElementById('cameras')

async function getCameras() {
  try {
    // enumerateDevices: 컴퓨터에 연결되거나 모바일이 가지고 있는 모든 장치와 미디어 장치를 알려준다.
    const devices = await navigator.mediaDevices.enumerateDevices()
    const cameras = devices.filter((device) => device.kind === 'videoinput')
    cameras.forEach((camera) => {
      const option = document.createElement('option')
      option.value = camera.deviceId
      option.innerText = camera.label
      camerasSelect.appendChild(option)
    })
  } catch (e) {
    console.log(e)
  }
}
```

#### 4. 카메라 목록의 카메라를 선택하면 강제적으로 선택한 새로운 카메라로 stream을 다시 시작한다.

```JavaScript
// app.js

async function getCameras() {
  try {
    // ...
    // 처음 렌더링 될 때 현재 사용중인 카메라가 선택되어 있도록한다.
    const currentCamera = myStream.getVideoTracks()[0]
    cameras.forEach((camera) => {
      // ...
      if (currentCamera.label === camera.label) option.selected = true
    })
  } catch (e) {
    console.log(e)
  }
}

// 유저 비디오 연결 함수
async function getMedia(deviceId) {
  // 카메라가 deviceId없이 맨 처음 랜더링 됐을 떄 (초기 랜더링)
  // deviceId가 없을 때
  const initialConstrains = {
    audio: true,
    // 모바일에서 selfie모드
    video: { facingMode: 'user' },
  }
  // deviceId가 있을 때
  const cameraConstrains = {
    audio: true,
    // 특정 카메라 지정
    video: { deviceId: { exact: deviceId } },
  }
  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstrains : initialConstrains
    )
    // ...
    if (!deviceId) await getCameras()
  } catch (e) {
    console.log(e)
  }
}

async function handleCameraChange() {
  await getMedia(camerasSelect.value)
}

camerasSelect.addEventListener('input', handleCameraChange)
```

  </div>
</details>

### 🔆 WebRTC

> 참고문서: [https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)

![WebRTC-1](https://github.com/hyerimhan/video-chat/assets/64674174/31fee755-2f47-4024-a3c8-b3e9ab6e0d4c)

- WebSocket과 달리 내가 보낸 영상과 오디오, 메시지 등이 서버로 가지 않고 직접 수신하기 때문에 빠르다. (peer-to-peer)
- 서버는 수신할 IP나 port(브라우저의 위치), setting, configuration등 서버의 상태를 알아야 할 경우에만 필요하다.

<details>
  <summary>WebRTC 영상 채팅 구현 설명</summary>
  <div markdown="1">
  
  #### 1.

  </div>
</details>
