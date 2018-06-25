numeral.locale('ru');
numeral.defaultFormat('0,0[.]00');

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
    disabled: 'disabled',
    fixed: 'fixed',
    hold: 'hold',
    init: 'init',
    open: 'open',
    success: 'success',
    error: 'error',
    result: 'result',
    freeze: 'freeze',
    hidden: 'hidden',
    shaded: 'shaded'
  };

  global.events = {
    ytReady: 'youTubeApiReady'
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

  global.exitFullScreen = function () {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  };

  global.isFullScreen = function () {
    return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
  };

  global.onGoogleMapsApiReady = function() {

    $(global).trigger('googleMapsApiReady');

  };

  global.loadGoogleMapsApi = function () {

    var $script = $('<script async defer></script>');

    $script.attr('src', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDZ1TXC6qzkLOU_hPKB4Rkx7yx3EpS3P1k&callback=onGoogleMapsApiReady');

    $('head').append($script);

  };

  global.onYouTubeIframeAPIReady = function () {

    $(global).trigger(global.events.ytReady);

  };

  global.loadYTApi = function () {

    var $script = $('<script async defer></script>');

    $script.attr('src', 'https://www.youtube.com/iframe_api');

    $('head').append($script);

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

    ratio: 16 / 9,
    onDone: function () {
      console.log('video cover resize done')
    }

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
      ratio = this.options.ratio;

    return Math.ceil(videoContainerWidth > videoContainerHeight ? videoContainerWidth : videoContainerHeight * ratio);

  }

  function onResize() {

    var self = this,
      width = $.proxy(getWidth, self)(),
      height = width / self.options.ratio;

    self.$element.css({
      width: width,
      height: height
    });

    console.log('in video cover');
    self.options.onDone();

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

    speed: 0.05,
    units: '%'

  };

  function init() {

    var self = this;

    $(window).on('scroll', function () {

      var scrollTop = $(this).scrollTop(),
        translate = scrollTop * self.options.speed;

      setParallax(self.$element, translate, self.options.units);

    });

  }

  function setParallax($element, translate, units) {

    $element.css({
      'transform': 'translateY(' + translate + units + ')'
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

(function customMarker(window, document, $, undefined) {

  function CustomMarker(options) {

    var self = this;
    self.options = $.extend(true, {}, self.defaults, options);
  }

  $(window).on('googleMapsApiReady', function () {

    CustomMarker.prototype = new google.maps.OverlayView();

    CustomMarker.prototype.gmaps = google.maps;

    CustomMarker.prototype.defaults = {
      markerClass: 'map-marker',
      markerContentClass: 'map-marker__content',
      markerImgClass: 'map-marker__img',
      markerTxtClass: 'map-marker__txt',
      markerNameClass: 'map-marker__name',
      markerAddressClass: 'map-marker__address',
      width: 32,
      height: 56,
      isMain: false
    };

    CustomMarker.prototype.onAdd = function () {

      var self = this,
        panes = self.getPanes();

      self.$element = $('<div class="'+ self.options.markerClass +'">' +
        '<div class="'+ self.options.markerContentClass +'">' +
        '<div class="'+ self.options.markerImgClass +'" style="background-image: url('+ self.options.img +')"></div>' +
        '<div class="'+ self.options.markerTxtClass +'">' +
        '<div class="'+ self.options.markerNameClass +'">'+ self.options.name +'</div>' +
        '<div class="'+ self.options.markerAddressClass +'">'+ self.options.address +'</div>' +
        '</div>' +
        '</div>' +
        '</div>');

      self.element = self.$element.get(0);

      if(self.options.isMain) {
        self.$element.addClass('main');
      }

      panes.overlayImage.appendChild(self.element);

    };

    CustomMarker.prototype.draw = function () {

      var self = this,
        point = self
          .getProjection()
          .fromLatLngToDivPixel(new self.gmaps.LatLng(self.options.position.lat, self.options.position.lng));

      if (point) {
        self.$element.css({
          left: point.x,
          top: point.y
        });
      }
    };

    CustomMarker.prototype.remove = function() {

      var self = this;

      if (self.$element) {
        self.$element.remove();
        self.$element = null;
        self.element = null;
      }
    };

    CustomMarker.prototype.getPosition = function() {

      return this.options.position;

    };

  });

  window.CustomMarker = CustomMarker;

}(window, window.document, jQuery));

(function environmentGoogle(window, document, $, undefined) {

  function EnvironmentGoogle(options) {

    this.options = $.extend(true, {}, this.defaults, options);

  }

  EnvironmentGoogle.prototype.defaults = {
    mapContainer: 'env-map',
    groups: ['main', 'kindergarten', 'school', 'university', 'hospital', 'pharmacy', 'pool', 'sportschool', 'fitness', 'mall', 'shops', 'parks', 'church'],
    imgFolder: '/img/env/map/',
    groupPinImg:{
      mall: 'pin-shops.svg',
      transport: 'pin-transport.svg',
      bar: 'pin-bar.svg',
      education: 'pin-education.svg',
      church: 'pin-church.svg',
      business: 'pin-business.svg',
      bank: 'pin-bank.svg',
      entertainment: 'pin-entertainment.svg',
      medicine: 'pin-medicine.svg',
      generic: 'transport_objects.svg',
      sport: 'pin-sport.svg',
      main: 'pin_main.svg'
    },
    mapOptions: {
      center: { lat: 55.754916, lng: 37.530560 },
      zoom: 15,
      scrollwheel: false,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      styles: [
        {
          "featureType": "all",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "saturation": 36
            },
            {
              "color": "#000000"
            },
            {
              "lightness": 40
            }
          ]
        },
        {
          "featureType": "all",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "visibility": "on"
            },
            {
              "color": "#000000"
            },
            {
              "lightness": 16
            }
          ]
        },
        {
          "featureType": "all",
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#000000"
            },
            {
              "lightness": 20
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#000000"
            },
            {
              "lightness": 17
            },
            {
              "weight": 1.2
            }
          ]
        },
        {
          "featureType": "landscape",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#000000"
            },
            {
              "lightness": 20
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#000000"
            },
            {
              "lightness": 21
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#000000"
            },
            {
              "lightness": 17
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#000000"
            },
            {
              "lightness": 29
            },
            {
              "weight": 0.2
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#000000"
            },
            {
              "lightness": 18
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#000000"
            },
            {
              "lightness": 16
            }
          ]
        },
        {
          "featureType": "transit",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#000000"
            },
            {
              "lightness": 19
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#000000"
            },
            {
              "lightness": 17
            }
          ]
        }
      ]
    },
    placemarkOpts: {

    },
    mainMarker: {
      'id': 'main',
      'name':'Офис продаж',
      'group':'main',
      'address': 'ШМИТОВСКИЙ ПР–Д / 39',
      'coords':{
        lat: 55.753256,
        lng: 37.526547
      }
    },
    showAll: false,
    reBound: false

  };

  EnvironmentGoogle.prototype.setPlacemarks = function (markersData) {

    var self = this;

    self.markers = {};

    // if(!markersData['4697']){
    // 	markersData['main'] = self.options.mainMarker;
    // }

    $.each(markersData, function (name, markerData) {

      var placemark = new CustomMarker({
        map: self.map,
        position: markerData.coords,
        img: self.options.imgFolder + self.options.groupPinImg[markerData.group],
        name: markerData.name,
        address: markerData.address,
        isMain: markerData.group === 'main'
      });

      self.markers[markerData.id] = {
        group: markerData.group,
        placemark: placemark
      };

      placemark.setMap(self.map);

    });

    return self;

  };

  EnvironmentGoogle.prototype.showGroups = function (groups) {

    $.proxy(showItems, this, function (id, marker) {

      return marker.group in groups || marker.group === 'main';

    })();

  };

  EnvironmentGoogle.prototype.showItem = function (itemId) {

    $.proxy(showItems, this, function (id, marker) {

      return parseInt(id) === itemId || id === 'main';

    })();

  };

  EnvironmentGoogle.prototype.setMap = function() {

    var self = this;

    self.gmaps = window.google.maps;

    self.map = new self.gmaps.Map(
      document.getElementById(self.options.mapContainer),
      self.options.mapOptions);

    $.proxy(initMap, self)();

  };

  function initMap() {

    var self = this,
      $window = $(window);

    $window.on('resize', function () {
      self.gmaps.event.trigger(self.map, 'resize');
      self.map.setCenter(self.options.mapOptions.center);
    });

  }

  function showItems(condition) {

    var self = this,
      bounds = [];

    $.each(self.markers, function (id, marker) {

      if(condition(id, marker)){

        marker.placemark.$element.addClass(window.classes.active);

        bounds.push(marker);

      }
      else {
        marker.placemark.$element.removeClass(window.classes.active);
      }

    });

    if(self.options.reBound)
      $.proxy(reBound, self, bounds)();

  }

  function createPlacemark(markerData) {

    var self = this,
      gmaps = self.gmaps,
      placemarkOpts = $.extend(true, {}, self.options.placemarkOpts, {

        position: markerData.coords,
        title: markerData.name,
        icon: {
          url: self.options.imgFolder + self.options.groupPinImg[markerData.group]
        }

      });

    if(markerData.group === 'main') {
      $.extend(placemarkOpts.icon, {
        size: new gmaps.Size(77, 92),
        origin: new gmaps.Point(0, 0),
        anchor: new gmaps.Point(0, 92)
      })
    }

    return new gmaps.Marker(placemarkOpts);
  }

  function reBound(bounds) {

    var self = this,
      gmaps = self.gmaps,
      gBounds = new gmaps.LatLngBounds();

    $.each(bounds, function (id, marker) {

      gBounds.extend(marker.placemark.getPosition());

    });

    self.map.setCenter(gBounds.getCenter());
    self.map.fitBounds(gBounds);

  }

  window.EnvironmentGoogle = EnvironmentGoogle;

}(window, window.document, jQuery));

