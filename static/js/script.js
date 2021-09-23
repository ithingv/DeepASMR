const MODEL = 'a1';
const NUM_MODEL_FILES = 99975;
const FILE_PREFIX = 'https://magentadata.storage.googleapis.com/piano_transformer/midi/';

 // Update this if the format we store the data into local storage has changed.
const STORAGE_VERSION = '0.0.2';

const STORAGE_KEYS = {FAVES: 'faves', VERSION: 'data_version'};
const EVENTS = {
  START: 'start', COMPLETE: 'complete',
  NEXT: 'next', PREVIOUS: 'previous',
  FAVE: 'fave', UNFAVE: 'unfave',
  SAVE:'save'};

const player = new core.SoundFontPlayer('https://storage.googleapis.com/download.magenta.tensorflow.org/soundfonts_js/salamander');
const allData = [];  // [ {path, fileName, sequence} ]
let currentSongIndex;
let secondsElapsed, progressInterval;
const canvas =  new p5(sketch, document.querySelector('.canvas-container'));
const HAS_LOCAL_STORAGE = typeof(Storage) !== 'undefined';

// FML, these p5 canvases are async?

setTimeout(init, 200);

function init() {
    // Event listeners
    document.getElementById('btnPlay').addEventListener('click', playOrPause);
}

/*
 * Event listeners
*/
function playOrPause() {
    const state = player.getPlayState();
    if (state === 'started') {
        pausePlayer();
    } else {
        startPlayer();
    }
}

function startPlayer() {
    const state = player.getPlayState();
    if (state === 'stopped') {
        tagClick(EVENTS.START);
        secondsElapsed = 0;
        player.start(allData[currentSongIndex].sequence).then(
            () => {
                tagClick(EVENTS.COMPLETE);
                nextSong();
            }
        );
    } else {
        player.resume();
    }

    clearInterval(progressInterval);
    progressInterval = setInterval(updateProgressBar, 1000));
    document.getElementById('btnPlay').classList.add('active')
    document.querySelector('.album').classList.add('rotating')
    // startPlayer
    // getPlayState(), start(allData[currentSongIndex].sequence), resume()
    // tagClick
    // allData[].sequence, .fileName
    // nextSong()
    // clearInterval(progressInterval)
    // updateProgressBar
    // classList.add('active')
    // classList.add('rotating')

}



function pausePlayer(andStop = false){
    if (andStop){
        player.stop();
        documnet.querySelector('.current-time').textContent = '0:00';
        document.querySelector('progress').value = 0
        secondsElapsed = 0;
    } else {
        player.pause();
    }
    clearInterval(progressInterval);
    progressInterval = null;
    document.getElementById('btnPlay').classList.remove('active')
    document.querySelector('.album').classList.remove('rotating')
    // andStop = true <- 이 정보는 어떻게 알수있지?
    // player.stop()
    // '.current-time').textContent = '0:00';
    // 'progress').value = 0
    // secondsElapsed = 0

    // andStop = false
    // player.pause()

    // clearInterval(progressInterval);
    // progressInterval = null;
    // document.getElementById('btnPlay').classList.remove('active') <- classList 정보도 공부
    // document.querySelector('.album').classList.remove('rotating')
}

function tagClick(eventName, logPlayTime, filename){
    filename = filename || allData[currentSongIndex].fileName;

    const details = {}
    details['event_category'] = MODEL;
    details['event_label'] = filename;

    if (logPlayTime) {
        details['value'] = progressBar.value;
    }
    gtag('event', eventName, details); 

    // tagClick(eventName, logPlayTime, filename) <- 값을 넣지 않아도 동작?
    //     filename = filename || allData[currentSongIndex].fileName;
    //     allData의 fileName

    //     const details = {} <- gtag에 전달하기 위한 object
    //     details['event_category'] = MODEL;
    //     details['event_label'] = filename;
    
    //     if (logPlayTime) {
    //         details['value'] = progressBar.value;
    //     }
    //     gtag('event', eventName, details); ???????????????????
    //  }  details <= 'event_category', 'event_label', 'value'
    
}

function nextSong(){
    getSong().then(() => changeSong(currentSongIndex + 1));

    // getSong()
    // changeSong(currentSongIndex 정보)
    // song 정보가 어디에 담겨있는지 알아보자!
}

function previousSong() {
    changeSong(currentSongIndex - 1);
  }

function updateProgressBar() {
    secondsElapsed++;
    progressBar.value = secondsElapsed;
    currentTime.textContent = formatSeconds(secondsElapsed);
    // 1초마다 progressBar 값을 1씩 늘림
    
    // progressBar = document.querySelector('progress');
    // currentTime = document.querySelector('.current_time')
    // .textContent
    // formatSeconds()
}

function formatSeconds(s){
    s = Math.round(s);
    return(s-(s%=60))/60+(9<s?':':':0')+s;
}

async function getSong(path) {
    if (!path) {
        path = getRandomMidiFilename();
    }
    const songData = {};
    allData.push(songData);
    songData.path = path;
    songData.fileName = songData.path.replace(`${FILE_PREFIX}${MODEL}/`,'');
    const ns = await core.urlToNoteSequence(path);
    const quantized = core.sequences.quantizeNoteSequence(ns, 4);
    songData.sequence = quantized;
    return quantized;

    // async function getSong(path) { 비동기 사용하는 이유?
    //     if (!path) {  // path가 안들어온다면?
    //         path = getRandomMidiFilename(); // getRandomMidiFilename()???
    //     }
    //     const songData = {};
    //     allData.push(songData); 빈 object를 먼저 넣고
    //     songData.path = path; path, fileName, sequence 정보를 삽입
    //     songData.fileName = songData.path.replace(`${FILE_PREFIX}${MODEL}/`,'');
    
    //     const ns = await core.urlToNoteSequence(path); 
    //     await이 뭔지, urlToNoteSequence
    //     const quantized = core.sequences.quantizeNoteSequence(ns, 4);
    //     quantization?
    //     songData.sequence = quantized;
    //     return quantized;
}

