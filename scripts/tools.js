define([
  './createBodies',
  './jsonObjs',
  './currentGeom',
  './tool',
  './toolType',
  'dojo/on',
  'dojo/dom',
  'dojo/domReady!'
], function(createBodies, jsonObjs, currentGeom, tool, toolType, on, dom){

  var toolForm = dom.byId('toolForm');
  on(toolForm, 'change', function(e){
    currentGeom.set(null);

    if(e.target.name === 'tool'){
      tool.set(e.target.value);
      console.log('tool', tool.get());
    }

    if(e.target.name === 'toolType'){
      toolType.set(e.target.value);
      console.log('toolType', toolType.get());
    }
  });

  on(dom.byId('load'), 'click', function(e){
    try{
      var objStr = dom.byId('output').value;
      console.log(objStr);

      var jsobj = JSON.parse(objStr);
      jsonObjs = jsobj.objs;

      createBodies();

      console.log(jsobj);
    } catch(er){
      console.info('error loading json',er);
    }
  });

  var undoBtn = dom.byId('undoBtn');
  on(undoBtn, 'click', function(e){
    if(jsonObjs.length){
      undoObjs.push(jsonObjs.pop());
      createBodies();
    }
  });

  on(dom.byId('runSimulation'), 'change', function(e){
    runSimulation = dom.byId('runSimulation').checked;
  });

  on(dom.byId('showStatic'), 'change', function(e){
    showStatic = dom.byId('showStatic').checked;
  });

  on(document, 'selectstart', function(e){
    e.preventDefault();
    return false;
  });

});