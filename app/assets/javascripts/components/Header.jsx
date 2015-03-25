define([
    "react",
    "mixins",
    "actions",
    "react-bootstrap"
], function(React, mixins, actions, Bootstrap) {
    "use strict";

    var urlRegex = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;

    function isValidUrl(value) {
        return urlRegex.test(value);
    }

    return React.createClass({
        mixins: [mixins.ImmutableRenderMixin],

        getInitialState: function() {
            return {
                inputValue: ''
            };
        },

        validationState: function() {
            if (isValidUrl(this.state.inputValue))
                return 'success';
            return 'error';
        },

        handleChange: function() {
            this.setState({
                inputValue: this.refs.input.getValue().trim(),
                depth: +this.refs.select.getValue()
            });
        },

        handleClick: function() {
            actions.addCrawlerRequest(this.state.inputValue, this.state.depth);

            this.setState({
                inputValue: '',
                depth: 0
            });
        },

        render: function() {
            var isValid = this.validationState() == 'success';

            return (
                <header>
                    <h3>Domain explorer</h3>
                    <form className="header-input">
                        <Bootstrap.Input onChange={this.handleChange}
                            ref="select"
                            type="select"
                            defaultValue="0"
                            label="Search depth">
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </Bootstrap.Input>
                        <Bootstrap.Input type="text"
                            value={this.state.inputValue}
                            placeholder="Enter url"
                            bsStyle={this.validationState()}
                            hasFeedback
                            ref="input"
                            onChange={this.handleChange}
                            buttonAfter={
                                <Bootstrap.Button bsStyle="success"
                                    disabled={!isValid}
                                    onClick={isValid ? this.handleClick : null}>
                                    Add
                                </Bootstrap.Button>
                            }/>
                    </form>
                </header>
            );
        }
    });
});
