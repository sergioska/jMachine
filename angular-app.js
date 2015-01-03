(function(){

	var machine = angular.module('appMachine', []);

	machine.controller('MachineController', ['$scope', 'Sound', 'Sequencer', function($scope, Sound, sequencer){

		var drums = {};
		$scope.mapSelected = 0;
		$scope.matrix = [[1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
						 [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
						 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]

		$scope.init = function() {

			var composition = Object.create(Composition);

			composition.setTime(120);

			var jsonSounds = Object.create(Drums);
			drums = composition.createInstrument('drums', jsonSounds);
			$scope.select(0);
			//var sequencer = Object.create(Sequencer);

		}

		$scope.run = function() {
			sequencer.steps = $scope.updateMatrix();
			sequencer.start();
			$scope.stepValue = sequencer.current;
			sequencer.loop(function(output){
				$scope.stepValue = output;
			});
		}

		$scope.updateMatrix = function() {
			var steps = [];
			for(var i=0;i<$scope.matrix.length;i++){
				var step = [];
				for(var j=0;j<$scope.matrix[i].length;j++){
					if($scope.matrix[j][i]==1){
						step.push(Sound(drums.play(j)));
					}
				}
				steps.push(step);
			}	
			return steps;
		}

		$scope.stop = function() {
			sequencer.stop();
		}

		$scope.play = function(sound) {
			var snd = Sound(drums.play(sound));
			snd.play();
		}

		$scope.select = function(step) {
			$scope.mapSelected=step;
			$scope.soundSelected = $scope.matrix[step];
		}

		$scope.selectStep = function(step) {
			if($scope.matrix[$scope.mapSelected][step]===0)
				$scope.matrix[$scope.mapSelected][step] = 1;
			else $scope.matrix[$scope.mapSelected][step] = 0;
			$scope.select($scope.mapSelected);
		}

		$scope.$watch('event', function(){
			if (event.keyCode == 75) { 
	    		var snd = Sound(drums.play('kick'));
				snd.play();
	    	} 
	   		if (event.keyCode == 83) { 
	    		var snd = Sound(drums.play('snare'));
				snd.play();
	    	} 
	   		if (event.keyCode == 72) { 
	    		var snd = Sound(drums.play('hihat'));
				snd.play();
	    	} 
		});

		$scope.$watch('matrix', function(){
			sequencer.steps = $scope.updateMatrix();
		}, true);

	}]);
	
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

	// Sound service definition
	machine.factory('Sound', function(){
		return Sound = (function () {
		    var df = document.createDocumentFragment();
		    return function Sound(src) {
		        var snd = new Audio(src);
		        df.appendChild(snd); // keep in fragment until finished playing
		        snd.addEventListener('ended', function () {df.removeChild(snd);});
		        //snd.play();
		        return snd;
		    }
		}());
	});

})();