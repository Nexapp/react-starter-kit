/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './NotFoundPage.css';
import Helmet from 'react-helmet';

@withStyles(s)
export default class NotFoundPage extends Component {
    static contextTypes = {
        onPageNotFound: PropTypes.func.isRequired,
    };

    componentWillMount() {
        this.context.onPageNotFound();
    }
    render() {
        let title = 'Page Not Found';
        return (
            <div>
                <Helmet title={title} />
                <h1>{title}</h1>
                <p>Sorry, the page you were trying to view does not exist.</p>
            </div>
        );
    }
}
