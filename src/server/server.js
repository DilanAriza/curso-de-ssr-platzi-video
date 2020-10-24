import express from 'express';
import config from './config/index';
import webpack from 'webpack';

//render
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import { createStore, compose } from 'redux';
import reducer from '../frontend/reducers';
import initialState from '../frontend/initialState';
import { renderRoutes } from 'react-router-config'

//routes
import serverRoutes from '../frontend/routes/serverRoutes'
import Layout from '../frontend/components/Layout';

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

const setResponse = (html) => {
    return(
        `<!DOCTYPE html>
        <html>
    
        <head>
            <link rel="stylesheet" href="assets/app.css" type="text/css" />
            <title>Platzi Video</title>
        </head>
    
        <body>
            <div id="app">${html}</div>
            <script src="assets/app.js" type="text/javascript"></script>
        </body>
    
        </html>`
    );
}

const renderApp = (req, res) => {
    const store = createStore(reducer, initialState);
    const html = renderToString(
        <Provider store={store}>
            <Layout>
                <StaticRouter location={req.url} context={{}}>
                    {renderRoutes(serverRoutes)}
                </StaticRouter>
            </Layout>
        </Provider>,
    );

    res.send(setResponse(html)); 
}

app.get('*', renderApp);

app.listen(PORT, (err) => {
    (err) ? console.log(err): console.log(`The server is runing in the port ${PORT}`)
})