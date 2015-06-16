$(document).ready(function(){
	$('div').fadeIn(1500);

	var s = Snap("#video");
	var main_icon = s.select('#main_icon_path');
	var curve_path = s.select("#curve_path");


	var distancePerPoint = 30;
	var drawFPS          = 60;

	var orig = $('.curve_path'), length, timer, check = false;
	

	function startDrawingPath(direct, allLines){
		
		allLines.each(function(element, index, array) {
				line = allLines[element];
				line.style.strokeDasharray = "0px 5000px";
				line.style.stroke = 'url(#grad1)';
				length = 0;
				increaseLength(line);
		});
		
	}

	function increaseLength(lineCurve){
		
		var pathLength = lineCurve.getTotalLength();
		length += distancePerPoint;
		lineCurve.style.strokeDasharray = [length,pathLength].join(' ');
		
		if (length >= pathLength)
		{	
			s.select('.child').animate({ transform: "matrix(0.02,0,0,0.02,950, 972)" },300, mina.elastic);
		}
		
		setTimeout(function(){
			increaseLength(lineCurve);	
		}, 10);
	}


	main_icon.click(function(){
		if(!check) {
			startDrawingPath(true, orig);
			check = true;
		} else {
			startDrawingPath(false, orig);
			check = false;
		}
	});

	$('.child').click(function(){
		
		var content = $('#child_' + ($(this).index('.child') + 1));
		offset = $(this).offset();
		content.css({
			'position': 'absolute',
			'left': offset.left + 50,
			'top': offset.top - 150
		});
		
		$(this).fadeOut(300, function(){
			content.css({'visibility': 'visible'});
		});
		
	});
	
	

	function onSVGLoaded( data ){ 
	    s.append( data );
	}
});