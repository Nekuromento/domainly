define(function (require, exports, module) {'use strict';

var React = require('react');
var d3 = require('d3');
var AxisTicks = require('./AxisTicks');
var AxisLine = require('./AxisLine');
var Label = require('./Label');

module.exports = React.createClass({displayName: "exports",

  propTypes: {
    yAxisClassName: React.PropTypes.string,
    yOrient: React.PropTypes.oneOf(['left', 'right']),
    yScale: React.PropTypes.func.isRequired,
    fill: React.PropTypes.string,
    stroke: React.PropTypes.string,
    tickStroke: React.PropTypes.string,
    strokeWidth: React.PropTypes.string,
    yAxisOffset: React.PropTypes.number
  },

  getDefaultProps:function() {
    return {
      yAxisClassName: 'y axis',
      yOrient: 'left',
      fill: 'none',
      stroke: '#000',
      tickStroke: '#000',
      strokeWidth: '1',
      yAxisOffset: 0
    };
  },

  render:function() {

    var props = this.props;

    var t;
    if (props.yOrient === 'right') {
       t = ("translate(" + (props.yAxisOffset + props.width) + ",0)");
    } else {
       t = ("translate(" + props.yAxisOffset + ",0)");
    }

    var tickArguments;
    if (props.yAxisTickCount) {
      tickArguments = [props.yAxisTickCount];
    }
    
    if (props.yAxisTickInterval) {
      tickArguments = [d3.time[props.yAxisTickInterval.unit], props.yAxisTickInterval.interval];
    }

    return (
      React.createElement("g", {
        className: props.yAxisClassName, 
        transform: t
      }, 
        React.createElement(AxisTicks, {
          tickFormatting: props.tickFormatting, 
          tickArguments: tickArguments, 
          yScale: props.yScale, 
          orient: props.yOrient, 
          height: props.height, 
          width: props.width}
        ), 
        React.createElement(AxisLine, React.__spread({
          scale: props.yScale, 
          orient: props.yOrient}, 
          props)
        ), 
        React.createElement(Label, {
          label: props.yAxisLabel, 
          offset: props.yAxisLabelOffset, 
          orient: props.yOrient, 
          margins: props.margins, 
          height: props.height, 
          width: props.width}
        )
      )
    );
  }

});

});
