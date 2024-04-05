
/**
 * @license
 * ios-detection-utils
 * @author danrossi / https://github.com/danrossi
 * Copyright (c) 2017 Google
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * IOSUtils
 * IOS utils methods for IOS detection and requesting orientation permissions. 
 * @author danrossi / https://github.com/danrossi
 */

let visionOSWidth = 1306;

class IOSUtils {
    /**
     * Only way to detect visionOS is detect for MacIntel Ipad and screen width greater than 1306
     * xr detection for visionOS is only possible if the flag is enabled.
     */
    static get isVisionOS() {
        return this.isIpad && screen.availWidth >= visionOSWidth; 
    }

    /**
     * Modern Ipad detection
     */
    static get isIpad() {
        return (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }

    /**
     * Iphone and Ipad detection and filter for visionOS screens. 
     * We don't want to detect visionOS as iOS to prevent including mobile features like orientation controls.
     */
    static get isIOS() {
        return ((/iP(hone|ad)/i).test(navigator.platform) || this.isIpad && screen.availWidth < visionOSWidth);
    }

    static requireOrientationPermission() {
        return window.DeviceOrientationEvent !== undefined && typeof window.DeviceOrientationEvent.requestPermission === 'function';
    }

    static requestOrientationPermissions() {
        return window.DeviceOrientationEvent.requestPermission();
    }
}

export { IOSUtils as default };
