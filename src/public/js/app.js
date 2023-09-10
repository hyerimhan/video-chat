const messageList = document.querySelector('ul')
const messageForm = document.querySelector('form')

// app.js의 socket은 서버로의 연결
// 각 기기마다 localhost가 다른 경우가 있으니 `window.location.host`로 한다.
let socket = new WebSocket(`ws://${window.location.host}`)

// 서버가 열렸을 때
socket.addEventListener('open', () => {
  console.log('Connected to Server ✅')
})

// 서버의 메세지를 가져올 때
socket.addEventListener('message', (message) => {
  console.log('New message:', message.data)
})

// 서버가 닫혔을 떄
socket.addEventListener('close', () => {
  console.log('Disconnected from Server ❌')
})

function handleSubmit(event) {
  event.preventDefault()
  const input = messageForm.querySelector('input')
  socket.send(input.value)
  input.value = ''
}

messageForm.addEventListener('submit', handleSubmit)

// 서버로 10초 후에 메세지를 보낸다.
