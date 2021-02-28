import {
    _start_ad_observer,
    _stop_ad_observer,
} from './ad_banners';

import { styles } from '../styles/styles';


function create_style() {
    const style_tag = document.createElement('style');
    style_tag.id = "linkedin-custom-dark-theme-need-this-to-be-long";
    style_tag.innerHTML = styles;
    return style_tag;
}

function remove_style() {
    const style_tag = document.getElementById("linkedin-custom-dark-theme-need-this-to-be-long");
    if (style_tag) style_tag.remove();
}


function _turn_on(theme) {
    remove_style();
    document.documentElement.setAttribute('theme', theme);
    document.head.appendChild(create_style());
    _start_ad_observer();
}

export function _turn_off() {
    remove_style();
    document.documentElement.removeAttribute('theme');
    _stop_ad_observer();
}

function storageListener(changes, areaName) {
    if (areaName === "local") {
        const { state, theme } = changes;

        if (state) {
            if (state.newValue === 'on') {

                chrome.storage.local.get(['theme'], (result) => {
                    _turn_on(result.theme);
                })

            } else {
                _turn_off();
            }
        }

        if (theme) {
            _turn_on(theme.newValue);
        }

    }
}

chrome.storage.onChanged.addListener(storageListener);
chrome.storage.local.get(['state', 'theme'], result => {
    if (result.state === 'on') {
        _turn_on(result.theme);
    } else {
        _turn_off();
    }
});

// const btn = document.querySelector('.search-global-typeahead__input');
// console.log(btn)
// // @ts-ignore
// btn.onkeydown = function (e) {
//     e.preventDefault();
//     const typeahead = document.querySelector('.basic-typeahead__triggered-content');

//     printRecursive(typeahead, 0);
// }

export function printRecursive(el: any, level) {

    console.log(new Array(level).fill("-").join(" "), el);
    console.log("\n");
    level += 1;
    for (const child of el.children) {
        printRecursive(child, level);
    }

}

type _ev = "click" | "keydown";

function __inspect(el, ev: _ev, target, all = false, idx = 0) {
    if (ev === 'click') {
        el.onclick = function (e) {
            e.preventDefault();
            const _target = all ?
                document.querySelectorAll(target)[idx] :
                document.querySelector(target);

            printRecursive(_target, 0);
        }
    } else if (ev === 'keydown') {
        el.onkeydown = function (e) {
            // e.preventDefault();
            const _target = all ?
                document.querySelectorAll(target)[idx] :
                document.querySelector(target);

            printRecursive(_target, 0);
        }
    } else {
        const _target = document.querySelector(target);

        printRecursive(_target, 0);
    }
}

function get_with_delay(target: string, count = 0, all = false, idx = 0) {
    // console.log("GOT HERE");
    return new Promise((res, rej) => {

        function do_work() {
            let el = all ?
                document.querySelectorAll(target)[idx] :
                document.querySelector(target);

            console.log(el);

            if (count < 50) {
                count += 1;
                if (el) res(el);
                else setTimeout(do_work, 300);
            } else {
                rej('Could not get an element...');
            }
        }

        do_work();
    });
}

// get_with_delay('.search-global-typeahead__input')
//     .then(d => {
//         console.log(d);
//         __inspect(d, 'keydown', '.search-global-typeahead__input');
//     })
//     .catch(console.error)


