const path = require('path');

module.exports = {
    entry: './src/index.js', // Arquivo principal de entrada
    output: {
        filename: 'bundle.js', // Saída empacotada
        path: path.resolve(__dirname, 'BlazorApp/wwwroot/js') // Diretório de saída
    },
    mode: 'production'
};