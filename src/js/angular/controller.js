var machine = angular.module('appMachine', ['ngSanitize','ui.select', 'ui.slider']);

machine.controller('MachineController', ['$scope', 'Sound', 'Sequencer', function($scope, Sound, sequencer){

	var drums = {};
	var pattern = new PatternManager();
	$scope.patternSelected = 0;
	$scope.patternDisabled = [];
	$scope.sync = false;
	$scope.mapSelected = 0;
	$scope.matrix = [];
	$scope.drumItems = ['909 Dreams', '8-bit'];
	$scope.nVolume = 1.0;
	$scope.sounds = [];
    $scope.jsonSounds = {};
    $scope.bankSelected = Drums64;
    $scope.playLabel = 'Play';
    $scope.animation = false;
    // enable/disable animation on pause button 
    $scope.animationPause = false;
    // enable/disable css animation about copy button
    $scope. animationCopy = false;
    // enable/disable css animation about paste button
    $scope.animationPaste = false;
    // 1/0 to enable/disable css animation about pattern button
    $scope.animationPattern = [];
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
		$scope.playLabel = 'Pause';
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

        // copy mode
		if($scope.isCopying) {
			$scope.copyClipboard = nPattern;
		}

		// paste mode
		if($scope.isPasting) {
			var srcPattern = pattern.getPattern($scope.copyClipboard);
			var matrixBak = srcPattern.matrix;
			pattern.paste(srcPattern.number, nPattern);
			pattern.setPattern(srcPattern.number, matrixBak);
		}

        var patternItem = null;

        patternItem = pattern.getPattern(nPattern);
        $scope.patternSelected = nPattern;

        if(patternItem) {
        	//console.log("PATTERN ALREADY EXISTS!!!");
        	$scope.matrix = patternItem.matrix;
        	$scope.select($scope.mapSelected);
        	return;
        }
        //console.log("PATTERN IS NEW");
        patternItem = pattern.setPattern(nPattern, []);
        $scope.matrix = patternItem.matrix;
        //console.log($scope.matrix);
        $scope.select($scope.mapSelected);

	};

	$scope.copyPattern = function() {
        for(var i=0;i<pattern.getPatterns().length;i++) {
        	$scope.animationPattern[pattern.getPattern(i).number]=1;
        }
		$scope.isCopying = true;
		$scope.isPasting = false;
		//$scope.animationPattern = true;
		$scope.animationCopy = true;
		$scope.animationPaste = false;
	};

	$scope.pastePattern = function() {
		$scope.isPasting = true;
		$scope.isCopying = false;
        for(var i=0;i<12;i++)
		  $scope.animationPattern[pattern.getPattern(i).number]=1;
		$scope.animationCopy = false;
		$scope.animationPaste = true;
	};

	$scope.resetPatternAction = function() {
		$scope.isCopying = false;
		$scope.isPasting = false;
		$scope.copyClipboard = 0;
		$scope.animationPattern = [];
		$scope.animationCopy = false;
		$scope.animationPaste = false;
	};

	$scope.selectBank = function(item) {
        var Obj = null;
        if(item.indexOf('909 Dreams')===0)Obj = Drums64;
        if(item.indexOf('8-bit')===0)Obj = Bit8;
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
		console.log("SOUNDS");
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
