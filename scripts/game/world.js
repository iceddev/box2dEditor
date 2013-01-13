define(function(){

  'use strict';

  var world = {};

  return {
    get: function(){
      return world;
    },
    set: function(newWorld){
      world = newWorld;
    }
  };

});