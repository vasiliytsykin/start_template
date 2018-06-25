import defaults from './defaults';

class ZFluidInput {

	constructor(element, options) {
		this.options = $.extend(true, {}, defaults, options);
		this.element = element;
		this.$element = $(element);
		this.init();
	}

	init() {
		this.$parent = this.$element.parent();
		this.placeholder = this.$element.attr('placeholder');
		this.inputValue = this.$element.val();
		this.initialFontSize = this.getFontSize();
		this.$element.attr('type', 'hidden');
		this.addFakeInput();
		this.resizeInput();

		this.$fakeInput
				.on('focus focusin', () => {
					const value = this.$fakeInput.html();
					if(value === this.placeholder) {
						setTimeout(() => {
							this.$fakeInput.html('');
						}, 20);
					}
				})
				.on('blur keyup paste', () => {
					this.inputValue = this.$fakeInput.html();
					this.$element.val(this.inputValue);
					this.resizeInput();
				})
				.on('blur', () => {
					if(!this.inputValue) {
						this.$fakeInput.html(this.placeholder);
					}
				})
				.on('keypress', (event) => {
					if ((event.keyCode === 13 || event.which === 13)) {
						event.preventDefault();
						if(this.inputValue){
							this.$element.trigger('submit');
							this.$fakeInput.trigger('blur');
						}
						return false;
					}
				});

		this.$element.on('change', () => {
			this.inputValue = this.$element.val();
			this.$fakeInput.html(this.inputValue);
			this.resizeInput();
		});

		$(window).on('resize', () => {
			this.resizeInput();
		});

	}

	addFakeInput() {
		let inputClass = this.$element.attr('class');
		this.$fakeInput = $(`<div class="${inputClass} input--fake" contenteditable>${this.inputValue || this.placeholder}</div>`);
		this.$element.parent().append(this.$fakeInput);
	}

	getFontSize() {
		return parseFloat(this.$element.css('font-size').replace('px', ''));
	}

	setFontSize(fontSize) {
		this.fontSize = fontSize;
		this.$fakeInput.css({
			'font-size': fontSize
		})
	}

	resetFontSize() {
		this.$fakeInput.removeAttr('style');
		this.fontSize = undefined;
	}

	isInputGreaterThanParent() {
		return this.$fakeInput.outerWidth() > this.$parent.width();
	}

	resizeInput() {
		const fontSize = Math.floor(1.6 * (this.$parent.width() / this.$fakeInput.html().length)),
				maxFontSize = this.options.maxFontSize ? Math.min(this.options.maxFontSize, this.initialFontSize) : this.initialFontSize;
		this.setFontSize(fontSize < maxFontSize ? fontSize: maxFontSize);
	}

}


$.fn.zFluidInput = function (options, ...params) {
	this.each(function () {
		let $this = $(this),
				data = $this.data('zFluidInput');
		if ((!options || typeof options === 'object') && !data) {
			data = new ZFluidInput(this, options);
			$this.data('zFluidInput', data);
		} else if (typeof options === 'string' && data && typeof data[options] === 'function') {
			data[options].apply(data, params);
		} else {
			throw 'zFluidInput: invalid call';
		}
	});
};

$.fn.zFluidInput.Constructor = ZFluidInput;