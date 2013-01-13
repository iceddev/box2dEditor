define([

], function(){

  'use strict';

  var tool = 'rectangle';

  return {
    get: function(){
      return tool;
    },
    set: function(newTool){
      tool = newTool;
    },
    is: function(testTool){
      return tool === testTool;
    }
  };

});