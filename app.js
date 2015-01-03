$(document).ready(function(){

	var Sound = (function () {
	    var df = document.createDocumentFragment();
	    return function Sound(src) {
	        var snd = new Audio(src);
	        df.appendChild(snd); // keep in fragment until finished playing
	        snd.addEventListener('ended', function () {df.removeChild(snd);});
	        //snd.play();
	        return snd;
	    }
	}());

	var composition = Object.create(Composition);

	composition.setTime(120);

	var jsonSounds = Object.create(Drums);
	var drums = composition.createInstrument('drums', jsonSounds);

	var sequencer = Object.create(Sequencer);
	run = function() {
		steps = [
					[Sound(drums.play('kick')), Sound(drums.play('hihat'))], 
					Sound(drums.play('hihat')),
					[Sound(drums.play('kick')), Sound(drums.play('hihat'))],
					Sound(drums.play('hihat')),
				 	[Sound(drums.play('snare')), Sound(drums.play('hihat'))],
				 	Sound(drums.play('hihat')),
				 	Sound(drums.play('hihat')),
				 	Sound(drums.play('hihat')),
				 	[Sound(drums.play('kick')), Sound(drums.play('hihat'))],
				 	Sound(drums.play('hihat')),
				 	[Sound(drums.play('kick')), Sound(drums.play('hihat'))],
				 	Sound(drums.play('hihat')),
				 	[Sound(drums.play('snare')), Sound(drums.play('hihat'))],
				 	Sound(drums.play('hihat')),
				 	Sound(drums.play('hihat')),
				 	Sound(drums.play('hihat'))
				];
		sequencer.steps = steps;
		sequencer.start();
		sequencer.loop();
	}

	stop = function() {
		sequencer.stop();
	}

	play = function(sound) {
		var snd = Sound(drums.play(sound));
		snd.play();
	}

	$(document).keyup(function(e) {
	    if (e.keyCode == 75) { 
	    	var snd = Sound(drums.play('kick'));
			snd.play();
	    } 
	   	if (e.keyCode == 83) { 
	    	var snd = Sound(drums.play('snare'));
			snd.play();
	    } 
	   	if (e.keyCode == 72) { 
	    	var snd = Sound(drums.play('hihat'));
			snd.play();
	    } 
	});

});