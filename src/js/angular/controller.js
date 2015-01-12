var machine = angular.module('appMachine', ['ngSanitize','ui.select', 'ui.slider']);

machine.controller('MachineController', ['$scope', '$log', 'Sound', 'Sequencer', function($scope, $log, Sound, sequencer){

	var drums = {};
	var pattern = [];
	$scope.patternSelected = 0;
	$scope.patternDisabled = [];
	$scope.sync = false;
	$scope.mapSelected = 0;
	$scope.matrix = [[]];
	$scope.drumItems = ['909 drums'];
	$scope.nVolume = 1.0;
	$scope.sounds = [];

	$scope.init = function() {

		var composition = Object.create(Composition);

		composition.setTime(120);

		var jsonSounds = Object.create(Drums64);
		drums = composition.createInstrument('drums', jsonSounds);

		$scope.select(0);

		pattern0 = new Pattern();
		$scope.matrix = pattern0.matrix;
		pattern.push(pattern0);
		$scope.patternSelected = 0;
		$scope.patternDisabled = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
		for(var i=0;i<drums.volumes.length;i++) {
			var item = {label: drums.labels[i], volume: drums.volumes[i], disabled: false};
			$scope.sounds.push(item);
		}
		for(var j=drums.volumes.length;j<16;j++) {
			var itemDummy = {label: '...', volume: '0.0', disabled: true};
			$scope.sounds.push(itemDummy);
		}
		//console.log($scope.sounds);
	};

	$scope.run = function() {
		sequencer.steps = $scope.updateMatrix();
		sequencer.start();
		$scope.stepValue = sequencer.current;
		sequencer.loop(function(output){
			$scope.stepValue = output;
		});
	};

	$scope.updateMatrix = function() {
		var steps = [];
		for(var i=0;i<$scope.matrix.length;i++){
			var step = [];
			for(var j=0;j<$scope.matrix[i].length;j++){
				if($scope.matrix[j][i]==1){
					step.push(Sound(drums.play(j), $scope.sounds[j].volume));
				}
			}
			steps.push(step);
		}	
		return steps;
	};

	$scope.stop = function() {
		sequencer.stop();
	};

	$scope.play = function(sound) {
		var index = 0;
		for(var i=0;i<drums.labels.length;i++){
			if(drums.labels[i]===sound)
				index = i;
		}
		console.log("INDEX: " + index);
		var snd = Sound(drums.play(sound), $scope.sounds[index].volume);
		snd.play();
	};

	$scope.select = function(step) {
		$scope.mapSelected=step;
		$scope.soundSelected = $scope.matrix[step];
	};

	$scope.selectStep = function(step) {
		if($scope.matrix[$scope.mapSelected][step]===0)
			$scope.matrix[$scope.mapSelected][step] = 1;
		else $scope.matrix[$scope.mapSelected][step] = 0;
		$scope.select($scope.mapSelected);
	};

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
	};

	$scope.$watch('event', function(){
		var snd;
		if (event.keyCode == 75) { 
    		snd = Sound(drums.play('kick'));
			snd.play();
    	} 
   		if (event.keyCode == 83) { 
    		snd = Sound(drums.play('snare'));
			snd.play();
    	} 
   		if (event.keyCode == 72) { 
    		snd = Sound(drums.play('hihat'));
			snd.play();
    	} 
	});

	$scope.$watch('matrix', function(){
		sequencer.steps = $scope.updateMatrix();
	}, true);

	$scope.$watch('sounds', function(){
		sequencer.steps = $scope.updateMatrix();
	}, true);

}]);
