const errorClass = 'error',
		errorEvent = 'error',
		successEvent = 'success';


export default {
	structure: {
		inputs: '.input:not(.input--fake)',
		submit: '.submit'
	},
	errorClass: errorClass,
	errorEvent: errorEvent,
	successEvent: successEvent,
	fieldTypeDataAttr: 'field-type',
	constraints: {
		required: {
			presence: true,
		},
		char: {
			format: {
				pattern: "[a-zа-я]*",
				flags: "i",
				message: "only chars allowed"
			}
		},
		number: {
			format: {
				pattern: "[0-9\\., ]*",
				flags: "i",
				message: "only digits allowed"
			}
		},
		cardholder: {
			format: {
				pattern: "[a-z]{2,} [a-z]{2,}",
				flags: "i",
				message: "not a name"
			}
		},
		card: {
			format: {
				pattern: "(?:4[0-9]{12}(?:[0-9]{3})?|(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12})",
				message: "not a card"
			}
		},
		cardMonth: {
			format: {
				pattern: "[0-9]{2}",
				message: 'must be 2 digits'
			},
			numericality: {
				onlyInteger: true,
				greaterThan: 0,
				lessThanOrEqualTo: 12
			}
		},
		cardYear: {
			format: {
				pattern: "[0-9]{2}",
				message: 'must be 2 digits'
			},
			numericality: {
				onlyInteger: true,
				greaterThanOrEqualTo: parseInt(new Date().getFullYear()) - 2000
			}
		},
		cardCvv: {
			format: {
				pattern: "[0-9]{3}",
				message: 'must be 4 digits'
			},
			numericality: {
				onlyInteger: true,
				greaterThanOrEqualTo: 100,
				lessThanOrEqualTo: 999
			}
		},
		name: {
			format: {
				pattern: "[a-zа-я]{2,}( [a-zа-я]{2,})?( [a-zа-я]{2,})?",
				flags: "i",
				message: "not a name"
			}
		},
		phone: {
			format: {
				pattern: "(\\+)?\\d{1}(\\()?\\d{3}(\\))?(-)?\\d{3}(-)?\\d{2}(-)?\\d{2}",
				message: "not a phone number"
			}
		},
		email: {
			email: true
		}
	},
	onError: function ($input, error) {
		$input.addClass(errorClass);
		console.log(error)
	},
	onSuccess: function ($input) {
		$input.removeClass(errorClass);
	}

}