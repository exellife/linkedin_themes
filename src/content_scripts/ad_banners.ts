import { AVOID_URLS } from './avoid_urls';
import { ads_styles } from '../styles/ads_styles';
import { _turn_off } from './index';

function _iframes() {
    const is_header = fetch_ad_banner(true);
    const is_not_header = fetch_ad_banner(false);

    if (is_header) handle_ad(is_header)
    if (is_not_header) handle_ad(is_not_header);
}

function handle_ad(iframe: HTMLIFrameElement) {
    const doc = iframe.contentDocument;

    if (THEME !== 'default') {
        if (doc.documentElement) {
            doc.documentElement.setAttribute('theme', THEME);
            let _style = doc.getElementById('iframe-style');
            if (_style) _style.remove();
            _style = doc.createElement('style');
            _style.id = 'iframe-style';
            _style.innerHTML = ads_styles;
            if (doc.head) {
                doc.head.appendChild(_style);
            }
        }
    }
}

function fetch_ad_banner(header = false) {
    const target = header ?
        '.ad-banner-container.is-header-zone'
        :
        '.ad-banner-container:not(.is-header-zone)';

    const ad = document.querySelector(target);
    if (ad) {
        // @ts-ignore
        const _iframe: HTMLIFrameElement = ad.firstChild;
        return _iframe;
    }

}


// const allowed = /(https?)\:\/\/(www\.)?linkedin\.com\/.*/;
// const disallowed = /(https?)\:\/\/(www\.)?linkedin\.com\/(accessibility|help|legal|talent|uas)\/.*/;
// function handle_href_change() {

//     const href = location.href;
//     // if our styles do not support current page
//     if (!allowed.test(href) || disallowed.test(href)) {
//         console.log("GOT HERE DISALLOW URLS TEST")
//         // _turn_off(); // turn off styles
//         return;
//     }
// }


let _href = '';

function mutation_cb(mutationsList, observer) {
    // const current_href = location.href;
    // if (current_href !== _href) {
    //     // handle_href_change();
    //     _href = current_href;
    // }

    _iframes();
}


function theme_change(changes, areaName) {
    if (areaName === 'local') {
        const { theme } = changes;

        if (theme) {
            if (theme.newValue !== 'default') {
                THEME = theme.newValue;
                _iframes();
            }
        }
    }
}
let THEME = 'default';
chrome.storage.onChanged.addListener(theme_change);
chrome.storage.local.get(['theme'], (result) => {
    if (result.theme !== 'default') {
        THEME = result.theme;
    }
})
// create an observer instance
const observer = new MutationObserver(mutation_cb);

export function _start_ad_observer() {


    // select the target node
    const target = document.querySelector('body');

    // configuration of the observer:
    const config = {
        subtree: true,
        childList: true,
    };
    observer.observe(target, config);
    return observer;

}

export function _stop_ad_observer() {
    if (observer) observer.disconnect();
}

// function _get_with_delay(target: string, count = 0, _timeout): Promise<Element> {
//     // console.log("GOT HERE");
//     return new Promise((res, rej) => {
//         let theme = '';

//         function do_work() {
//             let el = document.querySelector(target);

//             chrome.storage.local.get(['theme'], (result) => {
//                 theme = result.theme;
//             })

//             if (count < 150) {
//                 count += 1;
//                 if (el) {
//                     try {
//                         // @ts-ignore
//                         const _iframe: HTMLIFrameElement = el.firstChild;
//                         console.log(theme);

//                         _iframe.removeAttribute('style');
//                         const doc = _iframe.contentDocument;
//                         const html = doc.getElementsByTagName('html')[0];
//                         // !TODO
//                         // html.setAttribute('theme', theme);

//                         let styles = doc.getElementsByTagName('style')[0];
//                         if (!styles) {
//                             styles = doc.createElement('style');
//                             styles.innerHTML = ads_styles;
//                             doc.head.appendChild(styles);
//                         }
//                         _timeout = setTimeout(do_work, 200);


//                     } catch (e) {
//                         _timeout = setTimeout(do_work, 200);
//                     }
//                 }
//                 else _timeout = setTimeout(do_work, 200);
//             } else {
//                 rej('Could not get an element...');
//             }
//         }

//         do_work();
//     });
// }


// function get_with_delay(target: string, count = 0, _timeout: any): Promise<NodeListOf<Element>> {
//     // console.log("GOT HERE");
//     return new Promise((res, rej) => {

//         function do_work() {
//             let els = document.querySelectorAll(target);

//             if (count < 50) {
//                 count += 1;
//                 if (els) {
//                     // console.log(els)
//                     // console.log(document.readyState)
//                     // els.length === 0 || els.length === 1 ?
//                     //     _timeout = setTimeout(do_work, 300)
//                     //     :
//                     //     els.length === 2
//                     // document.readyState === 'complete' && els.length === 2 || document.readyState === "interactive"

//                     if (els.length === 2 &&
//                         (document.readyState === 'complete' || document.readyState === "interactive")) {



//                     } else {
//                         _timeout = setTimeout(do_work, 300)
//                     }
//                     // res(els);
//                 }
//                 else _timeout = setTimeout(do_work, 300);
//             } else {
//                 rej('Could not get an element...');
//             }
//         }

//         do_work();
//     });
// }

