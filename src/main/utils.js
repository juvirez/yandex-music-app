exports.debounce = function(func, wait, timeout) {
	let context = this;
	let later = function() {
		func.apply(context, arguments);
	};
	clearTimeout(timeout);
	return setTimeout(later, wait);
};

exports.truncate = function(str, n) {
  return (str.length > n) ? str.substr(0, n-1) + '...' : str;
};