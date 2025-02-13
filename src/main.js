// styles
import 'normalize.css'
import './styles/fonts.css'
import './styles/style.scss'

// 

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

const phone_input = document.querySelector('[name="phone"]');

function phoneFormat(e){
  const elem = e.target;

  let pos = elem.selectionStart;
  let posEnd = elem.selectionStart == elem.value.length;

  let numbers = elem.value.replace(/[^\d]/g, '');
  let formatted = numbers;

  let pattern = 'x (xxx) xxx-xx-xx';
  for (let i = 0; i < numbers.length; i++) {
    if (i == 0){
      pattern = pattern.replace('x', '7');
    } else {  
      pattern = pattern.replace('x', numbers[i]);
    }
  }

  pattern = '+' + pattern;

  formatted = pattern.replace(/^(.*\d)[^\d]*$/, '$1');
  formatted = numbers.length > 0 ? formatted : '';
  formatted[2]
  if (posEnd) {
    pos = formatted.length;
  }
  elem.value = formatted;
  elem.selectionStart = elem.selectionEnd = pos;

}

phone_input.addEventListener('input', phoneFormat)


function setError(form, name, error) {
  const form_item = form.querySelector(`[name=${name}]`).closest('.form-item');
  form_item.classList.add('form-item--error')
  form_item.querySelector('.form-item__error').textContent = error
}

const callback_form = document.querySelector('.callback-form');

function callback(e) {
  e.preventDefault();
  const form = e.srcElement;
  const submit = form.querySelector('[type="submit"]');
  submit.disabled = true;
  form.querySelector('.form-error').classList.add('form-error--hidden');
  for (let item of form.querySelectorAll('.form-item')){
    item.classList.remove('form-item--error')
  }
  fetch('https://api-demo.rednosed.agency/', {
    method: 'POST',
    body: new FormData(e.srcElement)
  })
    .then( (response) => {
      if (!response.ok)
      return response.json()
    })
    .then( (data) => {
      if (!data.result){
        for (let warning in data.warnings){
          setError(form, warning, data.warnings[warning])
        }
        return;
      }
      form.reset()
    })
    .catch( (error) => {
      form.querySelector('.form-error').classList.remove('form-error--hidden');
      console.log(error);
    })
    .finally( () => {
      submit.disabled = false;
    })
}

callback_form.addEventListener('submit', callback)