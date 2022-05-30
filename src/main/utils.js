exports.debounce = function (func, timeout) {
	let timer;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => { func.apply(this, args); }, timeout);
	};
}

exports.truncate = function (str, n) {
	return (str.length > n) ? str.substr(0, n - 1) + '...' : str;
};
