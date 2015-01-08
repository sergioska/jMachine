var machine = angular.module('appMachine', []);

machine.controller('MachineController', ['$scope', 'Sound', 'Sequencer', 'socket', function($scope, Sound, sequencer, socket){

	var drums = {};
	var pattern = [];
	$scope.patternSelected = 0;
	$scope.patternDisabled = [1, 1, 1, 1, 1, 1, 1, 1];
	$scope.sync = false;
	$scope.mapSelected = 0;
	$scope.matrix = [[]];
	/*
	$scope.matrix = [
						[1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
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
					 	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
					];*/

	$scope.init = function() {

		var composition = Object.create(Composition);

		composition.setTime(120);

		var jsonSounds = Object.create(Drums);
		drums = composition.createInstrument('drums', jsonSounds);
		$scope.select(0);

		pattern0 = new Pattern();
		$scope.matrix = pattern0.matrix;
		pattern.push(pattern0);
		$scope.patternSelected = 0;
		$scope.patternDisabled = [1, 1, 1, 1, 1, 1, 1, 1];

	}
	/*
	socket.on('go', function(output){
		console.log("OKOKOKOK");
		$scope.run();
	});
	*/

	$scope.run = function() {
		sequencer.steps = $scope.updateMatrix();
		sequencer.start();
		$scope.stepValue = sequencer.current;
		sequencer.loop(function(output){
			//socket.emit('clock', {clock: output});
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
		//socket.emit('matrix', {matrix: JSON.stringify($scope.matrix)});
		$scope.select($scope.mapSelected);
	}

	$scope.setPattern = function(nPattern) {
		$scope.patternSelected = nPattern;
		for(var i=0;i<pattern.length;i++) {
			if(pattern[i].number===nPattern) {
				$scope.matrix = pattern[i].matrix;
				$scope.select(0);
				return;
			}
			else continue;
		}
		var newpattern = new Pattern();
		newpattern.number = nPattern;
		$scope.matrix = newpattern.matrix;
		$scope.select(0);
		pattern.push(newpattern);
		console.log(pattern);
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
	

