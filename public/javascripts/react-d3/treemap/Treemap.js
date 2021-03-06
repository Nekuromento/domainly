define(function (require, exports, module) {'use strict';

var React = require('react');
var Chart = require('../common/index').Chart;
var DataSeries = require('./DataSeries');

module.exports = React.createClass({displayName: "exports",

  propTypes: {
    margins: React.PropTypes.object,
    data: React.PropTypes.array, 
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    title: React.PropTypes.string,
    textColor: React.PropTypes.string,
    fontSize: React.PropTypes.oneOfType([ 
      React.PropTypes.string,
      React.PropTypes.number
    ])

  },

  getDefaultProps:function() {
    return {
      data: [], 
      width: 400,
      heigth: 200,
      title: '',
      textColor: '#f7f7f7',
      fontSize: '0.85em'
    };
  },

  render:function() {

    var props = this.props;
    
    return (
      React.createElement(Chart, {
        title: props.title, 
        width: props.width, 
        height: props.height
      }, 
        React.createElement("g", {className: "rd3-treemap"}, 
          React.createElement(DataSeries, {
            width: props.width, 
            height: props.height, 
            data: props.data, 
            textColor: props.textColor, 
            fontSize: props.fontSize}
          )
        )
      )
    );
  }

});

});
