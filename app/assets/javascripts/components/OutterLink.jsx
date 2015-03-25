define([
    "react",
    "mixins",
    "react-bootstrap"
], function(React, mixins, Bootstrap) {
    "use strict";

    function classSet(styles) {
        return Object.keys(styles).reduce(function(className, style) {
            if (styles[style])
                return className + " " + style;
            return className;
        }, "");
    }

    return React.createClass({
        mixins: [Bootstrap.CollapsableMixin, mixins.ImmutableRenderMixin],

        displayName: 'OutterLink',

        getCollapsableDOMNode: function(){
            return this.refs.list.getDOMNode();
        },

        getCollapsableDimensionValue: function(){
            return this.refs.list.getDOMNode().scrollHeight;
        },

        handleClick: function() {
            this.setState({
                expanded: !this.state.expanded
            });
        },

        render: function renderOutterLink() {
            var styles = this.getCollapsableClassSet();
            var domain = this.props.domain;
            var content;
            if (this.state.expanded) {
                content = (
                    <div>
                        {domain.get('links').map(function(link) {
                            return (
                                <li key={link.get('url')}>
                                    <span className="link">{link.get('url')}</span>
                                    <Bootstrap.Badge>{link.get('count')}</Bootstrap.Badge>
                                </li>
                            );
                        })}
                    </div>
                );
            }

            return (
                <Bootstrap.ListGroupItem>
                    <Bootstrap.Button bsStyle="link" onClick={this.handleClick}>
                        {domain.get('url') + ' '}
                        <Bootstrap.Badge>{domain.get('totalLinkCount')}</Bootstrap.Badge>
                    </Bootstrap.Button>
                    <ul ref="list" className={classSet(styles)}>
                        {content}
                    </ul>
                </Bootstrap.ListGroupItem>
            );
        }
    });
});
