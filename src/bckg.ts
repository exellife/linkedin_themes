function onInstalled() {
    chrome.storage.local.set({
        state: 'off',
        theme: 'dark-gray',
    });
};
chrome.runtime.onInstalled.addListener(onInstalled);


// TODO ! has to be array of allowed urls
const regexes = [
    /.*:\/\/.*\.?linkedin\.com\/.*/,
];

const allowed = /(https?)\:\/\/(www\.)?linkedin\.com\/.*/;

const _disallowed = [
    // https://www.linkedin.com/accessibility/*
    // https://www.linkedin.com/help/*
    // https://www.linkedin.com/legal/*
    // https://www.linkedin.com/talent/*
    // https://www.linkedin.com/uas/*

]

const disallowed = /(https?)\:\/\/(www\.)?linkedin\.com\/(accessibility|help|legal|talent|uas|home|signup|login|payments|psettings|premium\/cancel)\/.*/;

chrome.tabs.onActivated.addListener((info) => {
    chrome.tabs.get(info.tabId, (tab) => {
        if (allowed.test(tab.url) && !disallowed.test(tab.url)) {
            chrome.browserAction.enable();
            return;
        }
        chrome.browserAction.disable();
    })
});


// https://www.linkedin.com/jobs/jobs-in-brooklyn-ny/?trk=homepage-basic_intent-module-jobs&position=1&pageNum=0


// https://www.linkedin.com/jobs/jobs-in-brooklyn-ny?trk=homepage-basic_intent-module-jobs&position=1&pageNum=0