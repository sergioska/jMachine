Instrument = {
	volume: 1,
	sounds: null,
	setVolume: function(volumeValue) {
		this.volume = volumeValue;
	},
	play: function(key) {
		if(parseInt(key, 10) >= 0) {
			return this.sounds[this.labels[key]];
		}
		return this.sounds[key];
	}
}