define([
  'dcl',
  'dojo/dom',
  'frozen/box2d/Box'
], function(dcl, dom, Box){

  var gravityXField = dom.byId('gravityX');
  var gravityYField = dom.byId('gravityY');
  var gravity = function(){
    return {
      x: parseFloat(gravityXField.value, 10),
      y: parseFloat(gravityYField.value, 10)
    };
  };

  return dcl(Box, {
    intervalRate: 60,
    adaptive: false,
    gravityY: gravity().y,
    gravityX: gravity().x
  });

});