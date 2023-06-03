
/**
 * @license
 * screenlock-polyfill
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

class IOSUtils {

    static get isIOS() {
        return ((/iP(hone|ad)/i).test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
    }

    static requireOrientationPermission() {
        return window.DeviceOrientationEvent !== undefined && typeof window.DeviceOrientationEvent.requestPermission === 'function';
    }

    static requestOrientationPermissions() {
        return window.DeviceOrientationEvent.requestPermission();
    }
}

export { IOSUtils as default };