function getRandomMidiFilename(){
    const index = Math.floor(Math.random() * NUM_MODEL_FILES);
    return `${FILE_PREFIX}${MODEL}/${index}.mid`;
}


function changeSong(index, noAutoplay = false){
    // update to this song
    currentSongIndex = index;

    // If this is the first song, we don't get a previous button
    if (currentSongIndex === 0){
        document.getElementById('btnPrevious').setAttribute('disabled', true);
    } else {
        document.getElementById('btnPrevious').removeAttribute('disabled');
    }
    pausePlayer(true);
    const hash = MODEL + '_' + allData[index].fileName;
    window.location.hash = hash;

    // update the share dialog with this index.
    const twitterPrefix = 'https://twitter.com/intent/tweet?hashtags=madewithmagenta&text=Listen%20to%20this%20Piano%20Transformer%20composition%21%20';
    const fbPrefix = 'https://www.facebook.com/sharer/sharer.php?u=';
    const url = `https://g.co/magenta/listen#${hash}`;
    document.querySelector('a.twitter').href = `${twitterPrefix}${escape(url)}`
    document.querySelector('a.fb').href = `${fbPrefix}${url}`;

    const sequence = allData[index].sequence;

    // Set up the progress bar
    const seconds = Math.round(sequence.totalTime);
    const totalTime = formatSeconds(seconds);
    document.querySelector('.total-titme').textContent = totalTime;
    const progressBar = document.querySelector('progress');
    progressBar.max = seconds;
    progressBar.value = 0;

    // Get ready for playing and start playing if we need to.
    // This takes the longest so start early
    player.loadSamples(sequence).then(() => {
        if (!noAutoplay){
            startPlayer();
        }
    });

    // Set up the album art
    updateCanvas(allData[index]);
    updateFaveButton();

    // function changeSong(index, noAutoplay = false){ 자동재생 유무
    //     // update to this song
    //     currentSongIndex = index; 
    
    //     // If this is the first song, we don't get a previous button
    //     if (currentSongIndex === 0){ 처음 곡이면 previous 버튼 비활성화
    //         document.getElementById('btnPrevious').setAttribute('disabled', true);
    //     } else { 비활성화 제거
    //         document.getElementById('btnPrevious').removeAttribute('disabled');
    //     }
    //     pausePlayer(true); 인수로 true를 주면 곡이 중지되고 기존 재생 정보가 초기화된다. 
    
    
    //     const hash = MODEL + '_' + allData[index].fileName; ??????
    //     window.location.hash = hash;
    
    //     // update the share dialog with this index.
    //     const twitterPrefix = 'https://twitter.com/intent/tweet?hashtags=madewithmagenta&text=Listen%20to%20this%20Piano%20Transformer%20composition%21%20';
    //     const fbPrefix = 'https://www.facebook.com/sharer/sharer.php?u=';
    //     const url = `https://g.co/magenta/listen#${hash}`;
    //     document.querySelector('a.twitter').href = `${twitterPrefix}${escape(url)}`
    //     document.querySelector('a.fb').href = `${fbPrefix}${url}`;
    
    //     const sequence = allData[index].sequence; sequence가 재생시간정보를 담고있는듯하다
    
    //     // Set up the progress bar
    //     const seconds = Math.round(sequence.totalTime);
    //     const totalTime = formatSeconds(seconds);
    //     document.querySelector('.total-titme').textContent = totalTime;
    //     const progressBar = document.querySelector('progress');
    //     progressBar.max = seconds; # 곡의 재생시간
    //     progressBar.value = 0;
    
    //     // Get ready for playing and start playing if we need to.
    //     // This takes the longest so start early

    //     player.loadSamples(sequence).then(() => { 재생할 샘플을 담고 곡을 자동재생할것인지?
    //         if (!noAutoplay){
    //             startPlayer();
    //         }
    //     });
    
    //     // Set up the album art
    //     updateCanvas(allData[index]);
    //     updateFaveButton();
    // }

}

function updateCanvas(songData){
    document.querySelector('.song-title').textContent = songData.fileName;
    canvas.drawAlbum(songData.sequence);
    // canvas의 drawAlbum?
}

function updateFaveButton(){
    if (!HAS_LOCAL_STORAGE) return;
    const btn = document.getElementById('btnFave');
    const faves = getFromLocalStorage(STORAGE_KEYS.FAVES);
    const index = faves.findIndex(x => x.name === allData[currentSongIndex].fileName);

    // Is the current song a favorite song?
    if (index !== -1){
        btn.classList.add('active');
    } else {
        btn.classList.remove('active');
    }
    // function updateFaveButton(){
    //     if (!HAS_LOCAL_STORAGE) return;
    //     const btn = document.getElementById('btnFave');
    //     const faves = getFromLocalStorage(STORAGE_KEYS.FAVES);
    //     const index = faves.findIndex(x => x.name === allData[currentSongIndex].fileName);
    
    //      findIndex ??
    
    //     // Is the current song a favorite song?
    //     if (index !== -1){
    //         btn.classList.add('active');
    //     } else {
    //         btn.classList.remove('active');
    //     }
}
