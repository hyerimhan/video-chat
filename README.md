# [video-chat (Demo)]()

:point_up_2: 제목을 클릭하면 배포된 사이트를 확인하실 수 있습니다.

<br />

## :pencil2: 학습 목적

- Node.js, WebRTC, Websockets로 실시간 화상 채팅 구현하기

<br />

## 🛠️ Stacks

<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-round&logo=JavaScript&logoColor=white"/> <img src="https://img.shields.io/badge/Node.js-339933?style=flat-round&logo=nodedotjs&logoColor=white"/> <img src="https://img.shields.io/badge/Nodemon-76D04B?style=flat-round&logo=nodemon&logoColor=white"/> <img src="https://img.shields.io/badge/Socket.io-010101?style=flat-round&logo=socketdotio&logoColor=white"/> <img src="https://img.shields.io/badge/WebRTC-333333?style=flat-round&logo=webrtc&logoColor=white"/> <img src="https://img.shields.io/badge/Express.js-000000?style=flat-round&logo=Express&logoColor=white"/>
<img src="https://img.shields.io/badge/Pug-A86454?style=flat-round&logo=Pug&logoColor=white"/>

<br />

## :book: 학습 내용

### 🔆 Socket이란?

-

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
// "ignore"은 저장할 때마다 서버가 호출되는 것을 막기 위함
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
app.listen(3000)
```

  </div>
</details>
<details>
  <summary>Frontend Setup</summary>
  <div markdown="1">

#### 1. "src"폴더 안에 "public"폴더를 생성한 후, "js"폴더 안에 유저에게 보일 app.js파일을 생성한다.

#### 2. "src"폴더 안에 "views" 폴더를 생성한 후, html 역할을 해줄 `home.pug`파일을 생성한다.

```JavaScript
// server.js
import express from 'express'

const app = express()

app.set('view engine', 'pug')
app.set('views', __dirname + '/views')
app.use('/public', express.static(__dirname + '/public'))
app.get('/', (req, res) => res.render('home'))

const handleListen = () => console.log(`Listening on http://localhost:3000/`)
app.listen(3000, handleListen)
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

<br />
