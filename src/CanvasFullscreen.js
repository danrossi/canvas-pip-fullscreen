/**
 * IPhone Canvas Native Fullscreeen API Support
 * @author Electroteque Media Daniel Rossi <danielr@electroteque.org>
 * Copyright (c) 2023 Electroteque Media
 */

import EventEmitter from 'event-emitter';

export default class CanvasFullscreen extends EventEmitter {

    constructor(canvas) {
        super();
        this.init(canvas);
    }

    /**
     * Init canvas rendering video for fullscreen support
     * @param {*} canvas 
     */
    init(canvas) {
        
        const video = this._video = document.createElement("video");

        this.canvas = canvas;

        video.setAttribute("autoplay", true);
        video.setAttribute("webkit-playsinline","");
        video.setAttribute("playsinline","");
             
        //video.setAttribute("muted", true);

        video.style.display = "none";

        video.addEventListener("pause", () => {
            this.emit("paused");
            this.isPaused = true;
        });

        video.addEventListener("play", () => {
            if (this.isPaused) {
                this.emit("playing");
                this.isPaused = false;
            }
        });

        video.addEventListener('webkitbeginfullscreen', () => {
            this._video.style.display = "block";
            this.emit('webkitbeginfullscreen');
        });

        video.addEventListener('webkitendfullscreen', () => {
            video.style.display = "none";

            //stop canvas stream tracks
            video.srcObject.getTracks().forEach(track => track.stop());

            this.emit('webkitendfullscreen');
        });

        video.addEventListener("loadedmetadata", () => {
           // console.log("metadatata");
           //enter fullscreen on metadata
            video.webkitEnterFullScreen();
        });
    }

    /**
     * Request canvas fullscreen for iPhone within a check. 
     * Use requestFullscreen otherwise for html container.
     */
    requestFullscreen() {
        
        this._video.srcObject = this.canvas.captureStream(30);

        //console.log("request", this._video.srcObject);
        this._video.play().catch(() => {});
    }

    /**
     * Exit fullscreen
     */
    exitFullscreen() {
        this._video.webkitExitFullScreen();
    }

    /**
     * the current video to add to the dom or add css
     */
    get video() {
        return this._video;
    }
}