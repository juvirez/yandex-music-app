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

exports.getLabelForTrack = function (track) {
  const label = track.title + " – " + track.artists.map((a) => a.title).join(", ");
  return exports.truncate(label, global.store.get("tray-song-label-length", 45));
}
