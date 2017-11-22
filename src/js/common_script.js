(function utilities(global, document, $) {

	global.engageOwlCarousel = function (element, settings) {

		if (element.hasClass('owl-carousel'))
			this.destroyOwlCarousel(element);
		element.addClass('owl-carousel').owlCarousel(settings);

	};

	global.destroyOwlCarousel = function (element) {

		if (element.hasClass('owl-carousel')) {
			element.trigger('destroy.owl.carousel')
					.removeClass('owl-carousel owl-loaded owl-center owl-hidden');
		}

	};

	global.setScrollTop = function (element, pos) {

		element.on('click', function () {
			$('body,html').animate({scrollTop: (pos)}, 600);
			return false;
		});

	};

	global.classes = {

		active: 'active',
		popupOpened: 'popup-opened',
		disabled: 'disabled'
	};

	global.roundTo = function (x, n) {
		if (isNaN(x) || isNaN(n)) return false;
		var m = Math.pow(10, n);
		return Math.round(x * m) / m;
	};

	global.ucFirst = function (str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	};

	global.getDay = function (date) {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate());
	};

	global.getNextDay = function (from, daysCount) {

		var nextDay = new Date(from.getTime());
		nextDay.setDate(nextDay.getDate() + daysCount);

		return new Date(nextDay.getFullYear(), nextDay.getMonth(), nextDay.getDate());

	};

	global.getOffsetRect = function (elem) {

		var box = elem.getBoundingClientRect();
		var body = document.body;
		var docElem = document.documentElement;
		var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
		var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
		var clientTop = docElem.clientTop || body.clientTop || 0;
		var clientLeft = docElem.clientLeft || body.clientLeft || 0;
		var top  = box.top +  scrollTop - clientTop;
		var left = box.left + scrollLeft - clientLeft;
		return {
			top: Math.round(top),
			left: Math.round(left),
			width: box.width,
			height: box.height
		}
	};

	global.getChar = function (event) {

		if (event.which === null) {
			if (event.keyCode < 32) return null;
			return String.fromCharCode(event.keyCode)
		}

		if (event.which !== 0 && event.charCode !== 0) {
			if (event.which < 32) return null;
			return String.fromCharCode(event.which);
		}

		return null;
	};

	global.enterFullScreen = function (element) {
		if (element.requestFullscreen) {
			element.requestFullscreen();
		} else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if (element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		} else if (element.msRequestFullscreen) {
			element.msRequestFullscreen();
		}
	};

	global.onGoogleMapsApiReady = function() {

		$(global).trigger('googleMapsApiReady');

	};

	global.loadGoogleMapsApi = function () {

		var $script = $('<script async defer></script>');

		$script.attr('src', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDZ1TXC6qzkLOU_hPKB4Rkx7yx3EpS3P1k&callback=onGoogleMapsApiReady');

		$('head').append($script);

	};

}(window, document, jQuery));

(function scrollIndicator(window, $) {

	var $window = $(window),
			stInitial = 0;

	$window.on('scroll', function () {

		var st = $window.scrollTop();

		if(st > stInitial)
			$window.trigger('scrollDown');
		else
			$window.trigger('scrollUp');

		stInitial = st;

	});

}(window, jQuery));

(function mediaChecker(global, document, $) {

	function MediaChecker(options) {

		this.options = $.extend(true, {}, this.defaults, options);
		$.proxy(init, this)();

	}

	MediaChecker.prototype.defaults = {
		breakPoints: {
			mobileSmall: 320,
			mobile: 767,
			tabletPortrait: 800,
			tablet: 1024
		}
	};

	function init() {

		var self = this;

		$.each(self.options.breakPoints, function (name, value) {
			self.addBreakpoint(name, value);
		})

	}

	MediaChecker.prototype.check = function (brPoint) {
		return global.matchMedia(getQuery(brPoint)).matches;
	};

	MediaChecker.prototype.addBreakpoint = function (name, brPoint) {

		var self = this,
				fnName = 'is' + global.ucFirst(name);
		self[fnName] = function () { return self.check(brPoint); }

	};

	function getQuery(brPoint) {
		return 'screen and (max-width: '+ brPoint +'px)';
	}

	global.mediaChecker = new MediaChecker;

}(window, document, jQuery));

