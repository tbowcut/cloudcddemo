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
 * Attaches behaviors for the Comment module's "by-viewer" class.
 */

(function ($, Drupal, drupalSettings) {

  'use strict';

  /**
   * Add 'by-viewer' class to comments written by the current user.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.commentByViewer = {
    attach: function (context) {
      var currentUserID = parseInt(drupalSettings.user.uid, 10);
      $('[data-comment-user-id]')
        .filter(function () {
          return parseInt(this.getAttribute('data-comment-user-id'), 10) === currentUserID;
        })
        .addClass('by-viewer');
    }
  };

})(jQuery, Drupal, drupalSettings);
;
/*!
 * jQuery UI Tabs 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/tabs/
 */(function(e){typeof define=="function"&&define.amd?define(["jquery","./core","./widget"],e):e(jQuery)})(function(e){return e.widget("ui.tabs",{version:"1.11.4",delay:300,options:{active:null,collapsible:!1,event:"click",heightStyle:"content",hide:null,show:null,activate:null,beforeActivate:null,beforeLoad:null,load:null},_isLocal:function(){var e=/#.*$/;return function(t){var n,r;t=t.cloneNode(!1),n=t.href.replace(e,""),r=location.href.replace(e,"");try{n=decodeURIComponent(n)}catch(i){}try{r=decodeURIComponent(r)}catch(i){}return t.hash.length>1&&n===r}}(),_create:function(){var t=this,n=this.options;this.running=!1,this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all").toggleClass("ui-tabs-collapsible",n.collapsible),this._processTabs(),n.active=this._initialActive(),e.isArray(n.disabled)&&(n.disabled=e.unique(n.disabled.concat(e.map(this.tabs.filter(".ui-state-disabled"),function(e){return t.tabs.index(e)}))).sort()),this.options.active!==!1&&this.anchors.length?this.active=this._findActive(n.active):this.active=e(),this._refresh(),this.active.length&&this.load(n.active)},_initialActive:function(){var t=this.options.active,n=this.options.collapsible,r=location.hash.substring(1);if(t===null){r&&this.tabs.each(function(n,i){if(e(i).attr("aria-controls")===r)return t=n,!1}),t===null&&(t=this.tabs.index(this.tabs.filter(".ui-tabs-active")));if(t===null||t===-1)t=this.tabs.length?0:!1}return t!==!1&&(t=this.tabs.index(this.tabs.eq(t)),t===-1&&(t=n?!1:0)),!n&&t===!1&&this.anchors.length&&(t=0),t},_getCreateEventData:function(){return{tab:this.active,panel:this.active.length?this._getPanelForTab(this.active):e()}},_tabKeydown:function(t){var n=e(this.document[0].activeElement).closest("li"),r=this.tabs.index(n),i=!0;if(this._handlePageNav(t))return;switch(t.keyCode){case e.ui.keyCode.RIGHT:case e.ui.keyCode.DOWN:r++;break;case e.ui.keyCode.UP:case e.ui.keyCode.LEFT:i=!1,r--;break;case e.ui.keyCode.END:r=this.anchors.length-1;break;case e.ui.keyCode.HOME:r=0;break;case e.ui.keyCode.SPACE:t.preventDefault(),clearTimeout(this.activating),this._activate(r);return;case e.ui.keyCode.ENTER:t.preventDefault(),clearTimeout(this.activating),this._activate(r===this.options.active?!1:r);return;default:return}t.preventDefault(),clearTimeout(this.activating),r=this._focusNextTab(r,i),!t.ctrlKey&&!t.metaKey&&(n.attr("aria-selected","false"),this.tabs.eq(r).attr("aria-selected","true"),this.activating=this._delay(function(){this.option("active",r)},this.delay))},_panelKeydown:function(t){if(this._handlePageNav(t))return;t.ctrlKey&&t.keyCode===e.ui.keyCode.UP&&(t.preventDefault(),this.active.focus())},_handlePageNav:function(t){if(t.altKey&&t.keyCode===e.ui.keyCode.PAGE_UP)return this._activate(this._focusNextTab(this.options.active-1,!1)),!0;if(t.altKey&&t.keyCode===e.ui.keyCode.PAGE_DOWN)return this._activate(this._focusNextTab(this.options.active+1,!0)),!0},_findNextTab:function(t,n){function i(){return t>r&&(t=0),t<0&&(t=r),t}var r=this.tabs.length-1;while(e.inArray(i(),this.options.disabled)!==-1)t=n?t+1:t-1;return t},_focusNextTab:function(e,t){return e=this._findNextTab(e,t),this.tabs.eq(e).focus(),e},_setOption:function(e,t){if(e==="active"){this._activate(t);return}if(e==="disabled"){this._setupDisabled(t);return}this._super(e,t),e==="collapsible"&&(this.element.toggleClass("ui-tabs-collapsible",t),!t&&this.options.active===!1&&this._activate(0)),e==="event"&&this._setupEvents(t),e==="heightStyle"&&this._setupHeightStyle(t)},_sanitizeSelector:function(e){return e?e.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g,"\\$&"):""},refresh:function(){var t=this.options,n=this.tablist.children(":has(a[href])");t.disabled=e.map(n.filter(".ui-state-disabled"),function(e){return n.index(e)}),this._processTabs(),t.active===!1||!this.anchors.length?(t.active=!1,this.active=e()):this.active.length&&!e.contains(this.tablist[0],this.active[0])?this.tabs.length===t.disabled.length?(t.active=!1,this.active=e()):this._activate(this._findNextTab(Math.max(0,t.active-1),!1)):t.active=this.tabs.index(this.active),this._refresh()},_refresh:function(){this._setupDisabled(this.options.disabled),this._setupEvents(this.options.event),this._setupHeightStyle(this.options.heightStyle),this.tabs.not(this.active).attr({"aria-selected":"false","aria-expanded":"false",tabIndex:-1}),this.panels.not(this._getPanelForTab(this.active)).hide().attr({"aria-hidden":"true"}),this.active.length?(this.active.addClass("ui-tabs-active ui-state-active").attr({"aria-selected":"true","aria-expanded":"true",tabIndex:0}),this._getPanelForTab(this.active).show().attr({"aria-hidden":"false"})):this.tabs.eq(0).attr("tabIndex",0)},_processTabs:function(){var t=this,n=this.tabs,r=this.anchors,i=this.panels;this.tablist=this._getList().addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").attr("role","tablist").delegate("> li","mousedown"+this.eventNamespace,function(t){e(this).is(".ui-state-disabled")&&t.preventDefault()}).delegate(".ui-tabs-anchor","focus"+this.eventNamespace,function(){e(this).closest("li").is(".ui-state-disabled")&&this.blur()}),this.tabs=this.tablist.find("> li:has(a[href])").addClass("ui-state-default ui-corner-top").attr({role:"tab",tabIndex:-1}),this.anchors=this.tabs.map(function(){return e("a",this)[0]}).addClass("ui-tabs-anchor").attr({role:"presentation",tabIndex:-1}),this.panels=e(),this.anchors.each(function(n,r){var i,s,o,u=e(r).uniqueId().attr("id"),a=e(r).closest("li"),f=a.attr("aria-controls");t._isLocal(r)?(i=r.hash,o=i.substring(1),s=t.element.find(t._sanitizeSelector(i))):(o=a.attr("aria-controls")||e({}).uniqueId()[0].id,i="#"+o,s=t.element.find(i),s.length||(s=t._createPanel(o),s.insertAfter(t.panels[n-1]||t.tablist)),s.attr("aria-live","polite")),s.length&&(t.panels=t.panels.add(s)),f&&a.data("ui-tabs-aria-controls",f),a.attr({"aria-controls":o,"aria-labelledby":u}),s.attr("aria-labelledby",u)}),this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").attr("role","tabpanel"),n&&(this._off(n.not(this.tabs)),this._off(r.not(this.anchors)),this._off(i.not(this.panels)))},_getList:function(){return this.tablist||this.element.find("ol,ul").eq(0)},_createPanel:function(t){return e("<div>").attr("id",t).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy",!0)},_setupDisabled:function(t){e.isArray(t)&&(t.length?t.length===this.anchors.length&&(t=!0):t=!1);for(var n=0,r;r=this.tabs[n];n++)t===!0||e.inArray(n,t)!==-1?e(r).addClass("ui-state-disabled").attr("aria-disabled","true"):e(r).removeClass("ui-state-disabled").removeAttr("aria-disabled");this.options.disabled=t},_setupEvents:function(t){var n={};t&&e.each(t.split(" "),function(e,t){n[t]="_eventHandler"}),this._off(this.anchors.add(this.tabs).add(this.panels)),this._on(!0,this.anchors,{click:function(e){e.preventDefault()}}),this._on(this.anchors,n),this._on(this.tabs,{keydown:"_tabKeydown"}),this._on(this.panels,{keydown:"_panelKeydown"}),this._focusable(this.tabs),this._hoverable(this.tabs)},_setupHeightStyle:function(t){var n,r=this.element.parent();t==="fill"?(n=r.height(),n-=this.element.outerHeight()-this.element.height(),this.element.siblings(":visible").each(function(){var t=e(this),r=t.css("position");if(r==="absolute"||r==="fixed")return;n-=t.outerHeight(!0)}),this.element.children().not(this.panels).each(function(){n-=e(this).outerHeight(!0)}),this.panels.each(function(){e(this).height(Math.max(0,n-e(this).innerHeight()+e(this).height()))}).css("overflow","auto")):t==="auto"&&(n=0,this.panels.each(function(){n=Math.max(n,e(this).height("").height())}).height(n))},_eventHandler:function(t){var n=this.options,r=this.active,i=e(t.currentTarget),s=i.closest("li"),o=s[0]===r[0],u=o&&n.collapsible,a=u?e():this._getPanelForTab(s),f=r.length?this._getPanelForTab(r):e(),l={oldTab:r,oldPanel:f,newTab:u?e():s,newPanel:a};t.preventDefault();if(s.hasClass("ui-state-disabled")||s.hasClass("ui-tabs-loading")||this.running||o&&!n.collapsible||this._trigger("beforeActivate",t,l)===!1)return;n.active=u?!1:this.tabs.index(s),this.active=o?e():s,this.xhr&&this.xhr.abort(),!f.length&&!a.length&&e.error("jQuery UI Tabs: Mismatching fragment identifier."),a.length&&this.load(this.tabs.index(s),t),this._toggle(t,l)},_toggle:function(t,n){function o(){r.running=!1,r._trigger("activate",t,n)}function u(){n.newTab.closest("li").addClass("ui-tabs-active ui-state-active"),i.length&&r.options.show?r._show(i,r.options.show,o):(i.show(),o())}var r=this,i=n.newPanel,s=n.oldPanel;this.running=!0,s.length&&this.options.hide?this._hide(s,this.options.hide,function(){n.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"),u()}):(n.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"),s.hide(),u()),s.attr("aria-hidden","true"),n.oldTab.attr({"aria-selected":"false","aria-expanded":"false"}),i.length&&s.length?n.oldTab.attr("tabIndex",-1):i.length&&this.tabs.filter(function(){return e(this).attr("tabIndex")===0}).attr("tabIndex",-1),i.attr("aria-hidden","false"),n.newTab.attr({"aria-selected":"true","aria-expanded":"true",tabIndex:0})},_activate:function(t){var n,r=this._findActive(t);if(r[0]===this.active[0])return;r.length||(r=this.active),n=r.find(".ui-tabs-anchor")[0],this._eventHandler({target:n,currentTarget:n,preventDefault:e.noop})},_findActive:function(t){return t===!1?e():this.tabs.eq(t)},_getIndex:function(e){return typeof e=="string"&&(e=this.anchors.index(this.anchors.filter("[href$='"+e+"']"))),e},_destroy:function(){this.xhr&&this.xhr.abort(),this.element.removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible"),this.tablist.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").removeAttr("role"),this.anchors.removeClass("ui-tabs-anchor").removeAttr("role").removeAttr("tabIndex").removeUniqueId(),this.tablist.unbind(this.eventNamespace),this.tabs.add(this.panels).each(function(){e.data(this,"ui-tabs-destroy")?e(this).remove():e(this).removeClass("ui-state-default ui-state-active ui-state-disabled ui-corner-top ui-corner-bottom ui-widget-content ui-tabs-active ui-tabs-panel").removeAttr("tabIndex").removeAttr("aria-live").removeAttr("aria-busy").removeAttr("aria-selected").removeAttr("aria-labelledby").removeAttr("aria-hidden").removeAttr("aria-expanded").removeAttr("role")}),this.tabs.each(function(){var t=e(this),n=t.data("ui-tabs-aria-controls");n?t.attr("aria-controls",n).removeData("ui-tabs-aria-controls"):t.removeAttr("aria-controls")}),this.panels.show(),this.options.heightStyle!=="content"&&this.panels.css("height","")},enable:function(t){var n=this.options.disabled;if(n===!1)return;t===undefined?n=!1:(t=this._getIndex(t),e.isArray(n)?n=e.map(n,function(e){return e!==t?e:null}):n=e.map(this.tabs,function(e,n){return n!==t?n:null})),this._setupDisabled(n)},disable:function(t){var n=this.options.disabled;if(n===!0)return;if(t===undefined)n=!0;else{t=this._getIndex(t);if(e.inArray(t,n)!==-1)return;e.isArray(n)?n=e.merge([t],n).sort():n=[t]}this._setupDisabled(n)},load:function(t,n){t=this._getIndex(t);var r=this,i=this.tabs.eq(t),s=i.find(".ui-tabs-anchor"),o=this._getPanelForTab(i),u={tab:i,panel:o},a=function(e,t){t==="abort"&&r.panels.stop(!1,!0),i.removeClass("ui-tabs-loading"),o.removeAttr("aria-busy"),e===r.xhr&&delete r.xhr};if(this._isLocal(s[0]))return;this.xhr=e.ajax(this._ajaxSettings(s,n,u)),this.xhr&&this.xhr.statusText!=="canceled"&&(i.addClass("ui-tabs-loading"),o.attr("aria-busy","true"),this.xhr.done(function(e,t,i){setTimeout(function(){o.html(e),r._trigger("load",n,u),a(i,t)},1)}).fail(function(e,t){setTimeout(function(){a(e,t)},1)}))},_ajaxSettings:function(t,n,r){var i=this;return{url:t.attr("href"),beforeSend:function(t,s){return i._trigger("beforeLoad",n,e.extend({jqXHR:t,ajaxSettings:s},r))}}},_getPanelForTab:function(t){var n=e(t).attr("aria-controls");return this.element.find(this._sanitizeSelector("#"+n))}})});;
/*!
 * jQuery UI Accordion 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/accordion/
 */(function(e){typeof define=="function"&&define.amd?define(["jquery","./core","./widget"],e):e(jQuery)})(function(e){return e.widget("ui.accordion",{version:"1.11.4",options:{active:0,animate:{},collapsible:!1,event:"click",header:"> li > :first-child,> :not(li):even",heightStyle:"auto",icons:{activeHeader:"ui-icon-triangle-1-s",header:"ui-icon-triangle-1-e"},activate:null,beforeActivate:null},hideProps:{borderTopWidth:"hide",borderBottomWidth:"hide",paddingTop:"hide",paddingBottom:"hide",height:"hide"},showProps:{borderTopWidth:"show",borderBottomWidth:"show",paddingTop:"show",paddingBottom:"show",height:"show"},_create:function(){var t=this.options;this.prevShow=this.prevHide=e(),this.element.addClass("ui-accordion ui-widget ui-helper-reset").attr("role","tablist"),!t.collapsible&&(t.active===!1||t.active==null)&&(t.active=0),this._processPanels(),t.active<0&&(t.active+=this.headers.length),this._refresh()},_getCreateEventData:function(){return{header:this.active,panel:this.active.length?this.active.next():e()}},_createIcons:function(){var t=this.options.icons;t&&(e("<span>").addClass("ui-accordion-header-icon ui-icon "+t.header).prependTo(this.headers),this.active.children(".ui-accordion-header-icon").removeClass(t.header).addClass(t.activeHeader),this.headers.addClass("ui-accordion-icons"))},_destroyIcons:function(){this.headers.removeClass("ui-accordion-icons").children(".ui-accordion-header-icon").remove()},_destroy:function(){var e;this.element.removeClass("ui-accordion ui-widget ui-helper-reset").removeAttr("role"),this.headers.removeClass("ui-accordion-header ui-accordion-header-active ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top").removeAttr("role").removeAttr("aria-expanded").removeAttr("aria-selected").removeAttr("aria-controls").removeAttr("tabIndex").removeUniqueId(),this._destroyIcons(),e=this.headers.next().removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-state-disabled").css("display","").removeAttr("role").removeAttr("aria-hidden").removeAttr("aria-labelledby").removeUniqueId(),this.options.heightStyle!=="content"&&e.css("height","")},_setOption:function(e,t){if(e==="active"){this._activate(t);return}e==="event"&&(this.options.event&&this._off(this.headers,this.options.event),this._setupEvents(t)),this._super(e,t),e==="collapsible"&&!t&&this.options.active===!1&&this._activate(0),e==="icons"&&(this._destroyIcons(),t&&this._createIcons()),e==="disabled"&&(this.element.toggleClass("ui-state-disabled",!!t).attr("aria-disabled",t),this.headers.add(this.headers.next()).toggleClass("ui-state-disabled",!!t))},_keydown:function(t){if(t.altKey||t.ctrlKey)return;var n=e.ui.keyCode,r=this.headers.length,i=this.headers.index(t.target),s=!1;switch(t.keyCode){case n.RIGHT:case n.DOWN:s=this.headers[(i+1)%r];break;case n.LEFT:case n.UP:s=this.headers[(i-1+r)%r];break;case n.SPACE:case n.ENTER:this._eventHandler(t);break;case n.HOME:s=this.headers[0];break;case n.END:s=this.headers[r-1]}s&&(e(t.target).attr("tabIndex",-1),e(s).attr("tabIndex",0),s.focus(),t.preventDefault())},_panelKeyDown:function(t){t.keyCode===e.ui.keyCode.UP&&t.ctrlKey&&e(t.currentTarget).prev().focus()},refresh:function(){var t=this.options;this._processPanels(),t.active===!1&&t.collapsible===!0||!this.headers.length?(t.active=!1,this.active=e()):t.active===!1?this._activate(0):this.active.length&&!e.contains(this.element[0],this.active[0])?this.headers.length===this.headers.find(".ui-state-disabled").length?(t.active=!1,this.active=e()):this._activate(Math.max(0,t.active-1)):t.active=this.headers.index(this.active),this._destroyIcons(),this._refresh()},_processPanels:function(){var e=this.headers,t=this.panels;this.headers=this.element.find(this.options.header).addClass("ui-accordion-header ui-state-default ui-corner-all"),this.panels=this.headers.next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom").filter(":not(.ui-accordion-content-active)").hide(),t&&(this._off(e.not(this.headers)),this._off(t.not(this.panels)))},_refresh:function(){var t,n=this.options,r=n.heightStyle,i=this.element.parent();this.active=this._findActive(n.active).addClass("ui-accordion-header-active ui-state-active ui-corner-top").removeClass("ui-corner-all"),this.active.next().addClass("ui-accordion-content-active").show(),this.headers.attr("role","tab").each(function(){var t=e(this),n=t.uniqueId().attr("id"),r=t.next(),i=r.uniqueId().attr("id");t.attr("aria-controls",i),r.attr("aria-labelledby",n)}).next().attr("role","tabpanel"),this.headers.not(this.active).attr({"aria-selected":"false","aria-expanded":"false",tabIndex:-1}).next().attr({"aria-hidden":"true"}).hide(),this.active.length?this.active.attr({"aria-selected":"true","aria-expanded":"true",tabIndex:0}).next().attr({"aria-hidden":"false"}):this.headers.eq(0).attr("tabIndex",0),this._createIcons(),this._setupEvents(n.event),r==="fill"?(t=i.height(),this.element.siblings(":visible").each(function(){var n=e(this),r=n.css("position");if(r==="absolute"||r==="fixed")return;t-=n.outerHeight(!0)}),this.headers.each(function(){t-=e(this).outerHeight(!0)}),this.headers.next().each(function(){e(this).height(Math.max(0,t-e(this).innerHeight()+e(this).height()))}).css("overflow","auto")):r==="auto"&&(t=0,this.headers.next().each(function(){t=Math.max(t,e(this).css("height","").height())}).height(t))},_activate:function(t){var n=this._findActive(t)[0];if(n===this.active[0])return;n=n||this.active[0],this._eventHandler({target:n,currentTarget:n,preventDefault:e.noop})},_findActive:function(t){return typeof t=="number"?this.headers.eq(t):e()},_setupEvents:function(t){var n={keydown:"_keydown"};t&&e.each(t.split(" "),function(e,t){n[t]="_eventHandler"}),this._off(this.headers.add(this.headers.next())),this._on(this.headers,n),this._on(this.headers.next(),{keydown:"_panelKeyDown"}),this._hoverable(this.headers),this._focusable(this.headers)},_eventHandler:function(t){var n=this.options,r=this.active,i=e(t.currentTarget),s=i[0]===r[0],o=s&&n.collapsible,u=o?e():i.next(),a=r.next(),f={oldHeader:r,oldPanel:a,newHeader:o?e():i,newPanel:u};t.preventDefault();if(s&&!n.collapsible||this._trigger("beforeActivate",t,f)===!1)return;n.active=o?!1:this.headers.index(i),this.active=s?e():i,this._toggle(f),r.removeClass("ui-accordion-header-active ui-state-active"),n.icons&&r.children(".ui-accordion-header-icon").removeClass(n.icons.activeHeader).addClass(n.icons.header),s||(i.removeClass("ui-corner-all").addClass("ui-accordion-header-active ui-state-active ui-corner-top"),n.icons&&i.children(".ui-accordion-header-icon").removeClass(n.icons.header).addClass(n.icons.activeHeader),i.next().addClass("ui-accordion-content-active"))},_toggle:function(t){var n=t.newPanel,r=this.prevShow.length?this.prevShow:t.oldPanel;this.prevShow.add(this.prevHide).stop(!0,!0),this.prevShow=n,this.prevHide=r,this.options.animate?this._animate(n,r,t):(r.hide(),n.show(),this._toggleComplete(t)),r.attr({"aria-hidden":"true"}),r.prev().attr({"aria-selected":"false","aria-expanded":"false"}),n.length&&r.length?r.prev().attr({tabIndex:-1,"aria-expanded":"false"}):n.length&&this.headers.filter(function(){return parseInt(e(this).attr("tabIndex"),10)===0}).attr("tabIndex",-1),n.attr("aria-hidden","false").prev().attr({"aria-selected":"true","aria-expanded":"true",tabIndex:0})},_animate:function(e,t,n){var r,i,s,o=this,u=0,a=e.css("box-sizing"),f=e.length&&(!t.length||e.index()<t.index()),l=this.options.animate||{},c=f&&l.down||l,h=function(){o._toggleComplete(n)};typeof c=="number"&&(s=c),typeof c=="string"&&(i=c),i=i||c.easing||l.easing,s=s||c.duration||l.duration;if(!t.length)return e.animate(this.showProps,s,i,h);if(!e.length)return t.animate(this.hideProps,s,i,h);r=e.show().outerHeight(),t.animate(this.hideProps,{duration:s,easing:i,step:function(e,t){t.now=Math.round(e)}}),e.hide().animate(this.showProps,{duration:s,easing:i,complete:h,step:function(e,n){n.now=Math.round(e),n.prop!=="height"?a==="content-box"&&(u+=n.now):o.options.heightStyle!=="content"&&(n.now=Math.round(r-t.outerHeight()-u),u=0)}})},_toggleComplete:function(e){var t=e.oldPanel;t.removeClass("ui-accordion-content-active").prev().removeClass("ui-corner-top").addClass("ui-corner-all"),t.length&&(t.parent()[0].className=t.parent()[0].className),this._trigger("activate",null,e)}})});;
/**
 * @file tabs.js
 */
(function ($, Drupal) {

  "use strict";

  function handleOverflow () {
    $('.df-tools-tabs-wrapper').each(function () {
      var baseTop;
      var $wrapper = $(this);
      if ($wrapper.find('.field-wrapper').data('ui-accordion')) {
        $wrapper.find('.field-wrapper').accordion('destroy');
        $wrapper.removeClass('is-overflown');
      }
      $wrapper.tabs();
      $wrapper.find('.ui-tabs-nav li').each(function () {
        var top = $(this).position()['top'];
        baseTop = baseTop || top;
        if (top !== baseTop) {
          $wrapper.tabs('destroy');
          $wrapper.find('.field-wrapper').accordion({
            header: '.df-tools-tabs-accordion-title',
            collapsible: true
          });
          $wrapper.addClass('is-overflown');
          return false;
        }
      });
    });
  }

  /**
   * Enables jQuery tabs for our field.
   */
  Drupal.behaviors.DFToolsTabs = {
    attach: function (context) {
      handleOverflow();
    }
  };

  $(document).ready(function () {
    $(window).resize(function () {
      handleOverflow();
    });
  });

})(jQuery, Drupal);
;
/**
 * @file magellan.js
 */
(function ($, Drupal) {

  "use strict";

  /**
   * Dynamically fills the "Magellan" block with valid links.
   */
  Drupal.behaviors.DFToolsBlocksMagellan = {
    attach: function (context) {
      $('.df-tools-magellan-block', context).once('magellan').each(function () {
        if (Drupal.panels_ipe && Drupal.panels_ipe.app && Drupal.panels_ipe.app.get('active')) {
          $(this).find('[data-sticky]').attr('style', '');
          $(this).find('[data-sticky]').removeClass('sticky');
          return;
        }
        var $blocks_after = $(this).closest('.block-plugin-id-magellan').nextAll();
        var $menu = $(this).find('.menu');
        $menu.empty();
        $blocks_after.each(function () {
          $(this).find('.block-title').each(function () {
            if (!this.hasAttribute('id')) {
              $(this).uniqueId();
            }
            $(this).attr('data-magellan-target', $(this).attr('id'));
            var $anchor = $('<a></a>');
            $anchor.attr('href', '#' + $(this).attr('id'));
            $anchor.text($(this).text());
            $menu.append($('<li></li>').append($anchor));
          });
        });
        $(this).find('[data-sticky], [data-magellan]').each(function() {
          if ($(this).data('zfPlugin')) {
            $(this).foundation('destroy');
          }
        });
        $(this).foundation();
        $(this).find('a').on('click', function () {
          $('[data-magellan]').data('zfPlugin').options.barOffset = $('#toolbar-bar:visible').outerHeight() + $('#toolbar-item-administration-tray:visible').outerHeight() + $(this).outerHeight() - 10;
        });
      });

      // Temporary fix until https://github.com/zurb/foundation-sites/issues/8016 is closed.
      $(window).once('temporary-magellan-fix').on('scroll hashchange', function () {
        $('[data-magellan]').each(function () {
          if ($(this).data('zfPlugin')) {
            $(this).foundation('reflow');
          }
        });
      });
    }
  };

}(jQuery, Drupal));
;
/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.6.0
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */
!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery"],a):"undefined"!=typeof exports?module.exports=a(require("jquery")):a(jQuery)}(function(a){"use strict";var b=window.Slick||{};b=function(){function c(c,d){var f,e=this;e.defaults={accessibility:!0,adaptiveHeight:!1,appendArrows:a(c),appendDots:a(c),arrows:!0,asNavFor:null,prevArrow:'<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',nextArrow:'<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',autoplay:!1,autoplaySpeed:3e3,centerMode:!1,centerPadding:"50px",cssEase:"ease",customPaging:function(b,c){return a('<button type="button" data-role="none" role="button" tabindex="0" />').text(c+1)},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",edgeFriction:.35,fade:!1,focusOnSelect:!1,infinite:!0,initialSlide:0,lazyLoad:"ondemand",mobileFirst:!1,pauseOnHover:!0,pauseOnFocus:!0,pauseOnDotsHover:!1,respondTo:"window",responsive:null,rows:1,rtl:!1,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:!0,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useCSS:!0,useTransform:!0,variableWidth:!1,vertical:!1,verticalSwiping:!1,waitForAnimate:!0,zIndex:1e3},e.initials={animating:!1,dragging:!1,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,$list:null,touchObject:{},transformsEnabled:!1,unslicked:!1},a.extend(e,e.initials),e.activeBreakpoint=null,e.animType=null,e.animProp=null,e.breakpoints=[],e.breakpointSettings=[],e.cssTransitions=!1,e.focussed=!1,e.interrupted=!1,e.hidden="hidden",e.paused=!0,e.positionProp=null,e.respondTo=null,e.rowCount=1,e.shouldClick=!0,e.$slider=a(c),e.$slidesCache=null,e.transformType=null,e.transitionType=null,e.visibilityChange="visibilitychange",e.windowWidth=0,e.windowTimer=null,f=a(c).data("slick")||{},e.options=a.extend({},e.defaults,d,f),e.currentSlide=e.options.initialSlide,e.originalSettings=e.options,"undefined"!=typeof document.mozHidden?(e.hidden="mozHidden",e.visibilityChange="mozvisibilitychange"):"undefined"!=typeof document.webkitHidden&&(e.hidden="webkitHidden",e.visibilityChange="webkitvisibilitychange"),e.autoPlay=a.proxy(e.autoPlay,e),e.autoPlayClear=a.proxy(e.autoPlayClear,e),e.autoPlayIterator=a.proxy(e.autoPlayIterator,e),e.changeSlide=a.proxy(e.changeSlide,e),e.clickHandler=a.proxy(e.clickHandler,e),e.selectHandler=a.proxy(e.selectHandler,e),e.setPosition=a.proxy(e.setPosition,e),e.swipeHandler=a.proxy(e.swipeHandler,e),e.dragHandler=a.proxy(e.dragHandler,e),e.keyHandler=a.proxy(e.keyHandler,e),e.instanceUid=b++,e.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/,e.registerBreakpoints(),e.init(!0)}var b=0;return c}(),b.prototype.activateADA=function(){var a=this;a.$slideTrack.find(".slick-active").attr({"aria-hidden":"false"}).find("a, input, button, select").attr({tabindex:"0"})},b.prototype.addSlide=b.prototype.slickAdd=function(b,c,d){var e=this;if("boolean"==typeof c)d=c,c=null;else if(0>c||c>=e.slideCount)return!1;e.unload(),"number"==typeof c?0===c&&0===e.$slides.length?a(b).appendTo(e.$slideTrack):d?a(b).insertBefore(e.$slides.eq(c)):a(b).insertAfter(e.$slides.eq(c)):d===!0?a(b).prependTo(e.$slideTrack):a(b).appendTo(e.$slideTrack),e.$slides=e.$slideTrack.children(this.options.slide),e.$slideTrack.children(this.options.slide).detach(),e.$slideTrack.append(e.$slides),e.$slides.each(function(b,c){a(c).attr("data-slick-index",b)}),e.$slidesCache=e.$slides,e.reinit()},b.prototype.animateHeight=function(){var a=this;if(1===a.options.slidesToShow&&a.options.adaptiveHeight===!0&&a.options.vertical===!1){var b=a.$slides.eq(a.currentSlide).outerHeight(!0);a.$list.animate({height:b},a.options.speed)}},b.prototype.animateSlide=function(b,c){var d={},e=this;e.animateHeight(),e.options.rtl===!0&&e.options.vertical===!1&&(b=-b),e.transformsEnabled===!1?e.options.vertical===!1?e.$slideTrack.animate({left:b},e.options.speed,e.options.easing,c):e.$slideTrack.animate({top:b},e.options.speed,e.options.easing,c):e.cssTransitions===!1?(e.options.rtl===!0&&(e.currentLeft=-e.currentLeft),a({animStart:e.currentLeft}).animate({animStart:b},{duration:e.options.speed,easing:e.options.easing,step:function(a){a=Math.ceil(a),e.options.vertical===!1?(d[e.animType]="translate("+a+"px, 0px)",e.$slideTrack.css(d)):(d[e.animType]="translate(0px,"+a+"px)",e.$slideTrack.css(d))},complete:function(){c&&c.call()}})):(e.applyTransition(),b=Math.ceil(b),e.options.vertical===!1?d[e.animType]="translate3d("+b+"px, 0px, 0px)":d[e.animType]="translate3d(0px,"+b+"px, 0px)",e.$slideTrack.css(d),c&&setTimeout(function(){e.disableTransition(),c.call()},e.options.speed))},b.prototype.getNavTarget=function(){var b=this,c=b.options.asNavFor;return c&&null!==c&&(c=a(c).not(b.$slider)),c},b.prototype.asNavFor=function(b){var c=this,d=c.getNavTarget();null!==d&&"object"==typeof d&&d.each(function(){var c=a(this).slick("getSlick");c.unslicked||c.slideHandler(b,!0)})},b.prototype.applyTransition=function(a){var b=this,c={};b.options.fade===!1?c[b.transitionType]=b.transformType+" "+b.options.speed+"ms "+b.options.cssEase:c[b.transitionType]="opacity "+b.options.speed+"ms "+b.options.cssEase,b.options.fade===!1?b.$slideTrack.css(c):b.$slides.eq(a).css(c)},b.prototype.autoPlay=function(){var a=this;a.autoPlayClear(),a.slideCount>a.options.slidesToShow&&(a.autoPlayTimer=setInterval(a.autoPlayIterator,a.options.autoplaySpeed))},b.prototype.autoPlayClear=function(){var a=this;a.autoPlayTimer&&clearInterval(a.autoPlayTimer)},b.prototype.autoPlayIterator=function(){var a=this,b=a.currentSlide+a.options.slidesToScroll;a.paused||a.interrupted||a.focussed||(a.options.infinite===!1&&(1===a.direction&&a.currentSlide+1===a.slideCount-1?a.direction=0:0===a.direction&&(b=a.currentSlide-a.options.slidesToScroll,a.currentSlide-1===0&&(a.direction=1))),a.slideHandler(b))},b.prototype.buildArrows=function(){var b=this;b.options.arrows===!0&&(b.$prevArrow=a(b.options.prevArrow).addClass("slick-arrow"),b.$nextArrow=a(b.options.nextArrow).addClass("slick-arrow"),b.slideCount>b.options.slidesToShow?(b.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),b.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),b.htmlExpr.test(b.options.prevArrow)&&b.$prevArrow.prependTo(b.options.appendArrows),b.htmlExpr.test(b.options.nextArrow)&&b.$nextArrow.appendTo(b.options.appendArrows),b.options.infinite!==!0&&b.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true")):b.$prevArrow.add(b.$nextArrow).addClass("slick-hidden").attr({"aria-disabled":"true",tabindex:"-1"}))},b.prototype.buildDots=function(){var c,d,b=this;if(b.options.dots===!0&&b.slideCount>b.options.slidesToShow){for(b.$slider.addClass("slick-dotted"),d=a("<ul />").addClass(b.options.dotsClass),c=0;c<=b.getDotCount();c+=1)d.append(a("<li />").append(b.options.customPaging.call(this,b,c)));b.$dots=d.appendTo(b.options.appendDots),b.$dots.find("li").first().addClass("slick-active").attr("aria-hidden","false")}},b.prototype.buildOut=function(){var b=this;b.$slides=b.$slider.children(b.options.slide+":not(.slick-cloned)").addClass("slick-slide"),b.slideCount=b.$slides.length,b.$slides.each(function(b,c){a(c).attr("data-slick-index",b).data("originalStyling",a(c).attr("style")||"")}),b.$slider.addClass("slick-slider"),b.$slideTrack=0===b.slideCount?a('<div class="slick-track"/>').appendTo(b.$slider):b.$slides.wrapAll('<div class="slick-track"/>').parent(),b.$list=b.$slideTrack.wrap('<div aria-live="polite" class="slick-list"/>').parent(),b.$slideTrack.css("opacity",0),(b.options.centerMode===!0||b.options.swipeToSlide===!0)&&(b.options.slidesToScroll=1),a("img[data-lazy]",b.$slider).not("[src]").addClass("slick-loading"),b.setupInfinite(),b.buildArrows(),b.buildDots(),b.updateDots(),b.setSlideClasses("number"==typeof b.currentSlide?b.currentSlide:0),b.options.draggable===!0&&b.$list.addClass("draggable")},b.prototype.buildRows=function(){var b,c,d,e,f,g,h,a=this;if(e=document.createDocumentFragment(),g=a.$slider.children(),a.options.rows>1){for(h=a.options.slidesPerRow*a.options.rows,f=Math.ceil(g.length/h),b=0;f>b;b++){var i=document.createElement("div");for(c=0;c<a.options.rows;c++){var j=document.createElement("div");for(d=0;d<a.options.slidesPerRow;d++){var k=b*h+(c*a.options.slidesPerRow+d);g.get(k)&&j.appendChild(g.get(k))}i.appendChild(j)}e.appendChild(i)}a.$slider.empty().append(e),a.$slider.children().children().children().css({width:100/a.options.slidesPerRow+"%",display:"inline-block"})}},b.prototype.checkResponsive=function(b,c){var e,f,g,d=this,h=!1,i=d.$slider.width(),j=window.innerWidth||a(window).width();if("window"===d.respondTo?g=j:"slider"===d.respondTo?g=i:"min"===d.respondTo&&(g=Math.min(j,i)),d.options.responsive&&d.options.responsive.length&&null!==d.options.responsive){f=null;for(e in d.breakpoints)d.breakpoints.hasOwnProperty(e)&&(d.originalSettings.mobileFirst===!1?g<d.breakpoints[e]&&(f=d.breakpoints[e]):g>d.breakpoints[e]&&(f=d.breakpoints[e]));null!==f?null!==d.activeBreakpoint?(f!==d.activeBreakpoint||c)&&(d.activeBreakpoint=f,"unslick"===d.breakpointSettings[f]?d.unslick(f):(d.options=a.extend({},d.originalSettings,d.breakpointSettings[f]),b===!0&&(d.currentSlide=d.options.initialSlide),d.refresh(b)),h=f):(d.activeBreakpoint=f,"unslick"===d.breakpointSettings[f]?d.unslick(f):(d.options=a.extend({},d.originalSettings,d.breakpointSettings[f]),b===!0&&(d.currentSlide=d.options.initialSlide),d.refresh(b)),h=f):null!==d.activeBreakpoint&&(d.activeBreakpoint=null,d.options=d.originalSettings,b===!0&&(d.currentSlide=d.options.initialSlide),d.refresh(b),h=f),b||h===!1||d.$slider.trigger("breakpoint",[d,h])}},b.prototype.changeSlide=function(b,c){var f,g,h,d=this,e=a(b.currentTarget);switch(e.is("a")&&b.preventDefault(),e.is("li")||(e=e.closest("li")),h=d.slideCount%d.options.slidesToScroll!==0,f=h?0:(d.slideCount-d.currentSlide)%d.options.slidesToScroll,b.data.message){case"previous":g=0===f?d.options.slidesToScroll:d.options.slidesToShow-f,d.slideCount>d.options.slidesToShow&&d.slideHandler(d.currentSlide-g,!1,c);break;case"next":g=0===f?d.options.slidesToScroll:f,d.slideCount>d.options.slidesToShow&&d.slideHandler(d.currentSlide+g,!1,c);break;case"index":var i=0===b.data.index?0:b.data.index||e.index()*d.options.slidesToScroll;d.slideHandler(d.checkNavigable(i),!1,c),e.children().trigger("focus");break;default:return}},b.prototype.checkNavigable=function(a){var c,d,b=this;if(c=b.getNavigableIndexes(),d=0,a>c[c.length-1])a=c[c.length-1];else for(var e in c){if(a<c[e]){a=d;break}d=c[e]}return a},b.prototype.cleanUpEvents=function(){var b=this;b.options.dots&&null!==b.$dots&&a("li",b.$dots).off("click.slick",b.changeSlide).off("mouseenter.slick",a.proxy(b.interrupt,b,!0)).off("mouseleave.slick",a.proxy(b.interrupt,b,!1)),b.$slider.off("focus.slick blur.slick"),b.options.arrows===!0&&b.slideCount>b.options.slidesToShow&&(b.$prevArrow&&b.$prevArrow.off("click.slick",b.changeSlide),b.$nextArrow&&b.$nextArrow.off("click.slick",b.changeSlide)),b.$list.off("touchstart.slick mousedown.slick",b.swipeHandler),b.$list.off("touchmove.slick mousemove.slick",b.swipeHandler),b.$list.off("touchend.slick mouseup.slick",b.swipeHandler),b.$list.off("touchcancel.slick mouseleave.slick",b.swipeHandler),b.$list.off("click.slick",b.clickHandler),a(document).off(b.visibilityChange,b.visibility),b.cleanUpSlideEvents(),b.options.accessibility===!0&&b.$list.off("keydown.slick",b.keyHandler),b.options.focusOnSelect===!0&&a(b.$slideTrack).children().off("click.slick",b.selectHandler),a(window).off("orientationchange.slick.slick-"+b.instanceUid,b.orientationChange),a(window).off("resize.slick.slick-"+b.instanceUid,b.resize),a("[draggable!=true]",b.$slideTrack).off("dragstart",b.preventDefault),a(window).off("load.slick.slick-"+b.instanceUid,b.setPosition),a(document).off("ready.slick.slick-"+b.instanceUid,b.setPosition)},b.prototype.cleanUpSlideEvents=function(){var b=this;b.$list.off("mouseenter.slick",a.proxy(b.interrupt,b,!0)),b.$list.off("mouseleave.slick",a.proxy(b.interrupt,b,!1))},b.prototype.cleanUpRows=function(){var b,a=this;a.options.rows>1&&(b=a.$slides.children().children(),b.removeAttr("style"),a.$slider.empty().append(b))},b.prototype.clickHandler=function(a){var b=this;b.shouldClick===!1&&(a.stopImmediatePropagation(),a.stopPropagation(),a.preventDefault())},b.prototype.destroy=function(b){var c=this;c.autoPlayClear(),c.touchObject={},c.cleanUpEvents(),a(".slick-cloned",c.$slider).detach(),c.$dots&&c.$dots.remove(),c.$prevArrow&&c.$prevArrow.length&&(c.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),c.htmlExpr.test(c.options.prevArrow)&&c.$prevArrow.remove()),c.$nextArrow&&c.$nextArrow.length&&(c.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),c.htmlExpr.test(c.options.nextArrow)&&c.$nextArrow.remove()),c.$slides&&(c.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){a(this).attr("style",a(this).data("originalStyling"))}),c.$slideTrack.children(this.options.slide).detach(),c.$slideTrack.detach(),c.$list.detach(),c.$slider.append(c.$slides)),c.cleanUpRows(),c.$slider.removeClass("slick-slider"),c.$slider.removeClass("slick-initialized"),c.$slider.removeClass("slick-dotted"),c.unslicked=!0,b||c.$slider.trigger("destroy",[c])},b.prototype.disableTransition=function(a){var b=this,c={};c[b.transitionType]="",b.options.fade===!1?b.$slideTrack.css(c):b.$slides.eq(a).css(c)},b.prototype.fadeSlide=function(a,b){var c=this;c.cssTransitions===!1?(c.$slides.eq(a).css({zIndex:c.options.zIndex}),c.$slides.eq(a).animate({opacity:1},c.options.speed,c.options.easing,b)):(c.applyTransition(a),c.$slides.eq(a).css({opacity:1,zIndex:c.options.zIndex}),b&&setTimeout(function(){c.disableTransition(a),b.call()},c.options.speed))},b.prototype.fadeSlideOut=function(a){var b=this;b.cssTransitions===!1?b.$slides.eq(a).animate({opacity:0,zIndex:b.options.zIndex-2},b.options.speed,b.options.easing):(b.applyTransition(a),b.$slides.eq(a).css({opacity:0,zIndex:b.options.zIndex-2}))},b.prototype.filterSlides=b.prototype.slickFilter=function(a){var b=this;null!==a&&(b.$slidesCache=b.$slides,b.unload(),b.$slideTrack.children(this.options.slide).detach(),b.$slidesCache.filter(a).appendTo(b.$slideTrack),b.reinit())},b.prototype.focusHandler=function(){var b=this;b.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick","*:not(.slick-arrow)",function(c){c.stopImmediatePropagation();var d=a(this);setTimeout(function(){b.options.pauseOnFocus&&(b.focussed=d.is(":focus"),b.autoPlay())},0)})},b.prototype.getCurrent=b.prototype.slickCurrentSlide=function(){var a=this;return a.currentSlide},b.prototype.getDotCount=function(){var a=this,b=0,c=0,d=0;if(a.options.infinite===!0)for(;b<a.slideCount;)++d,b=c+a.options.slidesToScroll,c+=a.options.slidesToScroll<=a.options.slidesToShow?a.options.slidesToScroll:a.options.slidesToShow;else if(a.options.centerMode===!0)d=a.slideCount;else if(a.options.asNavFor)for(;b<a.slideCount;)++d,b=c+a.options.slidesToScroll,c+=a.options.slidesToScroll<=a.options.slidesToShow?a.options.slidesToScroll:a.options.slidesToShow;else d=1+Math.ceil((a.slideCount-a.options.slidesToShow)/a.options.slidesToScroll);return d-1},b.prototype.getLeft=function(a){var c,d,f,b=this,e=0;return b.slideOffset=0,d=b.$slides.first().outerHeight(!0),b.options.infinite===!0?(b.slideCount>b.options.slidesToShow&&(b.slideOffset=b.slideWidth*b.options.slidesToShow*-1,e=d*b.options.slidesToShow*-1),b.slideCount%b.options.slidesToScroll!==0&&a+b.options.slidesToScroll>b.slideCount&&b.slideCount>b.options.slidesToShow&&(a>b.slideCount?(b.slideOffset=(b.options.slidesToShow-(a-b.slideCount))*b.slideWidth*-1,e=(b.options.slidesToShow-(a-b.slideCount))*d*-1):(b.slideOffset=b.slideCount%b.options.slidesToScroll*b.slideWidth*-1,e=b.slideCount%b.options.slidesToScroll*d*-1))):a+b.options.slidesToShow>b.slideCount&&(b.slideOffset=(a+b.options.slidesToShow-b.slideCount)*b.slideWidth,e=(a+b.options.slidesToShow-b.slideCount)*d),b.slideCount<=b.options.slidesToShow&&(b.slideOffset=0,e=0),b.options.centerMode===!0&&b.options.infinite===!0?b.slideOffset+=b.slideWidth*Math.floor(b.options.slidesToShow/2)-b.slideWidth:b.options.centerMode===!0&&(b.slideOffset=0,b.slideOffset+=b.slideWidth*Math.floor(b.options.slidesToShow/2)),c=b.options.vertical===!1?a*b.slideWidth*-1+b.slideOffset:a*d*-1+e,b.options.variableWidth===!0&&(f=b.slideCount<=b.options.slidesToShow||b.options.infinite===!1?b.$slideTrack.children(".slick-slide").eq(a):b.$slideTrack.children(".slick-slide").eq(a+b.options.slidesToShow),c=b.options.rtl===!0?f[0]?-1*(b.$slideTrack.width()-f[0].offsetLeft-f.width()):0:f[0]?-1*f[0].offsetLeft:0,b.options.centerMode===!0&&(f=b.slideCount<=b.options.slidesToShow||b.options.infinite===!1?b.$slideTrack.children(".slick-slide").eq(a):b.$slideTrack.children(".slick-slide").eq(a+b.options.slidesToShow+1),c=b.options.rtl===!0?f[0]?-1*(b.$slideTrack.width()-f[0].offsetLeft-f.width()):0:f[0]?-1*f[0].offsetLeft:0,c+=(b.$list.width()-f.outerWidth())/2)),c},b.prototype.getOption=b.prototype.slickGetOption=function(a){var b=this;return b.options[a]},b.prototype.getNavigableIndexes=function(){var e,a=this,b=0,c=0,d=[];for(a.options.infinite===!1?e=a.slideCount:(b=-1*a.options.slidesToScroll,c=-1*a.options.slidesToScroll,e=2*a.slideCount);e>b;)d.push(b),b=c+a.options.slidesToScroll,c+=a.options.slidesToScroll<=a.options.slidesToShow?a.options.slidesToScroll:a.options.slidesToShow;return d},b.prototype.getSlick=function(){return this},b.prototype.getSlideCount=function(){var c,d,e,b=this;return e=b.options.centerMode===!0?b.slideWidth*Math.floor(b.options.slidesToShow/2):0,b.options.swipeToSlide===!0?(b.$slideTrack.find(".slick-slide").each(function(c,f){return f.offsetLeft-e+a(f).outerWidth()/2>-1*b.swipeLeft?(d=f,!1):void 0}),c=Math.abs(a(d).attr("data-slick-index")-b.currentSlide)||1):b.options.slidesToScroll},b.prototype.goTo=b.prototype.slickGoTo=function(a,b){var c=this;c.changeSlide({data:{message:"index",index:parseInt(a)}},b)},b.prototype.init=function(b){var c=this;a(c.$slider).hasClass("slick-initialized")||(a(c.$slider).addClass("slick-initialized"),c.buildRows(),c.buildOut(),c.setProps(),c.startLoad(),c.loadSlider(),c.initializeEvents(),c.updateArrows(),c.updateDots(),c.checkResponsive(!0),c.focusHandler()),b&&c.$slider.trigger("init",[c]),c.options.accessibility===!0&&c.initADA(),c.options.autoplay&&(c.paused=!1,c.autoPlay())},b.prototype.initADA=function(){var b=this;b.$slides.add(b.$slideTrack.find(".slick-cloned")).attr({"aria-hidden":"true",tabindex:"-1"}).find("a, input, button, select").attr({tabindex:"-1"}),b.$slideTrack.attr("role","listbox"),b.$slides.not(b.$slideTrack.find(".slick-cloned")).each(function(c){a(this).attr({role:"option","aria-describedby":"slick-slide"+b.instanceUid+c})}),null!==b.$dots&&b.$dots.attr("role","tablist").find("li").each(function(c){a(this).attr({role:"presentation","aria-selected":"false","aria-controls":"navigation"+b.instanceUid+c,id:"slick-slide"+b.instanceUid+c})}).first().attr("aria-selected","true").end().find("button").attr("role","button").end().closest("div").attr("role","toolbar"),b.activateADA()},b.prototype.initArrowEvents=function(){var a=this;a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.off("click.slick").on("click.slick",{message:"previous"},a.changeSlide),a.$nextArrow.off("click.slick").on("click.slick",{message:"next"},a.changeSlide))},b.prototype.initDotEvents=function(){var b=this;b.options.dots===!0&&b.slideCount>b.options.slidesToShow&&a("li",b.$dots).on("click.slick",{message:"index"},b.changeSlide),b.options.dots===!0&&b.options.pauseOnDotsHover===!0&&a("li",b.$dots).on("mouseenter.slick",a.proxy(b.interrupt,b,!0)).on("mouseleave.slick",a.proxy(b.interrupt,b,!1))},b.prototype.initSlideEvents=function(){var b=this;b.options.pauseOnHover&&(b.$list.on("mouseenter.slick",a.proxy(b.interrupt,b,!0)),b.$list.on("mouseleave.slick",a.proxy(b.interrupt,b,!1)))},b.prototype.initializeEvents=function(){var b=this;b.initArrowEvents(),b.initDotEvents(),b.initSlideEvents(),b.$list.on("touchstart.slick mousedown.slick",{action:"start"},b.swipeHandler),b.$list.on("touchmove.slick mousemove.slick",{action:"move"},b.swipeHandler),b.$list.on("touchend.slick mouseup.slick",{action:"end"},b.swipeHandler),b.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},b.swipeHandler),b.$list.on("click.slick",b.clickHandler),a(document).on(b.visibilityChange,a.proxy(b.visibility,b)),b.options.accessibility===!0&&b.$list.on("keydown.slick",b.keyHandler),b.options.focusOnSelect===!0&&a(b.$slideTrack).children().on("click.slick",b.selectHandler),a(window).on("orientationchange.slick.slick-"+b.instanceUid,a.proxy(b.orientationChange,b)),a(window).on("resize.slick.slick-"+b.instanceUid,a.proxy(b.resize,b)),a("[draggable!=true]",b.$slideTrack).on("dragstart",b.preventDefault),a(window).on("load.slick.slick-"+b.instanceUid,b.setPosition),a(document).on("ready.slick.slick-"+b.instanceUid,b.setPosition)},b.prototype.initUI=function(){var a=this;a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.show(),a.$nextArrow.show()),a.options.dots===!0&&a.slideCount>a.options.slidesToShow&&a.$dots.show()},b.prototype.keyHandler=function(a){var b=this;a.target.tagName.match("TEXTAREA|INPUT|SELECT")||(37===a.keyCode&&b.options.accessibility===!0?b.changeSlide({data:{message:b.options.rtl===!0?"next":"previous"}}):39===a.keyCode&&b.options.accessibility===!0&&b.changeSlide({data:{message:b.options.rtl===!0?"previous":"next"}}))},b.prototype.lazyLoad=function(){function g(c){a("img[data-lazy]",c).each(function(){var c=a(this),d=a(this).attr("data-lazy"),e=document.createElement("img");e.onload=function(){c.animate({opacity:0},100,function(){c.attr("src",d).animate({opacity:1},200,function(){c.removeAttr("data-lazy").removeClass("slick-loading")}),b.$slider.trigger("lazyLoaded",[b,c,d])})},e.onerror=function(){c.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),b.$slider.trigger("lazyLoadError",[b,c,d])},e.src=d})}var c,d,e,f,b=this;b.options.centerMode===!0?b.options.infinite===!0?(e=b.currentSlide+(b.options.slidesToShow/2+1),f=e+b.options.slidesToShow+2):(e=Math.max(0,b.currentSlide-(b.options.slidesToShow/2+1)),f=2+(b.options.slidesToShow/2+1)+b.currentSlide):(e=b.options.infinite?b.options.slidesToShow+b.currentSlide:b.currentSlide,f=Math.ceil(e+b.options.slidesToShow),b.options.fade===!0&&(e>0&&e--,f<=b.slideCount&&f++)),c=b.$slider.find(".slick-slide").slice(e,f),g(c),b.slideCount<=b.options.slidesToShow?(d=b.$slider.find(".slick-slide"),g(d)):b.currentSlide>=b.slideCount-b.options.slidesToShow?(d=b.$slider.find(".slick-cloned").slice(0,b.options.slidesToShow),g(d)):0===b.currentSlide&&(d=b.$slider.find(".slick-cloned").slice(-1*b.options.slidesToShow),g(d))},b.prototype.loadSlider=function(){var a=this;a.setPosition(),a.$slideTrack.css({opacity:1}),a.$slider.removeClass("slick-loading"),a.initUI(),"progressive"===a.options.lazyLoad&&a.progressiveLazyLoad()},b.prototype.next=b.prototype.slickNext=function(){var a=this;a.changeSlide({data:{message:"next"}})},b.prototype.orientationChange=function(){var a=this;a.checkResponsive(),a.setPosition()},b.prototype.pause=b.prototype.slickPause=function(){var a=this;a.autoPlayClear(),a.paused=!0},b.prototype.play=b.prototype.slickPlay=function(){var a=this;a.autoPlay(),a.options.autoplay=!0,a.paused=!1,a.focussed=!1,a.interrupted=!1},b.prototype.postSlide=function(a){var b=this;b.unslicked||(b.$slider.trigger("afterChange",[b,a]),b.animating=!1,b.setPosition(),b.swipeLeft=null,b.options.autoplay&&b.autoPlay(),b.options.accessibility===!0&&b.initADA())},b.prototype.prev=b.prototype.slickPrev=function(){var a=this;a.changeSlide({data:{message:"previous"}})},b.prototype.preventDefault=function(a){a.preventDefault()},b.prototype.progressiveLazyLoad=function(b){b=b||1;var e,f,g,c=this,d=a("img[data-lazy]",c.$slider);d.length?(e=d.first(),f=e.attr("data-lazy"),g=document.createElement("img"),g.onload=function(){e.attr("src",f).removeAttr("data-lazy").removeClass("slick-loading"),c.options.adaptiveHeight===!0&&c.setPosition(),c.$slider.trigger("lazyLoaded",[c,e,f]),c.progressiveLazyLoad()},g.onerror=function(){3>b?setTimeout(function(){c.progressiveLazyLoad(b+1)},500):(e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),c.$slider.trigger("lazyLoadError",[c,e,f]),c.progressiveLazyLoad())},g.src=f):c.$slider.trigger("allImagesLoaded",[c])},b.prototype.refresh=function(b){var d,e,c=this;e=c.slideCount-c.options.slidesToShow,!c.options.infinite&&c.currentSlide>e&&(c.currentSlide=e),c.slideCount<=c.options.slidesToShow&&(c.currentSlide=0),d=c.currentSlide,c.destroy(!0),a.extend(c,c.initials,{currentSlide:d}),c.init(),b||c.changeSlide({data:{message:"index",index:d}},!1)},b.prototype.registerBreakpoints=function(){var c,d,e,b=this,f=b.options.responsive||null;if("array"===a.type(f)&&f.length){b.respondTo=b.options.respondTo||"window";for(c in f)if(e=b.breakpoints.length-1,d=f[c].breakpoint,f.hasOwnProperty(c)){for(;e>=0;)b.breakpoints[e]&&b.breakpoints[e]===d&&b.breakpoints.splice(e,1),e--;b.breakpoints.push(d),b.breakpointSettings[d]=f[c].settings}b.breakpoints.sort(function(a,c){return b.options.mobileFirst?a-c:c-a})}},b.prototype.reinit=function(){var b=this;b.$slides=b.$slideTrack.children(b.options.slide).addClass("slick-slide"),b.slideCount=b.$slides.length,b.currentSlide>=b.slideCount&&0!==b.currentSlide&&(b.currentSlide=b.currentSlide-b.options.slidesToScroll),b.slideCount<=b.options.slidesToShow&&(b.currentSlide=0),b.registerBreakpoints(),b.setProps(),b.setupInfinite(),b.buildArrows(),b.updateArrows(),b.initArrowEvents(),b.buildDots(),b.updateDots(),b.initDotEvents(),b.cleanUpSlideEvents(),b.initSlideEvents(),b.checkResponsive(!1,!0),b.options.focusOnSelect===!0&&a(b.$slideTrack).children().on("click.slick",b.selectHandler),b.setSlideClasses("number"==typeof b.currentSlide?b.currentSlide:0),b.setPosition(),b.focusHandler(),b.paused=!b.options.autoplay,b.autoPlay(),b.$slider.trigger("reInit",[b])},b.prototype.resize=function(){var b=this;a(window).width()!==b.windowWidth&&(clearTimeout(b.windowDelay),b.windowDelay=window.setTimeout(function(){b.windowWidth=a(window).width(),b.checkResponsive(),b.unslicked||b.setPosition()},50))},b.prototype.removeSlide=b.prototype.slickRemove=function(a,b,c){var d=this;return"boolean"==typeof a?(b=a,a=b===!0?0:d.slideCount-1):a=b===!0?--a:a,d.slideCount<1||0>a||a>d.slideCount-1?!1:(d.unload(),c===!0?d.$slideTrack.children().remove():d.$slideTrack.children(this.options.slide).eq(a).remove(),d.$slides=d.$slideTrack.children(this.options.slide),d.$slideTrack.children(this.options.slide).detach(),d.$slideTrack.append(d.$slides),d.$slidesCache=d.$slides,void d.reinit())},b.prototype.setCSS=function(a){var d,e,b=this,c={};b.options.rtl===!0&&(a=-a),d="left"==b.positionProp?Math.ceil(a)+"px":"0px",e="top"==b.positionProp?Math.ceil(a)+"px":"0px",c[b.positionProp]=a,b.transformsEnabled===!1?b.$slideTrack.css(c):(c={},b.cssTransitions===!1?(c[b.animType]="translate("+d+", "+e+")",b.$slideTrack.css(c)):(c[b.animType]="translate3d("+d+", "+e+", 0px)",b.$slideTrack.css(c)))},b.prototype.setDimensions=function(){var a=this;a.options.vertical===!1?a.options.centerMode===!0&&a.$list.css({padding:"0px "+a.options.centerPadding}):(a.$list.height(a.$slides.first().outerHeight(!0)*a.options.slidesToShow),a.options.centerMode===!0&&a.$list.css({padding:a.options.centerPadding+" 0px"})),a.listWidth=a.$list.width(),a.listHeight=a.$list.height(),a.options.vertical===!1&&a.options.variableWidth===!1?(a.slideWidth=Math.ceil(a.listWidth/a.options.slidesToShow),a.$slideTrack.width(Math.ceil(a.slideWidth*a.$slideTrack.children(".slick-slide").length))):a.options.variableWidth===!0?a.$slideTrack.width(5e3*a.slideCount):(a.slideWidth=Math.ceil(a.listWidth),a.$slideTrack.height(Math.ceil(a.$slides.first().outerHeight(!0)*a.$slideTrack.children(".slick-slide").length)));var b=a.$slides.first().outerWidth(!0)-a.$slides.first().width();a.options.variableWidth===!1&&a.$slideTrack.children(".slick-slide").width(a.slideWidth-b)},b.prototype.setFade=function(){var c,b=this;b.$slides.each(function(d,e){c=b.slideWidth*d*-1,b.options.rtl===!0?a(e).css({position:"relative",right:c,top:0,zIndex:b.options.zIndex-2,opacity:0}):a(e).css({position:"relative",left:c,top:0,zIndex:b.options.zIndex-2,opacity:0})}),b.$slides.eq(b.currentSlide).css({zIndex:b.options.zIndex-1,opacity:1})},b.prototype.setHeight=function(){var a=this;if(1===a.options.slidesToShow&&a.options.adaptiveHeight===!0&&a.options.vertical===!1){var b=a.$slides.eq(a.currentSlide).outerHeight(!0);a.$list.css("height",b)}},b.prototype.setOption=b.prototype.slickSetOption=function(){var c,d,e,f,h,b=this,g=!1;if("object"===a.type(arguments[0])?(e=arguments[0],g=arguments[1],h="multiple"):"string"===a.type(arguments[0])&&(e=arguments[0],f=arguments[1],g=arguments[2],"responsive"===arguments[0]&&"array"===a.type(arguments[1])?h="responsive":"undefined"!=typeof arguments[1]&&(h="single")),"single"===h)b.options[e]=f;else if("multiple"===h)a.each(e,function(a,c){b.options[a]=c});else if("responsive"===h)for(d in f)if("array"!==a.type(b.options.responsive))b.options.responsive=[f[d]];else{for(c=b.options.responsive.length-1;c>=0;)b.options.responsive[c].breakpoint===f[d].breakpoint&&b.options.responsive.splice(c,1),c--;b.options.responsive.push(f[d])}g&&(b.unload(),b.reinit())},b.prototype.setPosition=function(){var a=this;a.setDimensions(),a.setHeight(),a.options.fade===!1?a.setCSS(a.getLeft(a.currentSlide)):a.setFade(),a.$slider.trigger("setPosition",[a])},b.prototype.setProps=function(){var a=this,b=document.body.style;a.positionProp=a.options.vertical===!0?"top":"left","top"===a.positionProp?a.$slider.addClass("slick-vertical"):a.$slider.removeClass("slick-vertical"),(void 0!==b.WebkitTransition||void 0!==b.MozTransition||void 0!==b.msTransition)&&a.options.useCSS===!0&&(a.cssTransitions=!0),a.options.fade&&("number"==typeof a.options.zIndex?a.options.zIndex<3&&(a.options.zIndex=3):a.options.zIndex=a.defaults.zIndex),void 0!==b.OTransform&&(a.animType="OTransform",a.transformType="-o-transform",a.transitionType="OTransition",void 0===b.perspectiveProperty&&void 0===b.webkitPerspective&&(a.animType=!1)),void 0!==b.MozTransform&&(a.animType="MozTransform",a.transformType="-moz-transform",a.transitionType="MozTransition",void 0===b.perspectiveProperty&&void 0===b.MozPerspective&&(a.animType=!1)),void 0!==b.webkitTransform&&(a.animType="webkitTransform",a.transformType="-webkit-transform",a.transitionType="webkitTransition",void 0===b.perspectiveProperty&&void 0===b.webkitPerspective&&(a.animType=!1)),void 0!==b.msTransform&&(a.animType="msTransform",a.transformType="-ms-transform",a.transitionType="msTransition",void 0===b.msTransform&&(a.animType=!1)),void 0!==b.transform&&a.animType!==!1&&(a.animType="transform",a.transformType="transform",a.transitionType="transition"),a.transformsEnabled=a.options.useTransform&&null!==a.animType&&a.animType!==!1},b.prototype.setSlideClasses=function(a){var c,d,e,f,b=this;d=b.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true"),b.$slides.eq(a).addClass("slick-current"),b.options.centerMode===!0?(c=Math.floor(b.options.slidesToShow/2),b.options.infinite===!0&&(a>=c&&a<=b.slideCount-1-c?b.$slides.slice(a-c,a+c+1).addClass("slick-active").attr("aria-hidden","false"):(e=b.options.slidesToShow+a,
d.slice(e-c+1,e+c+2).addClass("slick-active").attr("aria-hidden","false")),0===a?d.eq(d.length-1-b.options.slidesToShow).addClass("slick-center"):a===b.slideCount-1&&d.eq(b.options.slidesToShow).addClass("slick-center")),b.$slides.eq(a).addClass("slick-center")):a>=0&&a<=b.slideCount-b.options.slidesToShow?b.$slides.slice(a,a+b.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"):d.length<=b.options.slidesToShow?d.addClass("slick-active").attr("aria-hidden","false"):(f=b.slideCount%b.options.slidesToShow,e=b.options.infinite===!0?b.options.slidesToShow+a:a,b.options.slidesToShow==b.options.slidesToScroll&&b.slideCount-a<b.options.slidesToShow?d.slice(e-(b.options.slidesToShow-f),e+f).addClass("slick-active").attr("aria-hidden","false"):d.slice(e,e+b.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false")),"ondemand"===b.options.lazyLoad&&b.lazyLoad()},b.prototype.setupInfinite=function(){var c,d,e,b=this;if(b.options.fade===!0&&(b.options.centerMode=!1),b.options.infinite===!0&&b.options.fade===!1&&(d=null,b.slideCount>b.options.slidesToShow)){for(e=b.options.centerMode===!0?b.options.slidesToShow+1:b.options.slidesToShow,c=b.slideCount;c>b.slideCount-e;c-=1)d=c-1,a(b.$slides[d]).clone(!0).attr("id","").attr("data-slick-index",d-b.slideCount).prependTo(b.$slideTrack).addClass("slick-cloned");for(c=0;e>c;c+=1)d=c,a(b.$slides[d]).clone(!0).attr("id","").attr("data-slick-index",d+b.slideCount).appendTo(b.$slideTrack).addClass("slick-cloned");b.$slideTrack.find(".slick-cloned").find("[id]").each(function(){a(this).attr("id","")})}},b.prototype.interrupt=function(a){var b=this;a||b.autoPlay(),b.interrupted=a},b.prototype.selectHandler=function(b){var c=this,d=a(b.target).is(".slick-slide")?a(b.target):a(b.target).parents(".slick-slide"),e=parseInt(d.attr("data-slick-index"));return e||(e=0),c.slideCount<=c.options.slidesToShow?(c.setSlideClasses(e),void c.asNavFor(e)):void c.slideHandler(e)},b.prototype.slideHandler=function(a,b,c){var d,e,f,g,j,h=null,i=this;return b=b||!1,i.animating===!0&&i.options.waitForAnimate===!0||i.options.fade===!0&&i.currentSlide===a||i.slideCount<=i.options.slidesToShow?void 0:(b===!1&&i.asNavFor(a),d=a,h=i.getLeft(d),g=i.getLeft(i.currentSlide),i.currentLeft=null===i.swipeLeft?g:i.swipeLeft,i.options.infinite===!1&&i.options.centerMode===!1&&(0>a||a>i.getDotCount()*i.options.slidesToScroll)?void(i.options.fade===!1&&(d=i.currentSlide,c!==!0?i.animateSlide(g,function(){i.postSlide(d)}):i.postSlide(d))):i.options.infinite===!1&&i.options.centerMode===!0&&(0>a||a>i.slideCount-i.options.slidesToScroll)?void(i.options.fade===!1&&(d=i.currentSlide,c!==!0?i.animateSlide(g,function(){i.postSlide(d)}):i.postSlide(d))):(i.options.autoplay&&clearInterval(i.autoPlayTimer),e=0>d?i.slideCount%i.options.slidesToScroll!==0?i.slideCount-i.slideCount%i.options.slidesToScroll:i.slideCount+d:d>=i.slideCount?i.slideCount%i.options.slidesToScroll!==0?0:d-i.slideCount:d,i.animating=!0,i.$slider.trigger("beforeChange",[i,i.currentSlide,e]),f=i.currentSlide,i.currentSlide=e,i.setSlideClasses(i.currentSlide),i.options.asNavFor&&(j=i.getNavTarget(),j=j.slick("getSlick"),j.slideCount<=j.options.slidesToShow&&j.setSlideClasses(i.currentSlide)),i.updateDots(),i.updateArrows(),i.options.fade===!0?(c!==!0?(i.fadeSlideOut(f),i.fadeSlide(e,function(){i.postSlide(e)})):i.postSlide(e),void i.animateHeight()):void(c!==!0?i.animateSlide(h,function(){i.postSlide(e)}):i.postSlide(e))))},b.prototype.startLoad=function(){var a=this;a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.hide(),a.$nextArrow.hide()),a.options.dots===!0&&a.slideCount>a.options.slidesToShow&&a.$dots.hide(),a.$slider.addClass("slick-loading")},b.prototype.swipeDirection=function(){var a,b,c,d,e=this;return a=e.touchObject.startX-e.touchObject.curX,b=e.touchObject.startY-e.touchObject.curY,c=Math.atan2(b,a),d=Math.round(180*c/Math.PI),0>d&&(d=360-Math.abs(d)),45>=d&&d>=0?e.options.rtl===!1?"left":"right":360>=d&&d>=315?e.options.rtl===!1?"left":"right":d>=135&&225>=d?e.options.rtl===!1?"right":"left":e.options.verticalSwiping===!0?d>=35&&135>=d?"down":"up":"vertical"},b.prototype.swipeEnd=function(a){var c,d,b=this;if(b.dragging=!1,b.interrupted=!1,b.shouldClick=b.touchObject.swipeLength>10?!1:!0,void 0===b.touchObject.curX)return!1;if(b.touchObject.edgeHit===!0&&b.$slider.trigger("edge",[b,b.swipeDirection()]),b.touchObject.swipeLength>=b.touchObject.minSwipe){switch(d=b.swipeDirection()){case"left":case"down":c=b.options.swipeToSlide?b.checkNavigable(b.currentSlide+b.getSlideCount()):b.currentSlide+b.getSlideCount(),b.currentDirection=0;break;case"right":case"up":c=b.options.swipeToSlide?b.checkNavigable(b.currentSlide-b.getSlideCount()):b.currentSlide-b.getSlideCount(),b.currentDirection=1}"vertical"!=d&&(b.slideHandler(c),b.touchObject={},b.$slider.trigger("swipe",[b,d]))}else b.touchObject.startX!==b.touchObject.curX&&(b.slideHandler(b.currentSlide),b.touchObject={})},b.prototype.swipeHandler=function(a){var b=this;if(!(b.options.swipe===!1||"ontouchend"in document&&b.options.swipe===!1||b.options.draggable===!1&&-1!==a.type.indexOf("mouse")))switch(b.touchObject.fingerCount=a.originalEvent&&void 0!==a.originalEvent.touches?a.originalEvent.touches.length:1,b.touchObject.minSwipe=b.listWidth/b.options.touchThreshold,b.options.verticalSwiping===!0&&(b.touchObject.minSwipe=b.listHeight/b.options.touchThreshold),a.data.action){case"start":b.swipeStart(a);break;case"move":b.swipeMove(a);break;case"end":b.swipeEnd(a)}},b.prototype.swipeMove=function(a){var d,e,f,g,h,b=this;return h=void 0!==a.originalEvent?a.originalEvent.touches:null,!b.dragging||h&&1!==h.length?!1:(d=b.getLeft(b.currentSlide),b.touchObject.curX=void 0!==h?h[0].pageX:a.clientX,b.touchObject.curY=void 0!==h?h[0].pageY:a.clientY,b.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(b.touchObject.curX-b.touchObject.startX,2))),b.options.verticalSwiping===!0&&(b.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(b.touchObject.curY-b.touchObject.startY,2)))),e=b.swipeDirection(),"vertical"!==e?(void 0!==a.originalEvent&&b.touchObject.swipeLength>4&&a.preventDefault(),g=(b.options.rtl===!1?1:-1)*(b.touchObject.curX>b.touchObject.startX?1:-1),b.options.verticalSwiping===!0&&(g=b.touchObject.curY>b.touchObject.startY?1:-1),f=b.touchObject.swipeLength,b.touchObject.edgeHit=!1,b.options.infinite===!1&&(0===b.currentSlide&&"right"===e||b.currentSlide>=b.getDotCount()&&"left"===e)&&(f=b.touchObject.swipeLength*b.options.edgeFriction,b.touchObject.edgeHit=!0),b.options.vertical===!1?b.swipeLeft=d+f*g:b.swipeLeft=d+f*(b.$list.height()/b.listWidth)*g,b.options.verticalSwiping===!0&&(b.swipeLeft=d+f*g),b.options.fade===!0||b.options.touchMove===!1?!1:b.animating===!0?(b.swipeLeft=null,!1):void b.setCSS(b.swipeLeft)):void 0)},b.prototype.swipeStart=function(a){var c,b=this;return b.interrupted=!0,1!==b.touchObject.fingerCount||b.slideCount<=b.options.slidesToShow?(b.touchObject={},!1):(void 0!==a.originalEvent&&void 0!==a.originalEvent.touches&&(c=a.originalEvent.touches[0]),b.touchObject.startX=b.touchObject.curX=void 0!==c?c.pageX:a.clientX,b.touchObject.startY=b.touchObject.curY=void 0!==c?c.pageY:a.clientY,void(b.dragging=!0))},b.prototype.unfilterSlides=b.prototype.slickUnfilter=function(){var a=this;null!==a.$slidesCache&&(a.unload(),a.$slideTrack.children(this.options.slide).detach(),a.$slidesCache.appendTo(a.$slideTrack),a.reinit())},b.prototype.unload=function(){var b=this;a(".slick-cloned",b.$slider).remove(),b.$dots&&b.$dots.remove(),b.$prevArrow&&b.htmlExpr.test(b.options.prevArrow)&&b.$prevArrow.remove(),b.$nextArrow&&b.htmlExpr.test(b.options.nextArrow)&&b.$nextArrow.remove(),b.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")},b.prototype.unslick=function(a){var b=this;b.$slider.trigger("unslick",[b,a]),b.destroy()},b.prototype.updateArrows=function(){var b,a=this;b=Math.floor(a.options.slidesToShow/2),a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&!a.options.infinite&&(a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false"),a.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false"),0===a.currentSlide?(a.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true"),a.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false")):a.currentSlide>=a.slideCount-a.options.slidesToShow&&a.options.centerMode===!1?(a.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")):a.currentSlide>=a.slideCount-1&&a.options.centerMode===!0&&(a.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")))},b.prototype.updateDots=function(){var a=this;null!==a.$dots&&(a.$dots.find("li").removeClass("slick-active").attr("aria-hidden","true"),a.$dots.find("li").eq(Math.floor(a.currentSlide/a.options.slidesToScroll)).addClass("slick-active").attr("aria-hidden","false"))},b.prototype.visibility=function(){var a=this;a.options.autoplay&&(document[a.hidden]?a.interrupted=!0:a.interrupted=!1)},a.fn.slick=function(){var f,g,a=this,c=arguments[0],d=Array.prototype.slice.call(arguments,1),e=a.length;for(f=0;e>f;f++)if("object"==typeof c||"undefined"==typeof c?a[f].slick=new b(a[f],c):g=a[f].slick[c].apply(a[f].slick,d),"undefined"!=typeof g)return g;return a}});;
/**
 * @file
 * Contains Javascript required to format the form
 */

(function ($, Drupal) {

  "use strict";

  Drupal.behaviors.DFToolsSlideshow = {
    attach: function (context, settings) {
      for (var i in settings.DFToolsSlideshow) {
        var config = settings.DFToolsSlideshow[i].slick;
        var $slideshow = $('[data-df-tools-slideshow-instance-id="' + i + '"] > .field-items').not('.slick-initialized');
        if ($slideshow.length) {
          if (config.customPaging === true) {
            config.customPaging = function (slider, i) {
              var $slide = $(slider.$slides[i]);
              return $('<a href="javascript:;" class="df-tools-slideshow-custom-pager"></a>').append($slide.find('.df-tools-slideshow-pager-element').clone());
            };
            $slideshow.addClass('df-tools-slideshow-uses-custom-pager');
          }
          $slideshow.slick(config);
        }
      }
    }
  };

}(jQuery, Drupal));
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
 * DFS Obio submit button replicate.
 */

(function($, Drupal) {
  'use strict';

  // Based on the data-replicate attriute, this behavior mimics the
  // functionality of any kind of element by triggering click event on the
  // (target) element that has this attribute IF the source element exists.
  //
  // Source element is the html tag which selector was specified in the content
  // of the "data-replicate" attribute.s
  //
  // If the source not exist, it restores the visibility of the target element.
  //
  // This feature is used on the add-to-cart form.
  //
  // Check dfs_obio_commerce module's form alter and the product template inside
  // the Obio theme.
  Drupal.behaviors.dfsObioCommerceSubmitReplicate = {
    attach: function (context) {
      $(context).find('[data-replicate]').once('dfsObioCommerceSubmitReplicate').each(function () {
        var $trigger_target = $(this);
        var trigger_source_selector = $(this).attr('data-replicate');
        var $trigger_source = $(trigger_source_selector);

        if ($trigger_source.length) {
          $trigger_source.bind('click', function (event) {
            $trigger_target.trigger('click');

            event.preventDefault();
          }).removeClass('visually-hidden');
        }
        else {
          $trigger_target.removeClass('visually-hidden');
        }
      });
    }
  };

})(jQuery, Drupal);
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
