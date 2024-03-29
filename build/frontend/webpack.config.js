const path              = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WorkboxPlugin     = require("workbox-webpack-plugin");
const webpack           = require("webpack");

const isDevelopment = process.env.NODE_ENV === "development";

module.exports = {
    entry  : "./src/frontend/index.tsx",
    output : {
        filename   : isDevelopment ? "bundle.js" : "[name].[contenthash].js",
        publicPath : "/",
        path       : path.resolve("./dist/frontend")
    },
    mode    : isDevelopment ? "development" : "production",
    devtool : "source-map",
    resolve : {
        extensions: [".ts", ".tsx", ".js", ".json"],
    },

    module: {
        rules: [
            {
                test    : /\.tsx?$/,
                exclude : /node_modules/,
                use     : [{
                    loader  : "ts-loader",
                    options : {
                        // working with paths is so much fun
                        context                 : path.resolve(__dirname, "..", ".."),
                        onlyCompileBundledFiles : true,
                        configFile              : path.resolve(__dirname, "tsconfig.json")
                    }
                }]
            },
            {
				test : /\.styl$/,
				use  : ["style-loader", "css-loader", "stylus-loader"]
			}
        ]
    },
    devServer : {
        client: { overlay: false },
        static: {
            directory: path.resolve("public"),
        },
        historyApiFallback : true,
        proxy              : {
            "/flexboxgrid.min.css" : { target : "http://localhost:8081" },
            "/socket.io"           : { target : "http://localhost:8081", ws : true }
        }
    },
    plugins : [
        new HtmlWebpackPlugin({
            filename : "index.html",
            template : path.resolve("./public/index-template.html")
        }),
        new WorkboxPlugin.GenerateSW({
            clientsClaim : true,
            skipWaiting  : true
        }),
        new webpack.EnvironmentPlugin(['API_URL', 'CLIENT_DOMAIN'])
    ]
    // externals: {
    //     "react"     : "React",
    //     "react-dom" : "ReactDOM"
    // }
};
