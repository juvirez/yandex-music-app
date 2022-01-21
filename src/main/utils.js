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

exports.truncate = function(str, n) {
  return (str.length > n) ? str.substr(0, n-1) + '...' : str;
};