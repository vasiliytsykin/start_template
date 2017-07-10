(function formalizer(global, document, $, undefined) {

	function Formalizer(element, options) {

		this.options = $.extend(true, {}, this.defaults, options);
		this.element = element;
		this.$element = $(element);
		$.proxy(init, this)();

	}

	Formalizer.prototype.defaults = {

		structure: {
			children: {
				input: 'input',
				select: 'input.select',
				file: 'input.file',
				textarea: 'input.textarea',
				options: 'input-group .options',
				submit: 'submit'
			}
		},
		fn: {

			name: function ($input) {

				$input.on('keypress', function (event) {

					var keyChar = global.getChar(event);
					if(keyChar === null || !keyChar.match(/[a-zа-я ]/i))
						return false;

				});
			},
			phone: function ($input, options) {
				$input.inputmask(options);
			},
			range: function ($input, options) {
				engageRangeSlider($input, options);
			},
			date: function ($input, options) {
				$input.calendar(options);

			}

		},
		pluginOpts: {
			range: {

			},
			phone: {
				mask: '+7(999)-999-99-99'
			},
			date: {
				format: 'd.m.Y'
			}
		},
		validator: {
			options: {
				modules : 'security',
				showHelpOnFocus : false,
				addSuggestions : false,
				borderColorOnError: ''
			},
			rules: {
				common: {
					'validation-error-msg': ' '
				},
				name: {
					'validation': 'required length',
					'validation-length': 'min2'
				},
				password: {
					'validation': 'required strength',
					'data-validation-strength': 2
				},
				email: {
					'validation': 'required email'
				},
				phone: {
					'validation': 'required custom',
					'validation-regexp': '^\\+\\d{1}\\(\\d{3}\\)-\\d{3}-\\d{2}-\\d{2}$'
				},
				date: {
					'validation': 'required'
				},
				required: {
					'validation': 'required'
				}
			}

		},
		url: '/ajax/request_form.php',
		sendCallback: undefined,
		removeLabels: false,
		async: true

	};

	function init() {

		var self = this,
				active = global.classes.active;

		self.$element.attr('id', self.$element.attr('name'));

		$.each(self.options.structure.children, function (name, value) {

			self['$' + name] = self.$element.find('.' + value);

		});

		self.$input.not(':disabled').each(function (index, input) {

			var $input = $(input),
					type = $input.data('type');

			if(type && self.options.validator.rules[type])
			{
				var validatorData = $.extend({}, self.options.validator.rules[type], self.options.validator.rules.common);
				$.each(validatorData, function (name, value) { $input.attr('data-' + name, value); });
			}
			if(type && self.options.fn[type])
			{
				self.options.fn[type]($input, self.options.pluginOpts[type] || undefined);
			}

		});

		if(self.options.removeLabels)
			$.proxy(removeLabels, self)();

		self.$select.on('change', function () {
			var $self = $(this),
					value = $self.val(),
					$group = $self.closest('.input-group'),
					$label = $group.find('.label'),
					hidden = global.classes.hidden;

			$self.validate();

			if(value && self.options.removeLabels)
				$label.addClass(hidden);

		});

		self.$select.on('click', function () {
			var $self = $(this),
					$group = $self.closest('.input-group');

			$group.toggleClass(active);
		});

		self.$options.on('click', '.item', function () {

			var $self = $(this),
					$group = $self.closest('.input-group'),
					$input = $group.find('.input'),
					value = $self.data('item');

			$input.val(value);
			$input.change();
			$group.removeClass(active);

		});

		global.autosize(self.$textarea);

		$.validate($.extend(
				{},
				{form: '#' + self.$element.attr('id')},
				self.options.validator.options
				));

		self.$submit.on('click', function () {

			if(self.$element.isValid({}, {}, false))
				$.proxy(sendForm, self)();
			else console.log('error');

			return false;

		});

	}

	function removeLabels() {

		var self = this,
				hidden = global.classes.hidden;

		self.$input.on('focus', function () {
			var $self = $(this),
					$group = $self.closest('.input-group'),
					$placeholder = $group.find('.placeholder');
			$placeholder.addClass(hidden);
		}).on('blur', function () {
			var $self = $(this),
					value = $self.val(),
					$group = $self.closest('.input-group'),
					$placeholder = $group.find('.placeholder');

			if(!value)
				$placeholder.removeClass(hidden);

		});

	}

	function engageRangeSlider(element, options) {

		var min = element.data('min'),
				max = element.data('max'),
				from = min,
				to = max,
				step = element.data('step'),
				arValue = element.val() ? element.val().split('-') : [],
				defaults = {
					type: 'double',
					min: min,
					max: max,
					from: from,
					to: to,
					step: step,
					hide_min_max: true,
					input_values_separator: '-',
					onFinish: function () {
						resetSliderInput();
					},
					onChange: function () {
						resetSliderInput();
					},
					onStart: function () {
						setTimeout(function () {
							resetSliderInput();
						}, 1000);
					},
					onUpdate: function () {
						resetSliderInput();
					}
				};

		if(arValue.length > 1){
			defaults.from = arValue[0];
			defaults.to = arValue[1];
		}

		function resetSliderInput() {
			if(element.val() === (min + '-' + max))
				element.val('');
		}


		element.ionRangeSlider($.extend({}, defaults, options));
	}

	function sendForm() {

		var self = this;

		if(self.options.async)
			$.proxy(sendFormAsync, self)();
		else self.element.submit();


	}

	function sendFormAsync() {

		var self = this,
				url = self.options.url,
				callback = self.options.sendCallback,
				data = new FormData(self.element);

		$.ajax({
			url: url,
			data: data,
			type: "POST",
			cache: false,
			contentType: false,
			processData: false,
			success: function(response){

				if(callback)
					callback(response);

			}
		});

	}

	Formalizer.prototype.setUrl = function(url) {

		this.options.url = url;

	};

	$.fn.formalizer = function (options) {

		return this.each(function () {

			var $this = $(this),
					data = $this.data('formalizer');

			if (!data) {
				data = new Formalizer(this, typeof options === 'object' && options);
				$this.data('formalizer', data);
			}

		});

	};

	$.fn.formalizer.Constructor = Formalizer;

}(window, document, jQuery));