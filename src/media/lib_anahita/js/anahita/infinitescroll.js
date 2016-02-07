/**
 * Author: Rastin Mehr
 * Email: rastin@anahitapolis.com
 * Copyright 2015 rmdStudio Inc. www.rmdStudio.com
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

;(function ($, window, document) {

	'use strict';

	$.widget("anahita.infinitescroll", {

		options: {
			window : window,
			scrollable : document,
			item : '.an-entity',
			preload : 3,
			limit : 20,
			url : null
		},

		_create: function() {

				var self = this;
				var scrollable = this.element.data('scrollable') || this.options.scrollable;

				this.element.data('fetched-items', null);
				this.url = this.element.data('url') || this.options.url;
			  this.waiting = false;
				this.endOfRecords = false;
				this.batchSize = this.options.limit * this.options.preload;
	      this.start = this.element.find(this.options.item).length;
				this.items = new Array();

				this._getItems();

				// listen to the "urlChange" event
        // if there is one, update the url and refresh records.
        this._on( $(document) , {

            'urlChange' : function( event ) {
                self.element.data('url', $(document).data('newUrl'));
                self.url = this.element.data('url');
								self.items = null;
								self.start = 0;
								self._getItems();
            }
        });

				$(scrollable).scroll(function(){
						if (
								!self.waiting &&
								self.element.is(':visible') &&
								$(window).scrollTop() + ($(window).height() * 1.3 ) >= $(scrollable).height()
						) {
								self._render();
								self._getItems();
						}
				});
		},

		_getItems : function() {

				if(this.endOfRecords) {
					 return;
				}

				var self = this;

				var limit = $.param({
						start : this.start,
						limit : this.batchSize
				});

				$.ajax({
						method : 'get',
						url : this.url + '&' + limit,
						beforeSend : function () {
							self.waiting = true;
						},
						success : function ( response ) {
							 self.waiting = false;

							 var newItems = null;

							 newItems = $(response).filter( self.options.item )

							 if(newItems.length == 0) {
								 newItems = $(response).find( self.options.item );
							 }

							 if(newItems.length == 0) {
								 self.endOfRecords = true;
								 return;
							 }

							 self.items = $.merge(self.items, newItems);
							 self.start += self.batchSize;
							 self._render();
						}
				});
		},

		_render : function() {

			if(this.element.data('fetched-items')) {
				$(document).trigger('masonry');
				return;
			}

			var items = new Array();
			var limit = this.options.limit;

			while(limit && this.items.length) {
				items.push(this.items.shift());
				limit--;
			}

			this.element.data('fetched-items', items);

			$(document).trigger('masonry');
		}
	});

	var elements = $('[data-trigger="InfiniteScroll"]');

	if ( elements.length ) {
		 elements.find('.InfiniteScrollReadmore').hide();
		 elements.infinitescroll();
	}

	$(document).ajaxSuccess(function() {

		var elements = $('[data-trigger="InfiniteScroll"]');

		$.each(elements, function( index, element ){

		    if( !$(element).is(":data('anahita-infinitescroll')") ) {

					$(element).find('.InfiniteScrollReadmore').hide();
		      $(element).infinitescroll();

		    }
		});
	});

}(jQuery, window, document));
