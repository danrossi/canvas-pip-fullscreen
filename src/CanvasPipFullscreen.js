/**
 * Canvas Picture in Picture and Fullscreeen API Manager
 * @author Electroteque Media Daniel Rossi <danielr@electroteque.org>
 * Copyright (c) 2023 Electroteque Media
 */

import EventEmitter from 'event-emitter';

import CanvasPictureInPicture from "./CanvasPictureInPicture";
import CanvasFullscreen from './CanvasFullscreen';

export default class CanvasPipFullscreen extends EventEmitter {

    constructor(canvas, video) {
        super();
        this.init(canvas, video);
    }

    /**
     * Init pip and fullscreen support
     * @param {*} canvas 
     * @param {*} video 
     */
    init(canvas, video) {
        this.canvasPip = new CanvasPictureInPicture(canvas, video);

        const eventCallback = (e, ...args) => {
            this.emit(e.type, args);
        };

        this.canvasPip.on("enterpictureinpicture", eventCallback)
        .on("leavepictureinpicture", eventCallback)
        .on("failed", eventCallback)
        .on("disabled", eventCallback);

        this.canvasFullScreen = new CanvasFullscreen(canvas);
        this.canvasFullScreen.on('webkitbeginfullscreen', eventCallback)
        .on('webkitendfullscreen', eventCallback);
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
        return this.canvasFullScreen && this.canvasFullScreen.video;
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