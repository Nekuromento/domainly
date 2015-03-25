define([
    "react",
    "mixins",
    "components/Loading",
    "components/Alert",
    "components/InnerLinkList",
    "components/OutterLinkList",
    "components/OutterLinkChart",
    "react-bootstrap"
], function(React, mixins, Loading, Alert, InnerLinkList, OutterLinkList, OutterLinkChart, Bootstrap) {
    "use strict";

    return React.createClass({
        mixins: [mixins.ImmutableRenderMixin],

        displayName: 'Domain',

        getInitialState: function() {
            return {
                expanded: false
            };
        },

        handleClick: function() {
            this.setState({
                expanded: !this.state.expanded
            });
        },

        render: function renderDomain() {
            var domain = this.props.domain;
            var url = new URL(domain.get('url'));

            var title = (
                <span><strong>{url.hostname}</strong>{url.pathname}</span>
            );
            var content;

            if (domain.get('loading')) {
                content = (
                    <Loading/>
                );
            } else if (domain.get('error')) {
                content = (
                    <Alert text={domain.get('error')}/>
                );
            } else if (this.state.expanded) {
                content = (
                    <div>
                        <h4>Scanned pages</h4>
                        <InnerLinkList url={domain.get('url')} pages={domain.get('pages')}/>
                        <h4>Discovered links</h4>
                        <Bootstrap.TabbedArea defaultActiveKey={1}>
                            <Bootstrap.TabPane eventKey={1} tab="Table view">
                                <OutterLinkList links={domain.get('links')}/>
                            </Bootstrap.TabPane>
                            <Bootstrap.TabPane eventKey={2} tab="Chart view">
                                <OutterLinkChart links={domain.get('links')}/>
                            </Bootstrap.TabPane>
                        </Bootstrap.TabbedArea>
                    </div>
                );
            }

            return (
                <Bootstrap.Panel collapsable header={title} onSelect={this.handleClick}>
                    {content}
                </Bootstrap.Panel>
            )
        }
    });
});

