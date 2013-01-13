define(function(){

  var currentGeom = null;

  return {
    get: function(){
      return currentGeom;
    },
    set: function(newGeom){
      currentGeom = newGeom;
    }
  };

});