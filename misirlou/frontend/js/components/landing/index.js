import React, { PropTypes } from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { locationShape } from 'react-router';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Navbar from './navbar';
import Footer from './footer';
import * as ManifestActions from '../../action-creators/manifest';
import ManifestResource from '../../resources/manifest-resource';
import ManifestDisplay from '../manifest-detail/manifest-display';
import SearchResults from '../search/search-results';
import ManifestCascade from './manifest-cascade/index';

import './landing-page.scss';
import './propagate-height.scss';

const RESULTLIST_TRANSITION_SETTINGS = {
    transitionName: {
        enter: 'result-list--enter',
        leave: 'result-list--leave',
        appear: 'result-list--enter'
    },
    transitionEnterTimeout: 400,
    transitionLeaveTimeout: 300,
    transitionAppearTimeout: 400,
    transitionAppear: true
};

const selector = createSelector(
    state => state.manifests,
    (_, props) => props.params.manifestId,
    (manifests, id) => ({ manifestRequest: manifests.get(id) })
);

/**
 * Render the landing page, which features a search function and a cascade of
 * recently uploaded manifests.
 */
@connect(selector)
export default class LandingPage extends React.Component
{

    static propTypes = {
        params: PropTypes.shape({
            manifestId: PropTypes.string
        }).isRequired,

        location: locationShape,
        routes: PropTypes.array.isRequired,

        dispatch: PropTypes.func.isRequired,
        manifestRequest: PropTypes.instanceOf(ManifestResource)
    };

    componentDidMount()
    {
        // Load the manifest if it isn't already loaded
        if (this.props.params.manifestId && !this.manifestRequest)
            this._loadManifest(this.props.params.manifestId);
    }

    componentWillReceiveProps(nextProps)
    {
        if (nextProps.params.manifestId && nextProps.params.manifestId !== this.props.params.manifestId)
            this._loadManifest(nextProps.params.manifestId);
    }

    _loadManifest(id)
    {
        this.props.dispatch(ManifestActions.request({ id }));
    }

    _renderLanding()
    {
        return (
            <div className="landing--container propagate-height">
                <div className="container">
                    {(!this.props.location.query.q && !this.props.location.query.m) && (
                        <section key="recent-section">
                            <div className="page-header">
                                <h2>Selected items</h2>
                            </div>
                            <ManifestCascade />
                        </section>
                    )}
                </div>
            </div>
        );
    }

    _renderResults()
    {
        let rightPanel = this._renderManifest();
        return (
            <div className="manifest-detail propagate-height propagate-height--row">
                <CSSTransitionGroup {...RESULTLIST_TRANSITION_SETTINGS} component={FirstChild}>
                    {(this.props.location.query.q || this.props.location.query.m) && (
                        <div className="search-results--container">
                            <SearchResults location={this.props.location} />
                        </div>
                    )}
                </CSSTransitionGroup>
                {rightPanel}
            </div>
        );
    }

    _renderManifest()
    {
        if (this.props.params.manifestId)
            return (<ManifestDisplay manifestRequest={this.props.manifestRequest}
                                    manifestId={this.props.params.manifestId}/>);
        else
        {
            return (<div className="manifest-detail__click-helper">
                <h5>Click on a Result to View it Here</h5>
            </div>);
        }
    }

    render()
    {
        let children;
        // If either a search is in progress or a manifest needs to be shown, show the manifest detail view
        if (this.props.location.query.q || this.props.location.query.m || this.props.params.manifestId)
            children = this._renderResults();
        else
            children = this._renderLanding();

        return (
            <div className="propagate-height propagate-height--root">
                <Navbar location={this.props.location} />
                {children}
                <Footer />
            </div>
        );
    }
}

/**
 * Component used to avoid wrapping animated elements in
 * a span.
 * See https://facebook.github.io/react/docs/animation.html#rendering-a-single-child
 */
class FirstChild extends React.Component {

    static propTypes = {
        children: PropTypes.object.isRequired
    };

    render()
    {
        const children = React.Children.toArray(this.props.children);
        return children[0] || null;
    }
}
