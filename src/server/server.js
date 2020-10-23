import express from 'express';
import config from './config/index';
import webpack from 'webpack';

//Initial config
const app = express();
const { ENV, PORT } = config;

//Env 
if (ENV === 'development') {
    console.log('development config');
    const webpackConfig = require('../../webpack.config');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const compiler = webpack(webpackConfig);
    const webpackServerConfig = { port: PORT, hot: true };

    app.use(webpackDevMiddleware(compiler, webpackServerConfig));
    app.use(webpackHotMiddleware(compiler));
}

app.get('*', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>

    <head>
        <link rel="stylesheet" href="assets/app.css" type="text/css" />
        <title>Platzi Video</title>
    </head>

    <body>
        <div id="app"></div>
        <script src="assets/app.js" type="text/javascript"></script>
    </body>

    </html>`);
});

app.listen(PORT, (err) => {
    (err) ? console.log(err): console.log(`The server is runing in the port ${PORT}`)
})