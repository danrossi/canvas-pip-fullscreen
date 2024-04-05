import { PictureInPictureUtil } from 'pip-manager';
import IOSUtils from 'iosutils';

export default class CanvasPipFullscreenUtil {

    static get fullScreenAvailable() {
        return document.fullscreenEnabled ||
            document.mozFullscreenEnabled ||
            document.webkitFullscreenEnabled ||
            document.msFullscreenEnabled;
    }

    static get isIOS() {
        return IOSUtils.isIOS;
    }

    static get IOSFullscreenAvailable() {
        return IOSUtils.isIOS && this.fullScreenAvailable;
    }

    static get pipSupported() {
        return PictureInPictureUtil.supported;
    }

    static get webkitSupported() {
        return PictureInPictureUtil.webkitSupport;
    }
}