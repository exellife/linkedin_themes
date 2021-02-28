const header = document.getElementById('header');
const switcher_container = document.getElementById('switcher-container');
const switcher = document.createElement('span');
switcher.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path
        d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z" />
</svg>
`;

const hint = document.createElement('span');
hint.classList.add('icon-btn-hint');
switcher.appendChild(hint);


chrome.storage.local.get(['state'], (result) => {
    if (result.state === 'off') {
        switcher.classList.add('icon-btn', 'off');
        header.innerHTML = `State: OFF`;
        hint.innerHTML = `Turn On`;
        // toggle_container.classList.add('hidden');
        theme_container.classList.add('hidden');
    } else {
        switcher.classList.add('icon-btn', 'on');
        header.innerHTML = `State: ON`;
        hint.innerHTML = `Turn Off`;
        // toggle_container.classList.remove('hidden');
        theme_container.classList.remove('hidden');
    }
})


// switcher.classList.add('icon-btn', 'off');
switcher_container.appendChild(switcher);

switcher.onclick = function () {
    if (switcher.classList.contains('off')) {
        // TURNING ON
        chrome.storage.local.set({ state: 'on' });
        switcher.classList.remove('off');
        switcher.classList.add('on');
        header.innerHTML = `State: ON`;
        hint.innerHTML = `Turn Off`;
        // toggle_container.classList.remove('hidden');
        theme_container.classList.remove('hidden');

    } else {
        // TURNING OFF
        chrome.storage.local.set({ state: 'off' });
        switcher.classList.remove('on');
        switcher.classList.add('off');
        header.innerHTML = `State: OFF`;
        hint.innerHTML = `Turn On`;
        // toggle_container.classList.add('hidden');
        theme_container.classList.add('hidden');
    }
}

/** THEME SECTION */
const theme_container = document.getElementById("btns-wrap");
const _btns_selection = document.getElementById("theme-btns");

for (const _id of ["dark-gray", "mauve", "camo"]) {
    const _span = document.createElement("span");
    _span.id = _id;
    _span.onclick = function () {
        chrome.storage.local.set({ theme: _id });
    }

    _btns_selection.appendChild(_span);
}


/** TOGGLE ADS  **/
// const toggle_container = document.getElementById("ads-toggle");
// const ads_header = document.createElement('div');
// ads_header.id = "ads-header";

// const inpt = document.createElement('input');
// inpt.id = "switch";
// inpt.setAttribute("type", "checkbox");

// const label = document.createElement('label');
// label.setAttribute("for", "switch");

// toggle_container.appendChild(ads_header);
// toggle_container.appendChild(inpt);
// toggle_container.appendChild(label);

// function set_toggle_state(state) {
//     inpt.setAttribute('state', state);
//     ads_header.innerText = state === "on" ?
//         "Ads Enabled" : "Ads Disabled";
// }


// chrome.storage.local.get(['ads'], (result) => {
//     set_toggle_state(result.ads);
// })

// inpt.onclick = function () {
//     chrome.storage.local.get(['ads'], (result) => {
//         if (result.ads === 'off') {
//             chrome.storage.local.set({ ads: 'on' }, () => {
//                 set_toggle_state('on');
//             })
//         } else {
//             chrome.storage.local.set({ ads: 'off' }, () => {
//                 set_toggle_state('off');
//             })
//         }
//     })
// }
