/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { IndexRoute, Route } from 'react-router';
import {
    App,
    Contact,
    Content,
    Home,
    Login,
    Register,
    NotFoundPage,
} from './containers';

export default () => {
    return (
        <Route>
            <Route path="/" component={App}>
                <IndexRoute getComponent={Home.getComponent} />
                <Route path="contact" component={Contact} />
                <Route path="login" component={Login} />
                <Route path="register" component={Register} />
                <Route path="about" getComponent={Content.getComponent} />
                <Route path="privacy" getComponent={Content.getComponent} />
            </Route>
            <Route path="*" getComponent={NotFoundPage.getComponent} />
        </Route>
    );
};
