define([
    "dispatcher",
    "constants",
    "api/CrawlerApi"
], function(dispatcher, constants, CrawlerApi) {
    "use strict";

    return {
        loadInitialState: function() {
            dispatcher.dispatch({
                type: constants.STATE_START
            });

            CrawlerApi.initialState().then(function(domains) {
                dispatcher.dispatch({
                    type: constants.STATE_DONE,
                    domains: domains
                });
            }, function(error) {
                dispatcher.dispatch({
                    type: constants.STATE_ERROR,
                    error: error
                });
            });
        },

        addCrawlerRequest: function(url, depth) {
            dispatcher.dispatch({
                type: constants.CRAWLER_START,
                url: url
            });

            CrawlerApi.add(url, depth).then(function(domain) {
                dispatcher.dispatch({
                    type: constants.CRAWLER_DONE,
                    url: domain.url,
                    pages: domain.pages
                });
            }, function(error) {
                dispatcher.dispatch({
                    type: constants.CRAWLER_ERROR,
                    url: url,
                    error: error
                });
            });
        },

        toggleStatisticsVisibility: function(parent, page, isVisible) {
            if (isVisible) {
                dispatcher.dispatch({
                    type: constants.HIDE_PAGE_STATISTICS,
                    url: parent,
                    page: page
                });
            } else {
                dispatcher.dispatch({
                    type: constants.SHOW_PAGE_STATISTICS,
                    url: parent,
                    page: page
                });
            }
        },

        toggleAllStatisticsVisibility: function(parent) {
            dispatcher.dispatch({
                type: constants.TOGGLE_STATISTICS_VISIBILITY,
                url: parent
            });
        }
    };
});
