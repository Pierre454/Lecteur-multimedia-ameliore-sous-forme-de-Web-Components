
import './lib/webaudio-controls.js';

const getBaseURL = () => {
  const base = new URL('.', import.meta.url);
  console.log("Base = " + base);
	return `${base}`;
};

const template = document.createElement("template");
template.innerHTML = `
    <style> 
        video {
            position: absolute;
            top: 50%;
            left: 50%;
            margin: -180px 0 0 -240px;
        }
    </style> 
    
    <button id="playButton">Play</button>
    <button id="pauseButton">Pause</button>
    <button id="backButton">-10</button>
    <button id="afterButton">+10</button>
    <button id="reloadButton">Reload</button>
    <button id="stopButton">Stop</button>
    <button id="enableLoopButton">Loop</button>
    <button id="disableLoopButton">Stop Loop</button>

    <video id="myPlayer" controls autoplay> 
        <source src=http://html5doctor.com/demos/video-canvas-magic/video.webm type=video/webm> 
        <source src=http://html5doctor.com/demos/video-canvas-magic/video.ogg type=video/ogg> 
        <source src=http://html5doctor.com/demos/video-canvas-magic/video.mp4 type=video/mp4> 
    </video>   
    <br>
    Volume: 0 <input type="range" min=0 max=1 step=0.1 oninput="player.volume=this.value"> 1
    <br>
    <webaudio-knob id="knobVolume" tooltip="Volume:%s" src="./assets/imgs/bouton2.png" sprites="127" value=1 min="0" max="1" step=0.01>
        Volume</webaudio-knob>

    <webaudio-knob id="knobVolume2" tooltip="Volume:%s" src="./assets/imgs/bouton2.png" sprites="127" value=1 min="0" max="1" step=0.01>
        Volume</webaudio-knob>
        `;

class MyPlayer extends HTMLElement {
    constructor() {
        super();
        this.volume = 1;
        this.attachShadow({ mode: "open" });
        //this.shadowRoot.innerHTML = template;
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.basePath = getBaseURL(); // url absolu du composant
        // Fix relative path in WebAudio Controls elements
            this.fixRelativeImagePaths();
    }
/*
    static get observedAttributes(){
        return ["volume"];
    }
*/
    connectedCallback() {
        this.player = this.shadowRoot.querySelector("#myPlayer");
        this.player.loop = true;

        this.declareListeners();
    }

    fixRelativeImagePaths() {
            // change webaudiocontrols relative paths for spritesheets to absolute
            let webaudioControls = this.shadowRoot.querySelectorAll(
                'webaudio-knob, webaudio-slider, webaudio-switch, img'
            );
            webaudioControls.forEach((e) => {
                let currentImagePath = e.getAttribute('src');
                if (currentImagePath !== undefined) {
                    //console.log("Got wc src as " + e.getAttribute("src"));
                    let imagePath = e.getAttribute('src');
            //e.setAttribute('src', this.basePath  + "/" + imagePath);
            e.src = this.basePath  + "/" + imagePath;
            //console.log("After fix : wc src as " + e.getAttribute("src"));
                }
            });
    }
    
    declareListeners() {
        this.shadowRoot.querySelector("#playButton").addEventListener("click", (event) => {
            this.playVid();
        });

        this.shadowRoot.querySelector("#pauseButton").addEventListener("click", (event) => {
            this.pauseVid();
        });

        this.shadowRoot.querySelector("#backButton").addEventListener("click", (event) => {
            this.back();
        });

        this.shadowRoot.querySelector("#afterButton").addEventListener("click", (event) => {
            this.after();
        });

        this.shadowRoot.querySelector("#reloadButton").addEventListener("click", (event) => {
            this.reload();
        });

        this.shadowRoot.querySelector("#stopButton").addEventListener("click", (event) => {
            this.stop();
        });

        this.shadowRoot.querySelector("#enableLoopButton").addEventListener("click", (event) => {
            this.enableLoop();
        });

        this.shadowRoot.querySelector("#disableLoopButton").addEventListener("click", (event) => {
            this.disableLoop();
        });

        this.shadowRoot
        .querySelector("#knobVolume")
        .addEventListener("input", (event) => {
            this.setVolume(event.target.value);
        });
/*
        this.shadowRoot
        .querySelector("#knobVolume2")
        .addEventListener("input", (event) => {
            this.setAttribute("volume", event.target.value);
        });
*/
    }

    // API
    setVolume(val) {
        this.player.volume = val;
    }
/*
    set volume(val) {
        console.log("volume");
    }
*/
    playVid() { 
        this.player.play(); 
    } 

    pauseVid() { 
        this.player.pause(); 
    } 

    back() { 
        this.player.currentTime -= 10;
    } 

    after() { 
        this.player.currentTime += 10;
    }  

    reload() { 
        this.player.currentTime=0;
    } 

    stop() { 
        this.player.pause();
        this.player.currentTime = 0;
    }

    enableLoop() { 
        this.player.loop = true;
        this.player.load();
    } 

    disableLoop() { 
        this.player.loop = false;
        this.player.load();
    }

}

customElements.define("my-player", MyPlayer);
