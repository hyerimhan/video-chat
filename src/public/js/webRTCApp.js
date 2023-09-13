const socket = io()

const myFace = document.getElementById('myFace')
const muteBtn = document.getElementById('mute')
const cameraBtn = document.getElementById('camera')
const camerasSelect = document.getElementById('cameras')

let myStream
let muted = false
let cameraOff = false

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

// 유저 비디오 연결 함수
async function getMedia() {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    })
    myFace.srcObject = myStream
    await getCameras()
  } catch (e) {
    console.log(e)
  }
}

getMedia()

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

muteBtn.addEventListener('click', handleMuteClick)
cameraBtn.addEventListener('click', handleCameraClick)
