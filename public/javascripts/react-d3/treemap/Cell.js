define(function (require, exports, module) {'use strict';

var React = require('react');
var d3 = require('d3');


module.exports = React.createClass({displayName: "exports",

  propTypes: {
    fill: React.PropTypes.string,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    label: React.PropTypes.string
  },

  render:function() {

    var props = this.props;
    
    var textStyle = {
      'textAnchor': 'middle',
      'fill': props.textColor,
      'fontSize': props.fontSize
    };

    var t = ("translate(" + props.x + ", " + props.y + "  )");

    return (
      React.createElement("g", {transform: t}, 
        React.createElement("rect", {
          fill: props.fill, 
          width: props.width, 
          height: props.height, 
          className: "rd3-treemap-cell"}
        ), 
        React.createElement("text", {
          x: props.width / 2, 
          y: props.height / 2, 
          dy: ".35em", 
          style: textStyle, 
          className: "rd3-treemap-cell-text"
        }, 
          props.label
        )
      )
    );
  }
});

});
