define(function(){

  var orderRectPts = function(pts){
    var retVal = [];
    var pt1,pt2;
    if(pts[1].x < pts[0].x){
      pt1 = pts[1];
      pt2 = pts[0];
    } else {
      pt1 = pts[0];
      pt2 = pts[1];
    }
    retVal.push(pt1);
    retVal.push(pt2);
    return retVal;
  };

  return orderRectPts;

});