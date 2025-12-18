/** @format */

// const nrwlConfig = require('@nrwl/react/plugins/webpack.js'); // require the main @nrwl/react/plugins/webpack configuration function.
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// module.exports = (config, context) => {
// //     console.log('config: ', JSON.stringify(config.module.rules, null, 4));
//     nrwlConfig(config); // first call it so that it @nrwl/react plugin adds its configs,

//     // then override your config.
//     return {
//         ...config,
//         plugins: [...config.plugins],
//         module: {
//             rules: [
//                 ...config.module.rules,
//                 {
//                     test: /\.(s(a|c)ss)$/,
//                     use: ['css-loader', 'sass-loader'],
//                 },
//             ],
//         },
//     };
// };
const getWebpackConfig = require('@nrwl/react/plugins/webpack');

module.exports = (config) => {
    config = getWebpackConfig(config);
    // console.log('config: ', JSON.stringify(config.plugins[0], null, 4));

    // if (process.platform === 'win32') {
    config.watchOptions = {
        poll: 2000,
        ignored: /node_modules/,
    };
    // }
    config.output.publicPath = '';
    return config;
};