(function photoSlider(global, document, $, undefined) {

  function PhotoSlider(element, options) {

    this.options = $.extend(true, {}, this.defaults, options);
    this.element = element;
    this.$element = $(element);
    $.proxy(init, this)();

  }

  PhotoSlider.prototype.defaults = {

    structure: {
      slider: '.photo-slider__items',
      item: '.photo-slider__item',
      prev: '.btn-prev',
      next: '.btn-next',
      total: '.page-total',
      current: '.page-cur'
    },
    flickityOpts: {
      cellAlign: 'left',
      prevNextButtons: false,
      pageDots: false

    },
    activeClass: window.classes.active,
    resumeAutoPlay: false

  };

  function init() {

    var self = this;

    $.proxy(setStructure, self)();

    self.itemCount = self.$item.length;

    self.$total.html(self.itemCount);

    self.$slider.flickity(self.options.flickityOpts);

    self.slider = self.$slider.data('flickity');

    $.proxy(setCurSlideNum, self)();

    self.$prev.on('click', function () {

      self.$slider.flickity('previous');
      $.proxy(resetAutoplayTimer, self)();
      $.proxy(setCurSlideNum, self)();

    });

    self.$next.on('click', function () {

      self.$slider.flickity('next');
      $.proxy(resetAutoplayTimer, self)();
      $.proxy(setCurSlideNum, self)();

    });

    self.$slider.on('select.flickity', $.proxy(setCurSlideNum, self));

    if(self.options.resumeAutoPlay){
      self.$slider.on( 'pointerUp.flickity', function( event, pointer ) {
        self.$slider.flickity('playPlayer');
      });
    }

  }

  function setStructure() {

    var self = this,
      structure = self.options.structure;

    $.each(structure, function (name, value) {

      self['$' + name] = self.$element.find(value);

    });

  }

  PhotoSlider.prototype.resize = function () {

    var self = this;

    self.$slider.flickity('resize');

    return self;

  };

  PhotoSlider.prototype.select = function (index) {

    var self = this;

    self.$slider.flickity('select', index, false, true);

    return self;

  };

  function setCurSlideNum() {

    var self = this,
      currentIndex = self.slider.selectedIndex + 1;

    self.$current.html(currentIndex);

    $.proxy(checkBounds, self, currentIndex)();

  }

  function checkBounds(currentIndex) {

    var self = this,
      disabled = window.classes.disabled;

    self.$prev.removeClass(disabled);
    self.$next.removeClass(disabled);

    if(currentIndex === 1) {
      self.$prev.addClass(disabled);
    }

    if(currentIndex === self.itemCount) {
      self.$next.addClass(disabled);
    }
  }

  function resetAutoplayTimer() {
    var self = this;
    self.$slider.flickity('stopPlayer');
    self.$slider.flickity('playPlayer');
  }

  $.fn.photoSlider = function (options) {

    return this.each(function () {

      var $this = $(this),
        data = $this.data('photoSlider');

      if (!data) {
        data = new PhotoSlider(this, typeof options === 'object' && options);
        $this.data('photoSlider', data);
      }

    });

  };

  $.fn.photoSlider.Constructor = PhotoSlider;

}(window, document, jQuery));

