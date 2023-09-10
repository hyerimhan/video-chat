// 각 기기마다 localhost가 다른 경우가 있으니 `window.location.host`로 한다.
// app.js의 socket은 서버로의 연결
let socket = new WebSocket(`ws://${window.location.host}`)
