define([

], function(){

  'use strict';

  var toolType = 'static';

  return {
    get: function(){
      return toolType;
    },
    set: function(newToolType){
      toolType = newToolType;
    },
    is: function(testToolType){
      return toolType === testToolType;
    }
  };

});