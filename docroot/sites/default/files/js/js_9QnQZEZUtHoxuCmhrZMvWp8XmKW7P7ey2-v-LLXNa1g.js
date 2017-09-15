/**
 * @file
 * Obio sub-theme behaviors.
 */
(function($, Drupal) {

  "use strict";

  /**
   * Initializes foundation's JavaScript for new content added to the page.
   */
  Drupal.behaviors.foundationInit = {
    attach: function (context, settings) {
      $(context).foundation();
    }
  };

  /**
   * Adds/removes a class when the top-bar menu is overflowing.
   */
  Drupal.behaviors.obioMenuOverflow = {
    attach: function (context, settings) {
      var onresize = function () {
        var $menu = $('.header-left ');
        var expectedMenuHeight = 120;
        $menu.closest('.header-wrap').removeClass('overflow');
        if ($menu.height() > expectedMenuHeight) {
          $menu.closest('.header-wrap').addClass('overflow');
        }
        else {
          $menu.closest('.header-wrap').removeClass('overflow');
        }
      };
      onresize();
      $(window).once('obio-menu-resize').resize(onresize);
    }
  };

  // Display a custom modal for Obio.
  Drupal.behaviors.obioModal = {
    attach: function(context, settings) {
      if (settings.obio && settings.obio.modal) {
        var output =
          '<div id="obio-modal" data-reveal data-animation-in="fade-in" data-animation-out="fade-out" class="obio-modal-message reveal">' +
          '  <div>' +
          '    <i class="icon ion-ios-checkmark-outline fa-4x"></i>' +
          '    <h2>' + Drupal.t('Thank You') + '</h2>' +
          '    <p>' + Drupal.checkPlain(settings.obio.modal) + '</p>' +
          '    <button class="close-button" aria-label="Close reveal" type="button" data-close><span aria-hidden="true">&times;</span></button>' +
          '  </div>' +
          '</div>';
        $('html').append(output);
        $('#obio-modal').foundation().foundation('open');
        delete settings.obio.modal;
      }
    }
  };

  function joyrideDisplace () {
    setTimeout(function () {
      var $joyride = $('.joyride-tip-guide:visible');
      if ($joyride.length) {
        var position = $joyride.position();
        var left = position['left'];
        var width = $joyride.width();
        var combined_left = left + width;
        if (combined_left > document.body.clientWidth) {
          $joyride.css('left', left - (combined_left - document.body.clientWidth));
        }
        if (position['top'] < 79 && $('body.toolbar-tray-open').length) {
          $joyride.css('top', 79);
        }
        else if (position['top'] == 79 && !$('body.toolbar-tray-open').length && $('body.toolbar-fixed').length) {
          $joyride.css('top', 39);
        }
      }
      $joyride.find('.button').on('click', function () {
        joyrideDisplace();
      });
    }, 1);
  }

  $(document).on('drupalTourStarted', joyrideDisplace);
  $(window).on('resize', joyrideDisplace);
  $('#toolbar-bar').on('click', joyrideDisplace);

})(jQuery, Drupal);
;
/*! Tablesaw - v3.0.0-beta.3 - 2016-10-10
* https://github.com/filamentgroup/tablesaw
* Copyright (c) 2016 Filament Group; Licensed MIT */
/*! Shoestring - v1.0.5 - 2016-09-20
* http://github.com/filamentgroup/shoestring/
* Copyright (c) 2016 Scott Jehl, Filament Group, Inc; Licensed MIT & GPLv2 */ 
(function( factory ) {
	if( typeof define === 'function' && define.amd ) {
			// AMD. Register as an anonymous module.
			define( [ 'shoestring' ], factory );
	} else if (typeof module === 'object' && module.exports) {
		// Node/CommonJS
		module.exports = factory();
	} else {
		// Browser globals
		factory();
	}
}(function () {
	var win = typeof window !== "undefined" ? window : this;
	var doc = win.document;


	/**
	 * The shoestring object constructor.
	 *
	 * @param {string,object} prim The selector to find or element to wrap.
	 * @param {object} sec The context in which to match the `prim` selector.
	 * @returns shoestring
	 * @this window
	 */
	function shoestring( prim, sec ){
		var pType = typeof( prim ),
				ret = [],
				sel;

		// return an empty shoestring object
		if( !prim ){
			return new Shoestring( ret );
		}

		// ready calls
		if( prim.call ){
			return shoestring.ready( prim );
		}

		// handle re-wrapping shoestring objects
		if( prim.constructor === Shoestring && !sec ){
			return prim;
		}

		// if string starting with <, make html
		if( pType === "string" && prim.indexOf( "<" ) === 0 ){
			var dfrag = doc.createElement( "div" );

			dfrag.innerHTML = prim;

			// TODO depends on children (circular)
			return shoestring( dfrag ).children().each(function(){
				dfrag.removeChild( this );
			});
		}

		// if string, it's a selector, use qsa
		if( pType === "string" ){
			if( sec ){
				return shoestring( sec ).find( prim );
			}

				sel = doc.querySelectorAll( prim );

			return new Shoestring( sel, prim );
		}

		// array like objects or node lists
		if( Object.prototype.toString.call( pType ) === '[object Array]' ||
				(win.NodeList && prim instanceof win.NodeList) ){

			return new Shoestring( prim, prim );
		}

		// if it's an array, use all the elements
		if( prim.constructor === Array ){
			return new Shoestring( prim, prim );
		}

		// otherwise assume it's an object the we want at an index
		return new Shoestring( [prim], prim );
	}

	var Shoestring = function( ret, prim ) {
		this.length = 0;
		this.selector = prim;
		shoestring.merge(this, ret);
	};

	// TODO only required for tests
	Shoestring.prototype.reverse = [].reverse;

	// For adding element set methods
	shoestring.fn = Shoestring.prototype;

	shoestring.Shoestring = Shoestring;

	// For extending objects
	// TODO move to separate module when we use prototypes
	shoestring.extend = function( first, second ){
		for( var i in second ){
			if( second.hasOwnProperty( i ) ){
				first[ i ] = second[ i ];
			}
		}

		return first;
	};

	// taken directly from jQuery
	shoestring.merge = function( first, second ) {
		var len, j, i;

		len = +second.length,
		j = 0,
		i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	};

	// expose
	win.shoestring = shoestring;



	/**
	 * Iterates over `shoestring` collections.
	 *
	 * @param {function} callback The callback to be invoked on each element and index
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.each = function( callback ){
		return shoestring.each( this, callback );
	};

	shoestring.each = function( collection, callback ) {
		var val;
		for( var i = 0, il = collection.length; i < il; i++ ){
			val = callback.call( collection[i], i, collection[i] );
			if( val === false ){
				break;
			}
		}

		return collection;
	};



  /**
	 * Check for array membership.
	 *
	 * @param {object} needle The thing to find.
	 * @param {object} haystack The thing to find the needle in.
	 * @return {boolean}
	 * @this window
	 */
	shoestring.inArray = function( needle, haystack ){
		var isin = -1;
		for( var i = 0, il = haystack.length; i < il; i++ ){
			if( haystack.hasOwnProperty( i ) && haystack[ i ] === needle ){
				isin = i;
			}
		}
		return isin;
	};



  /**
	 * Bind callbacks to be run when the DOM is "ready".
	 *
	 * @param {function} fn The callback to be run
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.ready = function( fn ){
		if( ready && fn ){
			fn.call( doc );
		}
		else if( fn ){
			readyQueue.push( fn );
		}
		else {
			runReady();
		}

		return [doc];
	};

	// TODO necessary?
	shoestring.fn.ready = function( fn ){
		shoestring.ready( fn );
		return this;
	};

	// Empty and exec the ready queue
	var ready = false,
		readyQueue = [],
		runReady = function(){
			if( !ready ){
				while( readyQueue.length ){
					readyQueue.shift().call( doc );
				}
				ready = true;
			}
		};

	// Quick IE8 shiv
	if( !win.addEventListener ){
		win.addEventListener = function( evt, cb ){
			return win.attachEvent( "on" + evt, cb );
		};
	}

	// If DOM is already ready at exec time, depends on the browser.
	// From: https://github.com/mobify/mobifyjs/blob/526841be5509e28fc949038021799e4223479f8d/src/capture.js#L128
	if (doc.attachEvent ? doc.readyState === "complete" : doc.readyState !== "loading") {
		runReady();
	}	else {
		if( !doc.addEventListener ){
			doc.attachEvent( "DOMContentLoaded", runReady );
			doc.attachEvent( "onreadystatechange", runReady );
		} else {
			doc.addEventListener( "DOMContentLoaded", runReady, false );
			doc.addEventListener( "readystatechange", runReady, false );
		}
		win.addEventListener( "load", runReady, false );
	}



  /**
	 * Checks the current set of elements against the selector, if one matches return `true`.
	 *
	 * @param {string} selector The selector to check.
	 * @return {boolean}
	 * @this {shoestring}
	 */
	shoestring.fn.is = function( selector ){
		var ret = false, self = this, parents, check;

		// assume a dom element
		if( typeof selector !== "string" ){
			// array-like, ie shoestring objects or element arrays
			if( selector.length && selector[0] ){
				check = selector;
			} else {
				check = [selector];
			}

			return _checkElements(this, check);
		}

		parents = this.parent();

		if( !parents.length ){
			parents = shoestring( doc );
		}

		parents.each(function( i, e ) {
			var children;

					children = e.querySelectorAll( selector );

			ret = _checkElements( self, children );
		});

		return ret;
	};

	function _checkElements(needles, haystack){
		var ret = false;

		needles.each(function() {
			var j = 0;

			while( j < haystack.length ){
				if( this === haystack[j] ){
					ret = true;
				}

				j++;
			}
		});

		return ret;
	}



	/**
	 * Get data attached to the first element or set data values on all elements in the current set.
	 *
	 * @param {string} name The data attribute name.
	 * @param {any} value The value assigned to the data attribute.
	 * @return {any|shoestring}
	 * @this shoestring
	 */
	shoestring.fn.data = function( name, value ){
		if( name !== undefined ){
			if( value !== undefined ){
				return this.each(function(){
					if( !this.shoestringData ){
						this.shoestringData = {};
					}

					this.shoestringData[ name ] = value;
				});
			}
			else {
				if( this[ 0 ] ) {
					if( this[ 0 ].shoestringData ) {
						return this[ 0 ].shoestringData[ name ];
					}
				}
			}
		}
		else {
			return this[ 0 ] ? this[ 0 ].shoestringData || {} : undefined;
		}
	};


	/**
	 * Remove data associated with `name` or all the data, for each element in the current set.
	 *
	 * @param {string} name The data attribute name.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.removeData = function( name ){
		return this.each(function(){
			if( name !== undefined && this.shoestringData ){
				this.shoestringData[ name ] = undefined;
				delete this.shoestringData[ name ];
			}	else {
				this[ 0 ].shoestringData = {};
			}
		});
	};



	/**
	 * An alias for the `shoestring` constructor.
	 */
	win.$ = shoestring;



	/**
	 * Add a class to each DOM element in the set of elements.
	 *
	 * @param {string} className The name of the class to be added.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.addClass = function( className ){
		var classes = className.replace(/^\s+|\s+$/g, '').split( " " );

		return this.each(function(){
			for( var i = 0, il = classes.length; i < il; i++ ){
				if( this.className !== undefined &&
						(this.className === "" ||
						!this.className.match( new RegExp( "(^|\\s)" + classes[ i ] + "($|\\s)"))) ){
					this.className += " " + classes[ i ];
				}
			}
		});
	};



  /**
	 * Add elements matching the selector to the current set.
	 *
	 * @param {string} selector The selector for the elements to add from the DOM
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.add = function( selector ){
		var ret = [];
		this.each(function(){
			ret.push( this );
		});

		shoestring( selector ).each(function(){
			ret.push( this );
		});

		return shoestring( ret );
	};



	/**
	 * Insert an element or HTML string as the last child of each element in the set.
	 *
	 * @param {string|HTMLElement} fragment The HTML or HTMLElement to insert.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.append = function( fragment ){
		if( typeof( fragment ) === "string" || fragment.nodeType !== undefined ){
			fragment = shoestring( fragment );
		}

		return this.each(function( i ){
			for( var j = 0, jl = fragment.length; j < jl; j++ ){
				this.appendChild( i > 0 ? fragment[ j ].cloneNode( true ) : fragment[ j ] );
			}
		});
	};



	/**
	 * Insert the current set as the last child of the elements matching the selector.
	 *
	 * @param {string} selector The selector after which to append the current set.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.appendTo = function( selector ){
		return this.each(function(){
			shoestring( selector ).append( this );
		});
	};



  /**
	 * Get the value of the first element of the set or set the value of all the elements in the set.
	 *
	 * @param {string} name The attribute name.
	 * @param {string} value The new value for the attribute.
	 * @return {shoestring|string|undefined}
	 * @this {shoestring}
	 */
	shoestring.fn.attr = function( name, value ){
		var nameStr = typeof( name ) === "string";

		if( value !== undefined || !nameStr ){
			return this.each(function(){
				if( nameStr ){
					this.setAttribute( name, value );
				}	else {
					for( var i in name ){
						if( name.hasOwnProperty( i ) ){
							this.setAttribute( i, name[ i ] );
						}
					}
				}
			});
		} else {
			return this[ 0 ] ? this[ 0 ].getAttribute( name ) : undefined;
		}
	};



	/**
	 * Insert an element or HTML string before each element in the current set.
	 *
	 * @param {string|HTMLElement} fragment The HTML or HTMLElement to insert.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.before = function( fragment ){
		if( typeof( fragment ) === "string" || fragment.nodeType !== undefined ){
			fragment = shoestring( fragment );
		}

		return this.each(function( i ){
			for( var j = 0, jl = fragment.length; j < jl; j++ ){
				this.parentNode.insertBefore( i > 0 ? fragment[ j ].cloneNode( true ) : fragment[ j ], this );
			}
		});
	};



	/**
	 * Get the children of the current collection.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.children = function(){
				var ret = [],
			childs,
			j;
		this.each(function(){
			childs = this.children;
			j = -1;

			while( j++ < childs.length-1 ){
				if( shoestring.inArray(  childs[ j ], ret ) === -1 ){
					ret.push( childs[ j ] );
				}
			}
		});
		return shoestring(ret);
	};



	/**
	 * Find an element matching the selector in the set of the current element and its parents.
	 *
	 * @param {string} selector The selector used to identify the target element.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.closest = function( selector ){
		var ret = [];

		if( !selector ){
			return shoestring( ret );
		}

		this.each(function(){
			var element, $self = shoestring( element = this );

			if( $self.is(selector) ){
				ret.push( this );
				return;
			}

			while( element.parentElement ) {
				if( shoestring(element.parentElement).is(selector) ){
					ret.push( element.parentElement );
					break;
				}

				element = element.parentElement;
			}
		});

		return shoestring( ret );
	};



  shoestring.cssExceptions = {
		'float': [ 'cssFloat', 'styleFloat' ] // styleFloat is IE8
	};



	/**
	 * A polyfill to support computed styles in IE < 9
	 *
	 * NOTE this is taken directly from https://github.com/jonathantneal/polyfill
	 */
	(function () {
		function getComputedStylePixel(element, property, fontSize) {
			element.document; // Internet Explorer sometimes struggles to read currentStyle until the element's document is accessed.

			var
			value = element.currentStyle[property].match(/([\d\.]+)(%|cm|em|in|mm|pc|pt|)/) || [0, 0, ''],
			size = value[1],
			suffix = value[2],
			rootSize;

			fontSize = !fontSize ? fontSize : /%|em/.test(suffix) && element.parentElement ? getComputedStylePixel(element.parentElement, 'fontSize', null) : 16;
			rootSize = property === 'fontSize' ? fontSize : /width/i.test(property) ? element.clientWidth : element.clientHeight;

			return suffix === '%' ? size / 100 * rootSize :
				suffix === 'cm' ? size * 0.3937 * 96 :
				suffix === 'em' ? size * fontSize :
				suffix === 'in' ? size * 96 :
				suffix === 'mm' ? size * 0.3937 * 96 / 10 :
				suffix === 'pc' ? size * 12 * 96 / 72 :
				suffix === 'pt' ? size * 96 / 72 :
				size;
		}

		function setShortStyleProperty(style, property) {
			var
			borderSuffix = property === 'border' ? 'Width' : '',
			t = property + 'Top' + borderSuffix,
			r = property + 'Right' + borderSuffix,
			b = property + 'Bottom' + borderSuffix,
			l = property + 'Left' + borderSuffix;

			style[property] = (style[t] === style[r] && style[t] === style[b] && style[t] === style[l] ? [ style[t] ] :
												 style[t] === style[b] && style[l] === style[r] ? [ style[t], style[r] ] :
												 style[l] === style[r] ? [ style[t], style[r], style[b] ] :
												 [ style[t], style[r], style[b], style[l] ]).join(' ');
		}

		// <CSSStyleDeclaration>
		function CSSStyleDeclaration(element) {
			var
			style = this,
			currentStyle = element.currentStyle,
			fontSize = getComputedStylePixel(element, 'fontSize'),
			unCamelCase = function (match) {
				return '-' + match.toLowerCase();
			},
			property;

			for (property in currentStyle) {
				Array.prototype.push.call(style, property === 'styleFloat' ? 'float' : property.replace(/[A-Z]/, unCamelCase));

				if (property === 'width') {
					style[property] = element.offsetWidth + 'px';
				} else if (property === 'height') {
					style[property] = element.offsetHeight + 'px';
				} else if (property === 'styleFloat') {
					style.float = currentStyle[property];
				} else if (/margin.|padding.|border.+W/.test(property) && style[property] !== 'auto') {
					style[property] = Math.round(getComputedStylePixel(element, property, fontSize)) + 'px';
				} else if (/^outline/.test(property)) {
					// errors on checking outline
					try {
						style[property] = currentStyle[property];
					} catch (error) {
						style.outlineColor = currentStyle.color;
						style.outlineStyle = style.outlineStyle || 'none';
						style.outlineWidth = style.outlineWidth || '0px';
						style.outline = [style.outlineColor, style.outlineWidth, style.outlineStyle].join(' ');
					}
				} else {
					style[property] = currentStyle[property];
				}
			}

			setShortStyleProperty(style, 'margin');
			setShortStyleProperty(style, 'padding');
			setShortStyleProperty(style, 'border');

			style.fontSize = Math.round(fontSize) + 'px';
		}

		CSSStyleDeclaration.prototype = {
			constructor: CSSStyleDeclaration,
			// <CSSStyleDeclaration>.getPropertyPriority
			getPropertyPriority: function () {
				throw new Error('NotSupportedError: DOM Exception 9');
			},
			// <CSSStyleDeclaration>.getPropertyValue
			getPropertyValue: function (property) {
				return this[property.replace(/-\w/g, function (match) {
					return match[1].toUpperCase();
				})];
			},
			// <CSSStyleDeclaration>.item
			item: function (index) {
				return this[index];
			},
			// <CSSStyleDeclaration>.removeProperty
			removeProperty: function () {
				throw new Error('NoModificationAllowedError: DOM Exception 7');
			},
			// <CSSStyleDeclaration>.setProperty
			setProperty: function () {
				throw new Error('NoModificationAllowedError: DOM Exception 7');
			},
			// <CSSStyleDeclaration>.getPropertyCSSValue
			getPropertyCSSValue: function () {
				throw new Error('NotSupportedError: DOM Exception 9');
			}
		};

		if( !win.getComputedStyle ) {
			// <win>.getComputedStyle
			// NOTE win is not defined in all browsers
			win.getComputedStyle = function (element) {
				return new CSSStyleDeclaration(element);
			};

			if ( win.Window ) {
				win.Window.prototype.getComputedStyle = win.getComputedStyle;
			}
		}
	})();



	(function() {
		var cssExceptions = shoestring.cssExceptions;

		// IE8 uses marginRight instead of margin-right
		function convertPropertyName( str ) {
			return str.replace( /\-([A-Za-z])/g, function ( match, character ) {
				return character.toUpperCase();
			});
		}

		function _getStyle( element, property ) {
			// polyfilled in getComputedStyle module
			return win.getComputedStyle( element, null ).getPropertyValue( property );
		}

		var vendorPrefixes = [ '', '-webkit-', '-ms-', '-moz-', '-o-', '-khtml-' ];

		/**
		 * Private function for getting the computed style of an element.
		 *
		 * **NOTE** Please use the [css](../css.js.html) method instead.
		 *
		 * @method _getStyle
		 * @param {HTMLElement} element The element we want the style property for.
		 * @param {string} property The css property we want the style for.
		 */
		shoestring._getStyle = function( element, property ) {
			var convert, value, j, k;

			if( cssExceptions[ property ] ) {
				for( j = 0, k = cssExceptions[ property ].length; j < k; j++ ) {
					value = _getStyle( element, cssExceptions[ property ][ j ] );

					if( value ) {
						return value;
					}
				}
			}

			for( j = 0, k = vendorPrefixes.length; j < k; j++ ) {
				convert = convertPropertyName( vendorPrefixes[ j ] + property );

				// VendorprefixKeyName || key-name
				value = _getStyle( element, convert );

				if( convert !== property ) {
					value = value || _getStyle( element, property );
				}

				if( vendorPrefixes[ j ] ) {
					// -vendorprefix-key-name
					value = value || _getStyle( element, vendorPrefixes[ j ] + property );
				}

				if( value ) {
					return value;
				}
			}

			return undefined;
		};
	})();



	(function() {
		var cssExceptions = shoestring.cssExceptions;

		// IE8 uses marginRight instead of margin-right
		function convertPropertyName( str ) {
			return str.replace( /\-([A-Za-z])/g, function ( match, character ) {
				return character.toUpperCase();
			});
		}

		/**
		 * Private function for setting the style of an element.
		 *
		 * **NOTE** Please use the [css](../css.js.html) method instead.
		 *
		 * @method _setStyle
		 * @param {HTMLElement} element The element we want to style.
		 * @param {string} property The property being used to style the element.
		 * @param {string} value The css value for the style property.
		 */
		shoestring._setStyle = function( element, property, value ) {
			var convertedProperty = convertPropertyName(property);

			element.style[ property ] = value;

			if( convertedProperty !== property ) {
				element.style[ convertedProperty ] = value;
			}

			if( cssExceptions[ property ] ) {
				for( var j = 0, k = cssExceptions[ property ].length; j<k; j++ ) {
					element.style[ cssExceptions[ property ][ j ] ] = value;
				}
			}
		};
	})();



	/**
	 * Get the compute style property of the first element or set the value of a style property
	 * on all elements in the set.
	 *
	 * @method _setStyle
	 * @param {string} property The property being used to style the element.
	 * @param {string|undefined} value The css value for the style property.
	 * @return {string|shoestring}
	 * @this shoestring
	 */
	shoestring.fn.css = function( property, value ){
		if( !this[0] ){
			return;
		}

		if( typeof property === "object" ) {
			return this.each(function() {
				for( var key in property ) {
					if( property.hasOwnProperty( key ) ) {
						shoestring._setStyle( this, key, property[key] );
					}
				}
			});
		}	else {
			// assignment else retrieve first
			if( value !== undefined ){
				return this.each(function(){
					shoestring._setStyle( this, property, value );
				});
			}

			return shoestring._getStyle( this[0], property );
		}
	};



	/**
	 * Returns the indexed element wrapped in a new `shoestring` object.
	 *
	 * @param {integer} index The index of the element to wrap and return.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.eq = function( index ){
		if( this[index] ){
			return shoestring( this[index] );
		}

		return shoestring([]);
	};



	/**
	 * Filter out the current set if they do *not* match the passed selector or
	 * the supplied callback returns false
	 *
	 * @param {string,function} selector The selector or boolean return value callback used to filter the elements.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.filter = function( selector ){
		var ret = [];

		this.each(function( index ){
			var wsel;

			if( typeof selector === 'function' ) {
				if( selector.call( this, index ) !== false ) {
					ret.push( this );
				}
			} else {
				if( !this.parentNode ){
					var context = shoestring( doc.createDocumentFragment() );

					context[ 0 ].appendChild( this );
					wsel = shoestring( selector, context );
				} else {
					wsel = shoestring( selector, this.parentNode );
				}

				if( shoestring.inArray( this, wsel ) > -1 ){
					ret.push( this );
				}
			}
		});

		return shoestring( ret );
	};



	/**
	 * Find descendant elements of the current collection.
	 *
	 * @param {string} selector The selector used to find the children
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.find = function( selector ){
		var ret = [],
			finds;
		this.each(function(){
				finds = this.querySelectorAll( selector );

			for( var i = 0, il = finds.length; i < il; i++ ){
				ret = ret.concat( finds[i] );
			}
		});
		return shoestring( ret );
	};



	/**
	 * Returns the first element of the set wrapped in a new `shoestring` object.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.first = function(){
		return this.eq( 0 );
	};



	/**
	 * Returns the raw DOM node at the passed index.
	 *
	 * @param {integer} index The index of the element to wrap and return.
	 * @return {HTMLElement|undefined|array}
	 * @this shoestring
	 */
	shoestring.fn.get = function( index ){

		// return an array of elements if index is undefined
		if( index === undefined ){
			var elements = [];

			for( var i = 0; i < this.length; i++ ){
				elements.push( this[ i ] );
			}

			return elements;
		} else {
			return this[ index ];
		}
	};



	var set = function( html ){
		if( typeof html === "string" || typeof html === "number" ){
			return this.each(function(){
				this.innerHTML = "" + html;
			});
		} else {
			var h = "";
			if( typeof html.length !== "undefined" ){
				for( var i = 0, l = html.length; i < l; i++ ){
					h += html[i].outerHTML;
				}
			} else {
				h = html.outerHTML;
			}
			return this.each(function(){
				this.innerHTML = h;
			});
		}
	};
	/**
	 * Gets or sets the `innerHTML` from all the elements in the set.
	 *
	 * @param {string|undefined} html The html to assign
	 * @return {string|shoestring}
	 * @this shoestring
	 */
	shoestring.fn.html = function( html ){
				if( typeof html !== "undefined" ){
			return set.call( this, html );
		} else { // get
			var pile = "";

			this.each(function(){
				pile += this.innerHTML;
			});

			return pile;
		}
	};



	(function() {
		function _getIndex( set, test ) {
			var i, result, element;

			for( i = result = 0; i < set.length; i++ ) {
				element = set.item ? set.item(i) : set[i];

				if( test(element) ){
					return result;
				}

				// ignore text nodes, etc
				// NOTE may need to be more permissive
				if( element.nodeType === 1 ){
					result++;
				}
			}

			return -1;
		}

		/**
		 * Find the index in the current set for the passed selector.
		 * Without a selector it returns the index of the first node within the array of its siblings.
		 *
		 * @param {string|undefined} selector The selector used to search for the index.
		 * @return {integer}
		 * @this {shoestring}
		 */
		shoestring.fn.index = function( selector ){
			var self, children;

			self = this;

			// no arg? check the children, otherwise check each element that matches
			if( selector === undefined ){
				children = ( ( this[ 0 ] && this[0].parentNode ) || doc.documentElement).childNodes;

				// check if the element matches the first of the set
				return _getIndex(children, function( element ) {
					return self[0] === element;
				});
			} else {

				// check if the element matches the first selected node from the parent
				return _getIndex(self, function( element ) {
					return element === (shoestring( selector, element.parentNode )[ 0 ]);
				});
			}
		};
	})();



	/**
	 * Insert the current set before the elements matching the selector.
	 *
	 * @param {string} selector The selector before which to insert the current set.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.insertBefore = function( selector ){
		return this.each(function(){
			shoestring( selector ).before( this );
		});
	};



	/**
	 * Returns the last element of the set wrapped in a new `shoestring` object.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.last = function(){
		return this.eq( this.length - 1 );
	};



	/**
	 * Returns a `shoestring` object with the set of siblings of each element in the original set.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.next = function(){
		
		var result = [];

		// TODO need to implement map
		this.each(function() {
			var children, item, found;

			// get the child nodes for this member of the set
			children = shoestring( this.parentNode )[0].childNodes;

			for( var i = 0; i < children.length; i++ ){
				item = children.item( i );

				// found the item we needed (found) which means current item value is
				// the next node in the list, as long as it's viable grab it
				// NOTE may need to be more permissive
				if( found && item.nodeType === 1 ){
					result.push( item );
					break;
				}

				// find the current item and mark it as found
				if( item === this ){
					found = true;
				}
			}
		});

		return shoestring( result );
	};



	/**
	 * Removes elements from the current set.
	 *
	 * @param {string} selector The selector to use when removing the elements.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.not = function( selector ){
		var ret = [];

		this.each(function(){
			var found = shoestring( selector, this.parentNode );

			if( shoestring.inArray(this, found) === -1 ){
				ret.push( this );
			}
		});

		return shoestring( ret );
	};



	/**
	 * Returns the set of first parents for each element in the current set.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.parent = function(){
		var ret = [],
			parent;

		this.each(function(){
			// no parent node, assume top level
			// jQuery parent: return the document object for <html> or the parent node if it exists
			parent = (this === doc.documentElement ? doc : this.parentNode);

			// if there is a parent and it's not a document fragment
			if( parent && parent.nodeType !== 11 ){
				ret.push( parent );
			}
		});

		return shoestring(ret);
	};



	/**
	 * Add an HTML string or element before the children of each element in the current set.
	 *
	 * @param {string|HTMLElement} fragment The HTML string or element to add.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.prepend = function( fragment ){
		if( typeof( fragment ) === "string" || fragment.nodeType !== undefined ){
			fragment = shoestring( fragment );
		}

		return this.each(function( i ){

			for( var j = 0, jl = fragment.length; j < jl; j++ ){
				var insertEl = i > 0 ? fragment[ j ].cloneNode( true ) : fragment[ j ];
				if ( this.firstChild ){
					this.insertBefore( insertEl, this.firstChild );
				} else {
					this.appendChild( insertEl );
				}
			}
		});
	};



	/**
	 * Returns a `shoestring` object with the set of *one* siblingx before each element in the original set.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.prev = function(){
		
		var result = [];

		// TODO need to implement map
		this.each(function() {
			var children, item, found;

			// get the child nodes for this member of the set
			children = shoestring( this.parentNode )[0].childNodes;

			for( var i = children.length -1; i >= 0; i-- ){
				item = children.item( i );

				// found the item we needed (found) which means current item value is
				// the next node in the list, as long as it's viable grab it
				// NOTE may need to be more permissive
				if( found && item.nodeType === 1 ){
					result.push( item );
					break;
				}

				// find the current item and mark it as found
				if( item === this ){
					found = true;
				}
			}
		});

		return shoestring( result );
	};



	/**
	 * Returns a `shoestring` object with the set of *all* siblings before each element in the original set.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.prevAll = function(){
		
		var result = [];

		this.each(function() {
			var $previous = shoestring( this ).prev();

			while( $previous.length ){
				result.push( $previous[0] );
				$previous = $previous.prev();
			}
		});

		return shoestring( result );
	};



	/**
	 * Remove an attribute from each element in the current set.
	 *
	 * @param {string} name The name of the attribute.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.removeAttr = function( name ){
		return this.each(function(){
			this.removeAttribute( name );
		});
	};



	/**
	 * Remove a class from each DOM element in the set of elements.
	 *
	 * @param {string} className The name of the class to be removed.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.removeClass = function( cname ){
		var classes = cname.replace(/^\s+|\s+$/g, '').split( " " );

		return this.each(function(){
			var newClassName, regex;

			for( var i = 0, il = classes.length; i < il; i++ ){
				if( this.className !== undefined ){
					regex = new RegExp( "(^|\\s)" + classes[ i ] + "($|\\s)", "gmi" );
					newClassName = this.className.replace( regex, " " );

					this.className = newClassName.replace(/^\s+|\s+$/g, '');
				}
			}
		});
	};



	/**
	 * Remove the current set of elements from the DOM.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.remove = function(){
		return this.each(function(){
			if( this.parentNode ) {
				this.parentNode.removeChild( this );
			}
		});
	};



	/**
	 * Replace each element in the current set with that argument HTML string or HTMLElement.
	 *
	 * @param {string|HTMLElement} fragment The value to assign.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.replaceWith = function( fragment ){
		if( typeof( fragment ) === "string" ){
			fragment = shoestring( fragment );
		}

		var ret = [];

		if( fragment.length > 1 ){
			fragment = fragment.reverse();
		}
		this.each(function( i ){
			var clone = this.cloneNode( true ),
				insertEl;
			ret.push( clone );

			// If there is no parentNode, this is pointless, drop it.
			if( !this.parentNode ){ return; }

			if( fragment.length === 1 ){
				insertEl = i > 0 ? fragment[ 0 ].cloneNode( true ) : fragment[ 0 ];
				this.parentNode.replaceChild( insertEl, this );
			} else {
				for( var j = 0, jl = fragment.length; j < jl; j++ ){
					insertEl = i > 0 ? fragment[ j ].cloneNode( true ) : fragment[ j ];
					this.parentNode.insertBefore( insertEl, this.nextSibling );
				}
				this.parentNode.removeChild( this );
			}
		});

		return shoestring( ret );
	};



  /**
	 * Get all of the sibling elements for each element in the current set.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.siblings = function(){
		
		if( !this.length ) {
			return shoestring( [] );
		}

		var sibs = [], el = this[ 0 ].parentNode.firstChild;

		do {
			if( el.nodeType === 1 && el !== this[ 0 ] ) {
				sibs.push( el );
			}

      el = el.nextSibling;
		} while( el );

		return shoestring( sibs );
	};



	var getText = function( elem ){
		var node,
			ret = "",
			i = 0,
			nodeType = elem.nodeType;

		if ( !nodeType ) {
			// If no nodeType, this is expected to be an array
			while ( (node = elem[i++]) ) {
				// Do not traverse comment nodes
				ret += getText( node );
			}
		} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent for elements
			// innerText usage removed for consistency of new lines (jQuery #11153)
			if ( typeof elem.textContent === "string" ) {
				return elem.textContent;
			} else {
				// Traverse its children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
		// Do not include comment or processing instruction nodes

		return ret;
	};

  /**
	 * Recursively retrieve the text content of the each element in the current set.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.text = function() {
		
		return getText( this );
	};




	/**
	 * Get the value of the first element or set the value of all elements in the current set.
	 *
	 * @param {string} value The value to set.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.val = function( value ){
		var el;
		if( value !== undefined ){
			return this.each(function(){
				if( this.tagName === "SELECT" ){
					var optionSet, option,
						options = this.options,
						values = [],
						i = options.length,
						newIndex;

					values[0] = value;
					while ( i-- ) {
						option = options[ i ];
						if ( (option.selected = shoestring.inArray( option.value, values ) >= 0) ) {
							optionSet = true;
							newIndex = i;
						}
					}
					// force browsers to behave consistently when non-matching value is set
					if ( !optionSet ) {
						this.selectedIndex = -1;
					} else {
						this.selectedIndex = newIndex;
					}
				} else {
					this.value = value;
				}
			});
		} else {
			el = this[0];

			if( el.tagName === "SELECT" ){
				if( el.selectedIndex < 0 ){ return ""; }
				return el.options[ el.selectedIndex ].value;
			} else {
				return el.value;
			}
		}
	};



	/**
	 * Private function for setting/getting the offset property for height/width.
	 *
	 * **NOTE** Please use the [width](width.js.html) or [height](height.js.html) methods instead.
	 *
	 * @param {shoestring} set The set of elements.
	 * @param {string} name The string "height" or "width".
	 * @param {float|undefined} value The value to assign.
	 * @return shoestring
	 * @this window
	 */
	shoestring._dimension = function( set, name, value ){
		var offsetName;

		if( value === undefined ){
			offsetName = name.replace(/^[a-z]/, function( letter ) {
				return letter.toUpperCase();
			});

			return set[ 0 ][ "offset" + offsetName ];
		} else {
			// support integer values as pixels
			value = typeof value === "string" ? value : value + "px";

			return set.each(function(){
				this.style[ name ] = value;
			});
		}
	};



	/**
	 * Gets the width value of the first element or sets the width for the whole set.
	 *
	 * @param {float|undefined} value The value to assign.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.width = function( value ){
		return shoestring._dimension( this, "width", value );
	};



	/**
	 * Wraps the child elements in the provided HTML.
	 *
	 * @param {string} html The wrapping HTML.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.wrapInner = function( html ){
		return this.each(function(){
			var inH = this.innerHTML;

			this.innerHTML = "";
			shoestring( this ).append( shoestring( html ).html( inH ) );
		});
	};



	function initEventCache( el, evt ) {
		if ( !el.shoestringData ) {
			el.shoestringData = {};
		}
		if ( !el.shoestringData.events ) {
			el.shoestringData.events = {};
		}
		if ( !el.shoestringData.loop ) {
			el.shoestringData.loop = {};
		}
		if ( !el.shoestringData.events[ evt ] ) {
			el.shoestringData.events[ evt ] = [];
		}
	}

	function addToEventCache( el, evt, eventInfo ) {
		var obj = {};
		obj.isCustomEvent = eventInfo.isCustomEvent;
		obj.callback = eventInfo.callfunc;
		obj.originalCallback = eventInfo.originalCallback;
		obj.namespace = eventInfo.namespace;

		el.shoestringData.events[ evt ].push( obj );

		if( eventInfo.customEventLoop ) {
			el.shoestringData.loop[ evt ] = eventInfo.customEventLoop;
		}
	}

	// In IE8 the events trigger in a reverse order (LIFO). This code
	// unbinds and rebinds all callbacks on an element in the a FIFO order.
	function reorderEvents( node, eventName ) {
		if( node.addEventListener || !node.shoestringData || !node.shoestringData.events ) {
			// add event listner obviates the need for all the callback order juggling
			return;
		}

		var otherEvents = node.shoestringData.events[ eventName ] || [];
		for( var j = otherEvents.length - 1; j >= 0; j-- ) {
			// DOM Events only, Custom events maintain their own order internally.
			if( !otherEvents[ j ].isCustomEvent ) {
				node.detachEvent( "on" + eventName, otherEvents[ j ].callback );
				node.attachEvent( "on" + eventName, otherEvents[ j ].callback );
			}
		}
	}

	/**
	 * Bind a callback to an event for the currrent set of elements.
	 *
	 * @param {string} evt The event(s) to watch for.
	 * @param {object,function} data Data to be included with each event or the callback.
	 * @param {function} originalCallback Callback to be invoked when data is define.d.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.bind = function( evt, data, originalCallback ){

				if( typeof data === "function" ){
			originalCallback = data;
			data = null;
		}

		var evts = evt.split( " " ),
			docEl = doc.documentElement;

		// NOTE the `triggeredElement` is purely for custom events from IE
		function encasedCallback( e, namespace, triggeredElement ){
			var result;

			if( e._namespace && e._namespace !== namespace ) {
				return;
			}

			e.data = data;
			e.namespace = e._namespace;

			var returnTrue = function(){
				return true;
			};

			e.isDefaultPrevented = function(){
				return false;
			};

			var originalPreventDefault = e.preventDefault;
			var preventDefaultConstructor = function(){
				if( originalPreventDefault ) {
					return function(){
						e.isDefaultPrevented = returnTrue;
						originalPreventDefault.call(e);
					};
				} else {
					return function(){
						e.isDefaultPrevented = returnTrue;
						e.returnValue = false;
					};
				}
			};

			// thanks https://github.com/jonathantneal/EventListener
			e.target = triggeredElement || e.target || e.srcElement;
			e.preventDefault = preventDefaultConstructor();
			e.stopPropagation = e.stopPropagation || function () {
				e.cancelBubble = true;
			};

			result = originalCallback.apply(this, [ e ].concat( e._args ) );

			if( result === false ){
				e.preventDefault();
				e.stopPropagation();
			}

			return result;
		}

		// This is exclusively for custom events on browsers without addEventListener (IE8)
		function propChange( originalEvent, boundElement, namespace ) {
			var lastEventInfo = doc.documentElement[ originalEvent.propertyName ],
				triggeredElement = lastEventInfo.el;

			var boundCheckElement = boundElement;

			if( boundElement === doc && triggeredElement !== doc ) {
				boundCheckElement = doc.documentElement;
			}

			if( triggeredElement !== undefined &&
				shoestring( triggeredElement ).closest( boundCheckElement ).length ) {

				originalEvent._namespace = lastEventInfo._namespace;
				originalEvent._args = lastEventInfo._args;
				encasedCallback.call( boundElement, originalEvent, namespace, triggeredElement );
			}
		}

		return this.each(function(){
			var domEventCallback,
				customEventCallback,
				customEventLoop,
				oEl = this;

			for( var i = 0, il = evts.length; i < il; i++ ){
				var split = evts[ i ].split( "." ),
					evt = split[ 0 ],
					namespace = split.length > 0 ? split[ 1 ] : null;

				domEventCallback = function( originalEvent ) {
					if( oEl.ssEventTrigger ) {
						originalEvent._namespace = oEl.ssEventTrigger._namespace;
						originalEvent._args = oEl.ssEventTrigger._args;

						oEl.ssEventTrigger = null;
					}
					return encasedCallback.call( oEl, originalEvent, namespace );
				};
				customEventCallback = null;
				customEventLoop = null;

				initEventCache( this, evt );

				if( "addEventListener" in this ){
					this.addEventListener( evt, domEventCallback, false );
				} else if( this.attachEvent ){
					if( this[ "on" + evt ] !== undefined ) {
						this.attachEvent( "on" + evt, domEventCallback );
					} else {
						customEventCallback = (function() {
							var eventName = evt;
							return function( e ) {
								if( e.propertyName === eventName ) {
									propChange( e, oEl, namespace );
								}
							};
						})();

						// only assign one onpropertychange per element
						if( this.shoestringData.events[ evt ].length === 0 ) {
							customEventLoop = (function() {
								var eventName = evt;
								return function( e ) {
									if( !oEl.shoestringData || !oEl.shoestringData.events ) {
										return;
									}
									var events = oEl.shoestringData.events[ eventName ];
									if( !events ) {
										return;
									}

									// TODO stopImmediatePropagation
									for( var j = 0, k = events.length; j < k; j++ ) {
										events[ j ].callback( e );
									}
								};
							})();

							docEl.attachEvent( "onpropertychange", customEventLoop );
						}
					}
				}

				addToEventCache( this, evt, {
					callfunc: customEventCallback || domEventCallback,
					isCustomEvent: !!customEventCallback,
					customEventLoop: customEventLoop,
					originalCallback: originalCallback,
					namespace: namespace
				});

				// Don’t reorder custom events, only DOM Events.
				if( !customEventCallback ) {
					reorderEvents( oEl, evt );
				}
			}
		});
	};

	shoestring.fn.on = shoestring.fn.bind;

	


	/**
	 * Unbind a previous bound callback for an event.
	 *
	 * @param {string} event The event(s) the callback was bound to..
	 * @param {function} callback Callback to unbind.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.unbind = function( event, callback ){

		
		var evts = event ? event.split( " " ) : [];

		return this.each(function(){
			if( !this.shoestringData || !this.shoestringData.events ) {
				return;
			}

			if( !evts.length ) {
				unbindAll.call( this );
			} else {
				var split, evt, namespace;
				for( var i = 0, il = evts.length; i < il; i++ ){
					split = evts[ i ].split( "." ),
					evt = split[ 0 ],
					namespace = split.length > 0 ? split[ 1 ] : null;

					if( evt ) {
						unbind.call( this, evt, namespace, callback );
					} else {
						unbindAll.call( this, namespace, callback );
					}
				}
			}
		});
	};

	function unbind( evt, namespace, callback ) {
		var bound = this.shoestringData.events[ evt ];
		if( !(bound && bound.length) ) {
			return;
		}

		var matched = [], j, jl;
		for( j = 0, jl = bound.length; j < jl; j++ ) {
			if( !namespace || namespace === bound[ j ].namespace ) {
				if( callback === undefined || callback === bound[ j ].originalCallback ) {
					if( "removeEventListener" in win ){
						this.removeEventListener( evt, bound[ j ].callback, false );
					} else if( this.detachEvent ){
						// dom event
						this.detachEvent( "on" + evt, bound[ j ].callback );

						// only unbind custom events if its the last one on the element
						if( bound.length === 1 && this.shoestringData.loop && this.shoestringData.loop[ evt ] ) {
							doc.documentElement.detachEvent( "onpropertychange", this.shoestringData.loop[ evt ] );
						}
					}
					matched.push( j );
				}
			}
		}

		for( j = 0, jl = matched.length; j < jl; j++ ) {
			this.shoestringData.events[ evt ].splice( j, 1 );
		}
	}

	function unbindAll( namespace, callback ) {
		for( var evtKey in this.shoestringData.events ) {
			unbind.call( this, evtKey, namespace, callback );
		}
	}

	shoestring.fn.off = shoestring.fn.unbind;


	/**
	 * Bind a callback to an event for the currrent set of elements, unbind after one occurence.
	 *
	 * @param {string} event The event(s) to watch for.
	 * @param {function} callback Callback to invoke on the event.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.one = function( event, callback ){
		var evts = event.split( " " );

		return this.each(function(){
			var thisevt, cbs = {},	$t = shoestring( this );

			for( var i = 0, il = evts.length; i < il; i++ ){
				thisevt = evts[ i ];

				cbs[ thisevt ] = function( e ){
					var $t = shoestring( this );

					for( var j in cbs ) {
						$t.unbind( j, cbs[ j ] );
					}

					return callback.apply( this, [ e ].concat( e._args ) );
				};

				$t.bind( thisevt, cbs[ thisevt ] );
			}
		});
	};



	/**
	 * Trigger an event on the first element in the set, no bubbling, no defaults.
	 *
	 * @param {string} event The event(s) to trigger.
	 * @param {object} args Arguments to append to callback invocations.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.triggerHandler = function( event, args ){
		var e = event.split( " " )[ 0 ],
			el = this[ 0 ],
			ret;

		// TODO needs IE8 support
		// See this.fireEvent( 'on' + evts[ i ], document.createEventObject() ); instead of click() etc in trigger.
		if( doc.createEvent && el.shoestringData && el.shoestringData.events && el.shoestringData.events[ e ] ){
			var bindings = el.shoestringData.events[ e ];
			for (var i in bindings ){
				if( bindings.hasOwnProperty( i ) ){
					event = doc.createEvent( "Event" );
					event.initEvent( e, true, true );
					event._args = args;
					args.unshift( event );

					ret = bindings[ i ].originalCallback.apply( event.target, args );
				}
			}
		}

		return ret;
	};



	/**
	 * Trigger an event on each of the DOM elements in the current set.
	 *
	 * @param {string} event The event(s) to trigger.
	 * @param {object} args Arguments to append to callback invocations.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.trigger = function( event, args ){
		var evts = event.split( " " );

		return this.each(function(){
			var split, evt, namespace;
			for( var i = 0, il = evts.length; i < il; i++ ){
				split = evts[ i ].split( "." ),
				evt = split[ 0 ],
				namespace = split.length > 0 ? split[ 1 ] : null;

				if( evt === "click" ){
					if( this.tagName === "INPUT" && this.type === "checkbox" && this.click ){
						this.click();
						return false;
					}
				}

				if( doc.createEvent ){
					var event = doc.createEvent( "Event" );
					event.initEvent( evt, true, true );
					event._args = args;
					event._namespace = namespace;

					this.dispatchEvent( event );
				} else if ( doc.createEventObject ) {
					if( ( "" + this[ evt ] ).indexOf( "function" ) > -1 ) {
						this.ssEventTrigger = {
							_namespace: namespace,
							_args: args
						};

						this[ evt ]();
					} else {
						doc.documentElement[ evt ] = {
							"el": this,
							_namespace: namespace,
							_args: args
						};
					}
				}
			}
		});
	};



	return shoestring;
}));

// UMD module definition
// From: https://github.com/umdjs/umd/blob/master/templates/jqueryPlugin.js

(function (factory) {
	if (typeof define === 'function' && define.amd) {
			// AMD. Register as an anonymous module.
			define(['shoestring'], factory);
	} else if (typeof module === 'object' && module.exports) {
		// Node/CommonJS
		module.exports = function( root, shoestring ) {
			if ( shoestring === undefined ) {
				// require('shoestring') returns a factory that requires window to
				// build a shoestring instance, we normalize how we use modules
				// that require this pattern but the window provided is a noop
				// if it's defined (how jquery works)
				if ( typeof window !== 'undefined' ) {
					shoestring = require('shoestring');
				} else {
					shoestring = require('shoestring')(root);
				}
			}
			factory(shoestring);
			return shoestring;
		};
	} else {
		// Browser globals
		factory(shoestring);
	}
}(function ($) {
	var Tablesaw, win = typeof window !== "undefined" ? window : this;

/*
* tablesaw: A set of plugins for responsive tables
* Stack and Column Toggle tables
* Copyright (c) 2013 Filament Group, Inc.
* MIT License
*/

if( typeof Tablesaw === "undefined" ) {
	Tablesaw = {
		i18n: {
			modes: [ 'Stack', 'Swipe', 'Toggle' ],
			columns: 'Col<span class=\"a11y-sm\">umn</span>s',
			columnBtnText: 'Columns',
			columnsDialogError: 'No eligible columns.',
			sort: 'Sort'
		},
		// cut the mustard
		mustard: ( 'querySelector' in document ) &&
			( 'head' in document ) &&
			( !window.blackberry || window.WebKitPoint ) &&
			!window.operamini
	};
}
if( !Tablesaw.config ) {
	Tablesaw.config = {};
}
if( Tablesaw.mustard ) {
	$( document.documentElement ).addClass( 'tablesaw-enhanced' );
}

(function() {
	var pluginName = "tablesaw",
		classes = {
			toolbar: "tablesaw-bar"
		},
		events = {
			create: "tablesawcreate",
			destroy: "tablesawdestroy",
			refresh: "tablesawrefresh"
		},
		defaultMode = "stack",
		initSelector = "table[data-tablesaw-mode],table[data-tablesaw-sortable]";

	var Table = function( element ) {
		if( !element ) {
			throw new Error( "Tablesaw requires an element." );
		}

		this.table = element;
		this.$table = $( element );

		this.mode = this.$table.attr( "data-tablesaw-mode" ) || defaultMode;

		this.init();
	};

	Table.prototype.init = function() {
		// assign an id if there is none
		if ( !this.$table.attr( "id" ) ) {
			this.$table.attr( "id", pluginName + "-" + Math.round( Math.random() * 10000 ) );
		}

		this.createToolbar();

		var colstart = this._initCells();

		this.$table.trigger( events.create, [ this, colstart ] );
	};

	Table.prototype._initCells = function() {
		var colstart,
			thrs = this.table.querySelectorAll( "thead tr" ),
			self = this;

		$( thrs ).each( function(){
			var coltally = 0;

			var children = $( this ).children();
			var columnlookup = [];
			children.each( function(){
				var span = parseInt( this.getAttribute( "colspan" ), 10 );

				columnlookup[coltally] = this;
				colstart = coltally + 1;

				if( span ){
					for( var k = 0; k < span - 1; k++ ){
						coltally++;
						columnlookup[coltally] = this;
					}
				}
				this.cells = [];
				coltally++;
			});
			// Note that this assumes that children() returns its results in document order. jQuery doesn't
			// promise that in the docs, but it's a pretty safe assumption.
			self.$table.find("tr").not( thrs[0]).each( function() {
				var cellcoltally = 0;
				$(this).children().each(function () {
					var span = parseInt( this.getAttribute( "colspan" ), 10 );
					columnlookup[cellcoltally].cells.push(this);
					if (span) {
						cellcoltally += span;
					} else {
						cellcoltally++;
					}
				});
			});
		});

		return colstart;
	};

	Table.prototype.refresh = function() {
		this._initCells();

		this.$table.trigger( events.refresh );
	};

	Table.prototype.createToolbar = function() {
		// Insert the toolbar
		// TODO move this into a separate component
		var $toolbar = this.$table.prev().filter( '.' + classes.toolbar );
		if( !$toolbar.length ) {
			$toolbar = $( '<div>' )
				.addClass( classes.toolbar )
				.insertBefore( this.$table );
		}
		this.$toolbar = $toolbar;

		if( this.mode ) {
			this.$toolbar.addClass( 'tablesaw-mode-' + this.mode );
		}
	};

	Table.prototype.destroy = function() {
		// Don’t remove the toolbar. Some of the table features are not yet destroy-friendly.
		this.$table.prev().filter( '.' + classes.toolbar ).each(function() {
			this.className = this.className.replace( /\btablesaw-mode\-\w*\b/gi, '' );
		});

		var tableId = this.$table.attr( 'id' );
		$( document ).off( "." + tableId );
		$( window ).off( "." + tableId );

		// other plugins
		this.$table.trigger( events.destroy, [ this ] );

		this.$table.removeData( pluginName );
	};

	// Collection method.
	$.fn[ pluginName ] = function() {
		return this.each( function() {
			var $t = $( this );

			if( $t.data( pluginName ) ){
				return;
			}

			var table = new Table( this );
			$t.data( pluginName, table );
		});
	};

	$( document ).on( "enhance.tablesaw", function( e ) {
		// Cut the mustard
		if( Tablesaw.mustard ) {
			$( e.target ).find( initSelector )[ pluginName ]();
		}
	});

}());

;(function(){

	var classes = {
		stackTable: 'tablesaw-stack',
		cellLabels: 'tablesaw-cell-label',
		cellContentLabels: 'tablesaw-cell-content'
	};

	var data = {
		obj: 'tablesaw-stack'
	};

	var attrs = {
		labelless: 'data-tablesaw-no-labels',
		hideempty: 'data-tablesaw-hide-empty'
	};

	var Stack = function( element ) {

		this.$table = $( element );

		this.labelless = this.$table.is( '[' + attrs.labelless + ']' );
		this.hideempty = this.$table.is( '[' + attrs.hideempty + ']' );

		if( !this.labelless ) {
			// allHeaders references headers, plus all THs in the thead, which may include several rows, or not
			this.allHeaders = this.$table.find( "th" );
		}

		this.$table.data( data.obj, this );
	};

	Stack.prototype.init = function( colstart ) {
		this.$table.addClass( classes.stackTable );

		if( this.labelless ) {
			return;
		}

		// get headers in reverse order so that top-level headers are appended last
		var reverseHeaders = $( this.allHeaders );
		var hideempty = this.hideempty;

		// create the hide/show toggles
		reverseHeaders.each(function(){
			var $t = $( this ),
				$cells = $( this.cells ).filter(function() {
					return !$( this ).parent().is( "[" + attrs.labelless + "]" ) && ( !hideempty || !$( this ).is( ":empty" ) );
				}),
				hierarchyClass = $cells.not( this ).filter( "thead th" ).length && " tablesaw-cell-label-top",
				// TODO reduce coupling with sortable
				$sortableButton = $t.find( ".tablesaw-sortable-btn" ),
				html = $sortableButton.length ? $sortableButton.html() : $t.html();

			if( html !== "" ){
				if( hierarchyClass ){
					var iteration = parseInt( $( this ).attr( "colspan" ), 10 ),
						filter = "";

					if( iteration ){
						filter = "td:nth-child("+ iteration +"n + " + ( colstart ) +")";
					}
					$cells.filter( filter ).prepend( "<b class='" + classes.cellLabels + hierarchyClass + "'>" + html + "</b>"  );
				} else {
					$cells.wrapInner( "<span class='" + classes.cellContentLabels + "'></span>" );
					$cells.prepend( "<b class='" + classes.cellLabels + "'>" + html + "</b>"  );
				}
			}
		});
	};

	Stack.prototype.destroy = function() {
		this.$table.removeClass( classes.stackTable );
		this.$table.find( '.' + classes.cellLabels ).remove();
		this.$table.find( '.' + classes.cellContentLabels ).each(function() {
			$( this ).replaceWith( this.childNodes );
		});
	};

	// on tablecreate, init
	$( document ).on( "tablesawcreate", function( e, tablesaw, colstart ){
		if( tablesaw.mode === 'stack' ){
			var table = new Stack( tablesaw.table );
			table.init( colstart );
		}

	} );

	$( document ).on( "tablesawdestroy", function( e, tablesaw ){

		if( tablesaw.mode === 'stack' ){
			$( tablesaw.table ).data( data.obj ).destroy();
		}

	} );

}());
;(function() {
	var pluginName = "tablesawbtn",
		methods = {
			_create: function(){
				return $( this ).each(function() {
					$( this )
						.trigger( "beforecreate." + pluginName )
						[ pluginName ]( "_init" )
						.trigger( "create." + pluginName );
				});
			},
			_init: function(){
				var oEl = $( this ),
					sel = this.getElementsByTagName( "select" )[ 0 ];

				if( sel ) {
					$( this )
						.addClass( "btn-select" )
						[ pluginName ]( "_select", sel );
				}
				return oEl;
			},
			_select: function( sel ) {
				var update = function( oEl, sel ) {
					var opts = $( sel ).find( "option" );
					var label = document.createElement( "span" );
					var el;
					var children;
					var found = false;

					label.setAttribute( "aria-hidden", "true" );
					label.innerHTML = "&#160;";

					opts.each(function() {
						var opt = this;
						if( opt.selected ) {
							label.innerHTML = opt.text;
						}
					});

					children = oEl.childNodes;
					if( opts.length > 0 ){
						for( var i = 0, l = children.length; i < l; i++ ) {
							el = children[ i ];

							if( el && el.nodeName.toUpperCase() === "SPAN" ) {
								oEl.replaceChild( label, el );
								found = true;
							}
						}

						if( !found ) {
							oEl.insertBefore( label, oEl.firstChild );
						}
					}
				};

				update( this, sel );
				$( this ).on( "change refresh", function() {
					update( this, sel );
				});
			}
		};

	// Collection method.
	$.fn[ pluginName ] = function( arrg, a, b, c ) {
		return this.each(function() {

		// if it's a method
		if( arrg && typeof( arrg ) === "string" ){
			return $.fn[ pluginName ].prototype[ arrg ].call( this, a, b, c );
		}

		// don't re-init
		if( $( this ).data( pluginName + "active" ) ){
			return $( this );
		}

		// otherwise, init

		$( this ).data( pluginName + "active", true );
			$.fn[ pluginName ].prototype._create.call( this );
		});
	};

	// add methods
	$.extend( $.fn[ pluginName ].prototype, methods );

}());
;(function(){

	var ColumnToggle = function( element ) {

		this.$table = $( element );

		if( !this.$table.length ) {
			return;
		}

		this.classes = {
			columnToggleTable: 'tablesaw-columntoggle',
			columnBtnContain: 'tablesaw-columntoggle-btnwrap tablesaw-advance',
			columnBtn: 'tablesaw-columntoggle-btn tablesaw-nav-btn down',
			popup: 'tablesaw-columntoggle-popup',
			priorityPrefix: 'tablesaw-priority-',
			// TODO duplicate class, also in tables.js
			toolbar: 'tablesaw-bar'
		};

		// Expose headers and allHeaders properties on the widget
		// headers references the THs within the first TR in the table
		this.headers = this.$table.find( "tr" ).eq( 0 ).find( "th" );

		this.$table.data( 'tablesaw-coltoggle', this );
	};

	ColumnToggle.prototype.init = function() {

		if( !this.$table.length ) {
			return;
		}

		var tableId,
			id,
			$menuButton,
			$popup,
			$menu,
			$btnContain,
			self = this;

		this.$table.addClass( this.classes.columnToggleTable );

		tableId = this.$table.attr( "id" );
		id = tableId + "-popup";
		$btnContain = $( "<div class='" + this.classes.columnBtnContain + "'></div>" );
		$menuButton = $( "<a href='#" + id + "' class='btn btn-micro " + this.classes.columnBtn +"' data-popup-link>" +
										"<span>" + Tablesaw.i18n.columnBtnText + "</span></a>" );
		$popup = $( "<div class='dialog-table-coltoggle " + this.classes.popup + "' id='" + id + "'></div>" );
		$menu = $( "<div class='btn-group'></div>" );

		var hasNonPersistentHeaders = false;
		$( this.headers ).not( "td" ).each( function() {
			var $this = $( this ),
				priority = $this.attr("data-tablesaw-priority"),
				$cells = self.$getCells( this );

			if( priority && priority !== "persist" ) {
				$cells.addClass( self.classes.priorityPrefix + priority );

				$("<label><input type='checkbox' checked>" + $this.text() + "</label>" )
					.appendTo( $menu )
					.children( 0 )
					.data( "tablesaw-header", this );

				hasNonPersistentHeaders = true;
			}
		});

		if( !hasNonPersistentHeaders ) {
			$menu.append( '<label>' + Tablesaw.i18n.columnsDialogError + '</label>' );
		}

		$menu.appendTo( $popup );

		// bind change event listeners to inputs - TODO: move to a private method?
		$menu.find( 'input[type="checkbox"]' ).on( "change", function(e) {
			var checked = e.target.checked;

			var $cells = self.$getCellsFromCheckbox( e.target );

			$cells[ !checked ? "addClass" : "removeClass" ]( "tablesaw-cell-hidden" );
			$cells[ checked ? "addClass" : "removeClass" ]( "tablesaw-cell-visible" );

			self.$table.trigger( 'tablesawcolumns' );
		});

		$menuButton.appendTo( $btnContain );
		$btnContain.appendTo( this.$table.prev().filter( '.' + this.classes.toolbar ) );


		function closePopup( event ) {
			// Click came from inside the popup, ignore.
			if( event && $( event.target ).closest( "." + self.classes.popup ).length ) {
				return;
			}

			$( document ).off( 'click.' + tableId );
			$menuButton.removeClass( 'up' ).addClass( 'down' );
			$btnContain.removeClass( 'visible' );
		}

		var closeTimeout;
		function openPopup() {
			$btnContain.addClass( 'visible' );
			$menuButton.removeClass( 'down' ).addClass( 'up' );

			$( document ).off( 'click.' + tableId, closePopup );

			window.clearTimeout( closeTimeout );
			closeTimeout = window.setTimeout(function() {
				$( document ).one( 'click.' + tableId, closePopup );
			}, 15 );
		}

		$menuButton.on( "click.tablesaw", function( event ) {
			event.preventDefault();

			if( !$btnContain.is( ".visible" ) ) {
				openPopup();
			} else {
				closePopup();
			}
		});

		$popup.appendTo( $btnContain );

		this.$menu = $menu;

		$(window).on( "resize." + tableId, function(){
			self.refreshToggle();
		});

		this.refreshToggle();
	};

	ColumnToggle.prototype.$getCells = function( th ) {
		return $( th ).add( th.cells );
	};

	ColumnToggle.prototype.$getCellsFromCheckbox = function( checkbox ) {
		var th = $( checkbox ).data( "tablesaw-header" );
		return this.$getCells( th );
	};

	ColumnToggle.prototype.refreshToggle = function() {
		var self = this;
		this.$menu.find( "input" ).each( function() {
			this.checked = self.$getCellsFromCheckbox( this ).eq( 0 ).css( "display" ) === "table-cell";
		});
	};

	ColumnToggle.prototype.refreshPriority = function(){
		var self = this;
		$(this.headers).not( "td" ).each( function() {
			var $this = $( this ),
				priority = $this.attr("data-tablesaw-priority"),
				$cells = $this.add( this.cells );

			if( priority && priority !== "persist" ) {
				$cells.addClass( self.classes.priorityPrefix + priority );
			}
		});
	};

	ColumnToggle.prototype.destroy = function() {
		this.$table.removeClass( this.classes.columnToggleTable );
		this.$table.find( 'th, td' ).each(function() {
			var $cell = $( this );
			$cell.removeClass( 'tablesaw-cell-hidden' )
				.removeClass( 'tablesaw-cell-visible' );

			this.className = this.className.replace( /\bui\-table\-priority\-\d\b/g, '' );
		});
	};

	// on tablecreate, init
	$( document ).on( "tablesawcreate", function( e, tablesaw ){

		if( tablesaw.mode === 'columntoggle' ){
			var table = new ColumnToggle( tablesaw.table );
			table.init();
		}

	} );

	$( document ).on( "tablesawdestroy", function( e, tablesaw ){
		if( tablesaw.mode === 'columntoggle' ){
			$( tablesaw.table ).data( 'tablesaw-coltoggle' ).destroy();
		}
	} );

}());
;(function() {
	function getSortValue( cell ) {
		var text = [];

		$( cell.childNodes ).each(function() {
			var $el = $( this );
			if( $el.is( 'input, select' ) ) {
				text.push( $el.val() );
			} else if( $el.is( '.tablesaw-cell-label' ) ) {
			} else {
				text.push( ( $el.text() || '' ).replace(/^\s+|\s+$/g, '') );
			}
		});

		return text.join( '' );
	}

	var pluginName = "tablesaw-sortable",
		initSelector = "table[data-" + pluginName + "]",
		sortableSwitchSelector = "[data-" + pluginName + "-switch]",
		attrs = {
			defaultCol: "data-tablesaw-sortable-default-col",
			numericCol: "data-tablesaw-sortable-numeric"
		},
		classes = {
			head: pluginName + "-head",
			ascend: pluginName + "-ascending",
			descend: pluginName + "-descending",
			switcher: pluginName + "-switch",
			tableToolbar: 'tablesaw-toolbar',
			sortButton: pluginName + "-btn"
		},
		methods = {
			_create: function( o ){
				return $( this ).each(function() {
					var init = $( this ).data( pluginName + "-init" );
					if( init ) {
						return false;
					}
					$( this )
						.data( pluginName + "-init", true )
						.trigger( "beforecreate." + pluginName )
						[ pluginName ]( "_init" , o )
						.trigger( "create." + pluginName );
				});
			},
			_init: function(){
				var el = $( this ),
					heads,
					$switcher;

				var addClassToTable = function(){
						el.addClass( pluginName );
					},
					addClassToHeads = function( h ){
						$.each( h , function( i , v ){
							$( v ).addClass( classes.head );
						});
					},
					makeHeadsActionable = function( h , fn ){
						$.each( h , function( i , v ){
							var b = $( "<button class='" + classes.sortButton + "'/>" );
							b.on( "click" , { col: v } , fn );
							$( v ).wrapInner( b );
							b.append( "<span class='tablesaw-sortable-arrow'>" );
						});
					},
					clearOthers = function( sibs ){
						$.each( sibs , function( i , v ){
							var col = $( v );
							col.removeAttr( attrs.defaultCol );
							col.removeClass( classes.ascend );
							col.removeClass( classes.descend );
						});
					},
					headsOnAction = function( e ){
						if( $( e.target ).is( 'a[href]' ) ) {
							return;
						}

						e.stopPropagation();
						var head = $( this ).parent(),
							v = e.data.col,
							newSortValue = heads.index( head[0] );

						clearOthers( head.siblings() );
						if( head.is( "." + classes.descend ) ){
							el[ pluginName ]( "sortBy" , v , true);
							newSortValue += '_asc';
						} else {
							el[ pluginName ]( "sortBy" , v );
							newSortValue += '_desc';
						}
						if( $switcher ) {
							$switcher.find( 'select' ).val( newSortValue ).trigger( 'refresh' );
						}

						e.preventDefault();
					},
					handleDefault = function( heads ){
						$.each( heads , function( idx , el ){
							var $el = $( el );
							if( $el.is( "[" + attrs.defaultCol + "]" ) ){
								if( !$el.is( "." + classes.descend ) ) {
									$el.addClass( classes.ascend );
								}
							}
						});
					},
					addSwitcher = function( heads ){
						$switcher = $( '<div>' ).addClass( classes.switcher ).addClass( classes.tableToolbar );

						var html = [ '<label>' + Tablesaw.i18n.sort + ':' ];

						html.push( '<span class="btn"><select>' );
						heads.each(function( j ) {
							var $t = $( this );
							var isDefaultCol = $t.is( "[" + attrs.defaultCol + "]" );
							var isDescending = $t.is( "." + classes.descend );

							var hasNumericAttribute = $t.is( '[data-sortable-numeric]' );
							var numericCount = 0;
							// Check only the first four rows to see if the column is numbers.
							var numericCountMax = 5;
							$( this.cells.slice( 0, numericCountMax ) ).each(function() {
								if( !isNaN( parseInt( getSortValue( this ), 10 ) ) ) {
									numericCount++;
								}
							});
							var isNumeric = numericCount === numericCountMax;
							if( !hasNumericAttribute ) {
								$t.attr( "data-sortable-numeric", isNumeric ? "" : "false" );
							}

							html.push( '<option' + ( isDefaultCol && !isDescending ? ' selected' : '' ) + ' value="' + j + '_asc">' + $t.text() + ' ' + ( isNumeric ? '&#x2191;' : '(A-Z)' ) + '</option>' );
							html.push( '<option' + ( isDefaultCol && isDescending ? ' selected' : '' ) + ' value="' + j + '_desc">' + $t.text() + ' ' + ( isNumeric ? '&#x2193;' : '(Z-A)' ) + '</option>' );
						});
						html.push( '</select></span></label>' );

						$switcher.html( html.join('') );

						var $toolbar = el.prev().filter( '.tablesaw-bar' ),
							$firstChild = $toolbar.children().eq( 0 );

						if( $firstChild.length ) {
							$switcher.insertBefore( $firstChild );
						} else {
							$switcher.appendTo( $toolbar );
						}
						$switcher.find( '.btn' ).tablesawbtn();
						$switcher.find( 'select' ).on( 'change', function() {
							var val = $( this ).val().split( '_' ),
								head = heads.eq( val[ 0 ] );

							clearOthers( head.siblings() );
							el[ pluginName ]( 'sortBy', head.get( 0 ), val[ 1 ] === 'asc' );
						});
					};

					addClassToTable();
					heads = el.find( "thead th[data-" + pluginName + "-col]" );
					addClassToHeads( heads );
					makeHeadsActionable( heads , headsOnAction );
					handleDefault( heads );

					if( el.is( sortableSwitchSelector ) ) {
						addSwitcher( heads, el.find('tbody tr:nth-child(-n+3)') );
					}
			},
			getColumnNumber: function( col ){
				return $( col ).prevAll().length;
			},
			getTableRows: function(){
				return $( this ).find( "tbody tr" );
			},
			sortRows: function( rows , colNum , ascending, col ){
				var cells, fn, sorted;
				var getCells = function( rows ){
						var cells = [];
						$.each( rows , function( i , r ){
							var element = $( r ).children().get( colNum );
							cells.push({
								element: element,
								cell: getSortValue( element ),
								rowNum: i
							});
						});
						return cells;
					},
					getSortFxn = function( ascending, forceNumeric ){
						var fn,
							regex = /[^\-\+\d\.]/g;
						if( ascending ){
							fn = function( a , b ){
								if( forceNumeric ) {
									return parseFloat( a.cell.replace( regex, '' ) ) - parseFloat( b.cell.replace( regex, '' ) );
								} else {
									return a.cell.toLowerCase() > b.cell.toLowerCase() ? 1 : -1;
								}
							};
						} else {
							fn = function( a , b ){
								if( forceNumeric ) {
									return parseFloat( b.cell.replace( regex, '' ) ) - parseFloat( a.cell.replace( regex, '' ) );
								} else {
									return a.cell.toLowerCase() < b.cell.toLowerCase() ? 1 : -1;
								}
							};
						}
						return fn;
					},
					applyToRows = function( sorted , rows ){
						var newRows = [], i, l, cur;
						for( i = 0, l = sorted.length ; i < l ; i++ ){
							cur = sorted[ i ].rowNum;
							newRows.push( rows[cur] );
						}
						return newRows;
					};

				cells = getCells( rows );
				var customFn = $( col ).data( 'tablesaw-sort' );
				fn = ( customFn && typeof customFn === "function" ? customFn( ascending ) : false ) ||
					getSortFxn( ascending, $( col ).is( '[data-sortable-numeric]' ) && !$( col ).is( '[data-sortable-numeric="false"]' ) );

				sorted = cells.sort( fn );
				rows = applyToRows( sorted , rows );
				return rows;
			},
			replaceTableRows: function( rows ){
				var el = $( this ),
					body = el.find( "tbody" );

				for( var j = 0, k = rows.length; j < k; j++ ) {
					body.append( rows[ j ] );
				}
			},
			makeColDefault: function( col , a ){
				var c = $( col );
				c.attr( attrs.defaultCol , "true" );
				if( a ){
					c.removeClass( classes.descend );
					c.addClass( classes.ascend );
				} else {
					c.removeClass( classes.ascend );
					c.addClass( classes.descend );
				}
			},
			sortBy: function( col , ascending ){
				var el = $( this ), colNum, rows;

				colNum = el[ pluginName ]( "getColumnNumber" , col );
				rows = el[ pluginName ]( "getTableRows" );
				rows = el[ pluginName ]( "sortRows" , rows , colNum , ascending, col );
				el[ pluginName ]( "replaceTableRows" , rows );
				el[ pluginName ]( "makeColDefault" , col , ascending );
				el.trigger( "tablesaw-sorted" );
			}
		};

	// Collection method.
	$.fn[ pluginName ] = function( arrg ) {
		var args = Array.prototype.slice.call( arguments , 1),
			returnVal;

		// if it's a method
		if( arrg && typeof( arrg ) === "string" ){
			returnVal = $.fn[ pluginName ].prototype[ arrg ].apply( this[0], args );
			return (typeof returnVal !== "undefined")? returnVal:$(this);
		}
		// check init
		if( !$( this ).data( pluginName + "-active" ) ){
			$( this ).data( pluginName + "-active", true );
			$.fn[ pluginName ].prototype._create.call( this , arrg );
		}
		return $(this);
	};
	// add methods
	$.extend( $.fn[ pluginName ].prototype, methods );

	$( document ).on( "tablesawcreate", function( e, Tablesaw ) {
		if( Tablesaw.$table.is( initSelector ) ) {
			Tablesaw.$table[ pluginName ]();
		}
	});

}());

;(function(){

	$.extend( Tablesaw.config, {
		swipe: {
			horizontalThreshold: 15,
			verticalThreshold: 30
		}
	});

	function sumStyles( $el, props ) {
		var total = 0;
		for( var j = 0, k = props.length; j < k; j++ ) {
			total += parseInt( $el.css( props[ j ] ) || 0, 10 );
		}
		return total;
	}

	function outerWidth( el ) {
		var $el = $( el );
		return $el.width() + sumStyles( $el, [ "border-left-width", "border-right-width" ] );
	}

	var classes = {
		// TODO duplicate class, also in tables.js
		toolbar: "tablesaw-bar",
		hideBtn: "disabled",
		persistWidths: "tablesaw-fix-persist",
		allColumnsVisible: 'tablesaw-all-cols-visible'
	};
	var attrs = {
		disableTouchEvents: "data-tablesaw-no-touch"
	};

	function createSwipeTable( $table ){

		var $btns = $( "<div class='tablesaw-advance'></div>" ),
			$prevBtn = $( "<a href='#' class='tablesaw-nav-btn btn btn-micro left' title='Previous Column'></a>" ).appendTo( $btns ),
			$nextBtn = $( "<a href='#' class='tablesaw-nav-btn btn btn-micro right' title='Next Column'></a>" ).appendTo( $btns ),
			$headerCells = $table.find( "thead th" ),
			$headerCellsNoPersist = $headerCells.not( '[data-tablesaw-priority="persist"]' ),
			headerWidths = [],
			$head = $( document.head || 'head' ),
			tableId = $table.attr( 'id' );

		if( !$headerCells.length ) {
			throw new Error( "tablesaw swipe: no header cells found. Are you using <th> inside of <thead>?" );
		}

		$table.addClass( "tablesaw-swipe" );

		// Calculate initial widths
		$headerCells.each(function() {
			var width = outerWidth( this );
			headerWidths.push( width );
		});

		$btns.appendTo( $table.prev().filter( '.tablesaw-bar' ) );

		if( !tableId ) {
			tableId = 'tableswipe-' + Math.round( Math.random() * 10000 );
			$table.attr( 'id', tableId );
		}

		function $getCells( headerCell ) {
			return $( headerCell.cells ).add( headerCell );
		}

		function showColumn( headerCell ) {
			$getCells( headerCell ).removeClass( 'tablesaw-cell-hidden' );
		}

		function hideColumn( headerCell ) {
			$getCells( headerCell ).addClass( 'tablesaw-cell-hidden' );
		}

		function persistColumn( headerCell ) {
			$getCells( headerCell ).addClass( 'tablesaw-cell-persist' );
		}

		function isPersistent( headerCell ) {
			return $( headerCell ).is( '[data-tablesaw-priority="persist"]' );
		}

		function unmaintainWidths() {
			$table.removeClass( classes.persistWidths );
			$( '#' + tableId + '-persist' ).remove();
		}

		function maintainWidths() {
			var prefix = '#' + tableId + '.tablesaw-swipe ',
				styles = [],
				tableWidth = $table.width(),
				hash = [],
				newHash;

			$headerCells.each(function( index ) {
				var width;
				if( isPersistent( this ) ) {
					width = outerWidth( this );

					// Only save width on non-greedy columns (take up less than 75% of table width)
					if( width < tableWidth * 0.75 ) {
						hash.push( index + '-' + width );
						styles.push( prefix + ' .tablesaw-cell-persist:nth-child(' + ( index + 1 ) + ') { width: ' + width + 'px; }' );
					}
				}
			});
			newHash = hash.join( '_' );

			$table.addClass( classes.persistWidths );

			var $style = $( '#' + tableId + '-persist' );
			// If style element not yet added OR if the widths have changed
			if( !$style.length || $style.data( 'tablesaw-hash' ) !== newHash ) {
				// Remove existing
				$style.remove();

				if( styles.length ) {
					$( '<style>' + styles.join( "\n" ) + '</style>' )
						.attr( 'id', tableId + '-persist' )
						.data( 'tablesaw-hash', newHash )
						.appendTo( $head );
				}
			}
		}

		function getNext(){
			var next = [],
				checkFound;

			$headerCellsNoPersist.each(function( i ) {
				var $t = $( this ),
					isHidden = $t.css( "display" ) === "none" || $t.is( ".tablesaw-cell-hidden" );

				if( !isHidden && !checkFound ) {
					checkFound = true;
					next[ 0 ] = i;
				} else if( isHidden && checkFound ) {
					next[ 1 ] = i;

					return false;
				}
			});

			return next;
		}

		function getPrev(){
			var next = getNext();
			return [ next[ 1 ] - 1 , next[ 0 ] - 1 ];
		}

		function nextpair( fwd ){
			return fwd ? getNext() : getPrev();
		}

		function canAdvance( pair ){
			return pair[ 1 ] > -1 && pair[ 1 ] < $headerCellsNoPersist.length;
		}

		function matchesMedia() {
			var matchMedia = $table.attr( "data-tablesaw-swipe-media" );
			return !matchMedia || ( "matchMedia" in win ) && win.matchMedia( matchMedia ).matches;
		}

		function fakeBreakpoints() {
			if( !matchesMedia() ) {
				return;
			}

			var	containerWidth = $table.parent().width(),
				persist = [],
				sum = 0,
				sums = [],
				visibleNonPersistantCount = $headerCells.length;

			$headerCells.each(function( index ) {
				var $t = $( this ),
					isPersist = $t.is( '[data-tablesaw-priority="persist"]' );

				persist.push( isPersist );
				sum += headerWidths[ index ];
				sums.push( sum );

				// is persistent or is hidden
				if( isPersist || sum > containerWidth ) {
					visibleNonPersistantCount--;
				}
			});

			// We need at least one column to swipe.
			var needsNonPersistentColumn = visibleNonPersistantCount === 0;

			$headerCells.each(function( index ) {
				if( persist[ index ] ) {

					// for visual box-shadow
					persistColumn( this );
					return;
				}

				if( sums[ index ] <= containerWidth || needsNonPersistentColumn ) {
					needsNonPersistentColumn = false;
					showColumn( this );
				} else {
					hideColumn( this );
				}
			});

			unmaintainWidths();
			$table.trigger( 'tablesawcolumns' );
		}

		function advance( fwd ){
			var pair = nextpair( fwd );
			if( canAdvance( pair ) ){
				if( isNaN( pair[ 0 ] ) ){
					if( fwd ){
						pair[0] = 0;
					}
					else {
						pair[0] = $headerCellsNoPersist.length - 1;
					}
				}

				maintainWidths();

				hideColumn( $headerCellsNoPersist.get( pair[ 0 ] ) );
				showColumn( $headerCellsNoPersist.get( pair[ 1 ] ) );

				$table.trigger( 'tablesawcolumns' );
			}
		}

		$prevBtn.add( $nextBtn ).on( "click", function( e ){
			advance( !!$( e.target ).closest( $nextBtn ).length );
			e.preventDefault();
		});

		function getCoord( event, key ) {
			return ( event.touches || event.originalEvent.touches )[ 0 ][ key ];
		}

		if( !$table.is( "[" + attrs.disableTouchEvents + "]" ) ) {
			
			$table
				.on( "touchstart.swipetoggle", function( e ){
					var originX = getCoord( e, 'pageX' ),
						originY = getCoord( e, 'pageY' ),
						x,
						y;

					$( win ).off( "resize", fakeBreakpoints );

					$( this )
						.on( "touchmove", function( e ){
							x = getCoord( e, 'pageX' );
							y = getCoord( e, 'pageY' );
							var cfg = Tablesaw.config.swipe;
							if( Math.abs( x - originX ) > cfg.horizontalThreshold && Math.abs( y - originY ) < cfg.verticalThreshold ) {
								e.preventDefault();
							}
						})
						.on( "touchend.swipetoggle", function(){
							var cfg = Tablesaw.config.swipe;
							if( Math.abs( y - originY ) < cfg.verticalThreshold ) {
								if( x - originX < -1 * cfg.horizontalThreshold ){
									advance( true );
								}
								if( x - originX > cfg.horizontalThreshold ){
									advance( false );
								}
							}

							window.setTimeout(function() {
								$( win ).on( "resize", fakeBreakpoints );
							}, 300);
							$( this ).off( "touchmove touchend" );
						});
				});
		}

		$table
			.on( "tablesawcolumns.swipetoggle", function(){
				var canGoPrev = canAdvance( getPrev() );
				var canGoNext = canAdvance( getNext() );
				$prevBtn[ canGoPrev ? "removeClass" : "addClass" ]( classes.hideBtn );
				$nextBtn[ canGoNext ? "removeClass" : "addClass" ]( classes.hideBtn );

				$prevBtn.closest( "." + classes.toolbar )[ !canGoPrev && !canGoNext ? 'addClass' : 'removeClass' ]( classes.allColumnsVisible );
			})
			.on( "tablesawnext.swipetoggle", function(){
				advance( true );
			} )
			.on( "tablesawprev.swipetoggle", function(){
				advance( false );
			} )
			.on( "tablesawdestroy.swipetoggle", function(){
				var $t = $( this );

				$t.removeClass( 'tablesaw-swipe' );
				$t.prev().filter( '.tablesaw-bar' ).find( '.tablesaw-advance' ).remove();
				$( win ).off( "resize", fakeBreakpoints );

				$t.off( ".swipetoggle" );
			})
			.on( "tablesawrefresh", function() {
				// manual refresh
				headerWidths = [];
				$headerCells.each(function() {
					var width = outerWidth( this );
					headerWidths.push( width );
				});

				fakeBreakpoints();
			});

		fakeBreakpoints();
		$( win ).on( "resize", fakeBreakpoints );
	}



	// on tablecreate, init
	$( document ).on( "tablesawcreate", function( e, tablesaw ){
		if( tablesaw.mode === 'swipe' ){
			createSwipeTable( tablesaw.$table );
		}

	} );

}());

;(function(){

	var MiniMap = {
		attr: {
			init: 'data-tablesaw-minimap'
		}
	};

	function createMiniMap( $table ){

		var $btns = $( '<div class="tablesaw-advance minimap">' ),
			$dotNav = $( '<ul class="tablesaw-advance-dots">' ).appendTo( $btns ),
			hideDot = 'tablesaw-advance-dots-hide',
			$headerCells = $table.find( 'thead th' );

		// populate dots
		$headerCells.each(function(){
			$dotNav.append( '<li><i></i></li>' );
		});

		$btns.appendTo( $table.prev().filter( '.tablesaw-bar' ) );

		function showMinimap( $table ) {
			var mq = $table.attr( MiniMap.attr.init );
			return !mq || win.matchMedia && win.matchMedia( mq ).matches;
		}

		function showHideNav(){
			if( !showMinimap( $table ) ) {
				$btns.css( "display", "none" );
				return;
			}
			$btns.css( "display", "block" );

			// show/hide dots
			var dots = $dotNav.find( "li" ).removeClass( hideDot );
			$table.find( "thead th" ).each(function(i){
				if( $( this ).css( "display" ) === "none" ){
					dots.eq( i ).addClass( hideDot );
				}
			});
		}

		// run on init and resize
		showHideNav();
		$( win ).on( "resize", showHideNav );


		$table
			.on( "tablesawcolumns.minimap", function(){
				showHideNav();
			})
			.on( "tablesawdestroy.minimap", function(){
				var $t = $( this );

				$t.prev().filter( '.tablesaw-bar' ).find( '.tablesaw-advance' ).remove();
				$( win ).off( "resize", showHideNav );

				$t.off( ".minimap" );
			});
	}



	// on tablecreate, init
	$( document ).on( "tablesawcreate", function( e, tablesaw ){

		if( ( tablesaw.mode === 'swipe' || tablesaw.mode === 'columntoggle' ) && tablesaw.$table.is( '[ ' + MiniMap.attr.init + ']' ) ){
			createMiniMap( tablesaw.$table );
		}

	} );

}());

;(function() {

	var S = {
		selectors: {
			init: 'table[data-tablesaw-mode-switch]'
		},
		attributes: {
			excludeMode: 'data-tablesaw-mode-exclude'
		},
		classes: {
			main: 'tablesaw-modeswitch',
			toolbar: 'tablesaw-toolbar'
		},
		modes: [ 'stack', 'swipe', 'columntoggle' ],
		init: function( table ) {
			var $table = $( table ),
				ignoreMode = $table.attr( S.attributes.excludeMode ),
				$toolbar = $table.prev().filter( '.tablesaw-bar' ),
				modeVal = '',
				$switcher = $( '<div>' ).addClass( S.classes.main + ' ' + S.classes.toolbar );

			var html = [ '<label>' + Tablesaw.i18n.columns + ':' ],
				dataMode = $table.attr( 'data-tablesaw-mode' ),
				isSelected;

			html.push( '<span class="btn"><select>' );
			for( var j=0, k = S.modes.length; j<k; j++ ) {
				if( ignoreMode && ignoreMode.toLowerCase() === S.modes[ j ] ) {
					continue;
				}

				isSelected = dataMode === S.modes[ j ];

				if( isSelected ) {
					modeVal = S.modes[ j ];
				}

				html.push( '<option' +
					( isSelected ? ' selected' : '' ) +
					' value="' + S.modes[ j ] + '">' + Tablesaw.i18n.modes[ j ] + '</option>' );
			}
			html.push( '</select></span></label>' );

			$switcher.html( html.join( '' ) );

			var $otherToolbarItems = $toolbar.find( '.tablesaw-advance' ).eq( 0 );
			if( $otherToolbarItems.length ) {
				$switcher.insertBefore( $otherToolbarItems );
			} else {
				$switcher.appendTo( $toolbar );
			}

			$switcher.find( '.btn' ).tablesawbtn();
			$switcher.find( 'select' ).on( 'change', S.onModeChange );
		},
		onModeChange: function() {
			var $t = $( this ),
				$switcher = $t.closest( '.' + S.classes.main ),
				$table = $t.closest( '.tablesaw-bar' ).next().eq( 0 ),
				val = $t.val();

			$switcher.remove();
			$table.data( 'tablesaw' ).destroy();

			$table.attr( 'data-tablesaw-mode', val );
			$table.tablesaw();
		}
	};

	$( win.document ).on( "tablesawcreate", function( e, Tablesaw ) {
		if( Tablesaw.$table.is( S.selectors.init ) ) {
			S.init( Tablesaw.table );
		}
	});

})();
}));
;
/*! Tablesaw - v3.0.0-beta.3 - 2016-10-10
* https://github.com/filamentgroup/tablesaw
* Copyright (c) 2016 Filament Group; Licensed MIT */
// UMD module definition
// From: https://github.com/umdjs/umd/blob/master/templates/jqueryPlugin.js

