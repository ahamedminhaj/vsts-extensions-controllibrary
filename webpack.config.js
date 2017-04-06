var path = require("path");
var webpack = require("webpack");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    target: "web",
    entry: {
        DateTimeControl: "./scripts/DateTimeControl.tsx",
        MultiValueControl: "./scripts/MultiValueControl.tsx",
        PatternControl: "./scripts/PatternControl.tsx",
        PlainTextControl: "./scripts/PlainTextControl.tsx",
        SliderControl: "./scripts/SliderControl.tsx",
        RatingControl: "./scripts/RatingControl.tsx",
        Checklist: "./scripts/Checklist.tsx"
    },
    output: {
        filename: "scripts/[name].js",
        libraryTarget: "amd"
    },
    externals: [
        {
            "q": true,
            "react": true,
            "react-dom": true
        },
        /^VSS\/.*/, /^TFS\/.*/, /^q$/
    ],
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
        moduleExtensions: ["-loader"],
        alias: { 
            "OfficeFabric": path.resolve(__dirname, "node_modules/office-ui-fabric-react/lib-amd")
        }        
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /\.s?css$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    },
    plugins: [
        new UglifyJSPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        }),
        new CopyWebpackPlugin([
            { from: "./node_modules/vss-web-extension-sdk/lib/VSS.SDK.min.js", to: "scripts/libs/VSS.SDK.min.js" },
            { from: "./node_modules/es6-promise/dist/es6-promise.min.js", to: "scripts/libs/es6-promise.min.js" },
            { from: "./node_modules/bootstrap/dist/js/bootstrap.min.js", to: "scripts/libs/bootstrap.min.js" },
            { from: "./node_modules/jquery/dist/jquery.min.js", to: "scripts/libs/jquery.min.js" },
            { from: "./node_modules/moment/min/moment.min.js", to: "scripts/libs/moment.min.js" },
            { from: "./node_modules/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js", to: "scripts/libs/bootstrap-datetimepicker.min.js" },

            { from: "./node_modules/bootstrap/dist/css/bootstrap.min.css", to: "css/libs/bootstrap.min.css" },            
            { from: "./node_modules/office-ui-fabric-react/dist/css/fabric.min.css", to: "css/libs/fabric.min.css" },
            { from: "./node_modules/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css", to: "css/libs/bootstrap-datetimepicker.min.css" },

            { from: "./img", to: "img" },
            { from: "./html", to: "html" },
            { from: "./README.md", to: "README.md" },
            { from: "./vss-extension.json", to: "vss-extension.json" }
        ])
    ]
}