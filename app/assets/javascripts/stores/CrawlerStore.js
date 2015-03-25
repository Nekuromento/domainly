define([
    "dispatcher",
    "EventEmitter",
    "constants",
    "immutable"
], function(dispatcher, EventEmitter, constants, immutable) {
    "use strict";

    function convertToObject(val) {
        if (val === null) {
            throw new TypeError('Object.assign cannot be called with null or undefined');
        }

        return Object(val);
    }

    //ES6 Object.assign() polyfill
    var assign = Object.assign || function (target, source) {
        var from;
        var keys;
        var to = convertToObject(target);

        for (var s = 1; s < arguments.length; s++) {
            from = arguments[s];
            keys = Object.keys(Object(from));

            for (var i = 0; i < keys.length; i++) {
                to[keys[i]] = from[keys[i]];
            }
        }

        return to;
    };

    var CHANGE_EVENT = 'change';

    var loading = true;
    var error = null;

    var recentSearch = JSON.parse(localStorage.getItem('recent-search') || '[]');
    var domains = {};

    function update(url, page, changes) {
        domains[url].pages[page] = assign({}, domains[url].pages[page], changes);
    }

    function updateAll(url, changes) {
        for (var page in domains[url].pages) {
            update(url, page, changes);
        }
    }

    function areAllVisible(url) {
        for (var page in domains[url].pages) {
            if (!domains[url].pages[page].visible)
                return false;
        }
        return true;
    }

    function orderByUrl(lhs, rhs) {
        return lhs.url < rhs.url;
    }

    function formatLinks(domain) {

        var aggregatedLinks = {};
        for (var pageUrl in domain.pages) {
            var page = domain.pages[pageUrl];
            if (!page.visible)
                continue;

            for (var pageLink in page.links) {
                var linkCount = page.links[pageLink];
                var linkUrl = new URL(pageLink);

                var aggregate = aggregatedLinks[linkUrl.hostname] || {
                    count: 0,
                    links: {}
                };

                var previousLinkCount = aggregate.links[pageLink] || 0;

                aggregate.count += linkCount;
                aggregate.links[pageLink] = previousLinkCount + linkCount;

                aggregatedLinks[linkUrl.hostname] = aggregate;
            }
        }

        var formattedLinks = [];
        for (var link in aggregatedLinks) {
            var aggregated = aggregatedLinks[link];

            var formattedAggregatedLinks = [];
            for (var aggregatedLink in aggregated.links) {
                formattedAggregatedLinks.push({
                    url: aggregatedLink,
                    count: aggregated.links[aggregatedLink]
                });
            }

            formattedLinks.push({
                url: link,
                totalLinkCount: aggregated.count,
                links: formattedAggregatedLinks.sort(orderByUrl)
            });
        }

        return formattedLinks.sort(orderByUrl);
    }

    function formatPages(domain) {
        var formattedPages = [];
        for (var pageUrl in domain.pages) {
            var page = domain.pages[pageUrl];

            formattedPages.push({
                url: pageUrl,
                visible: page.visible
            });
        }

        return formattedPages.sort(orderByUrl);
    }

    function formatDomains() {
        var formatedDomains = [];
        for (var domainUrl in domains) {
            var domain = domains[domainUrl];

            formatedDomains.push({
                url: domainUrl,
                loading: domain.loading,
                error: domain.error,
                pages: formatPages(domain),
                links: formatLinks(domain)
            });
        }

        return formatedDomains.sort(orderByUrl);
    }

    var Store = assign({}, EventEmitter.prototype, {
        getState: function() {
            return {
                loading: loading,
                error: error,
                recentSearch: recentSearch,
                domains: immutable.fromJS(formatDomains())
            };
        },

        emitChange: function() {
            this.emit(CHANGE_EVENT);
        },

        addChangeListener: function(callback) {
            this.on(CHANGE_EVENT, callback);
        },

        removeChangeListener: function(callback) {
            this.removeListener(CHANGE_EVENT, callback);
        }
    });

    dispatcher.register(function(action) {
        switch (action.type) {
        case constants.STATE_START:
            loading = true;

            Store.emitChange();
            break;

        case constants.STATE_DONE:
            loading = false;
            domains = action.domains;

            for (var url in domains) {
                if (!domains[url].error) {
                    updateAll(url, { visible: true });
                }
            }

            Store.emitChange();
            break;

        case constants.STATE_ERROR:
            loading = false;
            error = action.error;

            Store.emitChange();
            break;

        case constants.CRAWLER_START:
            domains[action.url] = {
                url: action.url,
                loading: true
            };

            recentSearch.push(action.url);
            localStorage.setItem('recent-search', JSON.stringify(recentSearch));

            Store.emitChange();
            break;

        case constants.CRAWLER_DONE:
            domains[action.url] = {
                url: action.url,
                pages: action.pages,
            };
            updateAll(action.url, { visible: true });

            Store.emitChange();
            break;

        case constants.CRAWLER_ERROR:
            domains[action.url] = {
                url: action.url,
                error: action.error
            };

            Store.emitChange();
            break;

        case constants.SHOW_PAGE_STATISTICS:
            update(action.url, action.page, { visible: true });

            Store.emitChange();
            break;

        case constants.HIDE_PAGE_STATISTICS:
            update(action.url, action.page, { visible: false });

            Store.emitChange();
            break;

        case constants.TOGGLE_STATISTICS_VISIBILITY:
            if (areAllVisible(action.url)) {
                updateAll(action.url, { visible: false });
            } else {
                updateAll(action.url, { visible: true });
            }

            Store.emitChange();
            break;
        }
    });

    return Store;
});
