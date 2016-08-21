/**
 * webpack.config.js
 * build by rwson @8/21/16
 * mail:rw_Song@sina.com
 */

"use strict";
let webpack = require("webpack");

module.exports = {
    entry: [
        `${__dirname}/public/js/index.js`
    ],
    output: {
        path: `${__dirname}/public/js/`,
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {test: /\.js$/, loader: "jsx!babel"}
        ]
    }
};