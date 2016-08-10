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
import getRoutes from './routes';
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

    // Make taps on links and buttons work fast on mobiles
    FastClick.attach(document.body);

    const history = withScroll(browserHistory);

    history.listen(location => {
        trackPageview();
    });

    const routes = getRoutes();

    match({ history, routes }, (error, redirectLocation, renderProps) => {
        ReactDOM.render(
            <ContextHolder context={context}>
                <Router {...renderProps} />
            </ContextHolder>,
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
