const { watch, series, src, dest } = require('gulp');

const sass = require('gulp-sass');
sass.compiler = require('node-sass');

const rename = require('gulp-rename');
const replace = require('gulp-replace');

const minify = require('gulp-minify');
const uglifycss = require('gulp-uglifycss');
const htmlmin = require('gulp-htmlmin');


const fs = require('fs');
const readline = require('readline');


const chrm_path = `./dist_chrm`;
const mdn_path = `./dist_mdn`;

function manifest(cb) {
    const raw = fs.readFileSync('./src/manifest.json');

    const chrome = JSON.parse(raw);
    chrome.description = "__MSG_appDesc__";

    const mdn = { ...chrome };

    fs.writeFileSync('./dist_chrm/manifest.json', JSON.stringify(chrome));


    // change this!!!
    mdn.browser_specific_settings = { gecko: { id: "addon@linkedin-dark-themes.com" } };

    mdn.icons = {
        ["48"]: "icons/linkedin_themes48.png",
        ["96"]: "icons/linkedin_themes96.png"
    }

    fs.writeFileSync('./dist_mdn/manifest.json', JSON.stringify(mdn));

    cb();
    // return src('./src/_locales/**/*')
    //     .pipe(dest('./dict_chrm/_locales'))
    //     .pipe(dest('./dict_mdn/_locales'))
}

function popup_html(cb) {
    return src('./src/popup/index.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest(`${chrm_path}/popup/`))
        .pipe(dest(`${mdn_path}/popup/`))
}

function app_scss() {
    return src('./src/scss/app.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(rename('index.css'))
        .pipe(uglifycss())
        .pipe(dest(`./src/styles`))
}


function ads_scss() {
    return src('./src/scss/ads.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(rename('ads.css'))
        .pipe(uglifycss())
        .pipe(dest(`./src/styles`))
}

function popup_scss() {
    return src('./src/scss/popup.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(rename('index.css'))
        .pipe(dest(`${chrm_path}/popup`))
        .pipe(replace('chrome-extension://__MSG_@@extension_id__', 'moz-extension://<extension-UUID>'))
        .pipe(dest(`${mdn_path}/popup`));
}

function appendCB(err) {
    if (err) console.error(err);
}

function export_css(cb) {
    if (fs.existsSync('./src/styles/styles.ts')) {
        fs.rmSync('./src/styles/styles.ts');
    }

    const raw = fs.readFileSync('./src/styles/index.css');

    const data = `export const styles = \`${raw.toString()}\`\;`;
    console.log(data.length);
    fs.writeFileSync('./src/styles/styles.ts', data);

    // fs.appendFileSync('./src/styles/styles.ts', 'export const styles = `', appendCB);
    // fs.appendFileSync('./src/styles/styles.ts', raw, appendCB);
    // fs.appendFileSync('./src/styles/styles.ts', '`', appendCB);
    cb();
}


function export_ads(cb) {
    if (fs.existsSync('./src/styles/ads_styles.ts')) {
        fs.rmSync('./src/styles/ads_styles.ts');
    }


    const raw = fs.readFileSync('./src/styles/ads.css');

    const data = `export const ads_styles = \`${raw.toString()}\`\;`;
    fs.writeFileSync('./src/styles/ads_styles.ts', data);

    cb();
}


function _locales() {
    return src('./src/_locales/**/*')
        .pipe(dest('./dist_chrm/_locales'))
        .pipe(dest('./dist_mdn/_locales'));
}

function _watch(cb) {

    watch('./src/manifest.json', manifest);
    watch('./src/popup/index.html', popup_html);
    watch(['./src/scss/**/*.scss', '!./src/scss/ads.scss'], app_scss);
    watch('./src/scss/ads.scss', ads_scss);
    watch('./src/scss/popup.scss', popup_scss);
    watch('./src/styles/index.css', export_css);
    watch('./src/styles/ads.css', export_ads);
    watch('./src/_locales/**/*', _locales);
    cb();
}


function _build(cb) {
    manifest(cb);
    popup_html(cb);
    app_scss(cb);
    ads_scss(cb);
    popup_scss(cb);
    export_css(cb);
    export_ads(cb);
    _locales(cb);

    cb();
}

exports.b = _build;

exports.w = _watch;