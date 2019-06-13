const path = require("path");

module.exports = {
    entry  : "./src/frontend/index.tsx",
    output : {
        filename   : "bundle.js",
        publicPath : "/",
        path       : path.resolve("./dist/frontend")
    },
    mode    : "development",
    devtool : "source-map",
    resolve : {
        extensions: [".ts", ".tsx", ".js", ".json"],
        // alias: {
        //     "react-dom": "@hot-loader/react-dom"
        // }
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
            }
        ]
    },
    devServer : {
        contentBase        : path.resolve("public"),
        hot                : true,
        historyApiFallback : true,
        proxy : {
            "/antd.min.css" : { target : "http://localhost:8081" }
        }
    },
    // externals: {
    //     "react"     : "React",
    //     "react-dom" : "ReactDOM"
    // }
};