(function (factory) {
	if (typeof define === 'function' && define.amd) {
			// AMD. Register as an anonymous module.
			define(['jquery'], factory);
	} else if (typeof module === 'object' && module.exports) {
		// Node/CommonJS
		module.exports = function( root, jQuery ) {
			if ( jQuery === undefined ) {
				// require('jQuery') returns a factory that requires window to
				// build a jQuery instance, we normalize how we use modules
				// that require this pattern but the window provided is a noop
				// if it's defined (how jquery works)
				if ( typeof window !== 'undefined' ) {
					jQuery = require('jquery');
				} else {
					jQuery = require('jquery')(root);
				}
			}
			factory(jQuery);
			return jQuery;
		};
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {
	var Tablesaw, win = typeof window !== "undefined" ? window : this;

/*
* tablesaw: A set of plugins for responsive tables
* Stack and Column Toggle tables
* Copyright (c) 2013 Filament Group, Inc.
* MIT License
*/

if( typeof Tablesaw === "undefined" ) {
	Tablesaw = {
		i18n: {
			modes: [ 'Stack', 'Swipe', 'Toggle' ],
			columns: 'Col<span class=\"a11y-sm\">umn</span>s',
			columnBtnText: 'Columns',
			columnsDialogError: 'No eligible columns.',
			sort: 'Sort'
		},
		// cut the mustard
		mustard: ( 'querySelector' in document ) &&
			( 'head' in document ) &&
			( !window.blackberry || window.WebKitPoint ) &&
			!window.operamini
	};
}
if( !Tablesaw.config ) {
	Tablesaw.config = {};
}
if( Tablesaw.mustard ) {
	$( document.documentElement ).addClass( 'tablesaw-enhanced' );
}

(function() {
	var pluginName = "tablesaw",
		classes = {
			toolbar: "tablesaw-bar"
		},
		events = {
			create: "tablesawcreate",
			destroy: "tablesawdestroy",
			refresh: "tablesawrefresh"
		},
		defaultMode = "stack",
		initSelector = "table[data-tablesaw-mode],table[data-tablesaw-sortable]";

	var Table = function( element ) {
		if( !element ) {
			throw new Error( "Tablesaw requires an element." );
		}

		this.table = element;
		this.$table = $( element );

		this.mode = this.$table.attr( "data-tablesaw-mode" ) || defaultMode;

		this.init();
	};

	Table.prototype.init = function() {
		// assign an id if there is none
		if ( !this.$table.attr( "id" ) ) {
			this.$table.attr( "id", pluginName + "-" + Math.round( Math.random() * 10000 ) );
		}

		this.createToolbar();

		var colstart = this._initCells();

		this.$table.trigger( events.create, [ this, colstart ] );
	};

	Table.prototype._initCells = function() {
		var colstart,
			thrs = this.table.querySelectorAll( "thead tr" ),
			self = this;

		$( thrs ).each( function(){
			var coltally = 0;

			var children = $( this ).children();
			var columnlookup = [];
			children.each( function(){
				var span = parseInt( this.getAttribute( "colspan" ), 10 );

				columnlookup[coltally] = this;
				colstart = coltally + 1;

				if( span ){
					for( var k = 0; k < span - 1; k++ ){
						coltally++;
						columnlookup[coltally] = this;
					}
				}
				this.cells = [];
				coltally++;
			});
			// Note that this assumes that children() returns its results in document order. jQuery doesn't
			// promise that in the docs, but it's a pretty safe assumption.
			self.$table.find("tr").not( thrs[0]).each( function() {
				var cellcoltally = 0;
				$(this).children().each(function () {
					var span = parseInt( this.getAttribute( "colspan" ), 10 );
					columnlookup[cellcoltally].cells.push(this);
					if (span) {
						cellcoltally += span;
					} else {
						cellcoltally++;
					}
				});
			});
		});

		return colstart;
	};

	Table.prototype.refresh = function() {
		this._initCells();

		this.$table.trigger( events.refresh );
	};

	Table.prototype.createToolbar = function() {
		// Insert the toolbar
		// TODO move this into a separate component
		var $toolbar = this.$table.prev().filter( '.' + classes.toolbar );
		if( !$toolbar.length ) {
			$toolbar = $( '<div>' )
				.addClass( classes.toolbar )
				.insertBefore( this.$table );
		}
		this.$toolbar = $toolbar;

		if( this.mode ) {
			this.$toolbar.addClass( 'tablesaw-mode-' + this.mode );
		}
	};

	Table.prototype.destroy = function() {
		// Don’t remove the toolbar. Some of the table features are not yet destroy-friendly.
		this.$table.prev().filter( '.' + classes.toolbar ).each(function() {
			this.className = this.className.replace( /\btablesaw-mode\-\w*\b/gi, '' );
		});

		var tableId = this.$table.attr( 'id' );
		$( document ).off( "." + tableId );
		$( window ).off( "." + tableId );

		// other plugins
		this.$table.trigger( events.destroy, [ this ] );

		this.$table.removeData( pluginName );
	};

	// Collection method.
	$.fn[ pluginName ] = function() {
		return this.each( function() {
			var $t = $( this );

			if( $t.data( pluginName ) ){
				return;
			}

			var table = new Table( this );
			$t.data( pluginName, table );
		});
	};

	$( document ).on( "enhance.tablesaw", function( e ) {
		// Cut the mustard
		if( Tablesaw.mustard ) {
			$( e.target ).find( initSelector )[ pluginName ]();
		}
	});

}());

;(function(){

	var classes = {
		stackTable: 'tablesaw-stack',
		cellLabels: 'tablesaw-cell-label',
		cellContentLabels: 'tablesaw-cell-content'
	};

	var data = {
		obj: 'tablesaw-stack'
	};

	var attrs = {
		labelless: 'data-tablesaw-no-labels',
		hideempty: 'data-tablesaw-hide-empty'
	};

	var Stack = function( element ) {

		this.$table = $( element );

		this.labelless = this.$table.is( '[' + attrs.labelless + ']' );
		this.hideempty = this.$table.is( '[' + attrs.hideempty + ']' );

		if( !this.labelless ) {
			// allHeaders references headers, plus all THs in the thead, which may include several rows, or not
			this.allHeaders = this.$table.find( "th" );
		}

		this.$table.data( data.obj, this );
	};

	Stack.prototype.init = function( colstart ) {
		this.$table.addClass( classes.stackTable );

		if( this.labelless ) {
			return;
		}

		// get headers in reverse order so that top-level headers are appended last
		var reverseHeaders = $( this.allHeaders );
		var hideempty = this.hideempty;

		// create the hide/show toggles
		reverseHeaders.each(function(){
			var $t = $( this ),
				$cells = $( this.cells ).filter(function() {
					return !$( this ).parent().is( "[" + attrs.labelless + "]" ) && ( !hideempty || !$( this ).is( ":empty" ) );
				}),
				hierarchyClass = $cells.not( this ).filter( "thead th" ).length && " tablesaw-cell-label-top",
				// TODO reduce coupling with sortable
				$sortableButton = $t.find( ".tablesaw-sortable-btn" ),
				html = $sortableButton.length ? $sortableButton.html() : $t.html();

			if( html !== "" ){
				if( hierarchyClass ){
					var iteration = parseInt( $( this ).attr( "colspan" ), 10 ),
						filter = "";

					if( iteration ){
						filter = "td:nth-child("+ iteration +"n + " + ( colstart ) +")";
					}
					$cells.filter( filter ).prepend( "<b class='" + classes.cellLabels + hierarchyClass + "'>" + html + "</b>"  );
				} else {
					$cells.wrapInner( "<span class='" + classes.cellContentLabels + "'></span>" );
					$cells.prepend( "<b class='" + classes.cellLabels + "'>" + html + "</b>"  );
				}
			}
		});
	};

	Stack.prototype.destroy = function() {
		this.$table.removeClass( classes.stackTable );
		this.$table.find( '.' + classes.cellLabels ).remove();
		this.$table.find( '.' + classes.cellContentLabels ).each(function() {
			$( this ).replaceWith( this.childNodes );
		});
	};

	// on tablecreate, init
	$( document ).on( "tablesawcreate", function( e, tablesaw, colstart ){
		if( tablesaw.mode === 'stack' ){
			var table = new Stack( tablesaw.table );
			table.init( colstart );
		}

	} );

	$( document ).on( "tablesawdestroy", function( e, tablesaw ){

		if( tablesaw.mode === 'stack' ){
			$( tablesaw.table ).data( data.obj ).destroy();
		}

	} );

}());
;(function() {
	var pluginName = "tablesawbtn",
		methods = {
			_create: function(){
				return $( this ).each(function() {
					$( this )
						.trigger( "beforecreate." + pluginName )
						[ pluginName ]( "_init" )
						.trigger( "create." + pluginName );
				});
			},
			_init: function(){
				var oEl = $( this ),
					sel = this.getElementsByTagName( "select" )[ 0 ];

				if( sel ) {
					$( this )
						.addClass( "btn-select" )
						[ pluginName ]( "_select", sel );
				}
				return oEl;
			},
			_select: function( sel ) {
				var update = function( oEl, sel ) {
					var opts = $( sel ).find( "option" );
					var label = document.createElement( "span" );
					var el;
					var children;
					var found = false;

					label.setAttribute( "aria-hidden", "true" );
					label.innerHTML = "&#160;";

					opts.each(function() {
						var opt = this;
						if( opt.selected ) {
							label.innerHTML = opt.text;
						}
					});

					children = oEl.childNodes;
					if( opts.length > 0 ){
						for( var i = 0, l = children.length; i < l; i++ ) {
							el = children[ i ];

							if( el && el.nodeName.toUpperCase() === "SPAN" ) {
								oEl.replaceChild( label, el );
								found = true;
							}
						}

						if( !found ) {
							oEl.insertBefore( label, oEl.firstChild );
						}
					}
				};

				update( this, sel );
				$( this ).on( "change refresh", function() {
					update( this, sel );
				});
			}
		};

	// Collection method.
	$.fn[ pluginName ] = function( arrg, a, b, c ) {
		return this.each(function() {

		// if it's a method
		if( arrg && typeof( arrg ) === "string" ){
			return $.fn[ pluginName ].prototype[ arrg ].call( this, a, b, c );
		}

		// don't re-init
		if( $( this ).data( pluginName + "active" ) ){
			return $( this );
		}

		// otherwise, init

		$( this ).data( pluginName + "active", true );
			$.fn[ pluginName ].prototype._create.call( this );
		});
	};

	// add methods
	$.extend( $.fn[ pluginName ].prototype, methods );

}());
;(function(){

	var ColumnToggle = function( element ) {

		this.$table = $( element );

		if( !this.$table.length ) {
			return;
		}

		this.classes = {
			columnToggleTable: 'tablesaw-columntoggle',
			columnBtnContain: 'tablesaw-columntoggle-btnwrap tablesaw-advance',
			columnBtn: 'tablesaw-columntoggle-btn tablesaw-nav-btn down',
			popup: 'tablesaw-columntoggle-popup',
			priorityPrefix: 'tablesaw-priority-',
			// TODO duplicate class, also in tables.js
			toolbar: 'tablesaw-bar'
		};

		// Expose headers and allHeaders properties on the widget
		// headers references the THs within the first TR in the table
		this.headers = this.$table.find( "tr" ).eq( 0 ).find( "th" );

		this.$table.data( 'tablesaw-coltoggle', this );
	};

	ColumnToggle.prototype.init = function() {

		if( !this.$table.length ) {
			return;
		}

		var tableId,
			id,
			$menuButton,
			$popup,
			$menu,
			$btnContain,
			self = this;

		this.$table.addClass( this.classes.columnToggleTable );

		tableId = this.$table.attr( "id" );
		id = tableId + "-popup";
		$btnContain = $( "<div class='" + this.classes.columnBtnContain + "'></div>" );
		$menuButton = $( "<a href='#" + id + "' class='btn btn-micro " + this.classes.columnBtn +"' data-popup-link>" +
										"<span>" + Tablesaw.i18n.columnBtnText + "</span></a>" );
		$popup = $( "<div class='dialog-table-coltoggle " + this.classes.popup + "' id='" + id + "'></div>" );
		$menu = $( "<div class='btn-group'></div>" );

		var hasNonPersistentHeaders = false;
		$( this.headers ).not( "td" ).each( function() {
			var $this = $( this ),
				priority = $this.attr("data-tablesaw-priority"),
				$cells = self.$getCells( this );

			if( priority && priority !== "persist" ) {
				$cells.addClass( self.classes.priorityPrefix + priority );

				$("<label><input type='checkbox' checked>" + $this.text() + "</label>" )
					.appendTo( $menu )
					.children( 0 )
					.data( "tablesaw-header", this );

				hasNonPersistentHeaders = true;
			}
		});

		if( !hasNonPersistentHeaders ) {
			$menu.append( '<label>' + Tablesaw.i18n.columnsDialogError + '</label>' );
		}

		$menu.appendTo( $popup );

		// bind change event listeners to inputs - TODO: move to a private method?
		$menu.find( 'input[type="checkbox"]' ).on( "change", function(e) {
			var checked = e.target.checked;

			var $cells = self.$getCellsFromCheckbox( e.target );

			$cells[ !checked ? "addClass" : "removeClass" ]( "tablesaw-cell-hidden" );
			$cells[ checked ? "addClass" : "removeClass" ]( "tablesaw-cell-visible" );

			self.$table.trigger( 'tablesawcolumns' );
		});

		$menuButton.appendTo( $btnContain );
		$btnContain.appendTo( this.$table.prev().filter( '.' + this.classes.toolbar ) );


		function closePopup( event ) {
			// Click came from inside the popup, ignore.
			if( event && $( event.target ).closest( "." + self.classes.popup ).length ) {
				return;
			}

			$( document ).off( 'click.' + tableId );
			$menuButton.removeClass( 'up' ).addClass( 'down' );
			$btnContain.removeClass( 'visible' );
		}

		var closeTimeout;
		function openPopup() {
			$btnContain.addClass( 'visible' );
			$menuButton.removeClass( 'down' ).addClass( 'up' );

			$( document ).off( 'click.' + tableId, closePopup );

			window.clearTimeout( closeTimeout );
			closeTimeout = window.setTimeout(function() {
				$( document ).one( 'click.' + tableId, closePopup );
			}, 15 );
		}

		$menuButton.on( "click.tablesaw", function( event ) {
			event.preventDefault();

			if( !$btnContain.is( ".visible" ) ) {
				openPopup();
			} else {
				closePopup();
			}
		});

		$popup.appendTo( $btnContain );

		this.$menu = $menu;

		$(window).on( "resize." + tableId, function(){
			self.refreshToggle();
		});

		this.refreshToggle();
	};

	ColumnToggle.prototype.$getCells = function( th ) {
		return $( th ).add( th.cells );
	};

	ColumnToggle.prototype.$getCellsFromCheckbox = function( checkbox ) {
		var th = $( checkbox ).data( "tablesaw-header" );
		return this.$getCells( th );
	};

	ColumnToggle.prototype.refreshToggle = function() {
		var self = this;
		this.$menu.find( "input" ).each( function() {
			this.checked = self.$getCellsFromCheckbox( this ).eq( 0 ).css( "display" ) === "table-cell";
		});
	};

	ColumnToggle.prototype.refreshPriority = function(){
		var self = this;
		$(this.headers).not( "td" ).each( function() {
			var $this = $( this ),
				priority = $this.attr("data-tablesaw-priority"),
				$cells = $this.add( this.cells );

			if( priority && priority !== "persist" ) {
				$cells.addClass( self.classes.priorityPrefix + priority );
			}
		});
	};

	ColumnToggle.prototype.destroy = function() {
		this.$table.removeClass( this.classes.columnToggleTable );
		this.$table.find( 'th, td' ).each(function() {
			var $cell = $( this );
			$cell.removeClass( 'tablesaw-cell-hidden' )
				.removeClass( 'tablesaw-cell-visible' );

			this.className = this.className.replace( /\bui\-table\-priority\-\d\b/g, '' );
		});
	};

	// on tablecreate, init
	$( document ).on( "tablesawcreate", function( e, tablesaw ){

		if( tablesaw.mode === 'columntoggle' ){
			var table = new ColumnToggle( tablesaw.table );
			table.init();
		}

	} );

	$( document ).on( "tablesawdestroy", function( e, tablesaw ){
		if( tablesaw.mode === 'columntoggle' ){
			$( tablesaw.table ).data( 'tablesaw-coltoggle' ).destroy();
		}
	} );

}());
;(function() {
	function getSortValue( cell ) {
		var text = [];

		$( cell.childNodes ).each(function() {
			var $el = $( this );
			if( $el.is( 'input, select' ) ) {
				text.push( $el.val() );
			} else if( $el.is( '.tablesaw-cell-label' ) ) {
			} else {
				text.push( ( $el.text() || '' ).replace(/^\s+|\s+$/g, '') );
			}
		});

		return text.join( '' );
	}

	var pluginName = "tablesaw-sortable",
		initSelector = "table[data-" + pluginName + "]",
		sortableSwitchSelector = "[data-" + pluginName + "-switch]",
		attrs = {
			defaultCol: "data-tablesaw-sortable-default-col",
			numericCol: "data-tablesaw-sortable-numeric"
		},
		classes = {
			head: pluginName + "-head",
			ascend: pluginName + "-ascending",
			descend: pluginName + "-descending",
			switcher: pluginName + "-switch",
			tableToolbar: 'tablesaw-toolbar',
			sortButton: pluginName + "-btn"
		},
		methods = {
			_create: function( o ){
				return $( this ).each(function() {
					var init = $( this ).data( pluginName + "-init" );
					if( init ) {
						return false;
					}
					$( this )
						.data( pluginName + "-init", true )
						.trigger( "beforecreate." + pluginName )
						[ pluginName ]( "_init" , o )
						.trigger( "create." + pluginName );
				});
			},
			_init: function(){
				var el = $( this ),
					heads,
					$switcher;

				var addClassToTable = function(){
						el.addClass( pluginName );
					},
					addClassToHeads = function( h ){
						$.each( h , function( i , v ){
							$( v ).addClass( classes.head );
						});
					},
					makeHeadsActionable = function( h , fn ){
						$.each( h , function( i , v ){
							var b = $( "<button class='" + classes.sortButton + "'/>" );
							b.on( "click" , { col: v } , fn );
							$( v ).wrapInner( b );
							b.append( "<span class='tablesaw-sortable-arrow'>" );
						});
					},
					clearOthers = function( sibs ){
						$.each( sibs , function( i , v ){
							var col = $( v );
							col.removeAttr( attrs.defaultCol );
							col.removeClass( classes.ascend );
							col.removeClass( classes.descend );
						});
					},
					headsOnAction = function( e ){
						if( $( e.target ).is( 'a[href]' ) ) {
							return;
						}

						e.stopPropagation();
						var head = $( this ).parent(),
							v = e.data.col,
							newSortValue = heads.index( head[0] );

						clearOthers( head.siblings() );
						if( head.is( "." + classes.descend ) ){
							el[ pluginName ]( "sortBy" , v , true);
							newSortValue += '_asc';
						} else {
							el[ pluginName ]( "sortBy" , v );
							newSortValue += '_desc';
						}
						if( $switcher ) {
							$switcher.find( 'select' ).val( newSortValue ).trigger( 'refresh' );
						}

						e.preventDefault();
					},
					handleDefault = function( heads ){
						$.each( heads , function( idx , el ){
							var $el = $( el );
							if( $el.is( "[" + attrs.defaultCol + "]" ) ){
								if( !$el.is( "." + classes.descend ) ) {
									$el.addClass( classes.ascend );
								}
							}
						});
					},
					addSwitcher = function( heads ){
						$switcher = $( '<div>' ).addClass( classes.switcher ).addClass( classes.tableToolbar );

						var html = [ '<label>' + Tablesaw.i18n.sort + ':' ];

						html.push( '<span class="btn"><select>' );
						heads.each(function( j ) {
							var $t = $( this );
							var isDefaultCol = $t.is( "[" + attrs.defaultCol + "]" );
							var isDescending = $t.is( "." + classes.descend );

							var hasNumericAttribute = $t.is( '[data-sortable-numeric]' );
							var numericCount = 0;
							// Check only the first four rows to see if the column is numbers.
							var numericCountMax = 5;
							$( this.cells.slice( 0, numericCountMax ) ).each(function() {
								if( !isNaN( parseInt( getSortValue( this ), 10 ) ) ) {
									numericCount++;
								}
							});
							var isNumeric = numericCount === numericCountMax;
							if( !hasNumericAttribute ) {
								$t.attr( "data-sortable-numeric", isNumeric ? "" : "false" );
							}

							html.push( '<option' + ( isDefaultCol && !isDescending ? ' selected' : '' ) + ' value="' + j + '_asc">' + $t.text() + ' ' + ( isNumeric ? '&#x2191;' : '(A-Z)' ) + '</option>' );
							html.push( '<option' + ( isDefaultCol && isDescending ? ' selected' : '' ) + ' value="' + j + '_desc">' + $t.text() + ' ' + ( isNumeric ? '&#x2193;' : '(Z-A)' ) + '</option>' );
						});
						html.push( '</select></span></label>' );

						$switcher.html( html.join('') );

						var $toolbar = el.prev().filter( '.tablesaw-bar' ),
							$firstChild = $toolbar.children().eq( 0 );

						if( $firstChild.length ) {
							$switcher.insertBefore( $firstChild );
						} else {
							$switcher.appendTo( $toolbar );
						}
						$switcher.find( '.btn' ).tablesawbtn();
						$switcher.find( 'select' ).on( 'change', function() {
							var val = $( this ).val().split( '_' ),
								head = heads.eq( val[ 0 ] );

							clearOthers( head.siblings() );
							el[ pluginName ]( 'sortBy', head.get( 0 ), val[ 1 ] === 'asc' );
						});
					};

					addClassToTable();
					heads = el.find( "thead th[data-" + pluginName + "-col]" );
					addClassToHeads( heads );
					makeHeadsActionable( heads , headsOnAction );
					handleDefault( heads );

					if( el.is( sortableSwitchSelector ) ) {
						addSwitcher( heads, el.find('tbody tr:nth-child(-n+3)') );
					}
			},
			getColumnNumber: function( col ){
				return $( col ).prevAll().length;
			},
			getTableRows: function(){
				return $( this ).find( "tbody tr" );
			},
			sortRows: function( rows , colNum , ascending, col ){
				var cells, fn, sorted;
				var getCells = function( rows ){
						var cells = [];
						$.each( rows , function( i , r ){
							var element = $( r ).children().get( colNum );
							cells.push({
								element: element,
								cell: getSortValue( element ),
								rowNum: i
							});
						});
						return cells;
					},
					getSortFxn = function( ascending, forceNumeric ){
						var fn,
							regex = /[^\-\+\d\.]/g;
						if( ascending ){
							fn = function( a , b ){
								if( forceNumeric ) {
									return parseFloat( a.cell.replace( regex, '' ) ) - parseFloat( b.cell.replace( regex, '' ) );
								} else {
									return a.cell.toLowerCase() > b.cell.toLowerCase() ? 1 : -1;
								}
							};
						} else {
							fn = function( a , b ){
								if( forceNumeric ) {
									return parseFloat( b.cell.replace( regex, '' ) ) - parseFloat( a.cell.replace( regex, '' ) );
								} else {
									return a.cell.toLowerCase() < b.cell.toLowerCase() ? 1 : -1;
								}
							};
						}
						return fn;
					},
					applyToRows = function( sorted , rows ){
						var newRows = [], i, l, cur;
						for( i = 0, l = sorted.length ; i < l ; i++ ){
							cur = sorted[ i ].rowNum;
							newRows.push( rows[cur] );
						}
						return newRows;
					};

				cells = getCells( rows );
				var customFn = $( col ).data( 'tablesaw-sort' );
				fn = ( customFn && typeof customFn === "function" ? customFn( ascending ) : false ) ||
					getSortFxn( ascending, $( col ).is( '[data-sortable-numeric]' ) && !$( col ).is( '[data-sortable-numeric="false"]' ) );

				sorted = cells.sort( fn );
				rows = applyToRows( sorted , rows );
				return rows;
			},
			replaceTableRows: function( rows ){
				var el = $( this ),
					body = el.find( "tbody" );

				for( var j = 0, k = rows.length; j < k; j++ ) {
					body.append( rows[ j ] );
				}
			},
			makeColDefault: function( col , a ){
				var c = $( col );
				c.attr( attrs.defaultCol , "true" );
				if( a ){
					c.removeClass( classes.descend );
					c.addClass( classes.ascend );
				} else {
					c.removeClass( classes.ascend );
					c.addClass( classes.descend );
				}
			},
			sortBy: function( col , ascending ){
				var el = $( this ), colNum, rows;

				colNum = el[ pluginName ]( "getColumnNumber" , col );
				rows = el[ pluginName ]( "getTableRows" );
				rows = el[ pluginName ]( "sortRows" , rows , colNum , ascending, col );
				el[ pluginName ]( "replaceTableRows" , rows );
				el[ pluginName ]( "makeColDefault" , col , ascending );
				el.trigger( "tablesaw-sorted" );
			}
		};

	// Collection method.
	$.fn[ pluginName ] = function( arrg ) {
		var args = Array.prototype.slice.call( arguments , 1),
			returnVal;

		// if it's a method
		if( arrg && typeof( arrg ) === "string" ){
			returnVal = $.fn[ pluginName ].prototype[ arrg ].apply( this[0], args );
			return (typeof returnVal !== "undefined")? returnVal:$(this);
		}
		// check init
		if( !$( this ).data( pluginName + "-active" ) ){
			$( this ).data( pluginName + "-active", true );
			$.fn[ pluginName ].prototype._create.call( this , arrg );
		}
		return $(this);
	};
	// add methods
	$.extend( $.fn[ pluginName ].prototype, methods );

	$( document ).on( "tablesawcreate", function( e, Tablesaw ) {
		if( Tablesaw.$table.is( initSelector ) ) {
			Tablesaw.$table[ pluginName ]();
		}
	});

}());

;(function(){

	$.extend( Tablesaw.config, {
		swipe: {
			horizontalThreshold: 15,
			verticalThreshold: 30
		}
	});

	function sumStyles( $el, props ) {
		var total = 0;
		for( var j = 0, k = props.length; j < k; j++ ) {
			total += parseInt( $el.css( props[ j ] ) || 0, 10 );
		}
		return total;
	}

	function outerWidth( el ) {
		var $el = $( el );
		return $el.width() + sumStyles( $el, [ "border-left-width", "border-right-width" ] );
	}

	var classes = {
		// TODO duplicate class, also in tables.js
		toolbar: "tablesaw-bar",
		hideBtn: "disabled",
		persistWidths: "tablesaw-fix-persist",
		allColumnsVisible: 'tablesaw-all-cols-visible'
	};
	var attrs = {
		disableTouchEvents: "data-tablesaw-no-touch"
	};

	function createSwipeTable( $table ){

		var $btns = $( "<div class='tablesaw-advance'></div>" ),
			$prevBtn = $( "<a href='#' class='tablesaw-nav-btn btn btn-micro left' title='Previous Column'></a>" ).appendTo( $btns ),
			$nextBtn = $( "<a href='#' class='tablesaw-nav-btn btn btn-micro right' title='Next Column'></a>" ).appendTo( $btns ),
			$headerCells = $table.find( "thead th" ),
			$headerCellsNoPersist = $headerCells.not( '[data-tablesaw-priority="persist"]' ),
			headerWidths = [],
			$head = $( document.head || 'head' ),
			tableId = $table.attr( 'id' );

		if( !$headerCells.length ) {
			throw new Error( "tablesaw swipe: no header cells found. Are you using <th> inside of <thead>?" );
		}

		$table.addClass( "tablesaw-swipe" );

		// Calculate initial widths
		$headerCells.each(function() {
			var width = outerWidth( this );
			headerWidths.push( width );
		});

		$btns.appendTo( $table.prev().filter( '.tablesaw-bar' ) );

		if( !tableId ) {
			tableId = 'tableswipe-' + Math.round( Math.random() * 10000 );
			$table.attr( 'id', tableId );
		}

		function $getCells( headerCell ) {
			return $( headerCell.cells ).add( headerCell );
		}

		function showColumn( headerCell ) {
			$getCells( headerCell ).removeClass( 'tablesaw-cell-hidden' );
		}

		function hideColumn( headerCell ) {
			$getCells( headerCell ).addClass( 'tablesaw-cell-hidden' );
		}

		function persistColumn( headerCell ) {
			$getCells( headerCell ).addClass( 'tablesaw-cell-persist' );
		}

		function isPersistent( headerCell ) {
			return $( headerCell ).is( '[data-tablesaw-priority="persist"]' );
		}

		function unmaintainWidths() {
			$table.removeClass( classes.persistWidths );
			$( '#' + tableId + '-persist' ).remove();
		}

		function maintainWidths() {
			var prefix = '#' + tableId + '.tablesaw-swipe ',
				styles = [],
				tableWidth = $table.width(),
				hash = [],
				newHash;

			$headerCells.each(function( index ) {
				var width;
				if( isPersistent( this ) ) {
					width = outerWidth( this );

					// Only save width on non-greedy columns (take up less than 75% of table width)
					if( width < tableWidth * 0.75 ) {
						hash.push( index + '-' + width );
						styles.push( prefix + ' .tablesaw-cell-persist:nth-child(' + ( index + 1 ) + ') { width: ' + width + 'px; }' );
					}
				}
			});
			newHash = hash.join( '_' );

			$table.addClass( classes.persistWidths );

			var $style = $( '#' + tableId + '-persist' );
			// If style element not yet added OR if the widths have changed
			if( !$style.length || $style.data( 'tablesaw-hash' ) !== newHash ) {
				// Remove existing
				$style.remove();

				if( styles.length ) {
					$( '<style>' + styles.join( "\n" ) + '</style>' )
						.attr( 'id', tableId + '-persist' )
						.data( 'tablesaw-hash', newHash )
						.appendTo( $head );
				}
			}
		}

		function getNext(){
			var next = [],
				checkFound;

			$headerCellsNoPersist.each(function( i ) {
				var $t = $( this ),
					isHidden = $t.css( "display" ) === "none" || $t.is( ".tablesaw-cell-hidden" );

				if( !isHidden && !checkFound ) {
					checkFound = true;
					next[ 0 ] = i;
				} else if( isHidden && checkFound ) {
					next[ 1 ] = i;

					return false;
				}
			});

			return next;
		}

		function getPrev(){
			var next = getNext();
			return [ next[ 1 ] - 1 , next[ 0 ] - 1 ];
		}

		function nextpair( fwd ){
			return fwd ? getNext() : getPrev();
		}

		function canAdvance( pair ){
			return pair[ 1 ] > -1 && pair[ 1 ] < $headerCellsNoPersist.length;
		}

		function matchesMedia() {
			var matchMedia = $table.attr( "data-tablesaw-swipe-media" );
			return !matchMedia || ( "matchMedia" in win ) && win.matchMedia( matchMedia ).matches;
		}

		function fakeBreakpoints() {
			if( !matchesMedia() ) {
				return;
			}

			var	containerWidth = $table.parent().width(),
				persist = [],
				sum = 0,
				sums = [],
				visibleNonPersistantCount = $headerCells.length;

			$headerCells.each(function( index ) {
				var $t = $( this ),
					isPersist = $t.is( '[data-tablesaw-priority="persist"]' );

				persist.push( isPersist );
				sum += headerWidths[ index ];
				sums.push( sum );

				// is persistent or is hidden
				if( isPersist || sum > containerWidth ) {
					visibleNonPersistantCount--;
				}
			});

			// We need at least one column to swipe.
			var needsNonPersistentColumn = visibleNonPersistantCount === 0;

			$headerCells.each(function( index ) {
				if( persist[ index ] ) {

					// for visual box-shadow
					persistColumn( this );
					return;
				}

				if( sums[ index ] <= containerWidth || needsNonPersistentColumn ) {
					needsNonPersistentColumn = false;
					showColumn( this );
				} else {
					hideColumn( this );
				}
			});

			unmaintainWidths();
			$table.trigger( 'tablesawcolumns' );
		}

		function advance( fwd ){
			var pair = nextpair( fwd );
			if( canAdvance( pair ) ){
				if( isNaN( pair[ 0 ] ) ){
					if( fwd ){
						pair[0] = 0;
					}
					else {
						pair[0] = $headerCellsNoPersist.length - 1;
					}
				}

				maintainWidths();

				hideColumn( $headerCellsNoPersist.get( pair[ 0 ] ) );
				showColumn( $headerCellsNoPersist.get( pair[ 1 ] ) );

				$table.trigger( 'tablesawcolumns' );
			}
		}

		$prevBtn.add( $nextBtn ).on( "click", function( e ){
			advance( !!$( e.target ).closest( $nextBtn ).length );
			e.preventDefault();
		});

		function getCoord( event, key ) {
			return ( event.touches || event.originalEvent.touches )[ 0 ][ key ];
		}

		if( !$table.is( "[" + attrs.disableTouchEvents + "]" ) ) {
			
			$table
				.on( "touchstart.swipetoggle", function( e ){
					var originX = getCoord( e, 'pageX' ),
						originY = getCoord( e, 'pageY' ),
						x,
						y;

					$( win ).off( "resize", fakeBreakpoints );

					$( this )
						.on( "touchmove", function( e ){
							x = getCoord( e, 'pageX' );
							y = getCoord( e, 'pageY' );
							var cfg = Tablesaw.config.swipe;
							if( Math.abs( x - originX ) > cfg.horizontalThreshold && Math.abs( y - originY ) < cfg.verticalThreshold ) {
								e.preventDefault();
							}
						})
						.on( "touchend.swipetoggle", function(){
							var cfg = Tablesaw.config.swipe;
							if( Math.abs( y - originY ) < cfg.verticalThreshold ) {
								if( x - originX < -1 * cfg.horizontalThreshold ){
									advance( true );
								}
								if( x - originX > cfg.horizontalThreshold ){
									advance( false );
								}
							}

							window.setTimeout(function() {
								$( win ).on( "resize", fakeBreakpoints );
							}, 300);
							$( this ).off( "touchmove touchend" );
						});
				});
		}

		$table
			.on( "tablesawcolumns.swipetoggle", function(){
				var canGoPrev = canAdvance( getPrev() );
				var canGoNext = canAdvance( getNext() );
				$prevBtn[ canGoPrev ? "removeClass" : "addClass" ]( classes.hideBtn );
				$nextBtn[ canGoNext ? "removeClass" : "addClass" ]( classes.hideBtn );

				$prevBtn.closest( "." + classes.toolbar )[ !canGoPrev && !canGoNext ? 'addClass' : 'removeClass' ]( classes.allColumnsVisible );
			})
			.on( "tablesawnext.swipetoggle", function(){
				advance( true );
			} )
			.on( "tablesawprev.swipetoggle", function(){
				advance( false );
			} )
			.on( "tablesawdestroy.swipetoggle", function(){
				var $t = $( this );

				$t.removeClass( 'tablesaw-swipe' );
				$t.prev().filter( '.tablesaw-bar' ).find( '.tablesaw-advance' ).remove();
				$( win ).off( "resize", fakeBreakpoints );

				$t.off( ".swipetoggle" );
			})
			.on( "tablesawrefresh", function() {
				// manual refresh
				headerWidths = [];
				$headerCells.each(function() {
					var width = outerWidth( this );
					headerWidths.push( width );
				});

				fakeBreakpoints();
			});

		fakeBreakpoints();
		$( win ).on( "resize", fakeBreakpoints );
	}



	// on tablecreate, init
	$( document ).on( "tablesawcreate", function( e, tablesaw ){
		if( tablesaw.mode === 'swipe' ){
			createSwipeTable( tablesaw.$table );
		}

	} );

}());

;(function(){

	var MiniMap = {
		attr: {
			init: 'data-tablesaw-minimap'
		}
	};

	function createMiniMap( $table ){

		var $btns = $( '<div class="tablesaw-advance minimap">' ),
			$dotNav = $( '<ul class="tablesaw-advance-dots">' ).appendTo( $btns ),
			hideDot = 'tablesaw-advance-dots-hide',
			$headerCells = $table.find( 'thead th' );

		// populate dots
		$headerCells.each(function(){
			$dotNav.append( '<li><i></i></li>' );
		});

		$btns.appendTo( $table.prev().filter( '.tablesaw-bar' ) );

		function showMinimap( $table ) {
			var mq = $table.attr( MiniMap.attr.init );
			return !mq || win.matchMedia && win.matchMedia( mq ).matches;
		}

		function showHideNav(){
			if( !showMinimap( $table ) ) {
				$btns.css( "display", "none" );
				return;
			}
			$btns.css( "display", "block" );

			// show/hide dots
			var dots = $dotNav.find( "li" ).removeClass( hideDot );
			$table.find( "thead th" ).each(function(i){
				if( $( this ).css( "display" ) === "none" ){
					dots.eq( i ).addClass( hideDot );
				}
			});
		}

		// run on init and resize
		showHideNav();
		$( win ).on( "resize", showHideNav );


		$table
			.on( "tablesawcolumns.minimap", function(){
				showHideNav();
			})
			.on( "tablesawdestroy.minimap", function(){
				var $t = $( this );

				$t.prev().filter( '.tablesaw-bar' ).find( '.tablesaw-advance' ).remove();
				$( win ).off( "resize", showHideNav );

				$t.off( ".minimap" );
			});
	}



	// on tablecreate, init
	$( document ).on( "tablesawcreate", function( e, tablesaw ){

		if( ( tablesaw.mode === 'swipe' || tablesaw.mode === 'columntoggle' ) && tablesaw.$table.is( '[ ' + MiniMap.attr.init + ']' ) ){
			createMiniMap( tablesaw.$table );
		}

	} );

}());

;(function() {

	var S = {
		selectors: {
			init: 'table[data-tablesaw-mode-switch]'
		},
		attributes: {
			excludeMode: 'data-tablesaw-mode-exclude'
		},
		classes: {
			main: 'tablesaw-modeswitch',
			toolbar: 'tablesaw-toolbar'
		},
		modes: [ 'stack', 'swipe', 'columntoggle' ],
		init: function( table ) {
			var $table = $( table ),
				ignoreMode = $table.attr( S.attributes.excludeMode ),
				$toolbar = $table.prev().filter( '.tablesaw-bar' ),
				modeVal = '',
				$switcher = $( '<div>' ).addClass( S.classes.main + ' ' + S.classes.toolbar );

			var html = [ '<label>' + Tablesaw.i18n.columns + ':' ],
				dataMode = $table.attr( 'data-tablesaw-mode' ),
				isSelected;

			html.push( '<span class="btn"><select>' );
			for( var j=0, k = S.modes.length; j<k; j++ ) {
				if( ignoreMode && ignoreMode.toLowerCase() === S.modes[ j ] ) {
					continue;
				}

				isSelected = dataMode === S.modes[ j ];

				if( isSelected ) {
					modeVal = S.modes[ j ];
				}

				html.push( '<option' +
					( isSelected ? ' selected' : '' ) +
					' value="' + S.modes[ j ] + '">' + Tablesaw.i18n.modes[ j ] + '</option>' );
			}
			html.push( '</select></span></label>' );

			$switcher.html( html.join( '' ) );

			var $otherToolbarItems = $toolbar.find( '.tablesaw-advance' ).eq( 0 );
			if( $otherToolbarItems.length ) {
				$switcher.insertBefore( $otherToolbarItems );
			} else {
				$switcher.appendTo( $toolbar );
			}

			$switcher.find( '.btn' ).tablesawbtn();
			$switcher.find( 'select' ).on( 'change', S.onModeChange );
		},
		onModeChange: function() {
			var $t = $( this ),
				$switcher = $t.closest( '.' + S.classes.main ),
				$table = $t.closest( '.tablesaw-bar' ).next().eq( 0 ),
				val = $t.val();

			$switcher.remove();
			$table.data( 'tablesaw' ).destroy();

			$table.attr( 'data-tablesaw-mode', val );
			$table.tablesaw();
		}
	};

	$( win.document ).on( "tablesawcreate", function( e, Tablesaw ) {
		if( Tablesaw.$table.is( S.selectors.init ) ) {
			S.init( Tablesaw.table );
		}
	});

})();
}));
;
/*! Tablesaw - v3.0.0-beta.3 - 2016-10-10
* https://github.com/filamentgroup/tablesaw
* Copyright (c) 2016 Filament Group; Licensed MIT */
;(function( win ) {

	var $ = 'jQuery' in win ? jQuery : shoestring;

	// DOM-ready auto-init of plugins.
	// Many plugins bind to an "enhance" event to init themselves on dom ready, or when new markup is inserted into the DOM
	$( function(){
		$( document ).trigger( "enhance.tablesaw" );
	});

})( typeof window !== "undefined" ? window : this );;
/**
 * @file
 * Attaches behaviors for Drupal's active link marking.
 */

(function (Drupal, drupalSettings) {

  'use strict';

  /**
   * Append is-active class.
   *
   * The link is only active if its path corresponds to the current path, the
   * language of the linked path is equal to the current language, and if the
   * query parameters of the link equal those of the current request, since the
   * same request with different query parameters may yield a different page
   * (e.g. pagers, exposed View filters).
   *
   * Does not discriminate based on element type, so allows you to set the
   * is-active class on any element: a, li…
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.activeLinks = {
    attach: function (context) {
      // Start by finding all potentially active links.
      var path = drupalSettings.path;
      var queryString = JSON.stringify(path.currentQuery);
      var querySelector = path.currentQuery ? "[data-drupal-link-query='" + queryString + "']" : ':not([data-drupal-link-query])';
      var originalSelectors = ['[data-drupal-link-system-path="' + path.currentPath + '"]'];
      var selectors;

      // If this is the front page, we have to check for the <front> path as
      // well.
      if (path.isFront) {
        originalSelectors.push('[data-drupal-link-system-path="<front>"]');
      }

      // Add language filtering.
      selectors = [].concat(
        // Links without any hreflang attributes (most of them).
        originalSelectors.map(function (selector) { return selector + ':not([hreflang])'; }),
        // Links with hreflang equals to the current language.
        originalSelectors.map(function (selector) { return selector + '[hreflang="' + path.currentLanguage + '"]'; })
      );

      // Add query string selector for pagers, exposed filters.
      selectors = selectors.map(function (current) { return current + querySelector; });

      // Query the DOM.
      var activeLinks = context.querySelectorAll(selectors.join(','));
      var il = activeLinks.length;
      for (var i = 0; i < il; i++) {
        activeLinks[i].classList.add('is-active');
      }
    },
    detach: function (context, settings, trigger) {
      if (trigger === 'unload') {
        var activeLinks = context.querySelectorAll('[data-drupal-link-system-path].is-active');
        var il = activeLinks.length;
        for (var i = 0; i < il; i++) {
          activeLinks[i].classList.remove('is-active');
        }
      }
    }
  };

})(Drupal, drupalSettings);
;
/**
 * @file
 * JavaScript API for the History module, with client-side caching.
 *
 * May only be loaded for authenticated users, with the History module enabled.
 */

(function ($, Drupal, drupalSettings, storage) {

  'use strict';

  var currentUserID = parseInt(drupalSettings.user.uid, 10);

  // Any comment that is older than 30 days is automatically considered read,
  // so for these we don't need to perform a request at all!
  var thirtyDaysAgo = Math.round(new Date().getTime() / 1000) - 30 * 24 * 60 * 60;

  // Use the data embedded in the page, if available.
  var embeddedLastReadTimestamps = false;
  if (drupalSettings.history && drupalSettings.history.lastReadTimestamps) {
    embeddedLastReadTimestamps = drupalSettings.history.lastReadTimestamps;
  }

  /**
   * @namespace
   */
  Drupal.history = {

    /**
     * Fetch "last read" timestamps for the given nodes.
     *
     * @param {Array} nodeIDs
     *   An array of node IDs.
     * @param {function} callback
     *   A callback that is called after the requested timestamps were fetched.
     */
    fetchTimestamps: function (nodeIDs, callback) {
      // Use the data embedded in the page, if available.
      if (embeddedLastReadTimestamps) {
        callback();
        return;
      }

      $.ajax({
        url: Drupal.url('history/get_node_read_timestamps'),
        type: 'POST',
        data: {'node_ids[]': nodeIDs},
        dataType: 'json',
        success: function (results) {
          for (var nodeID in results) {
            if (results.hasOwnProperty(nodeID)) {
              storage.setItem('Drupal.history.' + currentUserID + '.' + nodeID, results[nodeID]);
            }
          }
          callback();
        }
      });
    },

    /**
     * Get the last read timestamp for the given node.
     *
     * @param {number|string} nodeID
     *   A node ID.
     *
     * @return {number}
     *   A UNIX timestamp.
     */
    getLastRead: function (nodeID) {
      // Use the data embedded in the page, if available.
      if (embeddedLastReadTimestamps && embeddedLastReadTimestamps[nodeID]) {
        return parseInt(embeddedLastReadTimestamps[nodeID], 10);
      }
      return parseInt(storage.getItem('Drupal.history.' + currentUserID + '.' + nodeID) || 0, 10);
    },

    /**
     * Marks a node as read, store the last read timestamp client-side.
     *
     * @param {number|string} nodeID
     *   A node ID.
     */
    markAsRead: function (nodeID) {
      $.ajax({
        url: Drupal.url('history/' + nodeID + '/read'),
        type: 'POST',
        dataType: 'json',
        success: function (timestamp) {
          // If the data is embedded in the page, don't store on the client
          // side.
          if (embeddedLastReadTimestamps && embeddedLastReadTimestamps[nodeID]) {
            return;
          }

          storage.setItem('Drupal.history.' + currentUserID + '.' + nodeID, timestamp);
        }
      });
    },

    /**
     * Determines whether a server check is necessary.
     *
     * Any content that is >30 days old never gets a "new" or "updated"
     * indicator. Any content that was published before the oldest known reading
     * also never gets a "new" or "updated" indicator, because it must've been
     * read already.
     *
     * @param {number|string} nodeID
     *   A node ID.
     * @param {number} contentTimestamp
     *   The time at which some content (e.g. a comment) was published.
     *
     * @return {bool}
     *   Whether a server check is necessary for the given node and its
     *   timestamp.
     */
    needsServerCheck: function (nodeID, contentTimestamp) {
      // First check if the content is older than 30 days, then we can bail
      // early.
      if (contentTimestamp < thirtyDaysAgo) {
        return false;
      }

      // Use the data embedded in the page, if available.
      if (embeddedLastReadTimestamps && embeddedLastReadTimestamps[nodeID]) {
        return contentTimestamp > parseInt(embeddedLastReadTimestamps[nodeID], 10);
      }

      var minLastReadTimestamp = parseInt(storage.getItem('Drupal.history.' + currentUserID + '.' + nodeID) || 0, 10);
      return contentTimestamp > minLastReadTimestamp;
    }
  };

})(jQuery, Drupal, drupalSettings, window.localStorage);
;
/**
 * @file
 * Marks the nodes listed in drupalSettings.history.nodesToMarkAsRead as read.
 *
 * Uses the History module JavaScript API.
 *
 * @see Drupal.history
 */

(function (window, Drupal, drupalSettings) {

  'use strict';

  // When the window's "load" event is triggered, mark all enumerated nodes as
  // read. This still allows for Drupal behaviors (which are triggered on the
  // "DOMContentReady" event) to add "new" and "updated" indicators.
  window.addEventListener('load', function () {
    if (drupalSettings.history && drupalSettings.history.nodesToMarkAsRead) {
      Object.keys(drupalSettings.history.nodesToMarkAsRead).forEach(Drupal.history.markAsRead);
    }
  });

})(window, Drupal, drupalSettings);
;
/*!
 * jQuery Form Plugin
 * version: 3.51.0-2014.06.20
 * Requires jQuery v1.5 or later
 * Copyright (c) 2014 M. Alsup
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Project repository: https://github.com/malsup/form
 * Dual licensed under the MIT and GPL licenses.
 * https://github.com/malsup/form#copyright-and-license
 */
!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery"],e):e("undefined"!=typeof jQuery?jQuery:window.Zepto)}(function(e){"use strict";function t(t){var r=t.data;t.isDefaultPrevented()||(t.preventDefault(),e(t.target).ajaxSubmit(r))}function r(t){var r=t.target,a=e(r);if(!a.is("[type=submit],[type=image]")){var n=a.closest("[type=submit]");if(0===n.length)return;r=n[0]}var i=this;if(i.clk=r,"image"==r.type)if(void 0!==t.offsetX)i.clk_x=t.offsetX,i.clk_y=t.offsetY;else if("function"==typeof e.fn.offset){var o=a.offset();i.clk_x=t.pageX-o.left,i.clk_y=t.pageY-o.top}else i.clk_x=t.pageX-r.offsetLeft,i.clk_y=t.pageY-r.offsetTop;setTimeout(function(){i.clk=i.clk_x=i.clk_y=null},100)}function a(){if(e.fn.ajaxSubmit.debug){var t="[jquery.form] "+Array.prototype.join.call(arguments,"");window.console&&window.console.log?window.console.log(t):window.opera&&window.opera.postError&&window.opera.postError(t)}}var n={};n.fileapi=void 0!==e("<input type='file'/>").get(0).files,n.formdata=void 0!==window.FormData;var i=!!e.fn.prop;e.fn.attr2=function(){if(!i)return this.attr.apply(this,arguments);var e=this.prop.apply(this,arguments);return e&&e.jquery||"string"==typeof e?e:this.attr.apply(this,arguments)},e.fn.ajaxSubmit=function(t){function r(r){var a,n,i=e.param(r,t.traditional).split("&"),o=i.length,s=[];for(a=0;o>a;a++)i[a]=i[a].replace(/\+/g," "),n=i[a].split("="),s.push([decodeURIComponent(n[0]),decodeURIComponent(n[1])]);return s}function o(a){for(var n=new FormData,i=0;i<a.length;i++)n.append(a[i].name,a[i].value);if(t.extraData){var o=r(t.extraData);for(i=0;i<o.length;i++)o[i]&&n.append(o[i][0],o[i][1])}t.data=null;var s=e.extend(!0,{},e.ajaxSettings,t,{contentType:!1,processData:!1,cache:!1,type:u||"POST"});t.uploadProgress&&(s.xhr=function(){var r=e.ajaxSettings.xhr();return r.upload&&r.upload.addEventListener("progress",function(e){var r=0,a=e.loaded||e.position,n=e.total;e.lengthComputable&&(r=Math.ceil(a/n*100)),t.uploadProgress(e,a,n,r)},!1),r}),s.data=null;var c=s.beforeSend;return s.beforeSend=function(e,r){r.data=t.formData?t.formData:n,c&&c.call(this,e,r)},e.ajax(s)}function s(r){function n(e){var t=null;try{e.contentWindow&&(t=e.contentWindow.document)}catch(r){a("cannot get iframe.contentWindow document: "+r)}if(t)return t;try{t=e.contentDocument?e.contentDocument:e.document}catch(r){a("cannot get iframe.contentDocument: "+r),t=e.document}return t}function o(){function t(){try{var e=n(g).readyState;a("state = "+e),e&&"uninitialized"==e.toLowerCase()&&setTimeout(t,50)}catch(r){a("Server abort: ",r," (",r.name,")"),s(k),j&&clearTimeout(j),j=void 0}}var r=f.attr2("target"),i=f.attr2("action"),o="multipart/form-data",c=f.attr("enctype")||f.attr("encoding")||o;w.setAttribute("target",p),(!u||/post/i.test(u))&&w.setAttribute("method","POST"),i!=m.url&&w.setAttribute("action",m.url),m.skipEncodingOverride||u&&!/post/i.test(u)||f.attr({encoding:"multipart/form-data",enctype:"multipart/form-data"}),m.timeout&&(j=setTimeout(function(){T=!0,s(D)},m.timeout));var l=[];try{if(m.extraData)for(var d in m.extraData)m.extraData.hasOwnProperty(d)&&l.push(e.isPlainObject(m.extraData[d])&&m.extraData[d].hasOwnProperty("name")&&m.extraData[d].hasOwnProperty("value")?e('<input type="hidden" name="'+m.extraData[d].name+'">').val(m.extraData[d].value).appendTo(w)[0]:e('<input type="hidden" name="'+d+'">').val(m.extraData[d]).appendTo(w)[0]);m.iframeTarget||v.appendTo("body"),g.attachEvent?g.attachEvent("onload",s):g.addEventListener("load",s,!1),setTimeout(t,15);try{w.submit()}catch(h){var x=document.createElement("form").submit;x.apply(w)}}finally{w.setAttribute("action",i),w.setAttribute("enctype",c),r?w.setAttribute("target",r):f.removeAttr("target"),e(l).remove()}}function s(t){if(!x.aborted&&!F){if(M=n(g),M||(a("cannot access response document"),t=k),t===D&&x)return x.abort("timeout"),void S.reject(x,"timeout");if(t==k&&x)return x.abort("server abort"),void S.reject(x,"error","server abort");if(M&&M.location.href!=m.iframeSrc||T){g.detachEvent?g.detachEvent("onload",s):g.removeEventListener("load",s,!1);var r,i="success";try{if(T)throw"timeout";var o="xml"==m.dataType||M.XMLDocument||e.isXMLDoc(M);if(a("isXml="+o),!o&&window.opera&&(null===M.body||!M.body.innerHTML)&&--O)return a("requeing onLoad callback, DOM not available"),void setTimeout(s,250);var u=M.body?M.body:M.documentElement;x.responseText=u?u.innerHTML:null,x.responseXML=M.XMLDocument?M.XMLDocument:M,o&&(m.dataType="xml"),x.getResponseHeader=function(e){var t={"content-type":m.dataType};return t[e.toLowerCase()]},u&&(x.status=Number(u.getAttribute("status"))||x.status,x.statusText=u.getAttribute("statusText")||x.statusText);var c=(m.dataType||"").toLowerCase(),l=/(json|script|text)/.test(c);if(l||m.textarea){var f=M.getElementsByTagName("textarea")[0];if(f)x.responseText=f.value,x.status=Number(f.getAttribute("status"))||x.status,x.statusText=f.getAttribute("statusText")||x.statusText;else if(l){var p=M.getElementsByTagName("pre")[0],h=M.getElementsByTagName("body")[0];p?x.responseText=p.textContent?p.textContent:p.innerText:h&&(x.responseText=h.textContent?h.textContent:h.innerText)}}else"xml"==c&&!x.responseXML&&x.responseText&&(x.responseXML=X(x.responseText));try{E=_(x,c,m)}catch(y){i="parsererror",x.error=r=y||i}}catch(y){a("error caught: ",y),i="error",x.error=r=y||i}x.aborted&&(a("upload aborted"),i=null),x.status&&(i=x.status>=200&&x.status<300||304===x.status?"success":"error"),"success"===i?(m.success&&m.success.call(m.context,E,"success",x),S.resolve(x.responseText,"success",x),d&&e.event.trigger("ajaxSuccess",[x,m])):i&&(void 0===r&&(r=x.statusText),m.error&&m.error.call(m.context,x,i,r),S.reject(x,"error",r),d&&e.event.trigger("ajaxError",[x,m,r])),d&&e.event.trigger("ajaxComplete",[x,m]),d&&!--e.active&&e.event.trigger("ajaxStop"),m.complete&&m.complete.call(m.context,x,i),F=!0,m.timeout&&clearTimeout(j),setTimeout(function(){m.iframeTarget?v.attr("src",m.iframeSrc):v.remove(),x.responseXML=null},100)}}}var c,l,m,d,p,v,g,x,y,b,T,j,w=f[0],S=e.Deferred();if(S.abort=function(e){x.abort(e)},r)for(l=0;l<h.length;l++)c=e(h[l]),i?c.prop("disabled",!1):c.removeAttr("disabled");if(m=e.extend(!0,{},e.ajaxSettings,t),m.context=m.context||m,p="jqFormIO"+(new Date).getTime(),m.iframeTarget?(v=e(m.iframeTarget),b=v.attr2("name"),b?p=b:v.attr2("name",p)):(v=e('<iframe name="'+p+'" src="'+m.iframeSrc+'" />'),v.css({position:"absolute",top:"-1000px",left:"-1000px"})),g=v[0],x={aborted:0,responseText:null,responseXML:null,status:0,statusText:"n/a",getAllResponseHeaders:function(){},getResponseHeader:function(){},setRequestHeader:function(){},abort:function(t){var r="timeout"===t?"timeout":"aborted";a("aborting upload... "+r),this.aborted=1;try{g.contentWindow.document.execCommand&&g.contentWindow.document.execCommand("Stop")}catch(n){}v.attr("src",m.iframeSrc),x.error=r,m.error&&m.error.call(m.context,x,r,t),d&&e.event.trigger("ajaxError",[x,m,r]),m.complete&&m.complete.call(m.context,x,r)}},d=m.global,d&&0===e.active++&&e.event.trigger("ajaxStart"),d&&e.event.trigger("ajaxSend",[x,m]),m.beforeSend&&m.beforeSend.call(m.context,x,m)===!1)return m.global&&e.active--,S.reject(),S;if(x.aborted)return S.reject(),S;y=w.clk,y&&(b=y.name,b&&!y.disabled&&(m.extraData=m.extraData||{},m.extraData[b]=y.value,"image"==y.type&&(m.extraData[b+".x"]=w.clk_x,m.extraData[b+".y"]=w.clk_y)));var D=1,k=2,A=e("meta[name=csrf-token]").attr("content"),L=e("meta[name=csrf-param]").attr("content");L&&A&&(m.extraData=m.extraData||{},m.extraData[L]=A),m.forceSync?o():setTimeout(o,10);var E,M,F,O=50,X=e.parseXML||function(e,t){return window.ActiveXObject?(t=new ActiveXObject("Microsoft.XMLDOM"),t.async="false",t.loadXML(e)):t=(new DOMParser).parseFromString(e,"text/xml"),t&&t.documentElement&&"parsererror"!=t.documentElement.nodeName?t:null},C=e.parseJSON||function(e){return window.eval("("+e+")")},_=function(t,r,a){var n=t.getResponseHeader("content-type")||"",i="xml"===r||!r&&n.indexOf("xml")>=0,o=i?t.responseXML:t.responseText;return i&&"parsererror"===o.documentElement.nodeName&&e.error&&e.error("parsererror"),a&&a.dataFilter&&(o=a.dataFilter(o,r)),"string"==typeof o&&("json"===r||!r&&n.indexOf("json")>=0?o=C(o):("script"===r||!r&&n.indexOf("javascript")>=0)&&e.globalEval(o)),o};return S}if(!this.length)return a("ajaxSubmit: skipping submit process - no element selected"),this;var u,c,l,f=this;"function"==typeof t?t={success:t}:void 0===t&&(t={}),u=t.type||this.attr2("method"),c=t.url||this.attr2("action"),l="string"==typeof c?e.trim(c):"",l=l||window.location.href||"",l&&(l=(l.match(/^([^#]+)/)||[])[1]),t=e.extend(!0,{url:l,success:e.ajaxSettings.success,type:u||e.ajaxSettings.type,iframeSrc:/^https/i.test(window.location.href||"")?"javascript:false":"about:blank"},t);var m={};if(this.trigger("form-pre-serialize",[this,t,m]),m.veto)return a("ajaxSubmit: submit vetoed via form-pre-serialize trigger"),this;if(t.beforeSerialize&&t.beforeSerialize(this,t)===!1)return a("ajaxSubmit: submit aborted via beforeSerialize callback"),this;var d=t.traditional;void 0===d&&(d=e.ajaxSettings.traditional);var p,h=[],v=this.formToArray(t.semantic,h);if(t.data&&(t.extraData=t.data,p=e.param(t.data,d)),t.beforeSubmit&&t.beforeSubmit(v,this,t)===!1)return a("ajaxSubmit: submit aborted via beforeSubmit callback"),this;if(this.trigger("form-submit-validate",[v,this,t,m]),m.veto)return a("ajaxSubmit: submit vetoed via form-submit-validate trigger"),this;var g=e.param(v,d);p&&(g=g?g+"&"+p:p),"GET"==t.type.toUpperCase()?(t.url+=(t.url.indexOf("?")>=0?"&":"?")+g,t.data=null):t.data=g;var x=[];if(t.resetForm&&x.push(function(){f.resetForm()}),t.clearForm&&x.push(function(){f.clearForm(t.includeHidden)}),!t.dataType&&t.target){var y=t.success||function(){};x.push(function(r){var a=t.replaceTarget?"replaceWith":"html";e(t.target)[a](r).each(y,arguments)})}else t.success&&x.push(t.success);if(t.success=function(e,r,a){for(var n=t.context||this,i=0,o=x.length;o>i;i++)x[i].apply(n,[e,r,a||f,f])},t.error){var b=t.error;t.error=function(e,r,a){var n=t.context||this;b.apply(n,[e,r,a,f])}}if(t.complete){var T=t.complete;t.complete=function(e,r){var a=t.context||this;T.apply(a,[e,r,f])}}var j=e("input[type=file]:enabled",this).filter(function(){return""!==e(this).val()}),w=j.length>0,S="multipart/form-data",D=f.attr("enctype")==S||f.attr("encoding")==S,k=n.fileapi&&n.formdata;a("fileAPI :"+k);var A,L=(w||D)&&!k;t.iframe!==!1&&(t.iframe||L)?t.closeKeepAlive?e.get(t.closeKeepAlive,function(){A=s(v)}):A=s(v):A=(w||D)&&k?o(v):e.ajax(t),f.removeData("jqxhr").data("jqxhr",A);for(var E=0;E<h.length;E++)h[E]=null;return this.trigger("form-submit-notify",[this,t]),this},e.fn.ajaxForm=function(n){if(n=n||{},n.delegation=n.delegation&&e.isFunction(e.fn.on),!n.delegation&&0===this.length){var i={s:this.selector,c:this.context};return!e.isReady&&i.s?(a("DOM not ready, queuing ajaxForm"),e(function(){e(i.s,i.c).ajaxForm(n)}),this):(a("terminating; zero elements found by selector"+(e.isReady?"":" (DOM not ready)")),this)}return n.delegation?(e(document).off("submit.form-plugin",this.selector,t).off("click.form-plugin",this.selector,r).on("submit.form-plugin",this.selector,n,t).on("click.form-plugin",this.selector,n,r),this):this.ajaxFormUnbind().bind("submit.form-plugin",n,t).bind("click.form-plugin",n,r)},e.fn.ajaxFormUnbind=function(){return this.unbind("submit.form-plugin click.form-plugin")},e.fn.formToArray=function(t,r){var a=[];if(0===this.length)return a;var i,o=this[0],s=this.attr("id"),u=t?o.getElementsByTagName("*"):o.elements;if(u&&!/MSIE [678]/.test(navigator.userAgent)&&(u=e(u).get()),s&&(i=e(':input[form="'+s+'"]').get(),i.length&&(u=(u||[]).concat(i))),!u||!u.length)return a;var c,l,f,m,d,p,h;for(c=0,p=u.length;p>c;c++)if(d=u[c],f=d.name,f&&!d.disabled)if(t&&o.clk&&"image"==d.type)o.clk==d&&(a.push({name:f,value:e(d).val(),type:d.type}),a.push({name:f+".x",value:o.clk_x},{name:f+".y",value:o.clk_y}));else if(m=e.fieldValue(d,!0),m&&m.constructor==Array)for(r&&r.push(d),l=0,h=m.length;h>l;l++)a.push({name:f,value:m[l]});else if(n.fileapi&&"file"==d.type){r&&r.push(d);var v=d.files;if(v.length)for(l=0;l<v.length;l++)a.push({name:f,value:v[l],type:d.type});else a.push({name:f,value:"",type:d.type})}else null!==m&&"undefined"!=typeof m&&(r&&r.push(d),a.push({name:f,value:m,type:d.type,required:d.required}));if(!t&&o.clk){var g=e(o.clk),x=g[0];f=x.name,f&&!x.disabled&&"image"==x.type&&(a.push({name:f,value:g.val()}),a.push({name:f+".x",value:o.clk_x},{name:f+".y",value:o.clk_y}))}return a},e.fn.formSerialize=function(t){return e.param(this.formToArray(t))},e.fn.fieldSerialize=function(t){var r=[];return this.each(function(){var a=this.name;if(a){var n=e.fieldValue(this,t);if(n&&n.constructor==Array)for(var i=0,o=n.length;o>i;i++)r.push({name:a,value:n[i]});else null!==n&&"undefined"!=typeof n&&r.push({name:this.name,value:n})}}),e.param(r)},e.fn.fieldValue=function(t){for(var r=[],a=0,n=this.length;n>a;a++){var i=this[a],o=e.fieldValue(i,t);null===o||"undefined"==typeof o||o.constructor==Array&&!o.length||(o.constructor==Array?e.merge(r,o):r.push(o))}return r},e.fieldValue=function(t,r){var a=t.name,n=t.type,i=t.tagName.toLowerCase();if(void 0===r&&(r=!0),r&&(!a||t.disabled||"reset"==n||"button"==n||("checkbox"==n||"radio"==n)&&!t.checked||("submit"==n||"image"==n)&&t.form&&t.form.clk!=t||"select"==i&&-1==t.selectedIndex))return null;if("select"==i){var o=t.selectedIndex;if(0>o)return null;for(var s=[],u=t.options,c="select-one"==n,l=c?o+1:u.length,f=c?o:0;l>f;f++){var m=u[f];if(m.selected){var d=m.value;if(d||(d=m.attributes&&m.attributes.value&&!m.attributes.value.specified?m.text:m.value),c)return d;s.push(d)}}return s}return e(t).val()},e.fn.clearForm=function(t){return this.each(function(){e("input,select,textarea",this).clearFields(t)})},e.fn.clearFields=e.fn.clearInputs=function(t){var r=/^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;return this.each(function(){var a=this.type,n=this.tagName.toLowerCase();r.test(a)||"textarea"==n?this.value="":"checkbox"==a||"radio"==a?this.checked=!1:"select"==n?this.selectedIndex=-1:"file"==a?/MSIE/.test(navigator.userAgent)?e(this).replaceWith(e(this).clone(!0)):e(this).val(""):t&&(t===!0&&/hidden/.test(a)||"string"==typeof t&&e(this).is(t))&&(this.value="")})},e.fn.resetForm=function(){return this.each(function(){("function"==typeof this.reset||"object"==typeof this.reset&&!this.reset.nodeType)&&this.reset()})},e.fn.enable=function(e){return void 0===e&&(e=!0),this.each(function(){this.disabled=!e})},e.fn.selected=function(t){return void 0===t&&(t=!0),this.each(function(){var r=this.type;if("checkbox"==r||"radio"==r)this.checked=t;else if("option"==this.tagName.toLowerCase()){var a=e(this).parent("select");t&&a[0]&&"select-one"==a[0].type&&a.find("option").selected(!1),this.selected=t}})},e.fn.ajaxSubmit.debug=!1});
;
/**
 * @file
 * Some basic behaviors and utility functions for Views.
 */

(function ($, Drupal, drupalSettings) {

  'use strict';

  /**
   * @namespace
   */
  Drupal.Views = {};

  /**
   * Helper function to parse a querystring.
   *
   * @param {string} query
   *   The querystring to parse.
   *
   * @return {object}
   *   A map of query parameters.
   */
  Drupal.Views.parseQueryString = function (query) {
    var args = {};
    var pos = query.indexOf('?');
    if (pos !== -1) {
      query = query.substring(pos + 1);
    }
    var pair;
    var pairs = query.split('&');
    for (var i = 0; i < pairs.length; i++) {
      pair = pairs[i].split('=');
      // Ignore the 'q' path argument, if present.
      if (pair[0] !== 'q' && pair[1]) {
        args[decodeURIComponent(pair[0].replace(/\+/g, ' '))] = decodeURIComponent(pair[1].replace(/\+/g, ' '));
      }
    }
    return args;
  };

  /**
   * Helper function to return a view's arguments based on a path.
   *
   * @param {string} href
   *   The href to check.
   * @param {string} viewPath
   *   The views path to check.
   *
   * @return {object}
   *   An object containing `view_args` and `view_path`.
   */
  Drupal.Views.parseViewArgs = function (href, viewPath) {
    var returnObj = {};
    var path = Drupal.Views.getPath(href);
    // Get viewPath url without baseUrl portion.
    var viewHref = Drupal.url(viewPath).substring(drupalSettings.path.baseUrl.length);
    // Ensure we have a correct path.
    if (viewHref && path.substring(0, viewHref.length + 1) === viewHref + '/') {
      returnObj.view_args = decodeURIComponent(path.substring(viewHref.length + 1, path.length));
      returnObj.view_path = path;
    }
    return returnObj;
  };

  /**
   * Strip off the protocol plus domain from an href.
   *
   * @param {string} href
   *   The href to strip.
   *
   * @return {string}
   *   The href without the protocol and domain.
   */
  Drupal.Views.pathPortion = function (href) {
    // Remove e.g. http://example.com if present.
    var protocol = window.location.protocol;
    if (href.substring(0, protocol.length) === protocol) {
      // 2 is the length of the '//' that normally follows the protocol.
      href = href.substring(href.indexOf('/', protocol.length + 2));
    }
    return href;
  };

  /**
   * Return the Drupal path portion of an href.
   *
   * @param {string} href
   *   The href to check.
   *
   * @return {string}
   *   An internal path.
   */
  Drupal.Views.getPath = function (href) {
    href = Drupal.Views.pathPortion(href);
    href = href.substring(drupalSettings.path.baseUrl.length, href.length);
    // 3 is the length of the '?q=' added to the url without clean urls.
    if (href.substring(0, 3) === '?q=') {
      href = href.substring(3, href.length);
    }
    var chars = ['#', '?', '&'];
    for (var i = 0; i < chars.length; i++) {
      if (href.indexOf(chars[i]) > -1) {
        href = href.substr(0, href.indexOf(chars[i]));
      }
    }
    return href;
  };

})(jQuery, Drupal, drupalSettings);
;
/**
 * @file
 * Handles AJAX fetching of views, including filter submission and response.
 */

(function ($, Drupal, drupalSettings) {

  'use strict';

  /**
   * Attaches the AJAX behavior to exposed filters forms and key View links.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attaches ajaxView functionality to relevant elements.
   */
  Drupal.behaviors.ViewsAjaxView = {};
  Drupal.behaviors.ViewsAjaxView.attach = function () {
    if (drupalSettings && drupalSettings.views && drupalSettings.views.ajaxViews) {
      var ajaxViews = drupalSettings.views.ajaxViews;
      for (var i in ajaxViews) {
        if (ajaxViews.hasOwnProperty(i)) {
          Drupal.views.instances[i] = new Drupal.views.ajaxView(ajaxViews[i]);
        }
      }
    }
  };

  /**
   * @namespace
   */
  Drupal.views = {};

  /**
   * @type {object.<string, Drupal.views.ajaxView>}
   */
  Drupal.views.instances = {};

  /**
   * Javascript object for a certain view.
   *
   * @constructor
   *
   * @param {object} settings
   *   Settings object for the ajax view.
   * @param {string} settings.view_dom_id
   *   The DOM id of the view.
   */
  Drupal.views.ajaxView = function (settings) {
    var selector = '.js-view-dom-id-' + settings.view_dom_id;
    this.$view = $(selector);

    // Retrieve the path to use for views' ajax.
    var ajax_path = drupalSettings.views.ajax_path;

    // If there are multiple views this might've ended up showing up multiple
    // times.
    if (ajax_path.constructor.toString().indexOf('Array') !== -1) {
      ajax_path = ajax_path[0];
    }

    // Check if there are any GET parameters to send to views.
    var queryString = window.location.search || '';
    if (queryString !== '') {
      // Remove the question mark and Drupal path component if any.
      queryString = queryString.slice(1).replace(/q=[^&]+&?|&?render=[^&]+/, '');
      if (queryString !== '') {
        // If there is a '?' in ajax_path, clean url are on and & should be
        // used to add parameters.
        queryString = ((/\?/.test(ajax_path)) ? '&' : '?') + queryString;
      }
    }

    this.element_settings = {
      url: ajax_path + queryString,
      submit: settings,
      setClick: true,
      event: 'click',
      selector: selector,
      progress: {type: 'fullscreen'}
    };

    this.settings = settings;

    // Add the ajax to exposed forms.
    this.$exposed_form = $('form#views-exposed-form-' + settings.view_name.replace(/_/g, '-') + '-' + settings.view_display_id.replace(/_/g, '-'));
    this.$exposed_form.once('exposed-form').each($.proxy(this.attachExposedFormAjax, this));

    // Add the ajax to pagers.
    this.$view
      // Don't attach to nested views. Doing so would attach multiple behaviors
      // to a given element.
      .filter($.proxy(this.filterNestedViews, this))
      .once('ajax-pager').each($.proxy(this.attachPagerAjax, this));

    // Add a trigger to update this view specifically. In order to trigger a
    // refresh use the following code.
    //
    // @code
    // $('.view-name').trigger('RefreshView');
    // @endcode
    var self_settings = $.extend({}, this.element_settings, {
      event: 'RefreshView',
      base: this.selector,
      element: this.$view.get(0)
    });
    this.refreshViewAjax = Drupal.ajax(self_settings);
  };

  /**
   * @method
   */
  Drupal.views.ajaxView.prototype.attachExposedFormAjax = function () {
    var that = this;
    this.exposedFormAjax = [];
    // Exclude the reset buttons so no AJAX behaviours are bound. Many things
    // break during the form reset phase if using AJAX.
    $('input[type=submit], input[type=image]', this.$exposed_form).not('[data-drupal-selector=edit-reset]').each(function (index) {
      var self_settings = $.extend({}, that.element_settings, {
        base: $(this).attr('id'),
        element: this
      });
      that.exposedFormAjax[index] = Drupal.ajax(self_settings);
    });
  };

  /**
   * @return {bool}
   *   If there is at least one parent with a view class return false.
   */
  Drupal.views.ajaxView.prototype.filterNestedViews = function () {
    // If there is at least one parent with a view class, this view
    // is nested (e.g., an attachment). Bail.
    return !this.$view.parents('.view').length;
  };

  /**
   * Attach the ajax behavior to each link.
   */
  Drupal.views.ajaxView.prototype.attachPagerAjax = function () {
    this.$view.find('ul.js-pager__items > li > a, th.views-field a, .attachment .views-summary a')
      .each($.proxy(this.attachPagerLinkAjax, this));
  };

  /**
   * Attach the ajax behavior to a singe link.
   *
   * @param {string} [id]
   *   The ID of the link.
   * @param {HTMLElement} link
   *   The link element.
   */
  Drupal.views.ajaxView.prototype.attachPagerLinkAjax = function (id, link) {
    var $link = $(link);
    var viewData = {};
    var href = $link.attr('href');
    // Construct an object using the settings defaults and then overriding
    // with data specific to the link.
    $.extend(
      viewData,
      this.settings,
      Drupal.Views.parseQueryString(href),
      // Extract argument data from the URL.
      Drupal.Views.parseViewArgs(href, this.settings.view_base_path)
    );

    var self_settings = $.extend({}, this.element_settings, {
      submit: viewData,
      base: false,
      element: link
    });
    this.pagerAjax = Drupal.ajax(self_settings);
  };

  /**
   * Views scroll to top ajax command.
   *
   * @param {Drupal.Ajax} [ajax]
   *   A {@link Drupal.ajax} object.
   * @param {object} response
   *   Ajax response.
   * @param {string} response.selector
   *   Selector to use.
   */
  Drupal.AjaxCommands.prototype.viewsScrollTop = function (ajax, response) {
    // Scroll to the top of the view. This will allow users
    // to browse newly loaded content after e.g. clicking a pager
    // link.
    var offset = $(response.selector).offset();
    // We can't guarantee that the scrollable object should be
    // the body, as the view could be embedded in something
    // more complex such as a modal popup. Recurse up the DOM
    // and scroll the first element that has a non-zero top.
    var scrollTarget = response.selector;
    while ($(scrollTarget).scrollTop() === 0 && $(scrollTarget).parent()) {
      scrollTarget = $(scrollTarget).parent();
    }
    // Only scroll upward.
    if (offset.top - 10 < $(scrollTarget).scrollTop()) {
      $(scrollTarget).animate({scrollTop: (offset.top - 10)}, 500);
    }
  };

})(jQuery, Drupal, drupalSettings);
;
window.matchMedia||(window.matchMedia=function(){"use strict";var e=window.styleMedia||window.media;if(!e){var t=document.createElement("style"),i=document.getElementsByTagName("script")[0],n=null;t.type="text/css";t.id="matchmediajs-test";i.parentNode.insertBefore(t,i);n="getComputedStyle"in window&&window.getComputedStyle(t,null)||t.currentStyle;e={matchMedium:function(e){var i="@media "+e+"{ #matchmediajs-test { width: 1px; } }";if(t.styleSheet){t.styleSheet.cssText=i}else{t.textContent=i}return n.width==="1px"}}}return function(t){return{matches:e.matchMedium(t||"all"),media:t||"all"}}}());
;
/**
 * @file
 * Adds an HTML element and method to trigger audio UAs to read system messages.
 *
 * Use {@link Drupal.announce} to indicate to screen reader users that an
 * element on the page has changed state. For instance, if clicking a link
 * loads 10 more items into a list, one might announce the change like this.
 *
 * @example
 * $('#search-list')
 *   .on('itemInsert', function (event, data) {
 *     // Insert the new items.
 *     $(data.container.el).append(data.items.el);
 *     // Announce the change to the page contents.
 *     Drupal.announce(Drupal.t('@count items added to @container',
 *       {'@count': data.items.length, '@container': data.container.title}
 *     ));
 *   });
 */

(function (Drupal, debounce) {

  'use strict';

  var liveElement;
  var announcements = [];

  /**
   * Builds a div element with the aria-live attribute and add it to the DOM.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attaches the behavior for drupalAnnouce.
   */
  Drupal.behaviors.drupalAnnounce = {
    attach: function (context) {
      // Create only one aria-live element.
      if (!liveElement) {
        liveElement = document.createElement('div');
        liveElement.id = 'drupal-live-announce';
        liveElement.className = 'visually-hidden';
        liveElement.setAttribute('aria-live', 'polite');
        liveElement.setAttribute('aria-busy', 'false');
        document.body.appendChild(liveElement);
      }
    }
  };

  /**
   * Concatenates announcements to a single string; appends to the live region.
   */
  function announce() {
    var text = [];
    var priority = 'polite';
    var announcement;

    // Create an array of announcement strings to be joined and appended to the
    // aria live region.
    var il = announcements.length;
    for (var i = 0; i < il; i++) {
      announcement = announcements.pop();
      text.unshift(announcement.text);
      // If any of the announcements has a priority of assertive then the group
      // of joined announcements will have this priority.
      if (announcement.priority === 'assertive') {
        priority = 'assertive';
      }
    }

    if (text.length) {
      // Clear the liveElement so that repeated strings will be read.
      liveElement.innerHTML = '';
      // Set the busy state to true until the node changes are complete.
      liveElement.setAttribute('aria-busy', 'true');
      // Set the priority to assertive, or default to polite.
      liveElement.setAttribute('aria-live', priority);
      // Print the text to the live region. Text should be run through
      // Drupal.t() before being passed to Drupal.announce().
      liveElement.innerHTML = text.join('\n');
      // The live text area is updated. Allow the AT to announce the text.
      liveElement.setAttribute('aria-busy', 'false');
    }
  }

  /**
   * Triggers audio UAs to read the supplied text.
   *
   * The aria-live region will only read the text that currently populates its
   * text node. Replacing text quickly in rapid calls to announce results in
   * only the text from the most recent call to {@link Drupal.announce} being
   * read. By wrapping the call to announce in a debounce function, we allow for
   * time for multiple calls to {@link Drupal.announce} to queue up their
   * messages. These messages are then joined and append to the aria-live region
   * as one text node.
   *
   * @param {string} text
   *   A string to be read by the UA.
   * @param {string} [priority='polite']
   *   A string to indicate the priority of the message. Can be either
   *   'polite' or 'assertive'.
   *
   * @return {function}
   *   The return of the call to debounce.
   *
   * @see http://www.w3.org/WAI/PF/aria-practices/#liveprops
   */
  Drupal.announce = function (text, priority) {
    // Save the text and priority into a closure variable. Multiple simultaneous
    // announcements will be concatenated and read in sequence.
    announcements.push({
      text: text,
      priority: priority
    });
    // Immediately invoke the function that debounce returns. 200 ms is right at
    // the cusp where humans notice a pause, so we will wait
    // at most this much time before the set of queued announcements is read.
    return (debounce(announce, 200)());
  };
}(Drupal, Drupal.debounce));
;
(function(){if(window.matchMedia&&window.matchMedia("all").addListener){return false}var e=window.matchMedia,i=e("only all").matches,n=false,t=0,a=[],r=function(i){clearTimeout(t);t=setTimeout(function(){for(var i=0,n=a.length;i<n;i++){var t=a[i].mql,r=a[i].listeners||[],o=e(t.media).matches;if(o!==t.matches){t.matches=o;for(var s=0,l=r.length;s<l;s++){r[s].call(window,t)}}}},30)};window.matchMedia=function(t){var o=e(t),s=[],l=0;o.addListener=function(e){if(!i){return}if(!n){n=true;window.addEventListener("resize",r,true)}if(l===0){l=a.push({mql:o,listeners:s})}s.push(e)};o.removeListener=function(e){for(var i=0,n=s.length;i<n;i++){if(s[i]===e){s.splice(i,1)}}};return o}})();
;
/**
 * @file
 * Builds a nested accordion widget.
 *
 * Invoke on an HTML list element with the jQuery plugin pattern.
 *
 * @example
 * $('.toolbar-menu').drupalToolbarMenu();
 */

(function ($, Drupal, drupalSettings) {

  'use strict';

  /**
   * Store the open menu tray.
   */
  var activeItem = Drupal.url(drupalSettings.path.currentPath);

  $.fn.drupalToolbarMenu = function () {

    var ui = {
      handleOpen: Drupal.t('Extend'),
      handleClose: Drupal.t('Collapse')
    };

    /**
     * Handle clicks from the disclosure button on an item with sub-items.
     *
     * @param {Object} event
     *   A jQuery Event object.
     */
    function toggleClickHandler(event) {
      var $toggle = $(event.target);
      var $item = $toggle.closest('li');
      // Toggle the list item.
      toggleList($item);
      // Close open sibling menus.
      var $openItems = $item.siblings().filter('.open');
      toggleList($openItems, false);
    }

    /**
     * Handle clicks from a menu item link.
     *
     * @param {Object} event
     *   A jQuery Event object.
     */
    function linkClickHandler(event) {
      // If the toolbar is positioned fixed (and therefore hiding content
      // underneath), then users expect clicks in the administration menu tray
      // to take them to that destination but for the menu tray to be closed
      // after clicking: otherwise the toolbar itself is obstructing the view
      // of the destination they chose.
      if (!Drupal.toolbar.models.toolbarModel.get('isFixed')) {
        Drupal.toolbar.models.toolbarModel.set('activeTab', null);
      }
      // Stopping propagation to make sure that once a toolbar-box is clicked
      // (the whitespace part), the page is not redirected anymore.
      event.stopPropagation();
    }

    /**
     * Toggle the open/close state of a list is a menu.
     *
     * @param {jQuery} $item
     *   The li item to be toggled.
     *
     * @param {Boolean} switcher
     *   A flag that forces toggleClass to add or a remove a class, rather than
     *   simply toggling its presence.
     */
    function toggleList($item, switcher) {
      var $toggle = $item.children('.toolbar-box').children('.toolbar-handle');
      switcher = (typeof switcher !== 'undefined') ? switcher : !$item.hasClass('open');
      // Toggle the item open state.
      $item.toggleClass('open', switcher);
      // Twist the toggle.
      $toggle.toggleClass('open', switcher);
      // Adjust the toggle text.
      $toggle
        .find('.action')
        // Expand Structure, Collapse Structure.
        .text((switcher) ? ui.handleClose : ui.handleOpen);
    }

    /**
     * Add markup to the menu elements.
     *
     * Items with sub-elements have a list toggle attached to them. Menu item
     * links and the corresponding list toggle are wrapped with in a div
     * classed with .toolbar-box. The .toolbar-box div provides a positioning
     * context for the item list toggle.
     *
     * @param {jQuery} $menu
     *   The root of the menu to be initialized.
     */
    function initItems($menu) {
      var options = {
        class: 'toolbar-icon toolbar-handle',
        action: ui.handleOpen,
        text: ''
      };
      // Initialize items and their links.
      $menu.find('li > a').wrap('<div class="toolbar-box">');
      // Add a handle to each list item if it has a menu.
      $menu.find('li').each(function (index, element) {
        var $item = $(element);
        if ($item.children('ul.toolbar-menu').length) {
          var $box = $item.children('.toolbar-box');
          options.text = Drupal.t('@label', {'@label': $box.find('a').text()});
          $item.children('.toolbar-box')
            .append(Drupal.theme('toolbarMenuItemToggle', options));
        }
      });
    }

    /**
     * Adds a level class to each list based on its depth in the menu.
     *
     * This function is called recursively on each sub level of lists elements
     * until the depth of the menu is exhausted.
     *
     * @param {jQuery} $lists
     *   A jQuery object of ul elements.
     *
     * @param {number} level
     *   The current level number to be assigned to the list elements.
     */
    function markListLevels($lists, level) {
      level = (!level) ? 1 : level;
      var $lis = $lists.children('li').addClass('level-' + level);
      $lists = $lis.children('ul');
      if ($lists.length) {
        markListLevels($lists, level + 1);
      }
    }

    /**
     * On page load, open the active menu item.
     *
     * Marks the trail of the active link in the menu back to the root of the
     * menu with .menu-item--active-trail.
     *
     * @param {jQuery} $menu
     *   The root of the menu.
     */
    function openActiveItem($menu) {
      var pathItem = $menu.find('a[href="' + location.pathname + '"]');
      if (pathItem.length && !activeItem) {
        activeItem = location.pathname;
      }
      if (activeItem) {
        var $activeItem = $menu.find('a[href="' + activeItem + '"]').addClass('menu-item--active');
        var $activeTrail = $activeItem.parentsUntil('.root', 'li').addClass('menu-item--active-trail');
        toggleList($activeTrail, true);
      }
    }

    // Return the jQuery object.
    return this.each(function (selector) {
      var $menu = $(this).once('toolbar-menu');
      if ($menu.length) {
        // Bind event handlers.
        $menu
          .on('click.toolbar', '.toolbar-box', toggleClickHandler)
          .on('click.toolbar', '.toolbar-box a', linkClickHandler);

        $menu.addClass('root');
        initItems($menu);
        markListLevels($menu);
        // Restore previous and active states.
        openActiveItem($menu);
      }
    });
  };

  /**
   * A toggle is an interactive element often bound to a click handler.
   *
   * @param {object} options
   *   Options for the button.
   * @param {string} options.class
   *   Class to set on the button.
   * @param {string} options.action
   *   Action for the button.
   * @param {string} options.text
   *   Used as label for the button.
   *
   * @return {string}
   *   A string representing a DOM fragment.
   */
  Drupal.theme.toolbarMenuItemToggle = function (options) {
    return '<button class="' + options['class'] + '"><span class="action">' + options.action + '</span><span class="label">' + options.text + '</span></button>';
  };

}(jQuery, Drupal, drupalSettings));
;
/**
 * @file
 * Defines the behavior of the Drupal administration toolbar.
 */

(function ($, Drupal, drupalSettings) {

  'use strict';

  // Merge run-time settings with the defaults.
  var options = $.extend(
    {
      breakpoints: {
        'toolbar.narrow': '',
        'toolbar.standard': '',
        'toolbar.wide': ''
      }
    },
    drupalSettings.toolbar,
    // Merge strings on top of drupalSettings so that they are not mutable.
    {
      strings: {
        horizontal: Drupal.t('Horizontal orientation'),
        vertical: Drupal.t('Vertical orientation')
      }
    }
  );

  /**
   * Registers tabs with the toolbar.
   *
   * The Drupal toolbar allows modules to register top-level tabs. These may
   * point directly to a resource or toggle the visibility of a tray.
   *
   * Modules register tabs with hook_toolbar().
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attaches the toolbar rendering functionality to the toolbar element.
   */
  Drupal.behaviors.toolbar = {
    attach: function (context) {
      // Verify that the user agent understands media queries. Complex admin
      // toolbar layouts require media query support.
      if (!window.matchMedia('only screen').matches) {
        return;
      }
      // Process the administrative toolbar.
      $(context).find('#toolbar-administration').once('toolbar').each(function () {

        // Establish the toolbar models and views.
        var model = Drupal.toolbar.models.toolbarModel = new Drupal.toolbar.ToolbarModel({
          locked: JSON.parse(localStorage.getItem('Drupal.toolbar.trayVerticalLocked')) || false,
          activeTab: document.getElementById(JSON.parse(localStorage.getItem('Drupal.toolbar.activeTabID')))
        });
        Drupal.toolbar.views.toolbarVisualView = new Drupal.toolbar.ToolbarVisualView({
          el: this,
          model: model,
          strings: options.strings
        });
        Drupal.toolbar.views.toolbarAuralView = new Drupal.toolbar.ToolbarAuralView({
          el: this,
          model: model,
          strings: options.strings
        });
        Drupal.toolbar.views.bodyVisualView = new Drupal.toolbar.BodyVisualView({
          el: this,
          model: model
        });

        // Render collapsible menus.
        var menuModel = Drupal.toolbar.models.menuModel = new Drupal.toolbar.MenuModel();
        Drupal.toolbar.views.menuVisualView = new Drupal.toolbar.MenuVisualView({
          el: $(this).find('.toolbar-menu-administration').get(0),
          model: menuModel,
          strings: options.strings
        });

        // Handle the resolution of Drupal.toolbar.setSubtrees.
        // This is handled with a deferred so that the function may be invoked
        // asynchronously.
        Drupal.toolbar.setSubtrees.done(function (subtrees) {
          menuModel.set('subtrees', subtrees);
          var theme = drupalSettings.ajaxPageState.theme;
          localStorage.setItem('Drupal.toolbar.subtrees.' + theme, JSON.stringify(subtrees));
          // Indicate on the toolbarModel that subtrees are now loaded.
          model.set('areSubtreesLoaded', true);
        });

        // Attach a listener to the configured media query breakpoints.
        for (var label in options.breakpoints) {
          if (options.breakpoints.hasOwnProperty(label)) {
            var mq = options.breakpoints[label];
            var mql = Drupal.toolbar.mql[label] = window.matchMedia(mq);
            // Curry the model and the label of the media query breakpoint to
            // the mediaQueryChangeHandler function.
            mql.addListener(Drupal.toolbar.mediaQueryChangeHandler.bind(null, model, label));
            // Fire the mediaQueryChangeHandler for each configured breakpoint
            // so that they process once.
            Drupal.toolbar.mediaQueryChangeHandler.call(null, model, label, mql);
          }
        }

        // Trigger an initial attempt to load menu subitems. This first attempt
        // is made after the media query handlers have had an opportunity to
        // process. The toolbar starts in the vertical orientation by default,
        // unless the viewport is wide enough to accommodate a horizontal
        // orientation. Thus we give the Toolbar a chance to determine if it
        // should be set to horizontal orientation before attempting to load
        // menu subtrees.
        Drupal.toolbar.views.toolbarVisualView.loadSubtrees();

        $(document)
          // Update the model when the viewport offset changes.
          .on('drupalViewportOffsetChange.toolbar', function (event, offsets) {
            model.set('offsets', offsets);
          });

        // Broadcast model changes to other modules.
        model
          .on('change:orientation', function (model, orientation) {
            $(document).trigger('drupalToolbarOrientationChange', orientation);
          })
          .on('change:activeTab', function (model, tab) {
            $(document).trigger('drupalToolbarTabChange', tab);
          })
          .on('change:activeTray', function (model, tray) {
            $(document).trigger('drupalToolbarTrayChange', tray);
          });

        // If the toolbar's orientation is horizontal and no active tab is
        // defined then show the tray of the first toolbar tab by default (but
        // not the first 'Home' toolbar tab).
        if (Drupal.toolbar.models.toolbarModel.get('orientation') === 'horizontal' && Drupal.toolbar.models.toolbarModel.get('activeTab') === null) {
          Drupal.toolbar.models.toolbarModel.set({
            activeTab: $('.toolbar-bar .toolbar-tab:not(.home-toolbar-tab) a').get(0)
          });
        }
      });
    }
  };

  /**
   * Toolbar methods of Backbone objects.
   *
   * @namespace
   */
  Drupal.toolbar = {

    /**
     * A hash of View instances.
     *
     * @type {object.<string, Backbone.View>}
     */
    views: {},

    /**
     * A hash of Model instances.
     *
     * @type {object.<string, Backbone.Model>}
     */
    models: {},

    /**
     * A hash of MediaQueryList objects tracked by the toolbar.
     *
     * @type {object.<string, object>}
     */
    mql: {},

    /**
     * Accepts a list of subtree menu elements.
     *
     * A deferred object that is resolved by an inlined JavaScript callback.
     *
     * @type {jQuery.Deferred}
     *
     * @see toolbar_subtrees_jsonp().
     */
    setSubtrees: new $.Deferred(),

    /**
     * Respond to configured narrow media query changes.
     *
     * @param {Drupal.toolbar.ToolbarModel} model
     *   A toolbar model
     * @param {string} label
     *   Media query label.
     * @param {object} mql
     *   A MediaQueryList object.
     */
    mediaQueryChangeHandler: function (model, label, mql) {
      switch (label) {
        case 'toolbar.narrow':
          model.set({
            isOriented: mql.matches,
            isTrayToggleVisible: false
          });
          // If the toolbar doesn't have an explicit orientation yet, or if the
          // narrow media query doesn't match then set the orientation to
          // vertical.
          if (!mql.matches || !model.get('orientation')) {
            model.set({orientation: 'vertical'}, {validate: true});
          }
          break;

        case 'toolbar.standard':
          model.set({
            isFixed: mql.matches
          });
          break;

        case 'toolbar.wide':
          model.set({
            orientation: ((mql.matches) ? 'horizontal' : 'vertical')
          }, {validate: true});
          // The tray orientation toggle visibility does not need to be
          // validated.
          model.set({
            isTrayToggleVisible: mql.matches
          });
          break;

        default:
          break;
      }
    }
  };

  /**
   * A toggle is an interactive element often bound to a click handler.
   *
   * @return {string}
   *   A string representing a DOM fragment.
   */
  Drupal.theme.toolbarOrientationToggle = function () {
    return '<div class="toolbar-toggle-orientation"><div class="toolbar-lining">' +
      '<button class="toolbar-icon" type="button"></button>' +
      '</div></div>';
  };

  /**
   * Ajax command to set the toolbar subtrees.
   *
   * @param {Drupal.Ajax} ajax
   *   {@link Drupal.Ajax} object created by {@link Drupal.ajax}.
   * @param {object} response
   *   JSON response from the Ajax request.
   * @param {number} [status]
   *   XMLHttpRequest status.
   */
  Drupal.AjaxCommands.prototype.setToolbarSubtrees = function (ajax, response, status) {
    Drupal.toolbar.setSubtrees.resolve(response.subtrees);
  };

}(jQuery, Drupal, drupalSettings));
;
/**
 * @file
 * A Backbone Model for collapsible menus.
 */

(function (Backbone, Drupal) {

  'use strict';

  /**
   * Backbone Model for collapsible menus.
   *
   * @constructor
   *
   * @augments Backbone.Model
   */
  Drupal.toolbar.MenuModel = Backbone.Model.extend(/** @lends Drupal.toolbar.MenuModel# */{

    /**
     * @type {object}
     *
     * @prop {object} subtrees
     */
    defaults: /** @lends Drupal.toolbar.MenuModel# */{

      /**
       * @type {object}
       */
      subtrees: {}
    }
  });

}(Backbone, Drupal));
;
/**
 * @file
 * A Backbone Model for the toolbar.
 */

(function (Backbone, Drupal) {

  'use strict';

  /**
   * Backbone model for the toolbar.
   *
   * @constructor
   *
   * @augments Backbone.Model
   */
  Drupal.toolbar.ToolbarModel = Backbone.Model.extend(/** @lends Drupal.toolbar.ToolbarModel# */{

    /**
     * @type {object}
     *
     * @prop activeTab
     * @prop activeTray
     * @prop isOriented
     * @prop isFixed
     * @prop areSubtreesLoaded
     * @prop isViewportOverflowConstrained
     * @prop orientation
     * @prop locked
     * @prop isTrayToggleVisible
     * @prop height
     * @prop offsets
     */
    defaults: /** @lends Drupal.toolbar.ToolbarModel# */{

      /**
       * The active toolbar tab. All other tabs should be inactive under
       * normal circumstances. It will remain active across page loads. The
       * active item is stored as an ID selector e.g. '#toolbar-item--1'.
       *
       * @type {string}
       */
      activeTab: null,

      /**
       * Represents whether a tray is open or not. Stored as an ID selector e.g.
       * '#toolbar-item--1-tray'.
       *
       * @type {string}
       */
      activeTray: null,

      /**
       * Indicates whether the toolbar is displayed in an oriented fashion,
       * either horizontal or vertical.
       *
       * @type {bool}
       */
      isOriented: false,

      /**
       * Indicates whether the toolbar is positioned absolute (false) or fixed
       * (true).
       *
       * @type {bool}
       */
      isFixed: false,

      /**
       * Menu subtrees are loaded through an AJAX request only when the Toolbar
       * is set to a vertical orientation.
       *
       * @type {bool}
       */
      areSubtreesLoaded: false,

      /**
       * If the viewport overflow becomes constrained, isFixed must be true so
       * that elements in the trays aren't lost off-screen and impossible to
       * get to.
       *
       * @type {bool}
       */
      isViewportOverflowConstrained: false,

      /**
       * The orientation of the active tray.
       *
       * @type {string}
       */
      orientation: 'vertical',

      /**
       * A tray is locked if a user toggled it to vertical. Otherwise a tray
       * will switch between vertical and horizontal orientation based on the
       * configured breakpoints. The locked state will be maintained across page
       * loads.
       *
       * @type {bool}
       */
      locked: false,

      /**
       * Indicates whether the tray orientation toggle is visible.
       *
       * @type {bool}
       */
      isTrayToggleVisible: false,

      /**
       * The height of the toolbar.
       *
       * @type {number}
       */
      height: null,

      /**
       * The current viewport offsets determined by {@link Drupal.displace}. The
       * offsets suggest how a module might position is components relative to
       * the viewport.
       *
       * @type {object}
       *
       * @prop {number} top
       * @prop {number} right
       * @prop {number} bottom
       * @prop {number} left
       */
      offsets: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    },

    /**
     * @inheritdoc
     *
     * @param {object} attributes
     *   Attributes for the toolbar.
     * @param {object} options
     *   Options for the toolbar.
     *
     * @return {string|undefined}
     *   Returns an error message if validation failed.
     */
    validate: function (attributes, options) {
      // Prevent the orientation being set to horizontal if it is locked, unless
      // override has not been passed as an option.
      if (attributes.orientation === 'horizontal' && this.get('locked') && !options.override) {
        return Drupal.t('The toolbar cannot be set to a horizontal orientation when it is locked.');
      }
    }
  });

}(Backbone, Drupal));
;
/**
 * @file
 * A Backbone view for the body element.
 */

(function ($, Drupal, Backbone) {

  'use strict';

  Drupal.toolbar.BodyVisualView = Backbone.View.extend(/** @lends Drupal.toolbar.BodyVisualView# */{

    /**
     * Adjusts the body element with the toolbar position and dimension changes.
     *
     * @constructs
     *
     * @augments Backbone.View
     */
    initialize: function () {
      this.listenTo(this.model, 'change:orientation change:offsets change:activeTray change:isOriented change:isFixed change:isViewportOverflowConstrained', this.render);
    },

    /**
     * @inheritdoc
     */
    render: function () {
      var $body = $('body');
      var orientation = this.model.get('orientation');
      var isOriented = this.model.get('isOriented');
      var isViewportOverflowConstrained = this.model.get('isViewportOverflowConstrained');

      $body
        // We are using JavaScript to control media-query handling for two
        // reasons: (1) Using JavaScript let's us leverage the breakpoint
        // configurations and (2) the CSS is really complex if we try to hide
        // some styling from browsers that don't understand CSS media queries.
        // If we drive the CSS from classes added through JavaScript,
        // then the CSS becomes simpler and more robust.
        .toggleClass('toolbar-vertical', (orientation === 'vertical'))
        .toggleClass('toolbar-horizontal', (isOriented && orientation === 'horizontal'))
        // When the toolbar is fixed, it will not scroll with page scrolling.
        .toggleClass('toolbar-fixed', (isViewportOverflowConstrained || this.model.get('isFixed')))
        // Toggle the toolbar-tray-open class on the body element. The class is
        // applied when a toolbar tray is active. Padding might be applied to
        // the body element to prevent the tray from overlapping content.
        .toggleClass('toolbar-tray-open', !!this.model.get('activeTray'))
        // Apply padding to the top of the body to offset the placement of the
        // toolbar bar element.
        .css('padding-top', this.model.get('offsets').top);
    }
  });

}(jQuery, Drupal, Backbone));
;
/**
 * @file
 * A Backbone view for the collapsible menus.
 */

(function ($, Backbone, Drupal) {

  'use strict';

  Drupal.toolbar.MenuVisualView = Backbone.View.extend(/** @lends Drupal.toolbar.MenuVisualView# */{

    /**
     * Backbone View for collapsible menus.
     *
     * @constructs
     *
     * @augments Backbone.View
     */
    initialize: function () {
      this.listenTo(this.model, 'change:subtrees', this.render);
    },

    /**
     * @inheritdoc
     */
    render: function () {
      var subtrees = this.model.get('subtrees');
      // Add subtrees.
      for (var id in subtrees) {
        if (subtrees.hasOwnProperty(id)) {
          this.$el
            .find('#toolbar-link-' + id)
            .once('toolbar-subtrees')
            .after(subtrees[id]);
        }
      }
      // Render the main menu as a nested, collapsible accordion.
      if ('drupalToolbarMenu' in $.fn) {
        this.$el
          .children('.toolbar-menu')
          .drupalToolbarMenu();
      }
    }
  });

}(jQuery, Backbone, Drupal));
;
/**
 * @file
 * A Backbone view for the aural feedback of the toolbar.
 */

(function (Backbone, Drupal) {

  'use strict';

  Drupal.toolbar.ToolbarAuralView = Backbone.View.extend(/** @lends Drupal.toolbar.ToolbarAuralView# */{

    /**
     * Backbone view for the aural feedback of the toolbar.
     *
     * @constructs
     *
     * @augments Backbone.View
     *
     * @param {object} options
     *   Options for the view.
     * @param {object} options.strings
     *   Various strings to use in the view.
     */
    initialize: function (options) {
      this.strings = options.strings;

      this.listenTo(this.model, 'change:orientation', this.onOrientationChange);
      this.listenTo(this.model, 'change:activeTray', this.onActiveTrayChange);
    },

    /**
     * Announces an orientation change.
     *
     * @param {Drupal.toolbar.ToolbarModel} model
     *   The toolbar model in question.
     * @param {string} orientation
     *   The new value of the orientation attribute in the model.
     */
    onOrientationChange: function (model, orientation) {
      Drupal.announce(Drupal.t('Tray orientation changed to @orientation.', {
        '@orientation': orientation
      }));
    },

    /**
     * Announces a changed active tray.
     *
     * @param {Drupal.toolbar.ToolbarModel} model
     *   The toolbar model in question.
     * @param {HTMLElement} tray
     *   The new value of the tray attribute in the model.
     */
    onActiveTrayChange: function (model, tray) {
      var relevantTray = (tray === null) ? model.previous('activeTray') : tray;
      var action = (tray === null) ? Drupal.t('closed') : Drupal.t('opened');
      var trayNameElement = relevantTray.querySelector('.toolbar-tray-name');
      var text;
      if (trayNameElement !== null) {
        text = Drupal.t('Tray "@tray" @action.', {
          '@tray': trayNameElement.textContent, '@action': action
        });
      }
      else {
        text = Drupal.t('Tray @action.', {'@action': action});
      }
      Drupal.announce(text);
    }
  });

}(Backbone, Drupal));
;
/**
 * @file
 * A Backbone view for the toolbar element. Listens to mouse & touch.
 */

(function ($, Drupal, drupalSettings, Backbone) {

  'use strict';

  Drupal.toolbar.ToolbarVisualView = Backbone.View.extend(/** @lends Drupal.toolbar.ToolbarVisualView# */{

    /**
     * Event map for the `ToolbarVisualView`.
     *
     * @return {object}
     *   A map of events.
     */
    events: function () {
      // Prevents delay and simulated mouse events.
      var touchEndToClick = function (event) {
        event.preventDefault();
        event.target.click();
      };

      return {
        'click .toolbar-bar .toolbar-tab .trigger': 'onTabClick',
        'click .toolbar-toggle-orientation button': 'onOrientationToggleClick',
        'touchend .toolbar-bar .toolbar-tab .trigger': touchEndToClick,
        'touchend .toolbar-toggle-orientation button': touchEndToClick
      };
    },

    /**
     * Backbone view for the toolbar element. Listens to mouse & touch.
     *
     * @constructs
     *
     * @augments Backbone.View
     *
     * @param {object} options
     *   Options for the view object.
     * @param {object} options.strings
     *   Various strings to use in the view.
     */
    initialize: function (options) {
      this.strings = options.strings;

      this.listenTo(this.model, 'change:activeTab change:orientation change:isOriented change:isTrayToggleVisible', this.render);
      this.listenTo(this.model, 'change:mqMatches', this.onMediaQueryChange);
      this.listenTo(this.model, 'change:offsets', this.adjustPlacement);

      // Add the tray orientation toggles.
      this.$el
        .find('.toolbar-tray .toolbar-lining')
        .append(Drupal.theme('toolbarOrientationToggle'));

      // Trigger an activeTab change so that listening scripts can respond on
      // page load. This will call render.
      this.model.trigger('change:activeTab');
    },

    /**
     * @inheritdoc
     *
     * @return {Drupal.toolbar.ToolbarVisualView}
     *   The `ToolbarVisualView` instance.
     */
    render: function () {
      this.updateTabs();
      this.updateTrayOrientation();
      this.updateBarAttributes();
      // Load the subtrees if the orientation of the toolbar is changed to
      // vertical. This condition responds to the case that the toolbar switches
      // from horizontal to vertical orientation. The toolbar starts in a
      // vertical orientation by default and then switches to horizontal during
      // initialization if the media query conditions are met. Simply checking
      // that the orientation is vertical here would result in the subtrees
      // always being loaded, even when the toolbar initialization ultimately
      // results in a horizontal orientation.
      //
      // @see Drupal.behaviors.toolbar.attach() where admin menu subtrees
      // loading is invoked during initialization after media query conditions
      // have been processed.
      if (this.model.changed.orientation === 'vertical' || this.model.changed.activeTab) {
        this.loadSubtrees();
      }
      // Trigger a recalculation of viewport displacing elements. Use setTimeout
      // to ensure this recalculation happens after changes to visual elements
      // have processed.
      window.setTimeout(function () {
        Drupal.displace(true);
      }, 0);
      return this;
    },

    /**
     * Responds to a toolbar tab click.
     *
     * @param {jQuery.Event} event
     *   The event triggered.
     */
    onTabClick: function (event) {
      // If this tab has a tray associated with it, it is considered an
      // activatable tab.
      if (event.target.hasAttribute('data-toolbar-tray')) {
        var activeTab = this.model.get('activeTab');
        var clickedTab = event.target;

        // Set the event target as the active item if it is not already.
        this.model.set('activeTab', (!activeTab || clickedTab !== activeTab) ? clickedTab : null);

        event.preventDefault();
        event.stopPropagation();
      }
    },

    /**
     * Toggles the orientation of a toolbar tray.
     *
     * @param {jQuery.Event} event
     *   The event triggered.
     */
    onOrientationToggleClick: function (event) {
      var orientation = this.model.get('orientation');
      // Determine the toggle-to orientation.
      var antiOrientation = (orientation === 'vertical') ? 'horizontal' : 'vertical';
      var locked = antiOrientation === 'vertical';
      // Remember the locked state.
      if (locked) {
        localStorage.setItem('Drupal.toolbar.trayVerticalLocked', 'true');
      }
      else {
        localStorage.removeItem('Drupal.toolbar.trayVerticalLocked');
      }
      // Update the model.
      this.model.set({
        locked: locked,
        orientation: antiOrientation
      }, {
        validate: true,
        override: true
      });

      event.preventDefault();
      event.stopPropagation();
    },

    /**
     * Updates the display of the tabs: toggles a tab and the associated tray.
     */
    updateTabs: function () {
      var $tab = $(this.model.get('activeTab'));
      // Deactivate the previous tab.
      $(this.model.previous('activeTab'))
        .removeClass('is-active')
        .prop('aria-pressed', false);
      // Deactivate the previous tray.
      $(this.model.previous('activeTray'))
        .removeClass('is-active');

      // Activate the selected tab.
      if ($tab.length > 0) {
        $tab
          .addClass('is-active')
          // Mark the tab as pressed.
          .prop('aria-pressed', true);
        var name = $tab.attr('data-toolbar-tray');
        // Store the active tab name or remove the setting.
        var id = $tab.get(0).id;
        if (id) {
          localStorage.setItem('Drupal.toolbar.activeTabID', JSON.stringify(id));
        }
        // Activate the associated tray.
        var $tray = this.$el.find('[data-toolbar-tray="' + name + '"].toolbar-tray');
        if ($tray.length) {
          $tray.addClass('is-active');
          this.model.set('activeTray', $tray.get(0));
        }
        else {
          // There is no active tray.
          this.model.set('activeTray', null);
        }
      }
      else {
        // There is no active tray.
        this.model.set('activeTray', null);
        localStorage.removeItem('Drupal.toolbar.activeTabID');
      }
    },

    /**
     * Update the attributes of the toolbar bar element.
     */
    updateBarAttributes: function () {
      var isOriented = this.model.get('isOriented');
      if (isOriented) {
        this.$el.find('.toolbar-bar').attr('data-offset-top', '');
      }
      else {
        this.$el.find('.toolbar-bar').removeAttr('data-offset-top');
      }
      // Toggle between a basic vertical view and a more sophisticated
      // horizontal and vertical display of the toolbar bar and trays.
      this.$el.toggleClass('toolbar-oriented', isOriented);
    },

    /**
     * Updates the orientation of the active tray if necessary.
     */
    updateTrayOrientation: function () {
      var orientation = this.model.get('orientation');
      // The antiOrientation is used to render the view of action buttons like
      // the tray orientation toggle.
      var antiOrientation = (orientation === 'vertical') ? 'horizontal' : 'vertical';
      // Update the orientation of the trays.
      var $trays = this.$el.find('.toolbar-tray')
        .removeClass('toolbar-tray-horizontal toolbar-tray-vertical')
        .addClass('toolbar-tray-' + orientation);

      // Update the tray orientation toggle button.
      var iconClass = 'toolbar-icon-toggle-' + orientation;
      var iconAntiClass = 'toolbar-icon-toggle-' + antiOrientation;
      var $orientationToggle = this.$el.find('.toolbar-toggle-orientation')
        .toggle(this.model.get('isTrayToggleVisible'));
      $orientationToggle.find('button')
        .val(antiOrientation)
        .attr('title', this.strings[antiOrientation])
        .text(this.strings[antiOrientation])
        .removeClass(iconClass)
        .addClass(iconAntiClass);

      // Update data offset attributes for the trays.
      var dir = document.documentElement.dir;
      var edge = (dir === 'rtl') ? 'right' : 'left';
      // Remove data-offset attributes from the trays so they can be refreshed.
      $trays.removeAttr('data-offset-left data-offset-right data-offset-top');
      // If an active vertical tray exists, mark it as an offset element.
      $trays.filter('.toolbar-tray-vertical.is-active').attr('data-offset-' + edge, '');
      // If an active horizontal tray exists, mark it as an offset element.
      $trays.filter('.toolbar-tray-horizontal.is-active').attr('data-offset-top', '');
    },

    /**
     * Sets the tops of the trays so that they align with the bottom of the bar.
     */
    adjustPlacement: function () {
      var $trays = this.$el.find('.toolbar-tray');
      if (!this.model.get('isOriented')) {
        $trays.css('margin-top', 0);
        $trays.removeClass('toolbar-tray-horizontal').addClass('toolbar-tray-vertical');
      }
      else {
        // The toolbar container is invisible. Its placement is used to
        // determine the container for the trays.
        $trays.css('margin-top', this.$el.find('.toolbar-bar').outerHeight());
      }
    },

    /**
     * Calls the endpoint URI that builds an AJAX command with the rendered
     * subtrees.
     *
     * The rendered admin menu subtrees HTML is cached on the client in
     * localStorage until the cache of the admin menu subtrees on the server-
     * side is invalidated. The subtreesHash is stored in localStorage as well
     * and compared to the subtreesHash in drupalSettings to determine when the
     * admin menu subtrees cache has been invalidated.
     */
    loadSubtrees: function () {
      var $activeTab = $(this.model.get('activeTab'));
      var orientation = this.model.get('orientation');
      // Only load and render the admin menu subtrees if:
      //   (1) They have not been loaded yet.
      //   (2) The active tab is the administration menu tab, indicated by the
      //       presence of the data-drupal-subtrees attribute.
      //   (3) The orientation of the tray is vertical.
      if (!this.model.get('areSubtreesLoaded') && typeof $activeTab.data('drupal-subtrees') !== 'undefined' && orientation === 'vertical') {
        var subtreesHash = drupalSettings.toolbar.subtreesHash;
        var theme = drupalSettings.ajaxPageState.theme;
        var endpoint = Drupal.url('toolbar/subtrees/' + subtreesHash);
        var cachedSubtreesHash = localStorage.getItem('Drupal.toolbar.subtreesHash.' + theme);
        var cachedSubtrees = JSON.parse(localStorage.getItem('Drupal.toolbar.subtrees.' + theme));
        var isVertical = this.model.get('orientation') === 'vertical';
        // If we have the subtrees in localStorage and the subtree hash has not
        // changed, then use the cached data.
        if (isVertical && subtreesHash === cachedSubtreesHash && cachedSubtrees) {
          Drupal.toolbar.setSubtrees.resolve(cachedSubtrees);
        }
        // Only make the call to get the subtrees if the orientation of the
        // toolbar is vertical.
        else if (isVertical) {
          // Remove the cached menu information.
          localStorage.removeItem('Drupal.toolbar.subtreesHash.' + theme);
          localStorage.removeItem('Drupal.toolbar.subtrees.' + theme);
          // The AJAX response's command will trigger the resolve method of the
          // Drupal.toolbar.setSubtrees Promise.
          Drupal.ajax({url: endpoint}).execute();
          // Cache the hash for the subtrees locally.
          localStorage.setItem('Drupal.toolbar.subtreesHash.' + theme, subtreesHash);
        }
      }
    }
  });

}(jQuery, Drupal, drupalSettings, Backbone));
;
/**
 * @file
 * Extends the Drupal AJAX functionality to integrate the dialog API.
 */

(function ($, Drupal) {

  'use strict';

  /**
   * Initialize dialogs for Ajax purposes.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attaches the behaviors for dialog ajax functionality.
   */
  Drupal.behaviors.dialog = {
    attach: function (context, settings) {
      var $context = $(context);

      // Provide a known 'drupal-modal' DOM element for Drupal-based modal
      // dialogs. Non-modal dialogs are responsible for creating their own
      // elements, since there can be multiple non-modal dialogs at a time.
      if (!$('#drupal-modal').length) {
        // Add 'ui-front' jQuery UI class so jQuery UI widgets like autocomplete
        // sit on top of dialogs. For more information see
        // http://api.jqueryui.com/theming/stacking-elements/.
        $('<div id="drupal-modal" class="ui-front"/>').hide().appendTo('body');
      }

      // Special behaviors specific when attaching content within a dialog.
      // These behaviors usually fire after a validation error inside a dialog.
      var $dialog = $context.closest('.ui-dialog-content');
      if ($dialog.length) {
        // Remove and replace the dialog buttons with those from the new form.
        if ($dialog.dialog('option', 'drupalAutoButtons')) {
          // Trigger an event to detect/sync changes to buttons.
          $dialog.trigger('dialogButtonsChange');
        }

        // Force focus on the modal when the behavior is run.
        $dialog.dialog('widget').trigger('focus');
      }

      var originalClose = settings.dialog.close;
      // Overwrite the close method to remove the dialog on closing.
      settings.dialog.close = function (event) {
        originalClose.apply(settings.dialog, arguments);
        $(event.target).remove();
      };
    },

    /**
     * Scan a dialog for any primary buttons and move them to the button area.
     *
     * @param {jQuery} $dialog
     *   An jQuery object containing the element that is the dialog target.
     *
     * @return {Array}
     *   An array of buttons that need to be added to the button area.
     */
    prepareDialogButtons: function ($dialog) {
      var buttons = [];
      var $buttons = $dialog.find('.form-actions input[type=submit], .form-actions a.button');
      $buttons.each(function () {
        // Hidden form buttons need special attention. For browser consistency,
        // the button needs to be "visible" in order to have the enter key fire
        // the form submit event. So instead of a simple "hide" or
        // "display: none", we set its dimensions to zero.
        // See http://mattsnider.com/how-forms-submit-when-pressing-enter/
        var $originalButton = $(this).css({
          display: 'block',
          width: 0,
          height: 0,
          padding: 0,
          border: 0,
          overflow: 'hidden'
        });
        buttons.push({
          text: $originalButton.html() || $originalButton.attr('value'),
          class: $originalButton.attr('class'),
          click: function (e) {
            // If the original button is an anchor tag, triggering the "click"
            // event will not simulate a click. Use the click method instead.
            if ($originalButton.is('a')) {
              $originalButton[0].click();
            }
            else {
              $originalButton.trigger('mousedown').trigger('mouseup').trigger('click');
              e.preventDefault();
            }
          }
        });
      });
      return buttons;
    }
  };

  /**
   * Command to open a dialog.
   *
   * @param {Drupal.Ajax} ajax
   *   The Drupal Ajax object.
   * @param {object} response
   *   Object holding the server response.
   * @param {number} [status]
   *   The HTTP status code.
   *
   * @return {bool|undefined}
   *   Returns false if there was no selector property in the response object.
   */
  Drupal.AjaxCommands.prototype.openDialog = function (ajax, response, status) {
    if (!response.selector) {
      return false;
    }
    var $dialog = $(response.selector);
    if (!$dialog.length) {
      // Create the element if needed.
      $dialog = $('<div id="' + response.selector.replace(/^#/, '') + '" class="ui-front"/>').appendTo('body');
    }
    // Set up the wrapper, if there isn't one.
    if (!ajax.wrapper) {
      ajax.wrapper = $dialog.attr('id');
    }

    // Use the ajax.js insert command to populate the dialog contents.
    response.command = 'insert';
    response.method = 'html';
    ajax.commands.insert(ajax, response, status);

    // Move the buttons to the jQuery UI dialog buttons area.
    if (!response.dialogOptions.buttons) {
      response.dialogOptions.drupalAutoButtons = true;
      response.dialogOptions.buttons = Drupal.behaviors.dialog.prepareDialogButtons($dialog);
    }

    // Bind dialogButtonsChange.
    $dialog.on('dialogButtonsChange', function () {
      var buttons = Drupal.behaviors.dialog.prepareDialogButtons($dialog);
      $dialog.dialog('option', 'buttons', buttons);
    });

    // Open the dialog itself.
    response.dialogOptions = response.dialogOptions || {};
    var dialog = Drupal.dialog($dialog.get(0), response.dialogOptions);
    if (response.dialogOptions.modal) {
      dialog.showModal();
    }
    else {
      dialog.show();
    }

    // Add the standard Drupal class for buttons for style consistency.
    $dialog.parent().find('.ui-dialog-buttonset').addClass('form-actions');
  };

  /**
   * Command to close a dialog.
   *
   * If no selector is given, it defaults to trying to close the modal.
   *
   * @param {Drupal.Ajax} [ajax]
   *   The ajax object.
   * @param {object} response
   *   Object holding the server response.
   * @param {string} response.selector
   *   The selector of the dialog.
   * @param {bool} response.persist
   *   Whether to persist the dialog element or not.
   * @param {number} [status]
   *   The HTTP status code.
   */
  Drupal.AjaxCommands.prototype.closeDialog = function (ajax, response, status) {
    var $dialog = $(response.selector);
    if ($dialog.length) {
      Drupal.dialog($dialog.get(0)).close();
      if (!response.persist) {
        $dialog.remove();
      }
    }

    // Unbind dialogButtonsChange.
    $dialog.off('dialogButtonsChange');
  };

  /**
   * Command to set a dialog property.
   *
   * JQuery UI specific way of setting dialog options.
   *
   * @param {Drupal.Ajax} [ajax]
   *   The Drupal Ajax object.
   * @param {object} response
   *   Object holding the server response.
   * @param {string} response.selector
   *   Selector for the dialog element.
   * @param {string} response.optionsName
   *   Name of a key to set.
   * @param {string} response.optionValue
   *   Value to set.
   * @param {number} [status]
   *   The HTTP status code.
   */
  Drupal.AjaxCommands.prototype.setDialogOption = function (ajax, response, status) {
    var $dialog = $(response.selector);
    if ($dialog.length) {
      $dialog.dialog('option', response.optionName, response.optionValue);
    }
  };

  /**
   * Binds a listener on dialog creation to handle the cancel link.
   *
   * @param {jQuery.Event} e
   *   The event triggered.
   * @param {Drupal.dialog~dialogDefinition} dialog
   *   The dialog instance.
   * @param {jQuery} $element
   *   The jQuery collection of the dialog element.
   * @param {object} [settings]
   *   Dialog settings.
   */
  $(window).on('dialog:aftercreate', function (e, dialog, $element, settings) {
    $element.on('click.dialog', '.dialog-cancel', function (e) {
      dialog.close('cancel');
      e.preventDefault();
      e.stopPropagation();
    });
  });

  /**
   * Removes all 'dialog' listeners.
   *
   * @param {jQuery.Event} e
   *   The event triggered.
   * @param {Drupal.dialog~dialogDefinition} dialog
   *   The dialog instance.
   * @param {jQuery} $element
   *   jQuery collection of the dialog element.
   */
  $(window).on('dialog:beforeclose', function (e, dialog, $element) {
    $element.off('.dialog');
  });

})(jQuery, Drupal);
;
/**
 * @file
 * Drupal's off-canvas library.
 *
 * @todo This functionality should extracted into a new core library or a part
 *  of the current drupal.dialog.ajax library.
 *  https://www.drupal.org/node/2784443
 */

(function ($, Drupal, debounce, displace) {

  'use strict';

  // The minimum width to use body displace needs to match the width at which
  // the tray will be %100 width. @see outside_in.module.css
  var minDisplaceWidth = 768;

  /**
   * The edge of the screen that the dialog should appear on.
   *
   * @type {string}
   */
  var edge = document.documentElement.dir === 'rtl' ? 'left' : 'right';

  var $mainCanvasWrapper = $('[data-offcanvas-main-canvas]');

  /**
   * Resets the size of the dialog.
   *
   * @param {jQuery.Event} event
   *   The event triggered.
   */
  function resetSize(event) {
    var offsets = displace.offsets;
    var $element = event.data.$element;
    var $widget = $element.dialog('widget');

    var adjustedOptions = {
      // @see http://api.jqueryui.com/position/
      position: {
        my: edge + ' top',
        at: edge + ' top' + (offsets.top !== 0 ? '+' + offsets.top : ''),
        of: window
      }
    };

    $widget.css({
      position: 'fixed',
      height: ($(window).height() - (offsets.top + offsets.bottom)) + 'px'
    });

    $element
      .dialog('option', adjustedOptions)
      .trigger('dialogContentResize.offcanvas');
  }

  /**
   * Adjusts the dialog on resize.
   *
   * @param {jQuery.Event} event
   *   The event triggered.
   */
  function handleDialogResize(event) {
    var $element = event.data.$element;
    var $widget = $element.dialog('widget');

    var $offsets = $widget.find('> :not(#drupal-offcanvas, .ui-resizable-handle)');
    var offset = 0;
    var modalHeight;

    // Let scroll element take all the height available.
    $element.css({height: 'auto'});
    modalHeight = $widget.height();
    $offsets.each(function () { offset += $(this).outerHeight(); });

    // Take internal padding into account.
    var scrollOffset = $element.outerHeight() - $element.height();
    $element.height(modalHeight - offset - scrollOffset);
  }

  /**
   * Adjusts the body padding when the dialog is resized.
   *
   * @param {jQuery.Event} event
   *   The event triggered.
   */
  function bodyPadding(event) {
    if ($('body').outerWidth() < minDisplaceWidth) {
      return;
    }
    var $element = event.data.$element;
    var $widget = $element.dialog('widget');

    var width = $widget.outerWidth();
    var mainCanvasPadding = $mainCanvasWrapper.css('padding-' + edge);
    if (width !== mainCanvasPadding) {
      $mainCanvasWrapper.css('padding-' + edge, width + 'px');
      $widget.attr('data-offset-' + edge, width);
      displace();
    }
  }

  /**
   * Attaches off-canvas dialog behaviors.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attaches event listeners for off-canvas dialogs.
   */
  Drupal.behaviors.offCanvasEvents = {
    attach: function () {
      $(window).once('off-canvas').on({
        'dialog:aftercreate': function (event, dialog, $element, settings) {
          if ($element.is('#drupal-offcanvas')) {
            var eventData = {settings: settings, $element: $element};
            $('.ui-dialog-offcanvas, .ui-dialog-offcanvas .ui-dialog-titlebar').toggleClass('ui-dialog-empty-title', !settings.title);

            $element
              .on('dialogresize.offcanvas', eventData, debounce(bodyPadding, 100))
              .on('dialogContentResize.offcanvas', eventData, handleDialogResize)
              .on('dialogContentResize.offcanvas', eventData, debounce(bodyPadding, 100))
              .trigger('dialogresize.offcanvas');

            $element.dialog('widget').attr('data-offset-' + edge, '');

            $(window)
              .on('resize.offcanvas scroll.offcanvas', eventData, debounce(resetSize, 100))
              .trigger('resize.offcanvas');
          }
        },
        'dialog:beforecreate': function (event, dialog, $element, settings) {
          if ($element.is('#drupal-offcanvas')) {
            $('body').addClass('js-tray-open');
            // @see http://api.jqueryui.com/position/
            settings.position = {
              my: 'left top',
              at: edge + ' top',
              of: window
            };
            settings.dialogClass += ' ui-dialog-offcanvas';
            // Applies initial height to dialog based on window height.
            // See http://api.jqueryui.com/dialog for all dialog options.
            settings.height = $(window).height();
          }
        },
        'dialog:beforeclose': function (event, dialog, $element) {
          if ($element.is('#drupal-offcanvas')) {
            $('body').removeClass('js-tray-open');
            // Remove all *.offcanvas events
            $(document).off('.offcanvas');
            $(window).off('.offcanvas');
            $mainCanvasWrapper.css('padding-' + edge, 0);
          }
        }
      });
    }
  };

})(jQuery, Drupal, Drupal.debounce, Drupal.displace);
;
/**
 * @file
 * Drupal's Settings Tray library.
 */

(function ($, Drupal) {

  'use strict';

  var blockConfigureSelector = '[data-outside-in-edit]';
  var toggleEditSelector = '[data-drupal-outsidein="toggle"]';
  var itemsToToggleSelector = '[data-offcanvas-main-canvas], #toolbar-bar, [data-drupal-outsidein="editable"] a, [data-drupal-outsidein="editable"] button';
  var contextualItemsSelector = '[data-contextual-id] a, [data-contextual-id] button';
  var quickEditItemSelector = '[data-quickedit-entity-id]';

  /**
   * Reacts to contextual links being added.
   *
   * @param {jQuery.Event} event
   *   The `drupalContextualLinkAdded` event.
   * @param {object} data
   *   An object containing the data relevant to the event.
   *
   * @listens event:drupalContextualLinkAdded
   */
  $(document).on('drupalContextualLinkAdded', function (event, data) {
    // Bind Ajax behaviors to all items showing the class.
    // @todo Fix contextual links to work with use-ajax links in
    //    https://www.drupal.org/node/2764931.
    Drupal.attachBehaviors(data.$el[0]);

    // Bind a listener to all 'Quick edit' links for blocks
    // Click "Edit" button in toolbar to force Contextual Edit which starts
    // Settings Tray edit mode also.
    data.$el.find(blockConfigureSelector)
      .on('click.outsidein', function () {
        if (!isInEditMode()) {
          $(toggleEditSelector).trigger('click').trigger('click.outside_in');
        }
        // Always disable QuickEdit regardless of whether "EditMode" was just enabled.
        disableQuickEdit();
      });
  });

  $(document).on('keyup.outsidein', function (e) {
    if (isInEditMode() && e.keyCode === 27) {
      Drupal.announce(
        Drupal.t('Exited edit mode.')
      );
      toggleEditMode();
    }
  });

  /**
   * Gets all items that should be toggled with class during edit mode.
   *
   * @return {jQuery}
   *   Items that should be toggled.
   */
  function getItemsToToggle() {
    return $(itemsToToggleSelector).not(contextualItemsSelector);
  }

  /**
   * Helper to check the state of the outside-in mode.
   *
   * @todo don't use a class for this.
   *
   * @return {boolean}
   *  State of the outside-in edit mode.
   */
  function isInEditMode() {
    return $('#toolbar-bar').hasClass('js-outside-in-edit-mode');
  }

  /**
   * Helper to toggle Edit mode.
   */
  function toggleEditMode() {
    setEditModeState(!isInEditMode());
  }

  /**
   * Prevent default click events except contextual links.
   *
   * In edit mode the default action of click events is suppressed.
   *
   * @param {jQuery.Event} event
   *   The click event.
   */
  function preventClick(event) {
    // Do not prevent contextual links.
    if ($(event.target).closest('.contextual-links').length) {
      return;
    }
    event.preventDefault();
  }

  /**
   * Close any active toolbar tray before entering edit mode.
   */
  function closeToolbarTrays() {
    $(Drupal.toolbar.models.toolbarModel.get('activeTab')).trigger('click');
  }

  /**
   * Disables the QuickEdit module editor if open.
   */
  function disableQuickEdit() {
    $('.quickedit-toolbar button.action-cancel').trigger('click');
  }

  /**
   * Closes/removes offcanvas.
   */
  function closeOffCanvas() {
    $('.ui-dialog-offcanvas .ui-dialog-titlebar-close').trigger('click');
  }

  /**
   *  Helper to switch edit mode state.
   *
   * @param {boolean} editMode
   *  True enable edit mode, false disable edit mode.
   */
  function setEditModeState(editMode) {
    editMode = !!editMode;
    var $editButton = $(toggleEditSelector);
    var $editables;
    // Turn on edit mode.
    if (editMode) {
      $editButton.text(Drupal.t('Editing'));
      closeToolbarTrays();

      $editables = $('[data-drupal-outsidein="editable"]').once('outsidein');
      if ($editables.length) {
        // Use event capture to prevent clicks on links.
        document.querySelector('[data-offcanvas-main-canvas]').addEventListener('click', preventClick, true);

        // When a click occurs try and find the outside-in edit link
        // and click it.
        $editables
          .not(contextualItemsSelector)
          .on('click.outsidein', function (e) {
            // Contextual links are allowed to function in Edit mode.
            if ($(e.target).closest('.contextual').length || !localStorage.getItem('Drupal.contextualToolbar.isViewing')) {
              return;
            }
            $(e.currentTarget).find(blockConfigureSelector).trigger('click');
            disableQuickEdit();
          });
        $(quickEditItemSelector)
          .not(contextualItemsSelector)
          .on('click.outsidein', function (e) {
            // For all non-contextual links or the contextual QuickEdit link close the off-canvas tray.
            if (!$(e.target).parent().hasClass('contextual') || $(e.target).parent().hasClass('quickedit')) {
              closeOffCanvas();
            }
            // Do not trigger if target is quick edit link to avoid loop.
            if ($(e.target).parent().hasClass('contextual') || $(e.target).parent().hasClass('quickedit')) {
              return;
            }
            $(e.currentTarget).find('li.quickedit a').trigger('click');
          });
      }
    }
    // Disable edit mode.
    else {
      $editables = $('[data-drupal-outsidein="editable"]').removeOnce('outsidein');
      if ($editables.length) {
        document.querySelector('[data-offcanvas-main-canvas]').removeEventListener('click', preventClick, true);
        $editables.off('.outsidein');
        $(quickEditItemSelector).off('.outsidein');
      }

      $editButton.text(Drupal.t('Edit'));
      closeOffCanvas();
      disableQuickEdit();
    }
    getItemsToToggle().toggleClass('js-outside-in-edit-mode', editMode);
    $('.edit-mode-inactive').toggleClass('visually-hidden', editMode);
  }

  /**
   * Attaches contextual's edit toolbar tab behavior.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attaches contextual toolbar behavior on a contextualToolbar-init event.
   */
  Drupal.behaviors.outsideInEdit = {
    attach: function () {
      var editMode = localStorage.getItem('Drupal.contextualToolbar.isViewing') === 'false';
      if (editMode) {
        setEditModeState(true);
      }
    }
  };

  /**
   * Toggle the js-outside-edit-mode class on items that we want to disable while in edit mode.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Toggle the js-outside-edit-mode class.
   */
  Drupal.behaviors.toggleEditMode = {
    attach: function () {

      $(toggleEditSelector).once('outsidein').on('click.outsidein', toggleEditMode);

      var search = Drupal.ajax.WRAPPER_FORMAT + '=drupal_dialog';
      var replace = Drupal.ajax.WRAPPER_FORMAT + '=drupal_dialog_offcanvas';
      // Loop through all Ajax links and change the format to dialog-offcanvas when
      // needed.
      Drupal.ajax.instances
        .filter(function (instance) {
          var hasElement = instance && !!instance.element;
          var rendererOffcanvas = false;
          var wrapperOffcanvas = false;
          if (hasElement) {
            rendererOffcanvas = $(instance.element).attr('data-dialog-renderer') === 'offcanvas';
            wrapperOffcanvas = instance.options.url.indexOf('drupal_dialog_offcanvas') === -1;
          }
          return hasElement && rendererOffcanvas && wrapperOffcanvas;
        })
        .forEach(function (instance) {
          // @todo Move logic for data-dialog-renderer attribute into ajax.js
          //   https://www.drupal.org/node/2784443
          instance.options.url = instance.options.url.replace(search, replace);
          // Check to make sure existing dialogOptions aren't overridden.
          if (!('dialogOptions' in instance.options.data)) {
            instance.options.data.dialogOptions = {};
          }
          instance.options.data.dialogOptions.outsideInActiveEditableId = $(instance.element).parents('.outside-in-editable').attr('id');
          instance.progress = {type: 'fullscreen'};
        });
    }
  };

  // Manage Active editable class on opening and closing of the dialog.
  $(window).on({
    'dialog:beforecreate': function (event, dialog, $element, settings) {
      if ($element.is('#drupal-offcanvas')) {
        $('body .outside-in-active-editable').removeClass('outside-in-active-editable');
        var $activeElement = $('#' + settings.outsideInActiveEditableId);
        if ($activeElement.length) {
          $activeElement.addClass('outside-in-active-editable');
          settings.dialogClass += ' ui-dialog-outside-in';
        }
      }
    },
    'dialog:beforeclose': function (event, dialog, $element) {
      if ($element.is('#drupal-offcanvas')) {
        $('body .outside-in-active-editable').removeClass('outside-in-active-editable');
      }
    }
  });

})(jQuery, Drupal);
;
/**
 * @file
 * Contains all javascript logic for moderation_sidebar.
 */

(function ($, Drupal) {

  Drupal.behaviors.moderation_sidebar = {
    attach: function (context, settings) {
      // Re-open the Moderation Sidebar when Quick Edit saves, as the Entity
      // object is stored in form state and we don't want to save something
      // that's outdated.
      $('body').once('moderation-sidebar-init').each(function () {
        if (Drupal.quickedit.collections.entities) {
          Drupal.quickedit.collections.entities.on('change:isCommitting', function (model) {
            if (model.get('isCommitting') === true && $('.moderation-sidebar-container').length) {
              $('.toolbar-icon-moderation-sidebar').trigger('click', {reload: true});
            }
          });
        }
      });
    }
  };

  // Close the sidebar if the toolbar icon is clicked and moderation
  // information is already available.
  $('.toolbar-icon-moderation-sidebar').on('click', function (e, data) {
    if ($('.moderation-sidebar-container').length && (!data || !data.reload)) {
      $('#drupal-offcanvas').dialog('close');
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  });

  $(document).ready(function () {
    $(window).on({
      'dialog:beforecreate': function (event, dialog, $element, settings) {
        if ($element.find('.moderation-sidebar-container').length) {
          $('.toolbar-icon-moderation-sidebar').addClass('sidebar-open');
          settings.dialogClass += ' ui-dialog-outside-in';
        }
      },
      'dialog:beforeclose': function (event, dialog, $element) {
        if ($element.find('.moderation-sidebar-container').length) {
          $('.toolbar-icon-moderation-sidebar').removeClass('sidebar-open');
        }
      }
    });
  });

})(jQuery, Drupal);
;
/*! jquery.cookie v1.4.1 | MIT */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?a(require("jquery")):a(jQuery)}(function(a){function b(a){return h.raw?a:encodeURIComponent(a)}function c(a){return h.raw?a:decodeURIComponent(a)}function d(a){return b(h.json?JSON.stringify(a):String(a))}function e(a){0===a.indexOf('"')&&(a=a.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\"));try{return a=decodeURIComponent(a.replace(g," ")),h.json?JSON.parse(a):a}catch(b){}}function f(b,c){var d=h.raw?b:e(b);return a.isFunction(c)?c(d):d}var g=/\+/g,h=a.cookie=function(e,g,i){if(void 0!==g&&!a.isFunction(g)){if(i=a.extend({},h.defaults,i),"number"==typeof i.expires){var j=i.expires,k=i.expires=new Date;k.setTime(+k+864e5*j)}return document.cookie=[b(e),"=",d(g),i.expires?"; expires="+i.expires.toUTCString():"",i.path?"; path="+i.path:"",i.domain?"; domain="+i.domain:"",i.secure?"; secure":""].join("")}for(var l=e?void 0:{},m=document.cookie?document.cookie.split("; "):[],n=0,o=m.length;o>n;n++){var p=m[n].split("="),q=c(p.shift()),r=p.join("=");if(e&&e===q){l=f(r,g);break}e||void 0===(r=f(r))||(l[q]=r)}return l};h.defaults={},a.removeCookie=function(b,c){return void 0===a.cookie(b)?!1:(a.cookie(b,"",a.extend({},c,{expires:-1})),!a.cookie(b))}});;
/* jQuery Foundation Joyride Plugin 2.1 | Copyright 2012, ZURB | www.opensource.org/licenses/mit-license.php */
(function(e,t,n){"use strict";var r={version:"2.0.3",tipLocation:"bottom",nubPosition:"auto",scroll:!0,scrollSpeed:300,timer:0,autoStart:!1,startTimerOnClick:!0,startOffset:0,nextButton:!0,tipAnimation:"fade",pauseAfter:[],tipAnimationFadeSpeed:300,cookieMonster:!1,cookieName:"joyride",cookieDomain:!1,cookiePath:!1,localStorage:!1,localStorageKey:"joyride",tipContainer:"body",modal:!1,expose:!1,postExposeCallback:e.noop,preRideCallback:e.noop,postRideCallback:e.noop,preStepCallback:e.noop,postStepCallback:e.noop,template:{link:'<a href="#close" class="joyride-close-tip">X</a>',timer:'<div class="joyride-timer-indicator-wrap"><span class="joyride-timer-indicator"></span></div>',tip:'<div class="joyride-tip-guide"><span class="joyride-nub"></span></div>',wrapper:'<div class="joyride-content-wrapper" role="dialog"></div>',button:'<a href="#" class="joyride-next-tip"></a>',modal:'<div class="joyride-modal-bg"></div>',expose:'<div class="joyride-expose-wrapper"></div>',exposeCover:'<div class="joyride-expose-cover"></div>'}},i=i||!1,s={},o={init:function(n){return this.each(function(){e.isEmptyObject(s)?(s=e.extend(!0,r,n),s.document=t.document,s.$document=e(s.document),s.$window=e(t),s.$content_el=e(this),s.$body=e(s.tipContainer),s.body_offset=e(s.tipContainer).position(),s.$tip_content=e("> li",s.$content_el),s.paused=!1,s.attempts=0,s.tipLocationPatterns={top:["bottom"],bottom:[],left:["right","top","bottom"],right:["left","top","bottom"]},o.jquery_check(),e.isFunction(e.cookie)||(s.cookieMonster=!1),(!s.cookieMonster||!e.cookie(s.cookieName))&&(!s.localStorage||!o.support_localstorage()||!localStorage.getItem(s.localStorageKey))&&(s.$tip_content.each(function(t){o.create({$li:e(this),index:t})}),s.autoStart&&(!s.startTimerOnClick&&s.timer>0?(o.show("init"),o.startTimer()):o.show("init"))),s.$document.on("click.joyride",".joyride-next-tip, .joyride-modal-bg",function(e){e.preventDefault(),s.$li.next().length<1?o.end():s.timer>0?(clearTimeout(s.automate),o.hide(),o.show(),o.startTimer()):(o.hide(),o.show())}),s.$document.on("click.joyride",".joyride-close-tip",function(e){e.preventDefault(),o.end()}),s.$window.bind("resize.joyride",function(t){if(s.$li){if(s.exposed&&s.exposed.length>0){var n=e(s.exposed);n.each(function(){var t=e(this);o.un_expose(t),o.expose(t)})}o.is_phone()?o.pos_phone():o.pos_default()}})):o.restart()})},resume:function(){o.set_li(),o.show()},nextTip:function(){s.$li.next().length<1?o.end():s.timer>0?(clearTimeout(s.automate),o.hide(),o.show(),o.startTimer()):(o.hide(),o.show())},tip_template:function(t){var n,r,i;return t.tip_class=t.tip_class||"",n=e(s.template.tip).addClass(t.tip_class),r=e.trim(e(t.li).html())+o.button_text(t.button_text)+s.template.link+o.timer_instance(t.index),i=e(s.template.wrapper),t.li.attr("data-aria-labelledby")&&i.attr("aria-labelledby",t.li.attr("data-aria-labelledby")),t.li.attr("data-aria-describedby")&&i.attr("aria-describedby",t.li.attr("data-aria-describedby")),n.append(i),n.first().attr("data-index",t.index),e(".joyride-content-wrapper",n).append(r),n[0]},timer_instance:function(t){var n;return t===0&&s.startTimerOnClick&&s.timer>0||s.timer===0?n="":n=o.outerHTML(e(s.template.timer)[0]),n},button_text:function(t){return s.nextButton?(t=e.trim(t)||"Next",t=o.outerHTML(e(s.template.button).append(t)[0])):t="",t},create:function(t){var n=t.$li.attr("data-button")||t.$li.attr("data-text"),r=t.$li.attr("class"),i=e(o.tip_template({tip_class:r,index:t.index,button_text:n,li:t.$li}));e(s.tipContainer).append(i)},show:function(t){var r={},i,u=[],a=0,f,l=null;if(s.$li===n||e.inArray(s.$li.index(),s.pauseAfter)===-1){s.paused?s.paused=!1:o.set_li(t),s.attempts=0;if(s.$li.length&&s.$target.length>0){t&&(s.preRideCallback(s.$li.index(),s.$next_tip),s.modal&&o.show_modal()),s.preStepCallback(s.$li.index(),s.$next_tip),u=(s.$li.data("options")||":").split(";"),a=u.length;for(i=a-1;i>=0;i--)f=u[i].split(":"),f.length===2&&(r[e.trim(f[0])]=e.trim(f[1]));s.tipSettings=e.extend({},s,r),s.tipSettings.tipLocationPattern=s.tipLocationPatterns[s.tipSettings.tipLocation],s.modal&&s.expose&&o.expose(),!/body/i.test(s.$target.selector)&&s.scroll&&o.scroll_to(),o.is_phone()?o.pos_phone(!0):o.pos_default(!0),l=e(".joyride-timer-indicator",s.$next_tip),/pop/i.test(s.tipAnimation)?(l.outerWidth(0),s.timer>0?(s.$next_tip.show(),l.animate({width:e(".joyride-timer-indicator-wrap",s.$next_tip).outerWidth()},s.timer)):s.$next_tip.show()):/fade/i.test(s.tipAnimation)&&(l.outerWidth(0),s.timer>0?(s.$next_tip.fadeIn(s.tipAnimationFadeSpeed),s.$next_tip.show(),l.animate({width:e(".joyride-timer-indicator-wrap",s.$next_tip).outerWidth()},s.timer)):s.$next_tip.fadeIn(s.tipAnimationFadeSpeed)),s.$current_tip=s.$next_tip,e(".joyride-next-tip",s.$current_tip).focus(),o.tabbable(s.$current_tip)}else s.$li&&s.$target.length<1?o.show():o.end()}else s.paused=!0},is_phone:function(){return i?i.mq("only screen and (max-width: 767px)"):s.$window.width()<767?!0:!1},support_localstorage:function(){return i?i.localstorage:!!t.localStorage},hide:function(){s.modal&&s.expose&&o.un_expose(),s.modal||e(".joyride-modal-bg").hide(),s.$current_tip.hide(),s.postStepCallback(s.$li.index(),s.$current_tip)},set_li:function(e){e?(s.$li=s.$tip_content.eq(s.startOffset),o.set_next_tip(),s.$current_tip=s.$next_tip):(s.$li=s.$li.next(),o.set_next_tip()),o.set_target()},set_next_tip:function(){s.$next_tip=e(".joyride-tip-guide[data-index="+s.$li.index()+"]")},set_target:function(){var t=s.$li.attr("data-class"),n=s.$li.attr("data-id"),r=function(){return n?e(s.document.getElementById(n)):t?e("."+t).filter(":visible").first():e("body")};s.$target=r()},scroll_to:function(){var t,n;t=s.$window.height()/2,n=Math.ceil(s.$target.offset().top-t+s.$next_tip.outerHeight()),e("html, body").stop().animate({scrollTop:n},s.scrollSpeed)},paused:function(){return e.inArray(s.$li.index()+1,s.pauseAfter)===-1?!0:!1},destroy:function(){e.isEmptyObject(s)||s.$document.off(".joyride"),e(t).off(".joyride"),e(".joyride-close-tip, .joyride-next-tip, .joyride-modal-bg").off(".joyride"),e(".joyride-tip-guide, .joyride-modal-bg").remove(),clearTimeout(s.automate),s={}},restart:function(){s.autoStart?(o.hide(),s.$li=n,o.show("init")):(!s.startTimerOnClick&&s.timer>0?(o.show("init"),o.startTimer()):o.show("init"),s.autoStart=!0)},pos_default:function(t){var n=Math.ceil(s.$window.height()/2),r=s.$next_tip.offset(),i=e(".joyride-nub",s.$next_tip),u=Math.ceil(i.outerWidth()/2),a=Math.ceil(i.outerHeight()/2),f=t||!1;f&&(s.$next_tip.css("visibility","hidden"),s.$next_tip.show());if(!/body/i.test(s.$target.selector)){var l=s.tipSettings.tipAdjustmentY?parseInt(s.tipSettings.tipAdjustmentY):0,c=s.tipSettings.tipAdjustmentX?parseInt(s.tipSettings.tipAdjustmentX):0;o.bottom()?(s.$next_tip.css({top:s.$target.offset().top+a+s.$target.outerHeight()+l,left:s.$target.offset().left+c}),/right/i.test(s.tipSettings.nubPosition)&&s.$next_tip.css("left",s.$target.offset().left-s.$next_tip.outerWidth()+s.$target.outerWidth()),o.nub_position(i,s.tipSettings.nubPosition,"top")):o.top()?(s.$next_tip.css({top:s.$target.offset().top-s.$next_tip.outerHeight()-a+l,left:s.$target.offset().left+c}),o.nub_position(i,s.tipSettings.nubPosition,"bottom")):o.right()?(s.$next_tip.css({top:s.$target.offset().top+l,left:s.$target.outerWidth()+s.$target.offset().left+u+c}),o.nub_position(i,s.tipSettings.nubPosition,"left")):o.left()&&(s.$next_tip.css({top:s.$target.offset().top+l,left:s.$target.offset().left-s.$next_tip.outerWidth()-u+c}),o.nub_position(i,s.tipSettings.nubPosition,"right")),!o.visible(o.corners(s.$next_tip))&&s.attempts<s.tipSettings.tipLocationPattern.length&&(i.removeClass("bottom").removeClass("top").removeClass("right").removeClass("left"),s.tipSettings.tipLocation=s.tipSettings.tipLocationPattern[s.attempts],s.attempts++,o.pos_default(!0))}else s.$li.length&&o.pos_modal(i);f&&(s.$next_tip.hide(),s.$next_tip.css("visibility","visible"))},pos_phone:function(t){var n=s.$next_tip.outerHeight(),r=s.$next_tip.offset(),i=s.$target.outerHeight(),u=e(".joyride-nub",s.$next_tip),a=Math.ceil(u.outerHeight()/2),f=t||!1;u.removeClass("bottom").removeClass("top").removeClass("right").removeClass("left"),f&&(s.$next_tip.css("visibility","hidden"),s.$next_tip.show()),/body/i.test(s.$target.selector)?s.$li.length&&o.pos_modal(u):o.top()?(s.$next_tip.offset({top:s.$target.offset().top-n-a}),u.addClass("bottom")):(s.$next_tip.offset({top:s.$target.offset().top+i+a}),u.addClass("top")),f&&(s.$next_tip.hide(),s.$next_tip.css("visibility","visible"))},pos_modal:function(e){o.center(),e.hide(),o.show_modal()},show_modal:function(){e(".joyride-modal-bg").length<1&&e("body").append(s.template.modal).show(),/pop/i.test(s.tipAnimation)?e(".joyride-modal-bg").show():e(".joyride-modal-bg").fadeIn(s.tipAnimationFadeSpeed)},expose:function(){var n,r,i,u,a="expose-"+Math.floor(Math.random()*1e4);if(arguments.length>0&&arguments[0]instanceof e)i=arguments[0];else{if(!s.$target||!!/body/i.test(s.$target.selector))return!1;i=s.$target}if(i.length<1)return t.console&&console.error("element not valid",i),!1;n=e(s.template.expose),s.$body.append(n),n.css({top:i.offset().top,left:i.offset().left,width:i.outerWidth(!0),height:i.outerHeight(!0)}),r=e(s.template.exposeCover),u={zIndex:i.css("z-index"),position:i.css("position")},i.css("z-index",n.css("z-index")*1+1),u.position=="static"&&i.css("position","relative"),i.data("expose-css",u),r.css({top:i.offset().top,left:i.offset().left,width:i.outerWidth(!0),height:i.outerHeight(!0)}),s.$body.append(r),n.addClass(a),r.addClass(a),s.tipSettings.exposeClass&&(n.addClass(s.tipSettings.exposeClass),r.addClass(s.tipSettings.exposeClass)),i.data("expose",a),s.postExposeCallback(s.$li.index(),s.$next_tip,i),o.add_exposed(i)},un_expose:function(){var n,r,i,u,a=!1;if(arguments.length>0&&arguments[0]instanceof e)r=arguments[0];else{if(!s.$target||!!/body/i.test(s.$target.selector))return!1;r=s.$target}if(r.length<1)return t.console&&console.error("element not valid",r),!1;n=r.data("expose"),i=e("."+n),arguments.length>1&&(a=arguments[1]),a===!0?e(".joyride-expose-wrapper,.joyride-expose-cover").remove():i.remove(),u=r.data("expose-css"),u.zIndex=="auto"?r.css("z-index",""):r.css("z-index",u.zIndex),u.position!=r.css("position")&&(u.position=="static"?r.css("position",""):r.css("position",u.position)),r.removeData("expose"),r.removeData("expose-z-index"),o.remove_exposed(r)},add_exposed:function(t){s.exposed=s.exposed||[],t instanceof e?s.exposed.push(t[0]):typeof t=="string"&&s.exposed.push(t)},remove_exposed:function(t){var n;t instanceof e?n=t[0]:typeof t=="string"&&(n=t),s.exposed=s.exposed||[];for(var r=0;r<s.exposed.length;r++)if(s.exposed[r]==n){s.exposed.splice(r,1);return}},center:function(){var e=s.$window;return s.$next_tip.css({top:(e.height()-s.$next_tip.outerHeight())/2+e.scrollTop(),left:(e.width()-s.$next_tip.outerWidth())/2+e.scrollLeft()}),!0},bottom:function(){return/bottom/i.test(s.tipSettings.tipLocation)},top:function(){return/top/i.test(s.tipSettings.tipLocation)},right:function(){return/right/i.test(s.tipSettings.tipLocation)},left:function(){return/left/i.test(s.tipSettings.tipLocation)},corners:function(e){var t=s.$window,n=t.height()/2,r=Math.ceil(s.$target.offset().top-n+s.$next_tip.outerHeight()),i=t.width()+t.scrollLeft(),o=t.height()+r,u=t.height()+t.scrollTop(),a=t.scrollTop();return r<a&&(r<0?a=0:a=r),o>u&&(u=o),[e.offset().top<a,i<e.offset().left+e.outerWidth(),u<e.offset().top+e.outerHeight(),t.scrollLeft()>e.offset().left]},visible:function(e){var t=e.length;while(t--)if(e[t])return!1;return!0},nub_position:function(e,t,n){t==="auto"?e.addClass(n):e.addClass(t)},startTimer:function(){s.$li.length?s.automate=setTimeout(function(){o.hide(),o.show(),o.startTimer()},s.timer):clearTimeout(s.automate)},end:function(){s.cookieMonster&&e.cookie(s.cookieName,"ridden",{expires:365,domain:s.cookieDomain,path:s.cookiePath}),s.localStorage&&localStorage.setItem(s.localStorageKey,!0),s.timer>0&&clearTimeout(s.automate),s.modal&&s.expose&&o.un_expose(),s.$current_tip&&s.$current_tip.hide(),s.$li&&(s.postStepCallback(s.$li.index(),s.$current_tip),s.postRideCallback(s.$li.index(),s.$current_tip)),e(".joyride-modal-bg").hide()},jquery_check:function(){return e.isFunction(e.fn.on)?!0:(e.fn.on=function(e,t,n){return this.delegate(t,e,n)},e.fn.off=function(e,t,n){return this.undelegate(t,e,n)},!1)},outerHTML:function(e){return e.outerHTML||(new XMLSerializer).serializeToString(e)},version:function(){return s.version},tabbable:function(t){e(t).on("keydown",function(n){if(!n.isDefaultPrevented()&&n.keyCode&&n.keyCode===27){n.preventDefault(),o.end();return}if(n.keyCode!==9)return;var r=e(t).find(":tabbable"),i=r.filter(":first"),s=r.filter(":last");n.target===s[0]&&!n.shiftKey?(i.focus(1),n.preventDefault()):n.target===i[0]&&n.shiftKey&&(s.focus(1),n.preventDefault())})}};e.fn.joyride=function(t){if(o[t])return o[t].apply(this,Array.prototype.slice.call(arguments,1));if(typeof t=="object"||!t)return o.init.apply(this,arguments);e.error("Method "+t+" does not exist on jQuery.joyride")}})(jQuery,this);
;
/**
 * @file
 * Attaches behaviors for the Tour module's toolbar tab.
 */

(function ($, Backbone, Drupal, document) {

  'use strict';

  var queryString = decodeURI(window.location.search);

  /**
   * Attaches the tour's toolbar tab behavior.
   *
   * It uses the query string for:
   * - tour: When ?tour=1 is present, the tour will start automatically after
   *   the page has loaded.
   * - tips: Pass ?tips=class in the url to filter the available tips to the
   *   subset which match the given class.
   *
   * @example
   * http://example.com/foo?tour=1&tips=bar
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attach tour functionality on `tour` events.
   */
  Drupal.behaviors.tour = {
    attach: function (context) {
      $('body').once('tour').each(function () {
        var model = new Drupal.tour.models.StateModel();
        new Drupal.tour.views.ToggleTourView({
          el: $(context).find('#toolbar-tab-tour'),
          model: model
        });

        model
          // Allow other scripts to respond to tour events.
          .on('change:isActive', function (model, isActive) {
            $(document).trigger((isActive) ? 'drupalTourStarted' : 'drupalTourStopped');
          })
          // Initialization: check whether a tour is available on the current
          // page.
          .set('tour', $(context).find('ol#tour'));

        // Start the tour immediately if toggled via query string.
        if (/tour=?/i.test(queryString)) {
          model.set('isActive', true);
        }
      });
    }
  };

  /**
   * @namespace
   */
  Drupal.tour = Drupal.tour || {

    /**
     * @namespace Drupal.tour.models
     */
    models: {},

    /**
     * @namespace Drupal.tour.views
     */
    views: {}
  };

  /**
   * Backbone Model for tours.
   *
   * @constructor
   *
   * @augments Backbone.Model
   */
  Drupal.tour.models.StateModel = Backbone.Model.extend(/** @lends Drupal.tour.models.StateModel# */{

    /**
     * @type {object}
     */
    defaults: /** @lends Drupal.tour.models.StateModel# */{

      /**
       * Indicates whether the Drupal root window has a tour.
       *
       * @type {Array}
       */
      tour: [],

      /**
       * Indicates whether the tour is currently running.
       *
       * @type {bool}
       */
      isActive: false,

      /**
       * Indicates which tour is the active one (necessary to cleanly stop).
       *
       * @type {Array}
       */
      activeTour: []
    }
  });

  Drupal.tour.views.ToggleTourView = Backbone.View.extend(/** @lends Drupal.tour.views.ToggleTourView# */{

    /**
     * @type {object}
     */
    events: {click: 'onClick'},

    /**
     * Handles edit mode toggle interactions.
     *
     * @constructs
     *
     * @augments Backbone.View
     */
    initialize: function () {
      this.listenTo(this.model, 'change:tour change:isActive', this.render);
      this.listenTo(this.model, 'change:isActive', this.toggleTour);
    },

    /**
     * @inheritdoc
     *
     * @return {Drupal.tour.views.ToggleTourView}
     *   The `ToggleTourView` view.
     */
    render: function () {
      // Render the visibility.
      this.$el.toggleClass('hidden', this._getTour().length === 0);
      // Render the state.
      var isActive = this.model.get('isActive');
      this.$el.find('button')
        .toggleClass('is-active', isActive)
        .prop('aria-pressed', isActive);
      return this;
    },

    /**
     * Model change handler; starts or stops the tour.
     */
    toggleTour: function () {
      if (this.model.get('isActive')) {
        var $tour = this._getTour();
        this._removeIrrelevantTourItems($tour, this._getDocument());
        var that = this;
        if ($tour.find('li').length) {
          $tour.joyride({
            autoStart: true,
            postRideCallback: function () { that.model.set('isActive', false); },
            // HTML segments for tip layout.
            template: {
              link: '<a href=\"#close\" class=\"joyride-close-tip\">&times;</a>',
              button: '<a href=\"#\" class=\"button button--primary joyride-next-tip\"></a>'
            }
          });
          this.model.set({isActive: true, activeTour: $tour});
        }
      }
      else {
        this.model.get('activeTour').joyride('destroy');
        this.model.set({isActive: false, activeTour: []});
      }
    },

    /**
     * Toolbar tab click event handler; toggles isActive.
     *
     * @param {jQuery.Event} event
     *   The click event.
     */
    onClick: function (event) {
      this.model.set('isActive', !this.model.get('isActive'));
      event.preventDefault();
      event.stopPropagation();
    },

    /**
     * Gets the tour.
     *
     * @return {jQuery}
     *   A jQuery element pointing to a `<ol>` containing tour items.
     */
    _getTour: function () {
      return this.model.get('tour');
    },

    /**
     * Gets the relevant document as a jQuery element.
     *
     * @return {jQuery}
     *   A jQuery element pointing to the document within which a tour would be
     *   started given the current state.
     */
    _getDocument: function () {
      return $(document);
    },

    /**
     * Removes tour items for elements that don't have matching page elements.
     *
     * Or that are explicitly filtered out via the 'tips' query string.
     *
     * @example
     * <caption>This will filter out tips that do not have a matching
     * page element or don't have the "bar" class.</caption>
     * http://example.com/foo?tips=bar
     *
     * @param {jQuery} $tour
     *   A jQuery element pointing to a `<ol>` containing tour items.
     * @param {jQuery} $document
     *   A jQuery element pointing to the document within which the elements
     *   should be sought.
     *
     * @see Drupal.tour.views.ToggleTourView#_getDocument
     */
    _removeIrrelevantTourItems: function ($tour, $document) {
      var removals = false;
      var tips = /tips=([^&]+)/.exec(queryString);
      $tour
        .find('li')
        .each(function () {
          var $this = $(this);
          var itemId = $this.attr('data-id');
          var itemClass = $this.attr('data-class');
          // If the query parameter 'tips' is set, remove all tips that don't
          // have the matching class.
          if (tips && !$(this).hasClass(tips[1])) {
            removals = true;
            $this.remove();
            return;
          }
          // Remove tip from the DOM if there is no corresponding page element.
          if ((!itemId && !itemClass) ||
            (itemId && $document.find('#' + itemId).length) ||
            (itemClass && $document.find('.' + itemClass).length)) {
            return;
          }
          removals = true;
          $this.remove();
        });

      // If there were removals, we'll have to do some clean-up.
      if (removals) {
        var total = $tour.find('li').length;
        if (!total) {
          this.model.set({tour: []});
        }

        $tour
          .find('li')
          // Rebuild the progress data.
          .each(function (index) {
            var progress = Drupal.t('!tour_item of !total', {'!tour_item': index + 1, '!total': total});
            $(this).find('.tour-progress').text(progress);
          })
          // Update the last item to have "End tour" as the button.
          .eq(-1)
          .attr('data-text', Drupal.t('End tour'));
      }
    }

  });

})(jQuery, Backbone, Drupal, document);
;
(function($) {
  $(document).ready(function() {
    $('a.toolbar-icon').removeAttr('title');
  });
})(jQuery);
;
/**
 * @file
 * Replaces the home link in toolbar with a back to site link.
 */

(function ($, Drupal, drupalSettings) {

  'use strict';

  var pathInfo = drupalSettings.path;
  var escapeAdminPath = sessionStorage.getItem('escapeAdminPath');
  var windowLocation = window.location;

  // Saves the last non-administrative page in the browser to be able to link
  // back to it when browsing administrative pages. If there is a destination
  // parameter there is not need to save the current path because the page is
  // loaded within an existing "workflow".
  if (!pathInfo.currentPathIsAdmin && !/destination=/.test(windowLocation.search)) {
    sessionStorage.setItem('escapeAdminPath', windowLocation);
  }

  /**
   * Replaces the "Home" link with "Back to site" link.
   *
   * Back to site link points to the last non-administrative page the user
   * visited within the same browser tab.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attaches the replacement functionality to the toolbar-escape-admin element.
   */
  Drupal.behaviors.escapeAdmin = {
    attach: function () {
      var $toolbarEscape = $('[data-toolbar-escape-admin]').once('escapeAdmin');
      if ($toolbarEscape.length && pathInfo.currentPathIsAdmin) {
        if (escapeAdminPath !== null) {
          $toolbarEscape.attr('href', escapeAdminPath);
        }
        else {
          $toolbarEscape.text(Drupal.t('Home'));
        }
        $toolbarEscape.closest('.toolbar-tab').removeClass('hidden');
      }
    }
  };

})(jQuery, Drupal, drupalSettings);
;
/**
 * @file
 * Manages page tabbing modifications made by modules.
 */

/**
 * Allow modules to respond to the constrain event.
 *
 * @event drupalTabbingConstrained
 */

/**
 * Allow modules to respond to the tabbingContext release event.
 *
 * @event drupalTabbingContextReleased
 */

/**
 * Allow modules to respond to the constrain event.
 *
 * @event drupalTabbingContextActivated
 */

/**
 * Allow modules to respond to the constrain event.
 *
 * @event drupalTabbingContextDeactivated
 */

(function ($, Drupal) {

  'use strict';

  /**
   * Provides an API for managing page tabbing order modifications.
   *
   * @constructor Drupal~TabbingManager
   */
  function TabbingManager() {

    /**
     * Tabbing sets are stored as a stack. The active set is at the top of the
     * stack. We use a JavaScript array as if it were a stack; we consider the
     * first element to be the bottom and the last element to be the top. This
     * allows us to use JavaScript's built-in Array.push() and Array.pop()
     * methods.
     *
     * @type {Array.<Drupal~TabbingContext>}
     */
    this.stack = [];
  }

  /**
   * Add public methods to the TabbingManager class.
   */
  $.extend(TabbingManager.prototype, /** @lends Drupal~TabbingManager# */{

    /**
     * Constrain tabbing to the specified set of elements only.
     *
     * Makes elements outside of the specified set of elements unreachable via
     * the tab key.
     *
     * @param {jQuery} elements
     *   The set of elements to which tabbing should be constrained. Can also
     *   be a jQuery-compatible selector string.
     *
     * @return {Drupal~TabbingContext}
     *   The TabbingContext instance.
     *
     * @fires event:drupalTabbingConstrained
     */
    constrain: function (elements) {
      // Deactivate all tabbingContexts to prepare for the new constraint. A
      // tabbingContext instance will only be reactivated if the stack is
      // unwound to it in the _unwindStack() method.
      var il = this.stack.length;
      for (var i = 0; i < il; i++) {
        this.stack[i].deactivate();
      }

      // The "active tabbing set" are the elements tabbing should be constrained
      // to.
      var $elements = $(elements).find(':tabbable').addBack(':tabbable');

      var tabbingContext = new TabbingContext({
        // The level is the current height of the stack before this new
        // tabbingContext is pushed on top of the stack.
        level: this.stack.length,
        $tabbableElements: $elements
      });

      this.stack.push(tabbingContext);

      // Activates the tabbingContext; this will manipulate the DOM to constrain
      // tabbing.
      tabbingContext.activate();

      // Allow modules to respond to the constrain event.
      $(document).trigger('drupalTabbingConstrained', tabbingContext);

      return tabbingContext;
    },

    /**
     * Restores a former tabbingContext when an active one is released.
     *
     * The TabbingManager stack of tabbingContext instances will be unwound
     * from the top-most released tabbingContext down to the first non-released
     * tabbingContext instance. This non-released instance is then activated.
     */
    release: function () {
      // Unwind as far as possible: find the topmost non-released
      // tabbingContext.
      var toActivate = this.stack.length - 1;
      while (toActivate >= 0 && this.stack[toActivate].released) {
        toActivate--;
      }

      // Delete all tabbingContexts after the to be activated one. They have
      // already been deactivated, so their effect on the DOM has been reversed.
      this.stack.splice(toActivate + 1);

      // Get topmost tabbingContext, if one exists, and activate it.
      if (toActivate >= 0) {
        this.stack[toActivate].activate();
      }
    },

    /**
     * Makes all elements outside of the tabbingContext's set untabbable.
     *
     * Elements made untabbable have their original tabindex and autofocus
     * values stored so that they might be restored later when this
     * tabbingContext is deactivated.
     *
     * @param {Drupal~TabbingContext} tabbingContext
     *   The TabbingContext instance that has been activated.
     */
    activate: function (tabbingContext) {
      var $set = tabbingContext.$tabbableElements;
      var level = tabbingContext.level;
      // Determine which elements are reachable via tabbing by default.
      var $disabledSet = $(':tabbable')
        // Exclude elements of the active tabbing set.
        .not($set);
      // Set the disabled set on the tabbingContext.
      tabbingContext.$disabledElements = $disabledSet;
      // Record the tabindex for each element, so we can restore it later.
      var il = $disabledSet.length;
      for (var i = 0; i < il; i++) {
        this.recordTabindex($disabledSet.eq(i), level);
      }
      // Make all tabbable elements outside of the active tabbing set
      // unreachable.
      $disabledSet
        .prop('tabindex', -1)
        .prop('autofocus', false);

      // Set focus on an element in the tabbingContext's set of tabbable
      // elements. First, check if there is an element with an autofocus
      // attribute. Select the last one from the DOM order.
      var $hasFocus = $set.filter('[autofocus]').eq(-1);
      // If no element in the tabbable set has an autofocus attribute, select
      // the first element in the set.
      if ($hasFocus.length === 0) {
        $hasFocus = $set.eq(0);
      }
      $hasFocus.trigger('focus');
    },

    /**
     * Restores that tabbable state of a tabbingContext's disabled elements.
     *
     * Elements that were made untabbable have their original tabindex and
     * autofocus values restored.
     *
     * @param {Drupal~TabbingContext} tabbingContext
     *   The TabbingContext instance that has been deactivated.
     */
    deactivate: function (tabbingContext) {
      var $set = tabbingContext.$disabledElements;
      var level = tabbingContext.level;
      var il = $set.length;
      for (var i = 0; i < il; i++) {
        this.restoreTabindex($set.eq(i), level);
      }
    },

    /**
     * Records the tabindex and autofocus values of an untabbable element.
     *
     * @param {jQuery} $el
     *   The set of elements that have been disabled.
     * @param {number} level
     *   The stack level for which the tabindex attribute should be recorded.
     */
    recordTabindex: function ($el, level) {
      var tabInfo = $el.data('drupalOriginalTabIndices') || {};
      tabInfo[level] = {
        tabindex: $el[0].getAttribute('tabindex'),
        autofocus: $el[0].hasAttribute('autofocus')
      };
      $el.data('drupalOriginalTabIndices', tabInfo);
    },

    /**
     * Restores the tabindex and autofocus values of a reactivated element.
     *
     * @param {jQuery} $el
     *   The element that is being reactivated.
     * @param {number} level
     *   The stack level for which the tabindex attribute should be restored.
     */
    restoreTabindex: function ($el, level) {
      var tabInfo = $el.data('drupalOriginalTabIndices');
      if (tabInfo && tabInfo[level]) {
        var data = tabInfo[level];
        if (data.tabindex) {
          $el[0].setAttribute('tabindex', data.tabindex);
        }
        // If the element did not have a tabindex at this stack level then
        // remove it.
        else {
          $el[0].removeAttribute('tabindex');
        }
        if (data.autofocus) {
          $el[0].setAttribute('autofocus', 'autofocus');
        }

        // Clean up $.data.
        if (level === 0) {
          // Remove all data.
          $el.removeData('drupalOriginalTabIndices');
        }
        else {
          // Remove the data for this stack level and higher.
          var levelToDelete = level;
          while (tabInfo.hasOwnProperty(levelToDelete)) {
            delete tabInfo[levelToDelete];
            levelToDelete++;
          }
          $el.data('drupalOriginalTabIndices', tabInfo);
        }
      }
    }
  });

  /**
   * Stores a set of tabbable elements.
   *
   * This constraint can be removed with the release() method.
   *
   * @constructor Drupal~TabbingContext
   *
   * @param {object} options
   *   A set of initiating values
   * @param {number} options.level
   *   The level in the TabbingManager's stack of this tabbingContext.
   * @param {jQuery} options.$tabbableElements
   *   The DOM elements that should be reachable via the tab key when this
   *   tabbingContext is active.
   * @param {jQuery} options.$disabledElements
   *   The DOM elements that should not be reachable via the tab key when this
   *   tabbingContext is active.
   * @param {bool} options.released
   *   A released tabbingContext can never be activated again. It will be
   *   cleaned up when the TabbingManager unwinds its stack.
   * @param {bool} options.active
   *   When true, the tabbable elements of this tabbingContext will be reachable
   *   via the tab key and the disabled elements will not. Only one
   *   tabbingContext can be active at a time.
   */
  function TabbingContext(options) {

    $.extend(this, /** @lends Drupal~TabbingContext# */{

      /**
       * @type {?number}
       */
      level: null,

      /**
       * @type {jQuery}
       */
      $tabbableElements: $(),

      /**
       * @type {jQuery}
       */
      $disabledElements: $(),

      /**
       * @type {bool}
       */
      released: false,

      /**
       * @type {bool}
       */
      active: false
    }, options);
  }

  /**
   * Add public methods to the TabbingContext class.
   */
  $.extend(TabbingContext.prototype, /** @lends Drupal~TabbingContext# */{

    /**
     * Releases this TabbingContext.
     *
     * Once a TabbingContext object is released, it can never be activated
     * again.
     *
     * @fires event:drupalTabbingContextReleased
     */
    release: function () {
      if (!this.released) {
        this.deactivate();
        this.released = true;
        Drupal.tabbingManager.release(this);
        // Allow modules to respond to the tabbingContext release event.
        $(document).trigger('drupalTabbingContextReleased', this);
      }
    },

    /**
     * Activates this TabbingContext.
     *
     * @fires event:drupalTabbingContextActivated
     */
    activate: function () {
      // A released TabbingContext object can never be activated again.
      if (!this.active && !this.released) {
        this.active = true;
        Drupal.tabbingManager.activate(this);
        // Allow modules to respond to the constrain event.
        $(document).trigger('drupalTabbingContextActivated', this);
      }
    },

    /**
     * Deactivates this TabbingContext.
     *
     * @fires event:drupalTabbingContextDeactivated
     */
    deactivate: function () {
      if (this.active) {
        this.active = false;
        Drupal.tabbingManager.deactivate(this);
        // Allow modules to respond to the constrain event.
        $(document).trigger('drupalTabbingContextDeactivated', this);
      }
    }
  });

  // Mark this behavior as processed on the first pass and return if it is
  // already processed.
  if (Drupal.tabbingManager) {
    return;
  }

  /**
   * @type {Drupal~TabbingManager}
   */
  Drupal.tabbingManager = new TabbingManager();

}(jQuery, Drupal));
;
/**
 * @file
 * Attaches behaviors for the Contextual module's edit toolbar tab.
 */

(function ($, Drupal, Backbone) {

  'use strict';

  var strings = {
    tabbingReleased: Drupal.t('Tabbing is no longer constrained by the Contextual module.'),
    tabbingConstrained: Drupal.t('Tabbing is constrained to a set of @contextualsCount and the edit mode toggle.'),
    pressEsc: Drupal.t('Press the esc key to exit.')
  };

  /**
   * Initializes a contextual link: updates its DOM, sets up model and views.
   *
   * @param {HTMLElement} context
   *   A contextual links DOM element as rendered by the server.
   */
  function initContextualToolbar(context) {
    if (!Drupal.contextual || !Drupal.contextual.collection) {
      return;
    }

    var contextualToolbar = Drupal.contextualToolbar;
    var model = contextualToolbar.model = new contextualToolbar.StateModel({
      // Checks whether localStorage indicates we should start in edit mode
      // rather than view mode.
      // @see Drupal.contextualToolbar.VisualView.persist
      isViewing: localStorage.getItem('Drupal.contextualToolbar.isViewing') !== 'false'
    }, {
      contextualCollection: Drupal.contextual.collection
    });

    var viewOptions = {
      el: $('.toolbar .toolbar-bar .contextual-toolbar-tab'),
      model: model,
      strings: strings
    };
    new contextualToolbar.VisualView(viewOptions);
    new contextualToolbar.AuralView(viewOptions);
  }

  /**
   * Attaches contextual's edit toolbar tab behavior.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attaches contextual toolbar behavior on a contextualToolbar-init event.
   */
  Drupal.behaviors.contextualToolbar = {
    attach: function (context) {
      if ($('body').once('contextualToolbar-init').length) {
        initContextualToolbar(context);
      }
    }
  };

  /**
   * Namespace for the contextual toolbar.
   *
   * @namespace
   */
  Drupal.contextualToolbar = {

    /**
     * The {@link Drupal.contextualToolbar.StateModel} instance.
     *
     * @type {?Drupal.contextualToolbar.StateModel}
     */
    model: null
  };

})(jQuery, Drupal, Backbone);
;
/**
 * @file
 * A Backbone Model for the state of Contextual module's edit toolbar tab.
 */

(function (Drupal, Backbone) {

  'use strict';

  Drupal.contextualToolbar.StateModel = Backbone.Model.extend(/** @lends Drupal.contextualToolbar.StateModel# */{

    /**
     * @type {object}
     *
     * @prop {bool} isViewing
     * @prop {bool} isVisible
     * @prop {number} contextualCount
     * @prop {Drupal~TabbingContext} tabbingContext
     */
    defaults: /** @lends Drupal.contextualToolbar.StateModel# */{

      /**
       * Indicates whether the toggle is currently in "view" or "edit" mode.
       *
       * @type {bool}
       */
      isViewing: true,

      /**
       * Indicates whether the toggle should be visible or hidden. Automatically
       * calculated, depends on contextualCount.
       *
       * @type {bool}
       */
      isVisible: false,

      /**
       * Tracks how many contextual links exist on the page.
       *
       * @type {number}
       */
      contextualCount: 0,

      /**
       * A TabbingContext object as returned by {@link Drupal~TabbingManager}:
       * the set of tabbable elements when edit mode is enabled.
       *
       * @type {?Drupal~TabbingContext}
       */
      tabbingContext: null
    },

    /**
     * Models the state of the edit mode toggle.
     *
     * @constructs
     *
     * @augments Backbone.Model
     *
     * @param {object} attrs
     *   Attributes for the backbone model.
     * @param {object} options
     *   An object with the following option:
     * @param {Backbone.collection} options.contextualCollection
     *   The collection of {@link Drupal.contextual.StateModel} models that
     *   represent the contextual links on the page.
     */
    initialize: function (attrs, options) {
      // Respond to new/removed contextual links.
      this.listenTo(options.contextualCollection, 'reset remove add', this.countContextualLinks);
      this.listenTo(options.contextualCollection, 'add', this.lockNewContextualLinks);

      // Automatically determine visibility.
      this.listenTo(this, 'change:contextualCount', this.updateVisibility);

      // Whenever edit mode is toggled, lock all contextual links.
      this.listenTo(this, 'change:isViewing', function (model, isViewing) {
        options.contextualCollection.each(function (contextualModel) {
          contextualModel.set('isLocked', !isViewing);
        });
      });
    },

    /**
     * Tracks the number of contextual link models in the collection.
     *
     * @param {Drupal.contextual.StateModel} contextualModel
     *   The contextual links model that was added or removed.
     * @param {Backbone.Collection} contextualCollection
     *    The collection of contextual link models.
     */
    countContextualLinks: function (contextualModel, contextualCollection) {
      this.set('contextualCount', contextualCollection.length);
    },

    /**
     * Lock newly added contextual links if edit mode is enabled.
     *
     * @param {Drupal.contextual.StateModel} contextualModel
     *   The contextual links model that was added.
     * @param {Backbone.Collection} [contextualCollection]
     *    The collection of contextual link models.
     */
    lockNewContextualLinks: function (contextualModel, contextualCollection) {
      if (!this.get('isViewing')) {
        contextualModel.set('isLocked', true);
      }
    },

    /**
     * Automatically updates visibility of the view/edit mode toggle.
     */
    updateVisibility: function () {
      this.set('isVisible', this.get('contextualCount') > 0);
    }

  });

})(Drupal, Backbone);
;
/**
 * @file
 * A Backbone View that provides the aural view of the edit mode toggle.
 */

(function ($, Drupal, Backbone, _) {

  'use strict';

  Drupal.contextualToolbar.AuralView = Backbone.View.extend(/** @lends Drupal.contextualToolbar.AuralView# */{

    /**
     * Tracks whether the tabbing constraint announcement has been read once.
     *
     * @type {bool}
     */
    announcedOnce: false,

    /**
     * Renders the aural view of the edit mode toggle (screen reader support).
     *
     * @constructs
     *
     * @augments Backbone.View
     *
     * @param {object} options
     *   Options for the view.
     */
    initialize: function (options) {
      this.options = options;

      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'change:isViewing', this.manageTabbing);

      $(document).on('keyup', _.bind(this.onKeypress, this));
    },

    /**
     * @inheritdoc
     *
     * @return {Drupal.contextualToolbar.AuralView}
     *   The current contextual toolbar aural view.
     */
    render: function () {
      // Render the state.
      this.$el.find('button').attr('aria-pressed', !this.model.get('isViewing'));

      return this;
    },

    /**
     * Limits tabbing to the contextual links and edit mode toolbar tab.
     */
    manageTabbing: function () {
      var tabbingContext = this.model.get('tabbingContext');
      // Always release an existing tabbing context.
      if (tabbingContext) {
        tabbingContext.release();
        Drupal.announce(this.options.strings.tabbingReleased);
      }
      // Create a new tabbing context when edit mode is enabled.
      if (!this.model.get('isViewing')) {
        tabbingContext = Drupal.tabbingManager.constrain($('.contextual-toolbar-tab, .contextual'));
        this.model.set('tabbingContext', tabbingContext);
        this.announceTabbingConstraint();
        this.announcedOnce = true;
      }
    },

    /**
     * Announces the current tabbing constraint.
     */
    announceTabbingConstraint: function () {
      var strings = this.options.strings;
      Drupal.announce(Drupal.formatString(strings.tabbingConstrained, {
        '@contextualsCount': Drupal.formatPlural(Drupal.contextual.collection.length, '@count contextual link', '@count contextual links')
      }));
      Drupal.announce(strings.pressEsc);
    },

    /**
     * Responds to esc and tab key press events.
     *
     * @param {jQuery.Event} event
     *   The keypress event.
     */
    onKeypress: function (event) {
      // The first tab key press is tracked so that an annoucement about tabbing
      // constraints can be raised if edit mode is enabled when the page is
      // loaded.
      if (!this.announcedOnce && event.keyCode === 9 && !this.model.get('isViewing')) {
        this.announceTabbingConstraint();
        // Set announce to true so that this conditional block won't run again.
        this.announcedOnce = true;
      }
      // Respond to the ESC key. Exit out of edit mode.
      if (event.keyCode === 27) {
        this.model.set('isViewing', true);
      }
    }

  });

})(jQuery, Drupal, Backbone, _);
;
/**
 * @file
 * A Backbone View that provides the visual view of the edit mode toggle.
 */

(function (Drupal, Backbone) {

  'use strict';

  Drupal.contextualToolbar.VisualView = Backbone.View.extend(/** @lends Drupal.contextualToolbar.VisualView# */{

    /**
     * Events for the Backbone view.
     *
     * @return {object}
     *   A mapping of events to be used in the view.
     */
    events: function () {
      // Prevents delay and simulated mouse events.
      var touchEndToClick = function (event) {
        event.preventDefault();
        event.target.click();
      };

      return {
        click: function () {
          this.model.set('isViewing', !this.model.get('isViewing'));
        },
        touchend: touchEndToClick
      };
    },

    /**
     * Renders the visual view of the edit mode toggle.
     *
     * Listens to mouse & touch and handles edit mode toggle interactions.
     *
     * @constructs
     *
     * @augments Backbone.View
     */
    initialize: function () {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'change:isViewing', this.persist);
    },

    /**
     * @inheritdoc
     *
     * @return {Drupal.contextualToolbar.VisualView}
     *   The current contextual toolbar visual view.
     */
    render: function () {
      // Render the visibility.
      this.$el.toggleClass('hidden', !this.model.get('isVisible'));
      // Render the state.
      this.$el.find('button').toggleClass('is-active', !this.model.get('isViewing'));

      return this;
    },

    /**
     * Model change handler; persists the isViewing value to localStorage.
     *
     * `isViewing === true` is the default, so only stores in localStorage when
     * it's not the default value (i.e. false).
     *
     * @param {Drupal.contextualToolbar.StateModel} model
     *   A {@link Drupal.contextualToolbar.StateModel} model.
     * @param {bool} isViewing
     *   The value of the isViewing attribute in the model.
     */
    persist: function (model, isViewing) {
      if (!isViewing) {
        localStorage.setItem('Drupal.contextualToolbar.isViewing', 'false');
      }
      else {
        localStorage.removeItem('Drupal.contextualToolbar.isViewing');
      }
    }

  });

})(Drupal, Backbone);
;
/**
 * @file
 * Defines Javascript behaviors for the commerce cart module.
 */

(function ($, Drupal, drupalSettings) {
  'use strict';

  Drupal.behaviors.commerceCartBlock = {
    attach: function (context) {
      var $context = $(context);
      var $cart = $context.find('.cart--cart-block');
      var $cartButton = $context.find('.cart-block--link__expand');
      var $cartContents = $cart.find('.cart-block--contents');

      if ($cartContents.length > 0) {
        // Expand the block when the link is clicked.
        $cartButton.on('click', function (e) {
          // Prevent it from going to the cart.
          e.preventDefault();
          // Get the shopping cart width + the offset to the left.
          var windowWidth = $(window).width();
          var cartWidth = $cartContents.width() + $cart.offset().left;
          // If the cart goes out of the viewport we should align it right.
          if (cartWidth > windowWidth) {
            $cartContents.addClass('is-outside-horizontal');
          }
          // Toggle the expanded class.
          $cartContents
            .toggleClass('cart-block--contents__expanded')
            .slideToggle();
        });
      }
    }
  };
})(jQuery, Drupal, drupalSettings);
;
/**
 * @file
 * Removes whitespace from the highlighted region when an alert is closed.
 *
 */
(function ($, Drupal) {

  /**
   * Removes whitespace from the highlighted region when an alert is closed.
   */
  Drupal.behaviors.foundationAlertClose = {
    attach: function (context, settings) {

      $('.zurb-foundation-callout').once('foundation-alert').on('closed.zf', function(event) {
        var $target = $(event.target);
        var $region = $target.parent();

        // Remove this alert from the DOM, if it has no siblings.
        if (!$target.siblings().length) {
          $target.remove();

          // Trim newlines out of the highlighted region, so that our :empty
          // selector still works.
          $region.html($region.html().replace(/\n/g, ''));
        }
      });
    }
  };

})(jQuery, Drupal);
;
/**
 * @file
 * Adds the active class to active links, for proper top bar rendering.
 *
 */
(function ($, Drupal) {

  /**
   * Adds the "active" class to top bar <li> elements with active child links.
   */
  Drupal.behaviors.foundationTopBarActive = {
    attach: function (context, settings) {
      var $active_links = $(context).find('.top-bar .menu-item > a.is-active');
      if ($active_links.length) {
        $active_links.once('foundationTopBarActive').each(function() {
          $(this).parent().addClass('active');
        });
      }
    }
  };

})(jQuery, Drupal);
;
