define([
    "react",
    "mixins"
], function(React, mixins) {
    "use strict";

    return React.createClass({
        mixins: [mixins.ImmutableRenderMixin],

        displayName: 'Alert',

        render: function renderAlert() {
            return (
                <Bootstrap.Alert bsStyle="danger">
                    <strong>Error retrieving state from server:</strong> {this.props.text}
                </Bootstrap.Alert>
            );
        }
    });
});
