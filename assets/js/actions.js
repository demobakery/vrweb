$(document).ready(function(){
	$('.mainCircle').show();

	$('.hamburger').on('click', function() {
	  $(this).toggleClass('clicked');
	});

	$(document).delegate(".itemOpener","click", function(){
		//var mainCircle = $(this).closest('svg').find(".mainCircle").toggle();
		$('.icon').removeClass('mini');
		$('.vrContent').hide();

		svg = $(this).closest('div').find('svg');

		$('svg path').attr('class',' ');

		if($(this).attr('which') != "this") {
			$('.itemOpener').attr('which','');
			$(this).attr('which',"this");
			$(this).closest('div').find('.vrContent').show();
			HalloVR.hatsDown = false;
			$('.vrContent').each(function(){
				if($(this).find('.vrChild').length  ===  0){
					$(this).find('.content').delay(1000 * Math.random()).queue(function(){
					    $(this).addClass('margined').dequeue();
					});
				} else {
					$(this).children('.content').css({'opacity':1});
					$(this).find('.vrChild .content').delay(1000 * Math.random()).queue(function(){
					    $(this).addClass('margined').dequeue();
					});
				}
			});
			$(this).closest('div').find('.vrContent, .vrChild').show();
			svg.find('path').attr('class','draw');
		} else {
			$(this).attr('which','');
			HalloVR.hatsDown = true;
		}
	});

	$('.vrChild').each(function(){
		x = parseInt($(this).attr('x'));
		y = parseInt($(this).attr('y'));
		px = parseInt($(this).closest('.vrContent').attr('x'));
		py = parseInt($(this).closest('.vrContent').attr('y'));
		$(this).css({"top": y, "left": x});
		var index = $(this).closest('.vrContent').index();

		svgElement = $('<svg class="svg_' + index + '" style="position: absolute;width:1000px; height: 1000px;margin-left: -500px;margin-top: -500px;z-index: -1;left: ' + px + 'px;top: ' + py + 'px;"></svg>');
		$(this).closest('.vrContent').after(svgElement);

		line = document.createElementNS('http://www.w3.org/2000/svg','path');
		line.setAttribute('d' , 'M503.5 503.5 L' + (500 + x + 3.5) + ' ' + (500 + y + 3.5));
		line.setAttribute('stroke', 'white');
		line.setAttribute('line','line_' + index);

		parent = $(this);

		svgElement.append(line);

	});
	
	$('.vrContent').each(function(){
		x = parseInt($(this).attr('x'));
		y = parseInt($(this).attr('y'));
		svg = $(this).parent().find('.mainCircle');
		$(this).css({"top": y, "left": x});
		var index = $(this).index();
		
		line = document.createElementNS('http://www.w3.org/2000/svg','path');
		line.setAttribute('d' , 'M500 500 L' + (x + 3.5) + ' ' + (y + 3.5));
		line.setAttribute('stroke', 'white');
		line.setAttribute('mask','url(#hide_lines)');

		svgElement = $(this).closest('.vrElement').find('svg');
		svg.append(line);
	});
});