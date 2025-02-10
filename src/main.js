import 'normalize.css'
import './styles/fonts.css'
import './styles/style.scss'

const start = document.querySelector('.start');
const stop = document.querySelector('.stop');
const video = document.querySelector('.video');
let camera_stream = null;

start.addEventListener('click', startVideo)
stop.addEventListener('click', stopVideo)

function startVideo(){
  console.log('startVideo')
  navigator.mediaDevices.getUserMedia({video: true})
  .then( (result) => {
    camera_stream = result
    video.srcObject = camera_stream;
    video.play();
  } )  
  .catch( (error) => console.log(error))
}

function stopVideo(){
  console.log('stopVideo')
  camera_stream.getTracks()[0].stop();
}