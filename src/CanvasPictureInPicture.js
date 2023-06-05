/**
 * Canvas Picture In Picture API Manager
 * @author Electroteque Media Daniel Rossi <danielr@electroteque.org>
 * Copyright (c) 2023 Electroteque Media
 */
import EventEmitter from 'event-emitter';
import { PictureInPictureManager } from 'pip-manager';

export default class CanvasPictureInPicture extends EventEmitter {

    constructor(canvas, video) {
        super();
        
        this._renderingCanvas = canvas;
        this._video = video;
    }

    set video(video) {
        if (this.pipManager) this.pipManager.video = video;
    }

    /**
     * Init canvas video and normal video pip
     * @param {*} canvas 
     * @param {*} video 
     */
    init() {
        const pipVRVideo = this.pipVRVideo = document.createElement("video"),
        vrPipManager = new PictureInPictureManager(pipVRVideo);
        pipVRVideo.setAttribute("autoplay", true);
        pipVRVideo.setAttribute("webkit-playsinline","");
        pipVRVideo.setAttribute("playsinline","");

        this.onPipMetadata = () => {
            pipVRVideo.removeEventListener("loadedmetadata", this.onPipMetadata);
            vrPipManager.togglePictureInPicture();
        };

        const eventCallback = (e, ...args) => {
            this.emit(e.type, args[0], args[1]);
        };
    
        vrPipManager.on("enterpictureinpicture", (e) => {
            eventCallback(e, true);
        }).on("leavepictureinpicture", (e) => {
            eventCallback(e, true);
            pipVRVideo.style.display = "none";
            //stop the canvas stream tracks
            pipVRVideo.srcObject.getTracks().forEach(track => track.stop());
        }).on("failed", (e, error) => {
            eventCallback(e, true, error);
        });/*.on("disabled", (e, disabled) => {
            eventCallback(e, true, disabled);
        });*/

        if (this._video) {
            const pipManager = this.pipManager = new PictureInPictureManager(this._video);
    
            pipManager.on("enterpictureinpicture", (e) => {
                eventCallback(e, false);
            }).on("leavepictureinpicture", (e) => {
                eventCallback(e, false);
            }).on("failed", (e, error) => {
                eventCallback(e, false, error);
            }).on("disabled", (e, disabled) => {
                eventCallback(e, false, disabled);
            });

            pipManager.init(this._video);
        }
            
        vrPipManager.init(pipVRVideo);
    }

     /**
     * Request VR picture in picture
     */
     requestVRPip() {
        this.pipVRVideo.style.display = "block";
        this.pipVRVideo.addEventListener("loadedmetadata", this.onPipMetadata);
        //render video from the canvas stream
        this.pipVRVideo.srcObject = this._renderingCanvas.captureStream(30);
        this.pipVRVideo.play();
    }

    /**
     * Toggle canvas or video pip
     * @param {*} hasVR 
     */
    togglePictureInPicture(hasVR = true) {
        if (hasVR)
            this.requestVRPip();
        else if (this.pipManager)
            this.pipManager.togglePictureInPicture();
    }
}