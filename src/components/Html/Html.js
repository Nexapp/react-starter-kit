/* eslint-disable import/no-unresolved */
import React, { PropTypes } from 'react';
import { analytics } from '../../config';
import Helmet from 'react-helmet';
/* global ga */
/* eslint-disable prefer-rest-params */

function Html(props) {
    const head = Helmet.rewind();
    return (
        <html className="no-js" lang="">
            <head>
                {head.base.toComponent()}
                {head.title.toComponent()}
                {head.meta.toComponent()}

                {/* Chrome for Android theme color */}
                <meta name="theme-color" content="#373277" />

                {/* Tile color for Win8 */}
                <meta name="msapplication-TileColor" content="#373277" />

                {/* Web Application Manifest */}
                <link rel="manifest" href="manifest.json" />

                {/* Add to homescreen for Chrome on Android */}
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="application-name" content="React Starter Kit" />
                <link rel="icon" sizes="192x192" href="touch/chrome-touch-icon-192x192.png" />

                {/* Add to homescreen for Safari on iOS */}
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black" />
                <meta name="apple-mobile-web-app-title" content="React Starter Kit" />
                <link rel="apple-touch-icon" href="touch/apple-touch-icon.png" />

                {/* Tile icon for Win8 (144x144) */}
                <meta name="msapplication-TileImage" content="touch/ms-touch-icon-144x144-precomposed.png" />

                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="apple-touch-icon" href="apple-touch-icon.png" />

                <style id="css" dangerouslySetInnerHTML={{ __html: props.css }}></style>
            </head>
            <body>
                <div id="container" dangerouslySetInnerHTML={{ __html: props.children }} />
                <script
                    id="source"
                    src={props.script}
                    data-initial-state={props.state}
                    async defer />
                {
                process.env.NODE_ENV === 'production' &&
                    <script dangerouslySetInnerHTML={{ __html:
                            'window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;' +
                            `ga('create','${analytics.google.trackingId}','auto');` }} />
                }
                {
                process.env.NODE_ENV === 'production' &&
                    <script
                        src="https://www.google-analytics.com/analytics.js"
                        async defer />
                }
            </body>
        </html>
    );
}

Html.propTypes = {
    css: PropTypes.string.isRequired,
    children: PropTypes.string.isRequired,
    state: PropTypes.string,
    script: PropTypes.string,
};

export default Html;
