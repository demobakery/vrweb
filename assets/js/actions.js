$(document).ready(function(){
	$('.mainCircle').show();

	$(document).delegate(".itemOpener","click", function(){
		//var mainCircle = $(this).closest('svg').find(".mainCircle").toggle();

		$('.icon').removeClass('mini');
		$('.vrContent .content').removeClass('margined').fadeOut(500);

		if($('.mainCircle path').attr('class') != "draw")
			$('.mainCircle path').attr('class','draw');
		else 
			$('svg path').attr('class','');

		if(HalloVR.hatsDown)
			HalloVR.hatsDown = false;
		else
			HalloVR.hatsDown = true;


		$(this).closest('div').find('.vrContent').toggle();
	});

	$('.vrChild').each(function(){
		x = parseInt($(this).attr('x'));
		y = parseInt($(this).attr('y'));
		px = parseInt($(this).closest('.vrContent').attr('x'));
		py = parseInt($(this).closest('.vrContent').attr('y'));
		$(this).css({"top": y, "left": x});
		var index = $(this).closest('.vrContent').index();

		svgElement = $('<svg style="position: absolute;width:1000px; height: 1000px;margin-left: -500px;margin-top: -500px;z-index: -1;left: ' + px + 'px;top: ' + py + 'px;"></svg>');
		$(this).closest('.vrContent').after(svgElement);

		line = document.createElementNS('http://www.w3.org/2000/svg','path');
		line.setAttribute('d' , 'M510 510 L' + (500 + x + 10) + ' ' + (500 + y + 10));
		line.setAttribute('stroke-width', '2');
		line.setAttribute('stroke', 'white');
		line.setAttribute('line','line_' + index);

		$(this).find('.icon').click(function(){

			if(!$(this).hasClass('thisChild')) {
				$('.icon').removeClass('mini');
				$('.vrContent .content').removeClass('margined').fadeOut(500);
			}
			
			content = $(this).parent().find('.content');
			content.toggleClass('margined').fadeToggle(500);
			$(this).toggleClass('mini');

			$('.icon').removeClass('thisChild');
			$(this).addClass('thisChild');
			
		});

		svgElement.append(line);

	});
	
	$('.vrContent').each(function(){
		x = parseInt($(this).attr('x'));
		y = parseInt($(this).attr('y'));
		svg = $(this).parent().find('.mainCircle');
		$(this).css({"top": y, "left": x});
		var index = $(this).index();
		
		line = document.createElementNS('http://www.w3.org/2000/svg','path');
		line.setAttribute('d' , 'M500 500 L' + (x + 10) + ' ' + (y + 10));
		line.setAttribute('stroke-width', '2');
		line.setAttribute('stroke', 'white');
		line.setAttribute('mask','url(#hide_lines)');
		
		$(this).find('.icon').click(function(){

			if(!$(this).hasClass('thisChild')) {
				$('.icon').removeClass('mini');
				$('.vrContent .content').removeClass('margined').fadeOut(500);
			}

			
			content = $(this).parent().find('.content');

			if(content.find('.vrChild').length > 0)
			{
				content.css({left: "0", top: "0"});
				content.show();
				content.find('.vrChild').toggle();

				if($('svg path[line=line_' + index + ']').attr('class') != "draw")
					$('svg path[line=line_' + index + ']').attr('class','draw');
				else 
					$('svg path[line=line_' + index + ']').attr('class','');
			}
			else
			{
				content.toggleClass('margined').fadeToggle(500);
			}

			$(this).toggleClass('mini');
			$('.icon').removeClass('thisChild');
			$(this).addClass('thisChild');
			
		});
		
		svg.append(line);
	});
});