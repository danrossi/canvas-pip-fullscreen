/**
 * IPhone Canvas Native Fullscreeen API Support
 * @author Electroteque Media Daniel Rossi <danielr@electroteque.org>
 * Copyright (c) 2023 Electroteque Media
 */

import EventEmitter from 'event-emitter';

export default class CanvasFullscreen extends EventEmitter {

    constructor(canvas, renderVideo) {
        super();
        this.init(canvas, renderVideo);
    }

    /**
     * Init canvas rendering video for fullscreen support
     * @param {*} canvas 
     */
    init(canvas, renderVideo) {
        
        //const video = this._video = document.createElement("video");
        const video = this._video = renderVideo;
        this.canvas = canvas;

        video.setAttribute("autoplay", true);
        //video.setAttribute("webkit-playsinline","");
        //video.setAttribute("playsinline","");     
        //video.setAttribute("muted", true);

        video.style.display = "none";

        video.addEventListener("pause", () => {
            this.emit("fspause");
            this.isPaused = true;
        });

        video.addEventListener("play", () => {
            if (this.isPaused) {
                this.emit("fsplay");
                this.isPaused = false;
            }
        });

        const onEnterFullScreen = () => {
            video.style.display = "block";
            this.emit('webkitbeginfullscreen');
        };

        const onExitFullScreen = () => {
            video.style.display = "none";

            //stop canvas stream tracks
            video.srcObject.getTracks().forEach(track => track.stop());

            this.emit('webkitendfullscreen');
        };


        document.addEventListener("webkitfullscreenchange", function (event) {
            //console.log("on webkitfullscreenchange", video.webkitDisplayingFullscreen);

            if (video.webkitDisplayingFullscreen) {
                onEnterFullScreen();
            } else {
                onExitFullScreen();
            }
           
         });


        video.addEventListener('webkitbeginfullscreen', onEnterFullScreen);
        video.addEventListener('webkitendfullscreen', onExitFullScreen);

        video.addEventListener("loadedmetadata", () => {
            video.style.display = "block";
            video.play().catch((e) => { console.log(e);});
            //enter fullscreen on metadata
            video.webkitEnterFullScreen();

        });
    }

    /**
     * Request canvas fullscreen for iPhone within a check. 
     * Use requestFullscreen otherwise for html container.
     */
    requestFullscreen() {
        //video.style.display = "block";
        this._video.srcObject = this.canvas.captureStream(30);

        //this._video.play().catch((e) => { console.log(e);});
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