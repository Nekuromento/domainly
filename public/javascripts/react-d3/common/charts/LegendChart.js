define(function (require, exports, module) {'use strict';

var React = require('react');
var Legend = require('../Legend');

module.exports = React.createClass({displayName: "exports",

  propTypes: {
    legend: React.PropTypes.bool,
    legendPosition: React.PropTypes.string,
    sideOffset: React.PropTypes.number,
    margins: React.PropTypes.object,
    data: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.array
    ])
  },

  getDefaultProps:function() {
    return {
      data: {},
      legend: false,
      legendPosition: 'right',
      sideOffset: 90
    };
  },

  _renderLegend:function() {
    if (this.props.legend) {
      return (
        React.createElement(Legend, {
          legendPosition: this.props.legendPosition, 
          margins: this.props.margins, 
          colors: this.props.colors, 
          data: this.props.data, 
          width: this.props.width, 
          height: this.props.height, 
          sideOffset: this.props.sideOffset}
        ) 
      );
    }
  },

  render:function() {
    return (
      React.createElement("div", {style: {'width': this.props.width, 'height': this.props.height}}, 
        React.createElement("h4", null, this.props.title), 
        this._renderLegend(), 
        React.createElement("svg", {viewBox: this.props.viewBox, width: this.props.width - this.props.sideOffset, height: this.props.height}, this.props.children)
      )
    );
  }
});

});
