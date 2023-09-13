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

async function handleCameraChange() {
  await getMedia(camerasSelect.value)
}

muteBtn.addEventListener('click', handleMuteClick)
cameraBtn.addEventListener('click', handleCameraClick)
camerasSelect.addEventListener('input', handleCameraChange)
