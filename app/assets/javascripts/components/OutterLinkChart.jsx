define([
    "react",
    "mixins",
    "react-d3"
], function(React, mixins, d3) {
    "use strict";

    return React.createClass({
        mixins: [mixins.ImmutableRenderMixin],

        displayName: 'OutterLinkChart',

        render: function() {
            var data = this.props.links.map(function(link) {
                return {
                    label: link.get('url'),
                    value: link.get('totalLinkCount')
                };
            }).toArray();

            return (
                <d3.Treemap
                    data={data}
                    width={650}
                    height={650}
                    textColor="#484848"
                    fontSize="10px"/>
            );
        }
    });
});
