define(function (require, exports, module) {'use strict';

var React = require('react');
var d3 = require('d3');
var Cell = require('./Cell');


module.exports = React.createClass({displayName: "exports",
  
  propTypes: {
    data: React.PropTypes.array,
    value: React.PropTypes.string
  },
 
  getDefaultProps:function() {
    return {
      data: [],
      value: 'value',
      label: 'label'
    };
  },

  render:function() {

    var props = this.props;
    
    var data = props.data;
    var value = props.value;
    var label = props.label;

    var colors = d3.scale.category20c();

    var treemap = d3.layout.treemap()
                    // make sure calculation loop through all objects inside array 
                    .children(function(d) {return d;})
                    .size([props.width, props.height])
                    .sticky(true)
                    .value(function(d) { return d[value]; });
    
    var cells = treemap(data).map(function(node, i)  {
      return (
        React.createElement(Cell, {
          x: node.x, 
          y: node.y, 
          width: node.dx, 
          height: node.dy, 
          fill: colors(i), 
          label: node[label], 
          fontSize: props.fontSize, 
          textColor: props.textColor, 
          key: i}
        ) 
      ); 
    }, this);

    return (
      React.createElement("g", {transform: props.transform, className: "treemap"}, 
        cells
      )
    );
  }

});

});
