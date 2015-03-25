define([
    "react",
    "mixins",
    "actions",
    "components/InnerLink",
    "react-bootstrap"
], function(React, mixins, actions, InnerLink, Bootstrap) {
    "use strict";

    return React.createClass({
        mixins: [mixins.ImmutableRenderMixin],

        displayName: 'InnerLinkList',

        handleClick: function() {
            actions.toggleAllStatisticsVisibility(this.props.url);
        },

        render: function renderInnerLinkList() {
            return (
                <div>
                    <ul>
                        {this.props.pages.map(function(page) {
                            return (
                                <InnerLink key={page.get('url')} url={this.props.url} page={page.get('url')} checked={page.get('visible')}/>
                            );
                        }.bind(this))}
                    </ul>
                    <Bootstrap.Button bsStyle="link" onClick={this.handleClick}>Toggle all</Bootstrap.Button>
                </div>
            );
        }
    });
});