(function freezer(window, document, $) {

  function Freezer() {

    this.$body = $('html, body');
    this.$content = $('.content');
    this.$window = $(window);
    this.st = this.$window.scrollTop();
    this.freezeCount = 0;

  }


  Freezer.prototype.freeze = function () {

    var self = this,
      st = self.$window.scrollTop();

    if(self.freezeCount === 0) {
      self.$body.addClass(window.classes.freeze);
      self.$content.css({
        'margin-top': -st
      });
      self.st = st;
    }

    self.freezeCount++;

  };

  Freezer.prototype.unFreeze = function (reset) {

    var self = this,
      st = self.st;

    self.freezeCount--;

    if(self.freezeCount === 0) {
      self.$body.removeClass(window.classes.freeze);
      self.$content.removeAttr('style');
      if(!reset) {
        self.$window.scrollTop(st);
      }

      self.st = 0;
    }

  };

  window.Freezer = new Freezer();


}(window, document, jQuery));

(function youTubeVideo(global, document, $, undefined) {

  function YouTubeVideo(element, options) {

    this.options = $.extend(true, {}, this.defaults, options);
    this.element = element;
    this.$element = $(element);
    $.proxy(init, this)();

  }

  YouTubeVideo.prototype.defaults = {

    structure: {
      videoWrapper: '.video-over',
      player: '.player',
      play: '.btn-play',
      fullScreen: '.control--full-screen',
      timeline: '.b-timeline'
    },
    ytOptions: {
      width: 640,
      height: 360,
      playerVars: {
        controls: 0,
        enablejsapi: 1,
        origin: 'http://localhost:3000',
        showinfo: 0,
        modestbranding: 1,
        rel: 0
      },
      events: {

      }
    },
    autoLoad: true,
    playInFullSize: true,
    popup: '.b-popup--video',
    onStop: function () {
      $.magnificPopup.close();
    }

  };

  function init() {

    var self = this;

    self.$window = $(window);
    self.playerState = 'stop';
    self.init = false;
    $.proxy(setStructure, self)();
    self.$popup = $(self.options.popup);
    $.proxy(setPlayerId, self)();
    $.proxy(setVideoId, self)();

    self.$window.on(window.events.ytReady, $.proxy(onApiReady, self));

    self.$play.on('click', $.proxy(onPlay, self));

    self.$fullScreen.on('click', function () {
      if(!window.isFullScreen()) {
        window.enterFullScreen(self.$element.get(0));
      } else {
        window.exitFullScreen();
      }

      return false;

    });

  }

  function setStructure() {

    var self = this,
      structure = self.options.structure;

    $.each(structure, function (name, value) {

      self['$' + name] = self.$element.find(value);

    });

  }

  function setPlayerId() {

    this.playerId = this.$player.attr('id');

  }

  function setVideoId() {

    this.videoId = this.$player.data('video');

  }

  function onApiReady() {

    var self = this;

    if(this.options.autoLoad)
      $.proxy(loadPlayer, self)();

  }

  function loadPlayer() {

    var self = this,
      ytOptions = self.options.ytOptions;

    ytOptions.videoId = self.videoId;
    ytOptions.events.onReady = $.proxy(onPlayerReady, self);
    ytOptions.events.onStateChange = $.proxy(onStateChange, self);
    self.player = new YT.Player(self.playerId, ytOptions);

  }

  function onPlayerReady() {

    var self = this;

    self.playerReady = true;
    $.proxy(setStructure, self)();
    self.$window.trigger('playerReady');

  }

  function onPlay() {

    var self = this;

    if(self.options.playInFullSize)
      $.proxy(openFullScreen, self)();
    else
      $.proxy(playVideo, self)();


    return false;

  }

  function playVideo() {

    var self = this,
      player = self.player,
      playerState = self.playerState;

    if(self.$timeline.length) {
      self.$timeline.timeline({
        $video: self.$element,
        playEvent: 'videoPlaying',
        getDuration: function () {
          return player.getDuration();
        },
        getCurrentTime: function () {
          return player.getCurrentTime();
        },
        setVideoTime: function (curTime) {
          player.seekTo(curTime, true);
        },
        onStop: self.options.onStop
      });
    }

    if(!self.init) {
      self.init = true;
      self.$element.trigger('initialized');
    }

    if(playerState === 'stop' || playerState === 'pause') {
      self.playVideo();
    } else {
      self.pauseVideo();
    }

  }

  function openFullScreen() {

    var self = this,
      $videoPopup = self.$popup,
      $player = self.$player,
      play = $.proxy(playVideo, self);

    $videoPopup.append($player);

    $.magnificPopup.open({

      items: {
        src: $videoPopup,
        type: 'inline'
      },
      mainClass: 'mfp-custom mfp-full-size mfp-video',
      fixedContentPos: true,
      callbacks: {
        open: function () {

          self.$window.on('playerReady', play);

          window.enterFullScreen($videoPopup.get(0));


        },
        close: function () {

          self.$window.off('playerReady', play);
          self.$videoWrapper.append($player);
          self.$timeline.data('timeline').destroy();
        }
      }

    });
  }

  function onStateChange(event) {

    var self = this,
      statusCode = event.data;

    if(statusCode === YT.PlayerState.ENDED) {
      self.stopVideo();
    }
  }

  YouTubeVideo.prototype.loadPlayer = function () {

    $.proxy(loadPlayer, this)();

  };

  YouTubeVideo.prototype.playVideo = function () {
    this.player.playVideo();
    this.$element.trigger('videoPlaying');
    this.playerState = 'play';
  };

  YouTubeVideo.prototype.pauseVideo = function () {
    this.player.pauseVideo();
    this.playerState = 'pause';
    this.$element.trigger('videoPaused');
  };

  YouTubeVideo.prototype.stopVideo = function () {
    this.init = false;
    this.playerState = 'stop';
    this.$element.trigger('videoStopped');
  };

  $.fn.youTubeVideo = function (options) {

    return this.each(function () {

      var $this = $(this),
        data = $this.data('youTubeVideo');

      if (!data) {
        data = new YouTubeVideo(this, typeof options === 'object' && options);
        $this.data('youTubeVideo', data);
      }

    });

  };

  $.fn.youTubeVideo.Constructor = YouTubeVideo;

}(window, document, jQuery));

