define([
    "react",
    "mixins",
    "actions",
    "react-bootstrap"
], function(React, mixins, actions, Bootstrap) {
    "use strict";

    return React.createClass({
        mixins: [mixins.ImmutableRenderMixin],

        displayName: 'InnerLink',

        handleChange: function() {
            actions.toggleStatisticsVisibility(this.props.url, this.props.page, this.props.checked);
        },

        render: function renderInnerList() {
            return (
                <Bootstrap.Input type="checkbox"
                    label={this.props.page}
                    checked={this.props.checked}
                    onChange={this.handleChange}/>
            );
        }
    });
});
