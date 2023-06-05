
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
 * Screen orientation lock polyfill with IOS support.
 * 
 * @author danrossi / https://github.com/danrossi
 */

function iosScreenLock() {
    return new Promise((accept) => {
        const el = document.querySelector(".screen-lockable");
        el && el.classList.add("landscape");
        (screen && screen.dispatchEvent || screen && screen.orientation.dispatchEvent || window.dispatchEvent)(new Event("orientationchange"));
        accept();
    });

}

function iosScreenUnlock() {
    const el = document.querySelector(".screen-lockable");
    el && el.classList.remove("landscape");
    (screen && screen.dispatchEvent || screen && screen.orientation.dispatchEvent || window.dispatchEvent)(new Event("orientationchange"));
}

if (window.screen) {
    const screenLockApi = screen.lockOrientation
        || screen.mozLockOrientation
        || screen.msLockOrientation
        || screen.orientation && screen.orientation.lock && screen.orientation.lock.bind(screen.orientation);

    screen.lockOrientationUniversal = screenLockApi
        || iosScreenLock;

    screen.supportsScreenLock = !!screenLockApi;

    screen.unlockOrientationUniversal = screen.unlockOrientation
        || screen.mozUnlockOrientation
        || screen.msUnlockOrientation
        || screen.orientation && screen.orientation.unlock && screen.orientation.unlock.bind(screen.orientation)
        || iosScreenUnlock;

    console.log("SCREEN API ", screen.lockOrientationUniversal);
} else {
    const _listeners = [];
    window.screen = {
        supportsScreenLock: false,
        addEventListener: (name, callback) => {
            if (!_listeners[name]) _listeners[name] = [];
            _listeners[name].push(callback);
        },
        dispatchEvent: (name) => {
            _listeners[name].forEach(callback => callback());
        }

    };
    window.screen.lockOrientationUniversal = iosScreenLock;
    window.screen.unlockOrientationUniversal = iosScreenUnlock;
}

class ScreenLockApi {

    /**
     * Native Screen lock api support
     */
    static get supportsScreenLock() {
        return screen.supportsScreenLock;
    }

    /**
     * Set a lock element for IOS fallback
     * @param {*} element 
     */
    static lockElement(element) {
        element.classList.add("screen-lockable");
    }
    /**
     * Screen lock api
     * @param {*} option 
     * @returns 
     */
    static lock(option) {
        return screen.lockOrientationUniversal(option);
    }

    /**
     * Screen unlock api
     * @returns 
     */
    static unlock() {
        return screen.unlockOrientationUniversal();
    }
}

export { ScreenLockApi as default };
