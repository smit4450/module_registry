const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',  // Main entry point for your app
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),  // Output to 'dist' directory
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,  // For JavaScript and JSX files
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,  // For CSS files
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devServer: {
    static: path.join(__dirname, 'dist'),  // Serve static files from 'dist'
    port: 3000,
    open: true,  // Automatically open the browser
  },
  resolve: {
    extensions: ['.js', '.jsx'],  // Automatically resolve these extensions
  },
};
