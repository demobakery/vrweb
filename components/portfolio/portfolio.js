$(document).ready(function(){
	$('body').fadeIn(1500);

	var s = Snap("#portfolio");
	var main_icon = s.select('#main_icon_path');
	var curve_path = s.select("#curve_path");
	

	var distancePerPoint = 5;
	var drawFPS          = 60;

	var orig = $('.curve_path'), length, timer, check = false, direct = false;
	
	// -- Line animations -- //
	
	orig.each(function(element, index, array) {
		line = orig[element];
		path = line.getAttribute('d');
		path = path.split(" ");
		curve_x = parseInt(path[4]);
		curve_y = parseInt(path[5]);
		
		// calling lines floating animation
		//setFloatAnimation(line, curve_x, curve_y, path, curve_x, curve_y);
	});
	
	function getPath(pathStr, x, y) {
		pathStr = pathStr;
		pathStr[4] = parseInt(x);
		pathStr[5] = parseInt(y);
		pathStr = pathStr.join(" ");
		return pathStr;
	}
	
	function setFloatAnimation(line, cx, cy, pathString , rx, ry) {
		randomNum_x = 30 + 20 * Math.random();
		randomNum_y = 20 + 5 * Math.random();
		dir = Math.round(Math.random());
		
		cx = rx; cy = ry;
		
		renderAnimation();
		
		function renderAnimation(){
			//console.clear();
			if(dir) {
				
				x = cx - 1;
				y = cy - 1;
				
				if(x < rx - randomNum_x && y < ry - randomNum_y)
				  setFloatAnimation(line, cx, cy, path , rx , ry);
				
			} else {
				
				x = cx + 1;
				y = cy + 1;
				
				if(x >= rx + randomNum_x && y >= ry + randomNum_y)
				  setFloatAnimation(line, cx, cy, path , rx , ry);
				
			}
			
			pathStringLine = getPath(pathString, x, y);
			line.setAttribute('d', pathStringLine);
			cx = x; cy = y;
			requestAnimationFrame(renderAnimation);
		}
		
		//line.setAttribute('d',path);
	}
	

	function startDrawingPath(directTo, allLines){
		
		allLines.each(function(element, index, array) {
				line = allLines[element];
				line.style.strokeDasharray = "0px 5000px";
				line.style.stroke = 'url(#grad1)';
				length = 0;
				increaseLength(line, directTo);
		});
		
	}

	function increaseLength(lineCurve, directTo){
		
		var patLength;
		
		if(directTo !== undefined)
			direct = directTo;
		
		pathLength = lineCurve.getTotalLength();
		
		if ( direct ) {
			length += distancePerPoint;
			condition = length <= pathLength;
		} else {
			s.select('.child').animate({ opacity: 0 },300, mina.elastic);
			$('div.hidden').fadeOut(300);
			length -= distancePerPoint;
			condition = length <= 0;
		}
		
		lineCurve.style.strokeDasharray = [length,pathLength].join(' ');
		
		if(condition)
		{
			setTimeout(function(){
				increaseLength(lineCurve);	
			}, 10);
		}
		else
		{
			if(direct)
			{
				s.select('.child').animate({ opacity: 1 },300, mina.elastic);
			}
		}
	}
	
	main_icon.hover(function(){
		if(main_icon.className === "" || main_icon.className === undefined)
			main_icon.attr({
				"xlink:href": 'components/portfolio/icon-hover.png'
			});
	}, function(){
		if(main_icon.className === "" || main_icon.className === undefined)
			main_icon.attr({
				"xlink:href": 'components/portfolio/icon.png'
			});
	});
	
	main_icon.click(function(){
		if(!check) {
			main_icon.className = "opened";
			main_icon.attr({
				"xlink:href": 'components/portfolio/icon-hover.png'
			});
			startDrawingPath(true, orig);
			check = true;
			HalloVR.hatsDown = false;
		} else {
			main_icon.className = "";
			main_icon.attr({
				"xlink:href": 'components/portfolio/icon.png'
			});
			startDrawingPath(false, orig);
			check = false;
			HalloVR.hatsDown = true;
		}
	});


	$('.child').click(function(){
		
		var content = $('#child_' + ($(this).index('.child') + 1));
		offset = $(this).position();
		content.css({
			'position': 'absolute',
			'left': offset.left + 50,
			'top': offset.top - 150
		});
		
		$(this).fadeTo(300 , 0, function(){
			content.fadeIn(300);
		});
		
	});
	
	

	function onSVGLoaded( data ){ 
	    s.append( data );
	}
});