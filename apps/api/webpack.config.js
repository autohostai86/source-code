/** @format */

// const getWebpackConfig = require('@nrwl/react/plugins/webpack');

module.exports = (config) => {
    // config = getWebpackConfig(config);
    // config.watchOptions:
    // if (process.platform == 'win32') {
    config.watchOptions = {
        poll: 2000,
        ignored: /node_modules/,
    };
    config.output.publicPath = '';
    // }

    // console.log('process.platform: ', process.platform);
    //     console.log('config.watchoptions: ', config.watchOptions);
    //     console.log('config: ', config);
    return config;
};
