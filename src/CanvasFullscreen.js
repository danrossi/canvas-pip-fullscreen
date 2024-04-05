/**
 * IPhone Canvas Native Fullscreeen API Support
 * @author Electroteque Media Daniel Rossi <danielr@electroteque.org>
 * Copyright (c) 2023 Electroteque Media
 */

import EventEmitter from 'event-emitter';

export default class CanvasFullscreen extends EventEmitter {

    constructor(canvas, canvasVideo) {
        super();
        this.init(canvas, canvasVideo);
    }

    /**
     * Init canvas rendering video for fullscreen support
     * @param {*} canvas 
     */
    init(canvas, canvasVideo) {
        
        //const video = this._video = document.createElement("video");
        const video = this._video = canvasVideo;
        this._canvas = canvas;

        //video.setAttribute("autoplay", true);
        //video.setAttribute("webkit-playsinline","");
        //video.setAttribute("playsinline","");     
        //video.setAttribute("muted", true);

        //video.style.display = "none";

        
        this.onPauseRef = () => {
            if (this._legacyFullscreen) {
                this.emit("fspause");
                this.isPaused = true;
            }
            
        };

        this.onPlayRef = () => {
            if (this.isPaused && this._legacyFullscreen) {
                this.emit("fsplay");
                this.isPaused = false;
            }
        };

        this.onEnterFullScreenRef = () => {
            if (this._legacyFullscreen) {
                //video.style.display = "block";
                video.classList.add("show");
                this.emit('webkitbeginfullscreen');
            }
            
        };

        this.onExitFullScreenRef = () => {
            if (this._legacyFullscreen) {
                //video.style.display = "none";
                video.classList.remove("show");

                //stop canvas stream tracks
                if (video.srcObject) video.srcObject.getTracks().forEach(track => track.stop());

                document.removeEventListener("webkitfullscreenchange", this.onFullscreenChangeRef);

                video.removeEventListener("play", this.onPlayRef);
                video.removeEventListener("pause", this.onPauseRef);

                video.removeEventListener('webkitbeginfullscreen', this.onEnterFullScreenRef);
                video.removeEventListener('webkitendfullscreen', this.onExitFullScreenRef);


                this.emit('webkitendfullscreen');

                this._legacyFullscreen = false;
            }
            
        };

        this.onFullscreenChangeRef = (event) => {
            //console.log("on webkitfullscreenchange", video.webkitDisplayingFullscreen);

            if (video.webkitDisplayingFullscreen) {
                this.onEnterFullScreenRef();
            } else {
                this.onExitFullScreenRef();
            }
           
        };


        this.onLoadedMetadataRef = () => {
            //video.style.display = "block";
            //video.classList.add("show");
            video.play().catch((e) => { console.log(e);});
            //enter fullscreen on metadata
            //bug in webkit requiring delay when changing visibility css state or it won't show video
            setTimeout(() => {
                video.webkitEnterFullScreen();
            }, 100);


            video.removeEventListener("loadedmetadata", this.onLoadedMetadataRef);

        };

        
    }

    /**
     * Request canvas fullscreen for iPhone within a check. 
     * Use requestFullscreen otherwise for html container.
     */
    requestFullscreen() {
        this._legacyFullscreen = true;
        document.addEventListener("webkitfullscreenchange", this.onFullscreenChangeRef);
        this._video.addEventListener("play", this.onPlayRef);
        this._video.addEventListener("pause", this.onPauseRef);
        this._video.addEventListener('webkitbeginfullscreen', this.onEnterFullScreenRef);
        this._video.addEventListener('webkitendfullscreen', this.onExitFullScreenRef);
        this._video.addEventListener("loadedmetadata", this.onLoadedMetadataRef);
        

        //video.style.display = "block";
        this._video.classList.add("show");

        this._video.srcObject = this._canvas.captureStream(30);

        this._video.play().catch((e) => { console.log(e);});
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
    /*get video() {
        return this._video;
    }*/
}