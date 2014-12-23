Instrument = {
	volume: 1,
	sounds: null,
	setVolume: function(volumeValue) {
		this.volume = volumeValue;
	},
	play: function(key) {
		return this.sounds[key];
	}
}