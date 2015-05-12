app.directive('onLastRepeat', function() {
    return function(scope, element, attrs) {
    	
        if (scope.$last) setTimeout(function(){
            scope.$emit('onRepeatLast', element, attrs);
        }, 1);
    };
})


app.directive('pathLine', function($timeout) {
  return {
    restrict: 'E',
    link: function(scope, lElement, lAttr) {
      var path = makeNode('path', lElement, lAttr);
      var newGuy = path.cloneNode(true);
      $timeout(function() {
        lElement.replaceWith(newGuy);
      })
    }
  }
});

app.directive('svgLine', function($timeout){
  return {
    restrict: 'AE',
    replace:true,
    link: function(scope, lElement, lAttr) {
    	
    	var child = angular.fromJson(lAttr.child);
    	var parent = angular.fromJson(lAttr.parent);
    	var index = angular.fromJson(lAttr.parentindex);
   		x = child.x;
		y = child.y;
		px = parent.x;
		py = parent.y;

		var svgElement = $('<svg class="svg_' + index + '" style="position: absolute;width:1000px; height: 1000px;margin-left: -500px;margin-top: -500px;z-index: -1;left: ' + px + 'px;top: ' + py + 'px;"></svg>');

		lElement.closest('.vrContent').after(svgElement);
		
		line = document.createElementNS('http://www.w3.org/2000/svg','path');
		line.setAttribute('d' , 'M505 505 L' + (500 + x + 5) + ' ' + (500 + y + 5));
		line.setAttribute('stroke-width', '2');
		line.setAttribute('stroke', 'white');
		line.setAttribute('line','line_' + index);

		svgElement.append(line);
    }
  }
});

/* Create a shape node with the given settings. */
function makeNode(name, element, settings) {
	
	var node = document.createElementNS('http://www.w3.org/2000/svg', name);
		
		if(settings.d) {
			node.setAttribute('d' , settings.d);
		}
		    node.setAttribute('stroke-width', '2');
		if(settings.stroke) {
			node.setAttribute('stroke', settings.stroke);
		}
		if(settings.mask) {
			node.setAttribute('mask', settings.mask);
		}
			node.setAttribute('stroke-dashoffset', angular.fromJson(settings.strokedashoffset));
	
	return node;
}