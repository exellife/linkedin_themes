import path from 'path';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';

const chrm_path = './dist_chrm';
const mdn_path = './dist_mdn';
const format = 'iife';


/**
 * 
 * @param {"chrm" | "mdn"} b 
 */
function bckg_out(b) {
    let path;
    if (b === "chrm") path = `${chrm_path}/background.js`;

    if (b === "mdn") path = `${mdn_path}/background.js`;

    return {
        file: path,
        format,
    }
}
/**
 * 
 * @param {"chrm" | "mdn"} b 
 */
function scripts_out(b) {
    let path;
    if (b === "chrm") path = `${chrm_path}/content_scripts/index.js`;

    if (b === "mdn") path = `${mdn_path}/content_scripts/index.js`;

    return {
        file: path,
        format,
    }
}

/**
 * 
 * @param {"chrm" | "mdn"} b 
 */
function popup_out(b) {
    let path;
    if (b === "chrm") path = `${chrm_path}/popup/index.js`;

    if (b === "mdn") path = `${mdn_path}/popup/index.js`;

    return {
        file: path,
        format,
    }
}


const myOptions = {
    tsconfig: path.resolve(__dirname, 'my.tsconfig.json')
};

const plugin = [
    typescript(myOptions),
    // nodeResolve({
    //     browser: true,
    //     // extenstions: ['.js', '.jsx', '.ts', '.tsx'],
    // }),

    babel({
        babelHelpers: 'bundled'
    }),
];


export default [
    {
        // background.js
        input: './src/bckg.ts',
        output: [
            bckg_out("chrm"),
            bckg_out("mdn"),
        ],
        plugins: plugin,
        watch: {
            include: [
                'src/styles/**/*.ts',
                'src/bckg.ts',
            ],
            exclude: [
                'src/popup/'
            ]
        }
    },

    {
        // content_scripts
        input: './src/content_scripts/index.ts',
        output: [
            scripts_out("chrm"),
            scripts_out("mdn"),
        ],
        plugins: plugin,
        watch: {
            include: [
                'src/styles/**/*.ts',
                './src/content_scripts/**/*.ts'
            ],
            exclude: [
                'src/popup/'
            ]
        }
    },

    {
        // content_scripts
        input: './src/popup/index.ts',
        output: [
            popup_out("chrm"),
            popup_out("mdn"),
        ],
        plugins: plugin,
        watch: {
            // exclude: [
            //     './src/content_scripts/**/*.ts'
            // ]
        }
    },
]