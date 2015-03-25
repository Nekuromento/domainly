define([
    "react",
    "mixins"
], function(React, mixins) {
    "use strict";

    return React.createClass({
        mixins: [mixins.ImmutableRenderMixin],

        displayName: 'LatestSearch',

        render: function() {
            if (!this.props.domains.length)
                return null;

            return (
                <div className="col-sm-12 col-md-4">
                    <div className="well">
                        <h4>Latest searches:</h4>
                        <ul>
                            {this.props.domains.map(function(url) {
                                return (
                                    <li key={url}>{url}</li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            );
        }
    });
});