(function calendar(global, document, $, pickmeup) {

	pickmeup.defaults.locales['ru'] = {
		days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
		daysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
		daysMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
		months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
		monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
	};

	function Calendar(element, options) {

		this.options = $.extend(true, {}, this.defaults, options);
		this.element = element;
		this.$element = $(element);
		$.proxy(init, this)();

	}

	Calendar.prototype.defaults = {
		pickmeup: {
			hide_on_select: true,
			class_name: 'calendar',
			locale: 'ru',
			format: 'd.m.Y'
		},
		custom: {
			append: true,
			disablePastDays: false,
			minDay: getMinDay()
		}
	};

	Calendar.prototype.getDate = function (formatted) {

		var self = this,
				element = self.element;

		return pickmeup(element).get_date(formatted);

	};

	Calendar.prototype.setDate = function (date) {

		var self = this,
				element = self.element;

		pickmeup(element).set_date(date);

		return self;

	};

	Calendar.prototype.refresh = function (opts) {

		var self = this;
		self.options = $.extend(true, {}, self.options, opts);
		$.proxy(destroy, self)();
		$.proxy(init, self)();

	};

	function destroy() {

		pickmeup(this.element).destroy();

	}

	function init() {

		var self = this,
				element = self.element,
				$element = self.$element,
				calOptions = self.options.pickmeup,
				minDay = self.options.custom.minDay;

		if(self.options.custom.disablePastDays)
			calOptions = $.extend({}, self.options.pickmeup, {

				min: minDay,
				render: disablePastDays(minDay)

			});

		pickmeup(element, calOptions);

		if(self.options.custom.append)
			$element.parent().append($(element.__pickmeup.element));

		$element.on('pickmeup-change', function () {

			$element.trigger('change');

		});

	}

	function disablePastDays(day) {

		return function (date) {
			if (date < day) {
				return {disabled : true, class_name : 'date-in-past'};
			}
			return {};
		}

	}

	function getMinDay() {

		var now = new Date;
		return new Date(now.getFullYear(), now.getMonth(), now.getDate());

	}

	$.fn.calendar = function (options) {

		return this.each(function () {

			var $this = $(this),
					data = $this.data('calendar');

			if (!data) {
				data = new Calendar(this, typeof options === 'object' && options);
				$this.data('calendar', data);
			}

		});

	};

	$.fn.calendar.Constructor = Calendar;


}(window, document, jQuery, pickmeup));

