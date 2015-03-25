define([
    "react",
    "mixins"
], function(React, mixins) {
    "use strict";

    return React.createClass({
        mixins: [mixins.ImmutableRenderMixin],

        displayName: 'Loading',

        render: function() {
            return (
                <div className="loader">Loading...</div>
            );
        }
    });
});
