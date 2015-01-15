var machine = angular.module('appMachine', ['ngSanitize','ui.select', 'ui.slider']);

machine.controller('MachineController', ['$scope', 'Sound', 'Sequencer', function($scope, Sound, sequencer){

	var drums = {};
	var pattern = [];
	$scope.patternSelected = 0;
	$scope.patternDisabled = [];
	$scope.sync = false;
	$scope.mapSelected = 0;
	$scope.matrix = [[]];
	$scope.drumItems = ['909 Dreams', '8-bit'];
	$scope.nVolume = 1.0;
	$scope.sounds = [];
    $scope.jsonSounds = {};
    $scope.bankSelected = Drums64;
    $scope.playLabel = 'Play';
    $scope.animation = false;
    $scope.animationPause = false;
    $scope.isPlaying = false;
    $scope.isCopying = false;
    $scope.isPasting = false;
    $scope.copyClipboard = 0;
    $scope.bpm = 90;
    
	$scope.init = function() {
        drums = {};
        var itemDummy = {};
        var itemSound = {};
        $scope.sounds = [];
		var composition = Object.create(Composition);

		composition.setTime($scope.bpm);

		$scope.jsonSounds = Object.create($scope.bankSelected);
		drums = composition.createInstrument('drums', $scope.jsonSounds);
        console.log(drums.volumes.length);
		$scope.select(0);
		$scope.setPattern($scope.patternSelected);

		$scope.patternDisabled = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
		for(var i=0;i<drums.volumes.length;i++) {
			itemSound = {label: drums.labels[i], volume: drums.volumes[i], disabled: false};
			$scope.sounds.push(itemSound);
		}
		for(var j=drums.volumes.length;j<16;j++) {
			itemDummy = {label: '...', volume: '0.0', disabled: true};
			$scope.sounds.push(itemDummy);
		}
		//console.log($scope.sounds);
	};

	$scope.run = function() {
		$scope.animationPause = false;
		if($scope.isPlaying)
			return $scope.pause();
		$scope.playLabel = 'Play';
		$scope.isPlaying = true;
		sequencer.setTime($scope.bpm);
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
		$scope.isPlaying = false;
		sequencer.stop();
	};

	$scope.pause = function() {
		sequencer.pause();
		$scope.playLabel = 'pause';
		$scope.animationPause = true;
		$scope.isPlaying = false;
	};

	$scope.play = function(sound) {
		var index = 0;
		for(var i=0;i<drums.labels.length;i++){
			if(drums.labels[i]===sound)
				index = i;
		}
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
		if($scope.isCopying) {
			$scope.copyClipboard = nPattern;
		}
		if($scope.isPasting) {
			//console.log("SELECTED: " + nPattern + "CLIPBOARD: " + $scope.copyClipboard);
			if(pattern[nPattern])
				pattern[nPattern].matrix=pattern[$scope.copyClipboard].matrix;
			else {
				var tmppattern = new Pattern();
				tmppattern.number = nPattern;
				$scope.matrix = tmppattern.matrix;
				pattern.push(tmppattern);
				//pattern[nPattern]=pattern[$scope.copyClipboard];
			}
			$scope.copyClipboard = 0;
			$scope.resetPatternAction();
			return;
		}
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

	$scope.copyPattern = function() {
		$scope.isCopying = true;
		$scope.isPasting = false;
		$scope.animationPattern = true;
		$scope.animationCopy = true;
		$scope.animationPaste = false;
	};

	$scope.pastePattern = function() {
		//pattern[$scope.patternSelected];
		$scope.isPasting = true;
		$scope.isCopying = false;
		$scope.animationPattern = true;
		$scope.animationCopy = false;
		$scope.animationPaste = true;
	};

	$scope.resetPatternAction = function() {
		$scope.isCopying = false;
		$scope.isPasting = false;
		$scope.copyClipboard = 0;
		$scope.animationPattern = false;
		$scope.animationCopy = false;
		$scope.animationPaste = false;
	};

	$scope.selectBank = function(item) {
        var Obj = null;
        if(item.indexOf('909 Dreams')===0)Obj = Drums64;
        if(item.indexOf('8-bit')===0)Obj = Bit8;
        //$scope.stop();
        $scope.bankSelected = Obj;
        sequencer.steps = $scope.updateMatrix();
        $scope.init();
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

	$scope.$watch('bpm', function(){
		sequencer.setTime($scope.bpm);
		console.log($scope.isPlaying);
		if($scope.isPlaying) {
			sequencer.resetInterval();
			sequencer.loop(function(output){
				$scope.stepValue = output;
			});
		}
	});
    

}]);
