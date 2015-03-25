define([
    "react",
    "mixins",
    "components/Domain"
], function(React, mixins, Domain) {
    "use strict";

    return React.createClass({
        mixins: [mixins.ImmutableRenderMixin],

        displayName: 'DomainList',

        render: function renderDomainList() {
            return (
                <div className="col-sm-12 col-md-8">
                    {this.props.domains.map(function(domain) {
                        return (
                            <Domain key={domain.get('url')} domain={domain}/>
                        );
                    })}
                </div>
            );
        }
    });
});
