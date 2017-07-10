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
	}

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

}(window, document, jQuery));

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

	};

	function init() {

		$.proxy(setStructure, this)();
		$.proxy(setSwitchTabClickHandler, this)();
	}

	function setStructure() {

		var self = this,
				$gallery = self.$element;

		self.$switch = $gallery.children('.gallery__switch');
		self.$switchTabsContainer = self.$switch.find('.switch__tabs');
		self.$switchTabs = self.$switch.find('.switch__tab');
		self.$tabsContainer = $gallery.children('.gallery__tabs');
		self.$tabs = self.$tabsContainer.children('.gallery__tab');

	}

	function setSwitchTabClickHandler() {

		var self = this,
				$gallery = self.$element;

		$gallery.on('click', '.switch__tab:not(.disabled)', function () {

			$.proxy(onSwitchTabClick, self, this)();

		});
	}

	function onSwitchTabClick(tab) {

		var self = this,
				$gallery = self.$element,
				$tab = $(tab),
				activeTab = $tab.data('tab'),
				$activeTab = $gallery.find('.gallery__tab.' + $tab.data('tab')),
				active = global.classes.active;

		if(self.$switchTabsContainer.hasClass('is-dragging')) {
			return false;
		}

		self.$switchTabs.removeClass(active);
		self.$tabs.removeClass(active);
		$tab.addClass(active);
		$activeTab.addClass(active);

		$gallery.trigger('tabChanged', [activeTab, $activeTab]);

	}

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