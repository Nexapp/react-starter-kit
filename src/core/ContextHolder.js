import React, { PropTypes } from 'react';
import emptyFunction from 'fbjs/lib/emptyFunction';

export default class ContextHolder extends React.Component {

    static propTypes = {
        context: PropTypes.shape({
            insertCss: PropTypes.func,
            onPageNotFound: PropTypes.func,
        }),
        children: PropTypes.element.isRequired,
    };

    static childContextTypes = {
        insertCss: PropTypes.func,
        onPageNotFound: PropTypes.func,
    };

    getChildContext() {
        const context = this.props.context;
        return {
            insertCss: context.insertCss || emptyFunction,
            onPageNotFound: context.onPageNotFound || emptyFunction,
        };
    }

    render() {
        const { children } = this.props;
        return React.Children.only(children);
    }
}