(function timeline(global, document, $) {

  function Timeline(element, options) {

    this.options = $.extend(true, {}, this.defaults, options);
    this.element = element;
    this.$element = $(element);
    $.proxy(init, this)();

  }

  Timeline.prototype.defaults = {

    structure: {
      progressBar: '.timeline__progress',
      pointsBlock: '.timeline__points'
    },
    playEvent: 'play',
    pointClass: 'point',
    loop: false

  };

  function init() {

    var self = this,
      $video = self.options.$video,
      playEvent = self.options.playEvent;

    self.$window = $(window);

    $.proxy(setStructure, self)();

    if(self.options.timelinePoints){
      $.proxy(initPoints, self)();
    }

    $video.on(playEvent, $.proxy(updateTimeline, self));

    self.$element.on('click', function (event) {

      var progress = $.proxy(getProgress, self, event)(),
        curTime = self.options.getDuration() * progress;

      self.options.setVideoTime(curTime);
      $.proxy(setVideoProgress, self, progress)();

    });
  }

  function initPoints() {

    var self = this,
      duration = self.options.getDuration(),
      pointClass = self.options.pointClass;

    $.each(self.options.timelinePoints, function (index, point) {

      var $point = $('<div class="' + pointClass + '">' + point.name + '</div>'),
        leftPos = 100 * (point.time / duration) + '%';

      $point.data('index', index);
      $point.css({left: leftPos});

      self.$pointsBlock.append($point)

    });

    self.$points = self.$pointsBlock.find('.' + pointClass);

    self.$points.on('click', function () {

      var $self = $(this),
        index = $self.data('index'),
        curTime = self.options.timelinePoints[index].time,
        duration = self.options.getDuration(),
        progress = curTime / duration;

      self.options.setVideoTime(curTime);
      $.proxy(setVideoProgress, self, progress)();

      return false;

    });

  }

  function getProgress(event) {

    var self = this,
      $timeline = self.$element,
      w,
      x;

    if(event){
      w = $timeline.width();
      x = event.pageX - $timeline.offset().left;
    }
    else {
      w = self.options.getDuration();
      x = self.options.getCurrentTime();
    }

    return x / w;
  }

  function setVideoProgress(progress) {

    var self = this;

    if(!self.options.loop && progress === 1){

      $.proxy(stopProgress, self)();
      if(self.options.onStop)
        self.options.onStop();

    }

    self.$progressBar.css({
      width: 100 * progress + '%'
    });

  }

  function updateTimeline() {

    var self = this,
      progress;

    $.proxy(stopProgress, self)();

    self.intervalId = setInterval(function () {

      progress = $.proxy(getProgress, self)();
      $.proxy(setVideoProgress, self, progress)();

    }, 20);

  }

  function stopProgress() {
    var self = this;
    if(self.intervalId) {
      clearInterval(self.intervalId);
      $.proxy(setVideoProgress, self, 0)();
    }
  }

  function setStructure() {

    var self = this,
      structure = self.options.structure;

    $.each(structure, function (name, value) {

      self['$' + name] = self.$element.find(value);

    });

  }

  Timeline.prototype.destroy = function () {

    var self = this,
      $video = self.options.$video,
      playEvent = self.options.playEvent;

    $.proxy(stopProgress, self)();

    self.$element.data('timeline', null);

    $video.off(playEvent, updateTimeline);
  };

  $.fn.timeline = function (options) {

    return this.each(function () {

      var $this = $(this),
        data = $this.data('timeline');

      if (!data) {
        data = new Timeline(this, typeof options === 'object' && options);
        $this.data('timeline', data);
      }

    });

  };

  $.fn.timeline.Constructor = Timeline;

}(window, document, jQuery));
