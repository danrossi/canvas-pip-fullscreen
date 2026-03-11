import VideoPatcher from './util/VideoPatcher';

export default class VideoController {

    constructor(canvasVideo, mainVideo) {
        this.mainVideo = mainVideo;

        VideoPatcher.patchApi(this, canvasVideo);
    }
    

    get currentTime() {
        console.log("current time ", this.mainVideo.currentTime);
        return this.mainVideo.currentTime;
    }

    set currentTime(value) {
        this.mainVideo.currentTime = value;
    }

    get duration() {
        console.log("duration ", this.mainVideo.duration);
        return this.mainVideo.duration;
    }
    
}