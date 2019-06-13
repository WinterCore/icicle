const path          = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
    entry     : "./src/server/app.ts",
    target    : "node",
    externals : [nodeExternals()],
    devtool   : "cheap-module-source-map",
    mode      : "development",
    module    : {
        rules : [
            {
                test    : /\.tsx?$/,
                exclude : /node_modules/,
                use     : [{
                    loader  : "ts-loader",
                    options : {
                        context                 : path.resolve(__dirname, "..", ".."),
                        onlyCompileBundledFiles : true,
                        configFile              : path.resolve(__dirname, "tsconfig.json")
                    }
                }]
            },
            {
                test : /\.json$/,
                use  : "json-loader"
            }
        ]
    },
    output : {
        path     : path.resolve("./dist/server"),
        filename : "index.min.js"
    },
    resolve : {
        extensions : [".tsx", ".ts", ".d.ts"]
    }
};