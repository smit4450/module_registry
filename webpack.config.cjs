const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',  // Main entry point for your app
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),  // Output to 'dist' directory
    publicPath: '/',  // Set the base URL for your application
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
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    static: path.join(__dirname, 'dist'),
    port: 8080,
    host: '0.0.0.0',  // Listen on all network interfaces
    historyApiFallback: true,
    open: false,  // Set to false because there's no browser to open on EC2
  },
  resolve: {
    extensions: ['.ts', '.js', '.jsx'],  // Automatically resolve these extensions
  },
};
