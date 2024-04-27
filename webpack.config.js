const path = require('path');

module.exports = {
    entry : './src/index.ts',
    module : {
        rules : [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    resolve : {
        extensions : ['.tsx', '.ts', '.js'],
    },
    output : {
        module : false, 
        filename: 'SSIE.js',
        path : path.resolve(__dirname, 'dist'),
        library : "SSIE"
    },
};