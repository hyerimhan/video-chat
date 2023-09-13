const socket = io()

const welcome = document.getElementById('welcome')
const form = welcome.querySelector('form')
const room = document.getElementById('room')

room.hidden = true

let roomName

function roomTitle(newCount) {
  const h3 = room.querySelector('h3')
  h3.innerText = `Room ${roomName} ${newCount ? `(${newCount})` : ''}`
}

function addMessage(message) {
  const ul = room.querySelector('ul')
  const li = document.createElement('li')
  li.innerText = message
  ul.appendChild(li)
}

function handleMessageSubmit(event) {
  event.preventDefault()
  const input = room.querySelector('#message input')
  socket.emit('new_message', input.value, roomName, () => {
    addMessage(`You: ${input.value}`)
    input.value = ''
  })
}

function handleNicknameSubmit(event) {
  event.preventDefault()
  const input = room.querySelector('#name input')
  socket.emit('nickname', input.value)
}

function showRoom() {
  welcome.hidden = true
  room.hidden = false
  roomTitle()
  const messageForm = room.querySelector('#message')
  const nameForm = room.querySelector('#name')
  messageForm.addEventListener('submit', handleMessageSubmit)
  nameForm.addEventListener('submit', handleNicknameSubmit)
}

function handleRoomSubmit(event) {
  event.preventDefault()
  const input = form.querySelector('input')
  // websocket에서 서버로 보낼 때 사용했던 "send" 대신 emit을 사용한다.
  // 첫번째 argument에는 event이름, 두번째 보내고 싶은 payload, 세번째 서버에서 호출하는 function 등 원하는만큼 argument를 사용할 수 있다. (websocket은 string만 가능)
  // 단, function은 emit의 마지막 argument 여야 한다.
  socket.emit('enter_room', input.value, showRoom)
  roomName = input.value
  input.value = ''
}

form.addEventListener('submit', handleRoomSubmit)

// 방에 다른 유저들이 입장 or 퇴장하면 전체 메세지로 알려줌
socket.on('welcome', (user, newCount) => {
  addMessage(`${user} arrived!`)
  roomTitle(newCount)
})
socket.on('bye', (user, newCount) => {
  addMessage(`${user} left ㅠㅠ`)
  roomTitle(newCount)
})

socket.on('new_message', addMessage)
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
