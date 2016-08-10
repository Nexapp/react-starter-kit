/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import 'babel-polyfill';
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt from 'express-jwt';
import expressGraphQL from 'express-graphql';
import jwt from 'jsonwebtoken';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { createMemoryHistory, match, RouterContext } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import proxy from 'http-proxy-middleware';
import PrettyError from 'pretty-error';
import passport from './core/passport';
import models from './data/models';
import schema from './data/schema';
import getRoutes from './routes';
import ContextHolder from './core/ContextHolder';
import Html from './components/Html/Html';
import { ErrorPage } from './containers/errorPage/ErrorPage';
import errorPageStyle from './containers/errorPage/ErrorPage.css';
import { port, auth } from './config';
import { apiHost } from './clientConfig';
import { Provider } from 'react-redux';
import configureStore from './redux/configureStore';
import { setRuntimeVariable } from './redux/reducers/runtime';
import assets from './assets'; // eslint-disable-line import/no-unresolved

const app = express();

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

// Register API Proxy
// -----------------------------------------------------------------------------
// This need to be registered before bodyParser middleware
if (apiHost !== '') {
    app.use('/api', proxy({
        target: apiHost,
        changeOrigin: true,
        pathRewrite: {
            '^/api/': '/' // remove api path
        }
    }));
}

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
// Authentication
// -----------------------------------------------------------------------------
app.use(expressJwt({
    secret: auth.jwt.secret,
    credentialsRequired: false,
    getToken: req => req.cookies.id_token,
}));
app.use(passport.initialize());

app.get('/login/facebook',
    passport.authenticate('facebook', { scope: ['email', 'user_location'], session: false })
);
app.get('/login/facebook/return',
    passport.authenticate('facebook', { failureRedirect: '/login', session: false }),
    (req, res) => {
        const expiresIn = 60 * 60 * 24 * 180; // 180 days
        const token = jwt.sign(req.user, auth.jwt.secret, { expiresIn });
        res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
        res.redirect('/');
    }
);

//
// Register API middleware
// -----------------------------------------------------------------------------
app.use('/graphql', expressGraphQL(req => ({
    schema,
    graphiql: true,
    rootValue: { request: req },
    pretty: process.env.NODE_ENV !== 'production',
})));

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async(req, res, next) => {
    try {
        const memoryHistory = createMemoryHistory(req.url);
        const store = configureStore(memoryHistory, {});
        const history = syncHistoryWithStore(memoryHistory, store);

        store.dispatch(setRuntimeVariable({
            name: 'initialNow',
            value: Date.now(),
        }));

        match({ history, routes: getRoutes(store), location: req.url }, (error, redirectLocation, renderProps) => {
            if (error) {
                throw error;
            }
            if (redirectLocation) {
                const redirectPath = `${redirectLocation.pathname}${redirectLocation.search}`;
                res.redirect(redirectPath);
                return;
            }

            const css = [];
            let statusCode = 200;
            const data = {
                css: '',
                children: '',
                script: assets.main.js
            };
            const context = {
                store,
                onPageNotFound: () => statusCode = 404,
                insertCss(...styles) {
                    styles.forEach(style => css.push(style._getCss()));
                },
            };

            // Fire all componentWill... hooks
            data.children = ReactDOM.renderToString(
                <Provider store={store}>
                    <ContextHolder context={context}>
                        <RouterContext {...renderProps} />
                    </ContextHolder>
                </Provider>
            );

            // If you have async actions, wait for store stabilizes here.
            // This may be asynchronous loop if you have complicated structure.
            // Then render again

            // If store has not changes, you do not need render again!
            // data.body = ReactDOM.renderToString(provide(store, component));

            // It is important to have rendered output and state in sync,
            // otherwise React will write error to console when mounting on client

            data.state = JSON.stringify(store.getState());
            data.css = css.join('');
            const html = ReactDOM.renderToString(<Html {...data} />);
            res.status(statusCode);
            res.send(`<!doctype html>\n${html}`);
        });
    } catch (err) {
        next(err);
    }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    console.log(pe.render(err)); // eslint-disable-line no-console
    const statusCode = err.status || 500;
    const html = ReactDOM.renderToStaticMarkup(
        <Html
            title="Internal Server Error"
            css={errorPageStyle._getCss()}>
            {ReactDOM.renderToString(<ErrorPage error={err} />)}
        </Html>
    );
    res.status(statusCode);
    res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
/* eslint-disable no-console */
models.sync().catch(err => console.error(err.stack)).then(() => {
    app.listen(port, () => {
        console.log(`The server is running at http://localhost:${port}/`);
    });
});
/* eslint-enable no-console */
