console.clear();

const buttons = document.querySelectorAll(".btn");
const audios = document.querySelectorAll("audio");

let canvas, ctx, source, context, analyser, fbc_array, bars, bar_pos,
    bar_width, bar_height;
let MEDIA_ELEMENT_NODES = new WeakMap();

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {

    let idx = Number(btn.id);
    let curr_audio = audios[idx];   
    
    audios.forEach(audio => { // 재생할 오디오 이외 소리 모두 stop
      if (audio !== curr_audio){
        audio.pause();
      }
    })

    if (curr_audio.paused === true) {
      curr_audio.loop = true;
      curr_audio.volume = 0.5;
      curr_audio.play();
      showUpEQ(curr_audio, idx);
    
    } else {
    curr_audio.pause();

    }
  }, false);
})

function showUpEQ(audio, idx) {
  if (context == undefined) {
  context = new AudioContext();
  }
  analyser = context.createAnalyser();
  canvas = document.getElementById("canvas" + idx);
  ctx = canvas.getContext("2d");
  if (MEDIA_ELEMENT_NODES.has(audio)){
  source = MEDIA_ELEMENT_NODES.get(audio);
  }
  else{
    source = context.createMediaElementSource(audio);
    MEDIA_ELEMENT_NODES.set(audio, source);
  }
  source.connect(analyser);
  analyser.connect(context.destination);

  canvas.width = window.innerWidth * 0.4;
  canvas.height = window.innerHeight * 0.4;
  frameLooper();
}

function frameLooper() {
  window.RequestAnimationFrame =
    window.requestAnimationFrame(frameLooper) ||
    window.msRequestAnimationFrame(frameLooper) ||
    window.mozRequestAnimationFrame(frameLooper) ||
    window.webkitRequestAnimationFrame(frameLooper);

  fbc_array = new Uint8Array(analyser.frequencyBinCount);
  bar_count = window.innerWidth / 2;

  analyser.getByteFrequencyData(fbc_array);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";

  for (var i = 0; i < bar_count; i++) {
    bar_pos = i * 8;
    bar_width = 1;
    bar_height = -(fbc_array[i] / 2);

    ctx.fillRect(bar_pos, canvas.height + 10, bar_width, bar_height);
    ctx.setTransform(1, 0, 0, -1, 0, canvas.height);
  }
}
