//Autor: Buras Arkadiusz
//Blog:  http://macbury.jogger.pl

$.widget("ui.tutorial", {
	_init: function(){
		this.tip_index = 0;
		
		this.tip_wrapper = $('<div class="ui-popup"></div>');
		this.tip_wrapper.css({
			'position': 'absolute',
			'z-index': '9999',
			'display': 'none'
		});
		this.tip_content = $('<div class="content"></div>');
		this.tip_wrapper.append(this.tip_content);
		$('body').append(this.tip_wrapper);
		
		this._nextBubble(null);
	},
	
	_nextBubble: function(event){
		var tip = this.options.bubbles[this.tip_index];
		var last = (this.options.bubbles[this.tip_index+1] == undefined);
		var self = this;
		
		self.tip_wrapper.fadeOut('fast', function () {
			if (tip == undefined) {
				return;
			};
			
			self.tip_content.text(tip.body);
			
			var next_link = $('<a href="#" class="ui-next"></a>');
			next_link.text(last ? self.options.last_link_text : self.options.next_link_text);
			next_link.click(function (e) {
				self._nextBubble(e);
			});
			
			self.tip_content.append(next_link);
			
			var popup_pos = tip.direction || 'default';
			
			$(self.tip_wrapper).setPositionAround(event, {
				around: tip.element,
				direction: popup_pos,
				offset: tip.offset || [20,20]
			});
			
			self.tip_wrapper.attr('class', 'ui-popup');
			self.tip_wrapper.addClass('ui-popup-' + popup_pos);
			
			self.tip_wrapper.fadeIn();
			self.tip_index++;
		});
	},
}); 

$.ui.tutorial.defaults = {
	tutorial: [],
	last_link_text: 'Hide',
	next_link_text: 'Next'
};


$.fn.setPositionAround = function(event, o) {

	var options = $.extend({
		around: 'mouse',
		direction: 'default',
		forceDirection: false,
		offset: [0, 0]
	}, o);

	var leftOffset	= 0,
		topOffset	= 0,
		height		= this[0].offsetHeight,
		width		= this[0].offsetWidth,
		op			= this.offsetParent(),
		sp			= $(this.scrollParent().length ? this.scrollParent() : document.body),
		spBorderTop = parseInt(op.css('borderTopWidth'),10),
		spBorderLeft= parseInt(op.css('borderLeftWidth'),10),
		opBorderTop = parseInt(op.css('borderTopWidth'),10),
		opBorderLeft= parseInt(op.css('borderLeftWidth'),10),
		opOffset	= op.offset()
		//spOffset	= sp.offset()
	;

	//Ugly fix for the issues of offset related to the body element
	opOffset = (/(html|body)/).test(op[0].tagName.toLowerCase()) ? { top: 0, left: 0 } : opOffset;
	spOffset = (/(html|body)/).test(op[0].tagName.toLowerCase()) ? { top: 0, left: 0 } : spOffset;

	var bottomEdge = (/(html|body)/).test(op[0].tagName.toLowerCase()) ? $(window).height() : spOffset.top + spBorderTop + sp.height();
	var rightEdge = (/(html|body)/).test(op[0].tagName.toLowerCase()) ? $(window).width() : spOffset.left + spBorderLeft + sp.width();

	if($(options.around).length && $(options.around)[0].nodeName) { //If around is an element

		var element = $(options.around),
			offset = element.offset(),
			relHeight = element[0].offsetHeight,
			relWidth = element[0].offsetWidth
		;

		if((/(left|right)/).test(options.direction)) {

			leftOffset = ( options.direction == 'left' ? (offset.left - spOffset.left - spBorderLeft > width || options.forceDirection) : (rightEdge-offset.left-relWidth < width && !options.forceDirection) ) ? -(this.outerWidth()) : relWidth;
			topOffset = event ? ( bottomEdge - offset.top < height ? -(height-relHeight) : 0 ) : 0;
		} else {
			topOffset = ( options.direction == 'above' ? (offset.top - spOffset.top - spBorderTop  > height || options.forceDirection) : (bottomEdge-offset.top-relHeight < height && !options.forceDirection) ) ? -(this.outerHeight()) : relHeight;
		}

		this.css({
			left: offset.left - opOffset.left - opBorderLeft + leftOffset + options.offset[0],
			top: offset.top - opOffset.top - opBorderTop + topOffset + options.offset[1]
		});

	} else {

		if((/(below|default)/).test(options.direction)) {
			topOffset = bottomEdge - event.pageY < height && !options.forceDirection ? -(height) : 0;
		} else if ((/above/).test(options.direction)) {
			topOffset = (event.pageY - spOffset.top - spBorderTop) > height || options.forceDirection ? -(height) : 0;
		}

		if((/(right|default)/).test(options.direction)) {
			leftOffset = rightEdge - event.pageX < width && !options.forceDirection ? -(width) : 0;
		} else if ((/left/).test(options.direction)) {
			leftOffset = (event.pageX - spOffset.left - spBorderLeft) > width || options.forceDirection ? -(width) : 0;
		}


		this.css({
			left: event.pageX - opOffset.left - opBorderLeft + leftOffset + options.offset[0],
			top: event.pageY - opOffset.top - opBorderTop + topOffset + options.offset[1]
		});

	}

};