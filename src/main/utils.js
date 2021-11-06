let timeout;

exports.debounce = function(func, wait) {
	let context = this;
	let later = function() {
		timeout = null;
		func.apply(context, arguments);
	};
	clearTimeout(timeout);
	timeout = setTimeout(later, wait);
};