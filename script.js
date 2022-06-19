/*
video total seconds = 60
video played seconds= 10 
*/
const timeline = document.getElementById('timeline')
const filledtimeline = document.getElementById('filled-timeline')
const timeplayed = document.getElementById('timeplayed')
const playbtn = document.getElementById('playbtn')

//shows on  innerHTML
const SecToPixel_el = document.getElementById('sectopx')
const counter_el = document.getElementById('counter')
const mouseEventContainer_el = document.getElementById('mouse-event-container')
const mouseMovePX_el = document.getElementById('mouse-move-pixel')
const mouseMovePxToSec_el = document.getElementById('mouse-move-seconds')
const needMoveForChange_el = document.getElementById('needmoveforChange')
const coloredmv_els = document.getElementsByClassName('coloredmv')

//for canvas timeline preview
let canvas ; // creating canvas when mouse enter on timeline
const thumnailBox = document.getElementById('timeline-thumbnail');


//timeline values
let totalSec = 0;
let playedSec = 0
let SecToPX = 0

//mouse event values
let ChangeSecEventToPX = 0;
let ChangeVideoSecAmount = 0;

//General Values
let VideoPlaying = false;

//for canvas
let forCaptureImage = null;


///Play Button------------
function playBtnAction(action) {
    if (action == 'play') {
        video.play()
        playbtn.style.backgroundColor = 'green';
        playbtn.style.color = 'white';
        playbtn.innerHTML = 'Pause';
        VideoPlaying = true;
    }
    if (action == 'pause') {
        video.pause()
        playbtn.style.backgroundColor = 'red';
        playbtn.style.color = 'white';
        playbtn.innerHTML = 'Play';
        VideoPlaying = false;
    }
}

playbtn.addEventListener('click', () => {
    VideoPlaying ? playBtnAction('pause') : playBtnAction('play')
})

//when end the video
video.onended = function () {
    video.pause();
    playBtnAction('pause')
    canvas && thumnailBox.removeChild(canvas)
};

///Play Button--------------


///video time update calculate timeline 
video.ontimeupdate = function () {
    totalSec = Math.round(video.duration);
    playedSec = Math.round(video.currentTime);
    SecToPX = Math.round(playedSec * timeline.offsetWidth / totalSec);
    filledtimeline.style.width = SecToPX + 'px';

    //shows on innerhtml
    counter_el.innerHTML = `${playedSec} seconds`;
    SecToPixel_el.innerHTML = `= ${SecToPX}px`;
};

///video time update calculate timeline --------------


//mouse events------------------

// Mouse Move Event Calculate for thumnails position and time on click time line
timeline.addEventListener('mousemove', e => {

    mouseEventContainer_el.style.opacity = 1

    ChangeSecEvent_PxToSec = Math.round(e.layerX * totalSec / timeline.offsetWidth);
    ChangeVideoSecAmount = ChangeSecEvent_PxToSec - playedSec

    if (!forCaptureImage && VideoPlaying) {
        forCaptureImage = video.cloneNode(true);
    }

    VideoPlaying && canvas  && createImage(e.layerX, ChangeSecEvent_PxToSec)
    
    if (ChangeVideoSecAmount < 0) {
        for (let i = 0; i < coloredmv_els.length; i++) {
            coloredmv_els[i].style.color = "red"
        }
    } else {
        for (let i = 0; i < coloredmv_els.length; i++) {
            coloredmv_els[i].style.color = "green"
        }
    }

    //innerHTML show
    mouseMovePX_el.innerHTML = `${e.layerX} px`;
    mouseMovePxToSec_el.innerHTML = `${ChangeSecEvent_PxToSec} seconds`;
    needMoveForChange_el.innerHTML = `Need Move <b>${e.layerX - SecToPX}px</b> for <b>${ChangeVideoSecAmount} seconds</b> `;

    //console.log(e.layerX-SecToPX)
    //console.log(ChangeSecEvent_PxToSec,playedSec,ChangeVideoSecAmount)
})



//change time according to mouse position when user click anywhere on the timeline
timeline.addEventListener('click', () => {
    video.currentTime = video.currentTime + ChangeVideoSecAmount
})




timeline.addEventListener('mouseleave', () => {
    canvas && VideoPlaying && thumnailBox.removeChild(canvas)
})
timeline.addEventListener('mouseenter', () => {
    canvas = document.createElement('canvas')
})


//for thumbnail draws when mouse move on timeline
function createImage(mouseX, capturePictureSec) {

    forCaptureImage.currentTime = capturePictureSec;
    ctx = canvas.getContext('2d');
    canvas.width = forCaptureImage.videoWidth / 4;
    canvas.height = forCaptureImage.videoHeight / 4;
    ctx.drawImage(forCaptureImage, 0, 0, forCaptureImage.videoWidth / 4, forCaptureImage.videoHeight / 4);
    thumnailBox.appendChild(canvas);
  
    canvas.style.transform = `translateX(${mouseX - forCaptureImage.videoWidth / 6 }px) translateY(${-forCaptureImage.videoHeight / 4 -8}px)`;

    console.log(mouseX)
}

//mouse events------------------

