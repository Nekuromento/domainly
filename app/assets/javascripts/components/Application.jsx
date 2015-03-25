define([
    "react",
    "mixins",
    "actions",
    "stores/CrawlerStore",
    "components/Loading",
    "components/Alert",
    "components/Header",
    "components/DomainList",
    "components/LatestSearch"
], function(React, mixins, actions, CrawlerStore, Loading, Alert, Header, DomainList, LatestSearch) {
    "use strict";

    function getState() {
        return CrawlerStore.getState();
    }

    return React.createClass({
        mixins: [mixins.ImmutableRenderMixin],

        displayName: 'Application',

        onChange: function() {
            this.setState(getState());
        },

        getInitialState: function() {
            return getState();
        },

        componentDidMount: function() {
            CrawlerStore.addChangeListener(this.onChange);

            actions.loadInitialState();
        },

        componentWillUnmount: function() {
            CrawlerStore.removeChangeListener(this.onChange);
        },

        render: function renderApplication() {
            if (this.state.loading) {
                return (
                    <Loading/>
                );
            }

            if (this.state.error) {
                return (
                    <Alert text={this.state.error}/>
                );
            }

            return (
                <div className="container">
                    <Header/>
                    <section className="row">
                        <DomainList domains={this.state.domains}/>
                        <LatestSearch domains={this.state.recentSearch}/>
                    </section>
                </div>

            );
        },
    });
});
