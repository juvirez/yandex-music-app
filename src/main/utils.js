exports.debounce = function(func, wait) {
	let timeout;
	return function() {
		let context = this;
		let later = function() {
			timeout = null;
			func.apply(context, arguments);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
};