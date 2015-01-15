// sequencer service definition
machine.factory('Sequencer', ['$interval', function($interval) {
	var Sequencer = {
		steps: [],
		current: 0,
		isRun: false,
		interval: null,
		time: 0,
		setTime: function(bpm) {
			Sequencer.time = Math.round((60000/bpm)/4);
		},
		start: function() {
			Sequencer.isRun = true;
		},
		stop: function() {
			Sequencer.current = 0;
			Sequencer.isRun = false;
			$interval.cancel(Sequencer.interval);

		},
		pause: function() {
			Sequencer.isRun = false;
			$interval.cancel(Sequencer.interval);
		},
		resetInterval: function() {
			$interval.cancel(Sequencer.interval);
		},
		next: function(callback) {
			if(Sequencer.current==Sequencer.steps.length)
				Sequencer.current = 0;
			if(Sequencer.steps[Sequencer.current].length>0) {
				var set = Sequencer.steps[Sequencer.current];
				for(var i=0;i<set.length;i++){
					set[i].play();
				}
			} else {
				if(typeof(Sequencer.steps[Sequencer.current])==='string')
					Sequencer.steps[Sequencer.current].play();
			}
			callback(Sequencer.current);
			Sequencer.current++;
		},
		loop: function(callback) {
			Sequencer.interval = $interval(function(){
				Sequencer.next(callback);
			}, Sequencer.time);
		}
	};
	return Sequencer;
}]);