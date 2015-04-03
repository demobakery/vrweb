$(document).ready(function(){
	$('.mainCircle').show();

	$('.hamburger').on('click', function() {
	  $(this).toggleClass('clicked');
	});

	$(document).delegate(".itemOpener","click", function(){
		//var mainCircle = $(this).closest('svg').find(".mainCircle").toggle();

		$('.icon').removeClass('mini');
		$('.vrContent .content').removeClass('margined').fadeOut(500);
		svg = $(this).closest('svg');
		$('.vrContent').hide();
		$('svg path').attr('class',' ');

		if($(this).attr('which') != "this") {
			$('.itemOpener').attr('which','');
			$(this).attr('which',"this");
			HalloVR.hatsDown = false;
			$(this).closest('div').find('.vrContent').show();
			svg.find('.mainCircle path').attr('class','draw');
		} else {
			$(this).attr('which','');
			$(this).closest('div').find('.vrContent').hide();
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
		line.setAttribute('d' , 'M505 505 L' + (500 + x + 5) + ' ' + (500 + y + 5));
		line.setAttribute('stroke-width', '2');
		line.setAttribute('stroke', 'white');
		line.setAttribute('line','line_' + index);

		parent = $(this);

		$(this).children('.icon').click(function(){

			if(!$(this).hasClass('thisChild')) {
				$('.icon').removeClass('mini');
				$('.vrChild .content').removeClass('margined').fadeOut(500);
			}
			
			content = $(this).parent().children('.content');
			content.toggleClass('margined').fadeToggle(500);
			$(this).toggleClass('mini');

			parent.children('.icon').removeClass('thisChild');
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
		line.setAttribute('d' , 'M500 500 L' + (x + 5) + ' ' + (y + 5));
		line.setAttribute('stroke-width', '2');
		line.setAttribute('stroke', 'white');
		line.setAttribute('mask','url(#hide_lines)');

		svgElement = $(this).closest('.vrElement').find('svg');
		
		$(this).children('.icon').click(function(){

			if(!$(this).hasClass('thisChild')) {
				$('.icon').removeClass('mini');
				$('.vrContent .content').removeClass('margined').fadeOut(500);
			}

			
			content = $(this).parent().children('.content');

			if(content.find('.vrChild').length > 0)
			{
				content.css({left: "0", top: "0"});
				content.toggle();

				svgElement = $(this).closest('.vrElement').find(".svg_" + index);

				console.log(svgElement.find('path[line=line_' + index + ']'));


				if(svgElement.find('path[line=line_' + index + ']').attr('class') != "draw") {
					svgElement.find('path[line=line_' + index + ']').attr('class','draw');
					content.find('.vrChild').show();
				}
				else {
					svgElement.find('path[line=line_' + index + ']').attr('class','');
					content.find('.vrChild').hide();
				}
			}
			else
			{
				content.toggleClass('margined').fadeToggle(500);
				$('path[line]').attr('class','');
			}

			$(this).toggleClass('mini');
			$('.icon').removeClass('thisChild');
			$(this).addClass('thisChild');
			
		});
		
		svg.append(line);
	});
});