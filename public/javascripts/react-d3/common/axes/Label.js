define(function (require, exports, module) {'use strict';

var React = require('react');


module.exports = React.createClass({displayName: "exports",

  render:function() {
    var props = this.props;
    var strokeWidth = '0.01';
    if (props.label) {
      switch (props.orient) {
        case 'top':
          return (
            React.createElement("text", {
              strokeWidth: strokeWidth, 
              y: props.offset, x: props.width/2, 
              textAnchor: "middle"}, 
              props.label
            )
          );
        case 'bottom':
          return (
            React.createElement("text", {
              strokeWidth: strokeWidth, 
              y: props.offset, x: props.width/2, 
              textAnchor: "middle"}, 
              props.label
            )
          );
        case 'left':
          return (
            React.createElement("text", {
              strokeWidth: strokeWidth, 
              y: -props.offset, x: -props.height/2, 
              textAnchor: "middle", 
              transform: "rotate(270)"}, 
              props.label
            )
          );
        case 'right':
          return (
            React.createElement("text", {
              strokeWidth: strokeWidth, 
              y: props.offset, x: -props.height/2, 
              textAnchor: "middle", 
              transform: "rotate(270)"}, 
              props.label
            )
          );
      }
    }
    return React.createElement("text", null);
  }

});



});
