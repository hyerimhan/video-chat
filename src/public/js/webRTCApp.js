const socket = io()

const myFace = document.getElementById('myFace')
const muteBtn = document.getElementById('mute')
const cameraBtn = document.getElementById('camera')
const camerasSelect = document.getElementById('cameras')
const call = document.getElementById('call')

call.hidden = true

let myStream
let muted = false
let cameraOff = false
let roomName
let myPeerConnection
let myDataChannel

async function getCameras() {
  try {
    // enumerateDevices: 컴퓨터에 연결되거나 모바일이 가지고 있는 모든 장치와 미디어 장치를 알려준다.
    const devices = await navigator.mediaDevices.enumerateDevices()
    const cameras = devices.filter((device) => device.kind === 'videoinput')
    const currentCamera = myStream.getVideoTracks()[0]
    cameras.forEach((camera) => {
      const option = document.createElement('option')
      option.value = camera.deviceId
      option.innerText = camera.label
      if (currentCamera.label === camera.label) option.selected = true
      camerasSelect.appendChild(option)
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
    myFace.srcObject = myStream
    if (!deviceId) await getCameras()
  } catch (e) {
    console.log(e)
  }
}

function handleMuteClick() {
  myStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled))
  if (!muted) {
    muteBtn.innerText = 'Unmute'
    muted = true
  } else {
    muteBtn.innerText = 'Mute'
    muted = false
  }
}
function handleCameraClick() {
  myStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled))
  if (!cameraOff) {
    cameraBtn.innerText = 'Turn Camera On'
    cameraOff = true
  } else {
    cameraBtn.innerText = 'Turn Camera Off'
    cameraOff = false
  }
}

async function handleCameraChange() {
  await getMedia(camerasSelect.value)
  if (myPeerConnection) {
    const videoTrack = myStream.getVideoTracks()[0]
    // sender는 peer로 보내진 media stream track을 컨트롤하게 해준다.
    const videoSender = myPeerConnection.getSenders().find((sender) => {
      sender.track.kind === 'video'
    })
    videoSender.replaceTrack(videoTrack)
  }
}

muteBtn.addEventListener('click', handleMuteClick)
cameraBtn.addEventListener('click', handleCameraClick)
camerasSelect.addEventListener('input', handleCameraChange)

// Welcome Form (join a room)
const welcome = document.getElementById('welcome')
const welcomeForm = welcome.querySelector('form')

async function initCall() {
  welcome.hidden = true
  call.hidden = false
  await getMedia()
  makeConnection()
}

async function handleWelcomeSubmit(event) {
  event.preventDefault()
  const input = welcomeForm.querySelector('input')
  await initCall()
  socket.emit('join_room', input.value)
  roomName = input.value
  input.value = ''
}
welcomeForm.addEventListener('submit', handleWelcomeSubmit)

// Socket code
// peer 1(첫번째로 연결되는 컴퓨터)에서 실행
socket.on('welcome', async () => {
  myDataChannel = myPeerConnection.createDataChannel('chat')
  myDataChannel.addEventListener('message', (event) => {
    console.log(event.data)
  })
  console.log('made data channel')
  const offer = await myPeerConnection.createOffer()
  myPeerConnection.setLocalDescription(offer)
  console.log('sent the offer')
  socket.emit('offer', offer, roomName)
})

// peer 2(그 다음에 연결되는 컴퓨터)에서 실행
socket.on('offer', async (offer) => {
  myPeerConnection.addEventListener('datachannel', (event) => {
    myDataChannel = event.myDataChannel
    myDataChannel.addEventListener('message', (event) => {
      console.log(event.data)
    })
  })
  console.log('received the offer')
  myPeerConnection.setRemoteDescription(offer)
  const answer = await myPeerConnection.createAnswer()
  myPeerConnection.setLocalDescription(answer)
  socket.emit('answer', answer, roomName)
  console.log('sent the answer')
})

socket.on('answer', (answer) => {
  console.log('received the answer')
  myPeerConnection.setRemoteDescription(answer)
})

socket.on('ice', (ice) => {
  console.log('received candidate')
  myPeerConnection.addIceCandidate(ice)
})

// RTC code
function makeConnection() {
  myPeerConnection = new RTCPeerConnection({
    // 구글이 무료로 제공하는 리스트
    iceServers: [
      {
        urls: [
          'stun:stun.l.google.com:19302',
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
          'stun:stun3.l.google.com:19302',
          'stun:stun4.l.google.com:19302',
        ],
      },
    ],
  })
  myPeerConnection.addEventListener('icecandidate', handleIce)
  myPeerConnection.addEventListener('addstream', handleAddStream)
  myStream
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, myStream))
}

function handleIce(data) {
  console.log('sent candidate')
  socket.emit('ice', data.candidate, roomName)
  console.log('got ice candidate')
}

function handleAddStream(data) {
  const peerFace = document.getElementById('peerFace')
  peerFace.srcObject = data.stream
}
