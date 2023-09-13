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