(function gallery(global, document, $) {

	function Gallery(element, options) {

		this.options = $.extend(true, {}, this.defaults, options);
		this.element = element;
		this.$element = $(element);
		$.proxy(init, this)();

	}

	Gallery.prototype.defaults = {

		structure: {
			switchContainer: '.gallery__switch',
			switchTab: '.switch__tab',
			tabsContainer: '.gallery__tabs',
			tab: '.gallery__tab'
		},
		dataTabKey: 'tab',
		autoData: true,
		disabledClass: '.disabled',
		autoPlay: false,
		autoPlayInterval: 4000,
		switchOnClick: true,
		switchOnHover: false

	};

	function init() {

		$.proxy(setStructure, this)();

		if(this.options.autoData)
			$.proxy(setData, this)();

		this.currentTabNum = $.proxy(getCurrentTabNum, this)();
		this.tabCount = this.$tabs.length;

		if (this.options.autoPlay)
			$.proxy(startAnimation, this)();

		if (this.options.switchOnClick)
			$.proxy(setSwitchTabHandler, this, 'click')();

		if (this.options.switchOnHover)
			$.proxy(setSwitchTabHandler, this, 'mouseenter')();

	}

	function setStructure() {

		var self = this,
				$gallery = self.$element,
				structure = self.options.structure;

		self.$switch = $gallery.children(structure.switchContainer);
		self.$switchTabs = self.$switch.find(structure.switchTab);
		self.$tabsContainer = $gallery.children(structure.tabsContainer);
		self.$tabs = self.$tabsContainer.children(structure.tab);

	}

	function setData() {

		var self = this,
				key = self.options.dataTabKey;

		self.$switchTabs.each(function (ind, el) {
			var $el = $(el);
			$el.data(key, ind + 1);
		});

		self.$tabs.each(function (ind, el) {
			var $el = $(el);
			$el.data(key, ind + 1);
		});
	}

	function switchTab(activeTab) {

		var self = this,
				nextTabNum = self.currentTabNum < self.tabCount ? self.currentTabNum + 1 : 1,
				tab = activeTab || nextTabNum;

		self.currentTabNum = tab;

		self.$switchTabs.each(function (ind, el) {
			$.proxy(activateTab, self, $(el), tab)();
		});

		self.$tabs.each(function (ind, el) {
			$.proxy(activateTab, self, $(el), tab)();
		});

	}

	function activateTab($tab, activeTab) {

		var active = window.classes.active,
				key = this.options.dataTabKey;

		if ($tab.data(key) === activeTab)
			$tab.addClass(active);
		else
			$tab.removeClass(active);
	}

	function getTab(tab) {

		var self = this,
				$tab = undefined;
		self.$tabs.each(function (ind, el) {
			var $el = $(el);
			if ($el.data(self.options.dataTabKey) === tab) {
				$tab = $el;
				return false;
			}
		});
		return $tab;

	}

	function getCurrentTabNum() {
		var self = this,
				tabNum = undefined;
		self.$tabs.each(function (ind, el) {
			var $el = $(el);
			if ($el.hasClass(window.classes.active)) {
				tabNum = $el.data(self.options.dataTabKey);
				return false;
			}
		});
		return tabNum;
	}

	function setSwitchTabHandler(event) {

		var self = this,
				switchTabClass = self.options.structure.switchTab,
				disabled = self.options.disabled;

		self.$element.on(event, switchTabClass + ':not(' + disabled + ')', function () {

			if (self.animationStarted)
				$.proxy(stopAnimation, self)();

			$.proxy(switchTabHandler, this, self)();

		}).on('mouseleave', switchTabClass + ':not(' + disabled + ')', function () {
			if (self.options.autoPlay)
				$.proxy(startAnimation, self)();
		});
	}

	function switchTabHandler(mainContext) {

		var $tab = $(this),
				tab = $tab.data(mainContext.options.dataTabKey);

		$.proxy(switchTab, mainContext, tab)();
		mainContext.$element.trigger('tabChanged', [tab, $.proxy(getTab, mainContext, tab)()]);
	}

	function startAnimation() {
		var self = this;
		if (!self.animationStarted) {
			self.intervalId = setInterval($.proxy(switchTab, self), self.options.autoPlayInterval);
			self.animationStarted = true;
		}

	}

	function stopAnimation() {
		var self = this;
		clearInterval(self.intervalId);
		self.animationStarted = false;
	}

	Gallery.prototype.switchTab = function (tabNum) {

		$.proxy(switchTab, this, tabNum)();

	};

	$.fn.gallery = function (options) {

		return this.each(function () {

			var $this = $(this),
					data = $this.data('gallery');

			if (!data) {
				data = new Gallery(this, typeof options === 'object' && options);
				$this.data('gallery', data);
			}

		});

	};

	$.fn.gallery.Constructor = Gallery;

}(window, document, jQuery));

(function videoCover(global, document, $) {

	function VideoCover(element, options) {

		this.options = $.extend(true, {}, this.defaults, options);
		this.element = element;
		this.$element = $(element);
		$.proxy(init, this)();

	}

	VideoCover.prototype.defaults = {

		ratio: 16 / 9

	};

	function init() {

		var self = this;
		self.$parent = self.$element.parent();

		$(window).on('resize', function () {

			setTimeout(function () {

				$.proxy(onResize, self)();

			}, 300);


		}).resize();

	}

	function getWidth() {

		var videoContainerHeight = this.$parent.height(),
				videoContainerWidth = this.$parent.width(),
				videoWidth = videoContainerHeight * this.options.ratio,
				videoHeight = videoWidth * (1 / this.options.ratio),
				k1 = videoContainerWidth / videoWidth,
				k2 = videoContainerHeight / videoHeight,
				k = Math.max(k1, k2);

		return Math.ceil(videoWidth * k);

	}

	function onResize() {

		var self = this;

		self.$element.css({
			width: $.proxy(getWidth, self)()
		});

	}

	$.fn.videoCover = function (options) {

		return this.each(function () {

			var $this = $(this),
					data = $this.data('videoCover');

			if (!data) {
				data = new VideoCover(this, typeof options === 'object' && options);
				$this.data('videoCover', data);
			}

		});

	};

	$.fn.videoCover.Constructor = VideoCover;

}(window, document, jQuery));

