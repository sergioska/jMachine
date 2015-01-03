Sequencer = {
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
		clearInterval(Sequencer.interval);

	},
	pause: function() {
		Sequencer.isRun = false;
		clearInterval(Sequencer.interval);
	},
	next: function() {
		if(Sequencer.current==steps.length)
			Sequencer.current = 0;
		if(steps[Sequencer.current].length>0) {
			var set = steps[Sequencer.current];
			for(var i=0;i<set.length;i++){
				set[i].play();
			}
		} else {
			steps[Sequencer.current].play();
		}
		Sequencer.current++;
	},
	loop: function() {
		Sequencer.interval = setInterval(function(){
			Sequencer.next();
		},300);
	}
}