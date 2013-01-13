/*
 *

 Copyright 2011 Luis Montes

http://azprogrammer.com

 */

define([
  './game',
  './CanvasDND',
  './tools'
], function(game, CanvasDND){

  'use strict';

  var undoObjs = [];

  var dnd = new CanvasDND();

  game.run();

});