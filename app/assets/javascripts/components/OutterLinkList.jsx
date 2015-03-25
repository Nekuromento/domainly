define([
    "react",
    "mixins",
    "react-bootstrap",
    "components/OutterLink"
], function(React, mixins, Bootstrap, OutterLink) {
    "use strict";

    return React.createClass({
        mixins: [mixins.ImmutableRenderMixin],

        displayName: 'OutterLinkList',

        render: function renderOutterLinkList() {
            return (
                <Bootstrap.ListGroup>
                    {this.props.links.map(function(link) {
                        return (
                            <OutterLink key={link.get('url')} domain={link}/>
                        );
                    })}
                </Bootstrap.ListGroup>
            );
        }
    });
});

