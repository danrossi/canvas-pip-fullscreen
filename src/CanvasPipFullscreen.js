/**
 * Canvas Picture in Picture and Fullscreeen API Manager
 * @author Electroteque Media Daniel Rossi <danielr@electroteque.org>
 * Copyright (c) 2023 Electroteque Media
 */

import EventEmitter from 'event-emitter';

import CanvasPictureInPicture from "./CanvasPictureInPicture";
import CanvasFullscreen from './CanvasFullscreen';

import CanvasPipFullscreenUtil from './util/CanvasPipFullscreenUtil';

export default class CanvasPipFullscreen extends EventEmitter {

    constructor(canvas, video, forceFs = false) {
        super();
        this._canvas = canvas;
        this._video = video;
        this._requiresDom = false;
        this._forceFs = forceFs;
    }

    async init() {
        return new Promise((accept) => {
            this.initCanvasVideo();
            const isIOS = CanvasPipFullscreenUtil.isIOS,
            _pipSupported = CanvasPipFullscreenUtil.pipSupported;

            if (_pipSupported) {
                this.initPip();
            }

            this._requiresDom = isIOS && _pipSupported;
        
            //if (isIOS && !CanvasPipFullscreenUtil.fullScreenAvailable) {
            if (isIOS && (!CanvasPipFullscreenUtil.fullScreenAvailable || this._forceFs)) {
                this._requiresDom = true;
                this.initFullscreen();
            }

            accept(this._requiresDom);
        });
        
    }

    static get pipSupported() {
        return CanvasPipFullscreenUtil.pipSupported;
    }

    static get fullScreenAvailable() {
        return CanvasPipFullscreenUtil.fullScreenAvailable;
    }

    get requiresDom() {
        return this._requiresDom;
    }

    initCanvasVideo() {
        const canvasVideo = this._canvasVideo = document.createElement("video");
        canvasVideo.setAttribute("autoplay", true);
        //canvasVideo.setAttribute("webkit-playsinline","");
        //canvasVideo.setAttribute("playsinline","");
    }

    /**
     * Init pip and fullscreen support
     * @param {*} canvas 
     * @param {*} video 
     */
    initPip() {
        this.canvasPip = new CanvasPictureInPicture(this._canvas, this._video, this._canvasVideo);

        const eventCallback = (e, ...args) => {
            this.emit(e.type, args[0], args[1]);
        };

        this.canvasPip.on("enterpictureinpicture", eventCallback)
        .on("leavepictureinpicture", eventCallback)
        .on("failed", eventCallback)
        .on("disabled", eventCallback);

        this.canvasPip.init();
    }

    initFullscreen() {
        const eventCallback = (e, ...args) => {
            this.emit(e.type, args[0], args[1]);
        };

        this.canvasFullScreen = new CanvasFullscreen(this._canvas, this._canvasVideo);
        this.canvasFullScreen.on('webkitbeginfullscreen', eventCallback)
        .on('webkitendfullscreen', eventCallback)
        .on('fsplay', eventCallback)
        .on('fspause', eventCallback)
    }

    /**
     * Update the video for the pip manager
     */
    set video(video) {
        if (this.canvasPip) this.canvasPip.video = video;
    }

    /**
     * Get the canvas rendering video to add to the dom
     */
    get canvasVideo() {
        return this._canvasVideo;
    }

    /**
     * Toggle
     * @param {*} hasVR in a canvas render state or use normal video pip.
     */
    togglePictureInPicture(hasVR = true) {
        this.canvasPip.togglePictureInPicture(hasVR);
    }

    /**
     * iPhone request fullscreen for canvas support
     */
    requestFullscreen() {
        this.canvasFullScreen && this.canvasFullScreen.requestFullscreen();
    }

    /**
     * Exit iPhone fullscreen
     */
    exitFullscreen() {
        this.canvasFullScreen && this.canvasFullScreen.exitFullscreen();
    }
}