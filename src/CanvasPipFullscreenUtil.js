export default class CanvasPipFullscreenUtil {

    static get fullScreenAvailable() {
        return document.fullscreenEnabled ||
            document.mozFullscreenEnabled ||
            document.webkitFullscreenEnabled ||
            document.msFullscreenEnabled;
    }
}