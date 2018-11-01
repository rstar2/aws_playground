const path = require('path');

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const options = {
    entry: {
        // this is bundle for the Vue/VueMaterial
        // 'vue': './src/vue.js',

        // this is bundle for the main app
        'app': ['./src/main.js'],
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        // publicPath: '/dist',
        filename: 'js/build.[name].js',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader',
                }),
            },

            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },

            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
        ],
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',

            // this will make '@' available only in the 'app' folder
            '@': path.join(__dirname, 'src'),

            'aws-amplify.config.js': path.resolve(__dirname, '../aws-amplify.config.js')  // <-- When you build or restart dev-server, you'll get an error if the path to your utils.js file is incorrect.
        },
        extensions: ['*', '.js', '.vue', '.json',],
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        overlay: true,
    },
    performance: {
        hints: false,
    },
    plugins: [
        // extract the 'boot' entry, the one containing Vue and VueMaterial as
        // it will be included in every page
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vue',
        //     // minChunks: function (module, count) {
        //     //   // any required modules inside node_modules are extracted to vendor
        //     //   return (
        //     // 	module.resource &&
        //     // 	/\.js$/.test(module.resource) &&
        //     // 	module.resource.indexOf(
        //     // 	  path.join(__dirname, '../node_modules')
        //     // 	) === 0
        //     //   )
        //     // }
        // }),

        // extract CSS nad LESS into own files
        new ExtractTextPlugin({ filename: 'styles/build.[name].css', }),

        new VueLoaderPlugin(),

        new HtmlWebpackPlugin({
            template: './src/index.html',
            // in html-webpack-plugin version 4 using minify:true will actually pass these minification options,
            //but for not will have to set them explicitly 
            // minify: true,
            minify: (process.env.NODE_ENV === 'production') ? {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true
              } : false,
        }),

        new webpack.ProvidePlugin({
            AWS_AMPLIFY_CONFIG: 'aws-amplify.config.js',
        }),
    ],
    devtool: '#eval-source-map',
};

if (process.env.NODE_ENV === 'production') {
    // mp source-map
    options.devtool = false;


    options.plugins = (options.plugins || []).concat([
        // http://vue-loader.vuejs.org/en/workflow/production.html
        // https://vuejs.org/v2/guide/deployment.html
        // Run Vue.js in production mode - less warnings and etc...
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"',
            },
        }),

        // Uglify and compress
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: !!options.devtool,
            compress: {
                warnings: false,
            },
        }),

        // The LoaderOptionsPlugin is unlike other plugins in that
        // it is built for migration from webpack 1 to 2
        new webpack.LoaderOptionsPlugin({
            minimize: true,
        }),
    ]);
}

module.exports = options;
