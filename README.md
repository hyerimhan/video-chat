# [video-chat (Demo)]()

👆🏻 제목을 클릭하면 배포된 사이트를 확인하실 수 있습니다.

<br />

## ✏️ 학습 목적

- Node.js, WebRTC, Websockets로 실시간 화상 채팅 or 채팅방 구현하기

<br/>

## ✅ 구현 목록

- [x] 닉네임을 추가해서 채팅 구현
- [ ] 입장, 퇴장 이벤트 추가
- [ ] 채팅방에 접속중인 인원 확인
- [ ] 서버에 실시간으로 몇 개의 방이 존재하는지 확인

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

### 🔆 node.js로 서버 생성

#### 1. ws(webSocket) 설치

```
npm i ws
```

#### 2. `server.js`에 webSocket 서버 생성할 코드를 추가한다.

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

#### 3. `app.js`에 서버로 연결하는 코드를 작성한다.

```JavaScript
// 각 기기마다 localhost가 다른 경우가 있으니 `window.location.host`로 한다.
// socket은 서버로의 연결
let socket = new WebSocket(`ws://${window.location.host}`)
```

### 🔆 Chat with WebSockets

#### 1. 서버와 브라우저를 연결한다.

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

#### 2. 다른 브라우저 환경에서도 작동할 수 있는 코드를 작성한다.

```JavaScript
// server.js

// fake database
const sockets = []

wss.on('connection', (socket) => {
  sockets.push(socket)
  // ...
  socket.on('message', (message) =>
    sockets.forEach((aSocket) => aSocket.send(message.toString()))
  )
})
```

<br />
