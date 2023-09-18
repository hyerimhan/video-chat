const messageList = document.querySelector('ul')
const nickForm = document.querySelector('#nick')
const messageForm = document.querySelector('#message')

// app.js의 socket은 서버로의 연결
// 각 기기마다 localhost가 다른 경우가 있으니 `window.location.host`로 한다.
const socket = new WebSocket(`ws://${window.location.host}`)

function makeMessage(type, payload) {
  const msg = { type, payload }
  return JSON.stringify(msg)
}

// 서버가 열렸을 때
socket.addEventListener('open', () => {
  console.log('Connected to Server ✅')
})

// 서버의 메세지를 가져올 때
socket.addEventListener('message', (message) => {
  const li = document.createElement('li')
  li.innerText = message.data
  messageList.append(li)
})

// 서버가 닫혔을 떄
socket.addEventListener('close', () => {
  console.log('Disconnected from Server ❌')
})

function handleSubmit(event) {
  event.preventDefault()
  const input = messageForm.querySelector('input')
  socket.send(makeMessage('new_message', input.value))
  input.value = ''
}

function handleNickSubmit(event) {
  event.preventDefault()
  const input = nickForm.querySelector('input')
  socket.send(makeMessage('nickname', input.value))
  input.value = ''
}

messageForm.addEventListener('submit', handleSubmit)
nickForm.addEventListener('submit', handleNickSubmit)
