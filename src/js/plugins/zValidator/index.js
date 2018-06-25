
import validate from 'validate.js';
import defaults from './defaults';

class ZValidator {

	constructor(element, options) {
		this.options = $.extend(true, {}, defaults, options);
		this.element = element;
		this.$element = $(element);
		this.init();
	}

	init() {
		let self = this;
		this.setStructure();
		this.filterInputs();
		this.$inputs
				.on('blur', function () {
					self.validateInput($(this));
				})
				.on('focus', function () {
					self.options.onSuccess($(this));
				})
				.on('error', function (event, error) {
					self.options.onError($(this), error);
				})
				.on('success', function () {
					self.options.onSuccess($(this));
				});
	}

	setStructure() {
		$.each(this.options.structure, (name, value) => {
			this['$' + name] = this.$element.find(value);
		});
	}

	filterInputs() {
		this.$inputs = this.$inputs.filter((index, input) => {
			let $input = $(input);
			return $input.attr('name') && $input.data(this.options.fieldTypeDataAttr);
		})
	}

	getInputObj($input) {
		let fieldTypes = $input.data(this.options.fieldTypeDataAttr).split(' '),
				value = $input.val()
						? ($input.get(0).inputmask ? $input.inputmask('unmaskedvalue')
								: $input.val()) : undefined;

		return fieldTypes.reduce((prev, next) => {
			prev[next] = value;
			return prev;
		}, {});
	}

	getInputConstraints($input) {
		let fieldTypes = $input.data(this.options.fieldTypeDataAttr).split(' ');
		return fieldTypes.reduce((prev, next) => {
			prev[next] = this.options.constraints[next];
			return prev;
		}, {});
	}

	validateInput($input) {
		let error = validate(this.getInputObj($input), this.getInputConstraints($input));

		if(error) {
			$input.trigger('error', [error]);
			return false;
		} else {
			$input.trigger('success');
			return true
		}
	}

	isValidForm() {
		let isValid = true;
		this.$inputs.each((index, input) => {
			if(!this.validateInput($(input))) {
				isValid = false;
			}
		});
		return isValid;
	}

}


$.fn.zValidator = function (options, ...params) {
	this.each(function () {
		let $this = $(this),
				data = $this.data('zValidator');
		if ((!options || typeof options === 'object') && !data) {
			data = new ZValidator(this, options);
			$this.data('zValidator', data);
		} else if(typeof options === 'string' && data && typeof data[options] === 'function') {
			data[options].apply(data, params);
		} else {
			throw 'zValidator: invalid call';
		}
	});
};

$.fn.zValidator.Constructor = ZValidator;