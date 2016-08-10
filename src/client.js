/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick';
import { match, Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import getRoutes from './routes';
import { Provider } from 'react-redux';
import configureStore from './redux/configureStore';
import ContextHolder from './core/ContextHolder';
import withScroll from 'scroll-behavior';

const context = {
    store: null,
    insertCss(...styles) {
        const funcs = styles.map(style => style._insertCss());

        return () => {
            funcs.forEach(func => func());
        };
    },
};

// Google Analytics tracking. Don't send 'pageview' event after the first
// rendering, as it was already sent by the Html component.
const trackPageview = () => {
    if (window.ga) {
        window.ga('send', 'pageview');
    }
};

function run() {
    const container = document.getElementById('container');
    const initialState = JSON.parse(
        document.getElementById('source').getAttribute('data-initial-state')
    );

    // Make taps on links and buttons work fast on mobiles
    FastClick.attach(document.body);

    const scrollHistory = withScroll(browserHistory);
    const store = configureStore(scrollHistory, initialState);
    context.store = store;
    const history = syncHistoryWithStore(scrollHistory, store);

    history.listen(location => {
        trackPageview();
    });

    const routes = getRoutes(store);

    match({ history, routes }, (error, redirectLocation, renderProps) => {
        ReactDOM.render(
            <Provider store={store}>
                <ContextHolder context={context}>
                    <Router {...renderProps} />
                </ContextHolder>
            </Provider>,
            container);

        // Remove the pre-rendered CSS because it's no longer used
        // after the React app is launched
        const cssContainer = document.getElementById('css');
        if (cssContainer) {
            cssContainer.parentNode.removeChild(cssContainer);
        }
    });
}

// Run the application when both DOM is ready and page content is loaded
if (['complete', 'loaded', 'interactive'].includes(document.readyState) && document.body) {
    run();
} else {
    document.addEventListener('DOMContentLoaded', run, false);
}