(function discloser(global, document, $) {

	function Discloser(element, options) {

		this.options = $.extend(true, {}, this.defaults, options);
		this.element = element;
		this.$element = $(element);
		$.proxy(init, this)();

	}

	Discloser.prototype.defaults = {

		structure: {
			header: '.discloser__header',
			content: '.discloser__content'
		},
		activeClass: window.classes.active,
		slide: true

	};

	function init() {

		var self = this;

		$.proxy(setStructure, self)();

		self.$header.on('click', function () {

			self.$element.toggleClass(self.options.activeClass);

			if(self.options.slide)
				self.$content.slideToggle();

		});
	}

	function setStructure() {

		var self = this,
				structure = self.options.structure;

		$.each(structure, function (name, value) {

			self['$' + name] = self.$element.find(value);

		});

	}

	$.fn.discloser = function (options) {

		return this.each(function () {

			var $this = $(this),
					data = $this.data('discloser');

			if (!data) {
				data = new Discloser(this, typeof options === 'object' && options);
				$this.data('discloser', data);
			}

		});

	};

	$.fn.discloser.Constructor = Discloser;

}(window, document, jQuery));

(function selectBox(global, document, $, undefined) {

	function SelectBox(element, options) {

		this.options = $.extend(true, {}, this.defaults, options);
		this.element = element;
		this.$element = $(element);
		$.proxy(init, this)();

	}

	SelectBox.prototype.defaults = {

		structure: {
			caption: '.caption',
			option: '.option'
		},
		activeClass: window.classes.active,
		slide: true,
		discloser: undefined

	};

	function init() {

		var self = this;
		$.proxy(setStructure, self)();

		self.$option.first().prop('checked', true);

		self.$option.on('click', function () {

			var $option = $(this),
					value = $option.val() || $option.data('value'),
					discloser = self.options.discloser;

			self.$caption.html(value);
			self.$element.removeClass(self.options.activeClass);
			if(discloser && discloser.options.slide)
				discloser.$content.slideToggle();

			$option.trigger('change');

		});

	}

	function setStructure() {

		var self = this,
				structure = self.options.structure;

		$.each(structure, function (name, value) {

			self['$' + name] = self.$element.find(value);

		});

	}

	$.fn.selectBox = function (options) {

		return this.each(function () {

			var $this = $(this),
					data = $this.data('selectBox');

			if (!data) {
				data = new SelectBox(this, typeof options === 'object' && options);
				$this.data('selectBox', data);
			}

		});

	};

	$.fn.selectBox.Constructor = SelectBox;

}(window, document, jQuery));

(function parallax(global, document, $) {

	function Parallax(element, options) {

		this.options = $.extend(true, {}, this.defaults, options);
		this.element = element;
		this.$element = $(element);
		$.proxy(init, this)();

	}

	Parallax.prototype.defaults = {

		speed: 20

	};

	function init() {

		var self = this;

		$(window).on('scroll', function () {

			var scrollTop = $(this).scrollTop(),
					translate = scrollTop / self.options.speed;

			setParallax(self.$element, translate);

		});

	}

	function setParallax($element, translate) {

		$element.css({
			'transform': 'translateY(' + translate + '%)'
		});

	}

	$.fn.parallax = function (options) {

		return this.each(function () {

			var $this = $(this),
					data = $this.data('parallax');

			if (!data) {
				data = new Parallax(this, typeof options === 'object' && options);
				$this.data('parallax', data);
			}

		});

	};

	$.fn.parallax.Constructor = Parallax;

}(window, document, jQuery));

numeral.locale('ru');