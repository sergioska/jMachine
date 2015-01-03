	// sequencer service definition
	machine.factory('Sequencer', ['$interval', function($interval) {
		var Sequencer = {
			steps: [],
			current: 0,
			isRun: false,
			interval: null,
			start: function() {
				Sequencer.isRun = true;
				Sequencer.current = 0;
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
			next: function(callback) {
				//console.log("OK");
				if(Sequencer.current==Sequencer.steps.length)
					Sequencer.current = 0;
				if(Sequencer.steps[Sequencer.current].length>0) {
					var set = Sequencer.steps[Sequencer.current];
					for(var i=0;i<set.length;i++){
						set[i].play();
					}
				} else {
					Sequencer.steps[Sequencer.current].play();
				}
				callback(Sequencer.current);
				Sequencer.current++;
			},
			loop: function(callback) {
				Sequencer.interval = $interval(function(){
					Sequencer.next(callback);
				}, 250);
			}
		};
		return Sequencer;
	}]);