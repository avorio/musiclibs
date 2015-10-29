import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import SearchInput from './search-input';
import { replaceState } from 'redux-react-router';
import { createSelector } from 'reselect';

import AsyncStatusRecord from '../../async-status-record';
import * as Search from '../../action-creators/search';

import SearchResultList from './search-results';


/* State selectors */

const getQuery = state => state.router.location.query.q;

const getSearchResults = createSelector(
    getQuery,
    state => state.search,
    (query, search) => search.get(query)
);

const getState = createSelector(
    getQuery,
    getSearchResults,
    state => state.router.location.pathname,
    (query, results, pathname) => ({ query, results, pathname })
);


/* Components */

@connect(getState)
export default class SearchPageContainer extends React.Component
{
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        pathname: PropTypes.string.isRequired,

        // Optional
        results: PropTypes.objectOf(AsyncStatusRecord),
        query: PropTypes.string
    };

    componentDidMount()
    {
        this._loadQuery(this.props.query);
    }

    _loadQuery(query)
    {
        if (!query)
        {
            this.props.dispatch(replaceState(null, this.props.pathname));
            return;
        }

        this.props.dispatch(replaceState(null, this.props.pathname, {
            q: query
        }));

        this.props.dispatch(Search.request({ query }));
    }

    render()
    {
        return (
            <div className="container">
                <header className="page-header">
                    <h1>Search</h1>
                </header>
                <SearchInput
                        query={this.props.query}
                        onChange={({ target: { value } }) => this._loadQuery(value)} />
                <SearchResultList query={this.props.query} results={this.props.results} />
            </div>
        );
    }
}

export const __hotReload = true;
