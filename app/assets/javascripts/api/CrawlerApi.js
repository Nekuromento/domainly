define(["jquery"], function($) {
    "use strict";

    function countLinks(links) {
        return links.reduce(function (obj, link) {
            var previous = obj[link] || 0;
            obj[link] = previous + 1;

            return obj;
        }, {});
    }

    function objectifyEntry(entry) {
        if (entry.pages) {
            entry.pages = objectifyResponse(entry.pages);
        }

        if (entry.links) {
            entry.links = countLinks(entry.links);
        }

        return entry;
    }

    function objectifyResponse(data) {
        return data.reduce(function (obj, entry) {
           obj[entry.url] = entry;

           objectifyEntry(entry);

           return obj;
        }, {});
    }

    return {
        initialState: function() {
            return {
                then: function(success, failure) {
                    $.get("/api/domains")
                        .done(function(data) { success(objectifyResponse(data)); })
                        .fail(function(_, __, error) { failure(error.message); });
                }
            };
        },

        add: function(url, depth) {
            return {
                then: function(success, failure) {
                    $.ajax({
                        type: 'POST',
                        url: '/api/scan',
                        data: JSON.stringify({ url: url, depth: depth }),
                        contentType: 'application/json',
                        dataType: 'json',
                        success: function(data) {
                            success(objectifyEntry(data));
                        },
                        error: function(_, __, error) {
                            failure(error.message);
                        }
                    });
                }
            };
        }
    };
});
