Composition = {
	time: 120,
	setTime: function(timeValue) {
		time = timeValue
	},
	createInstrument: function(label, jsonSounds) {
		instrument = Object.create(Instrument);
		instrument.sounds = jsonSounds.sounds;
		instrument.labels = jsonSounds.labels;
		return instrument;
	}
}