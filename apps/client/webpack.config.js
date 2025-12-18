const getWebpackConfig = require('@nrwl/react/plugins/webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = (config) => {
    // Get the existing Nx Webpack config
    config = getWebpackConfig(config);

    // Enable polling for file changes (optional)
    config.watchOptions = {
        poll: 2000,
        ignored: /node_modules/,
    };

    // Update output public path (if needed)
    config.output.publicPath = '';

    // check whether the build is for development or production
    if (config.mode == 'production') {
        
        // Add MiniCssExtractPlugin to extract CSS into separate files
        config.plugins.push(new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[name].[contenthash].css',
        }));
    
        // Add rules to handle SCSS files
        config.module.rules.push({
            test: /\.(s(a|c)ss)$/,
            use: [
                MiniCssExtractPlugin.loader, // Extracts CSS into separate files
                'css-loader', // Translates CSS into CommonJS
                'sass-loader' // Compiles Sass to CSS
            ],
        });
    
        // Add CSS minimizer plugin
        config.optimization = {
            ...config.optimization,
            minimizer: [
                `...`,
                new CssMinimizerPlugin({
                    minimizerOptions: {
                        preset: [
                            'default',
                            {
                                discardComments: { removeAll: true },
                            },
                        ],
                    },
                }),
            ],
        };
    }


    return config;
};
