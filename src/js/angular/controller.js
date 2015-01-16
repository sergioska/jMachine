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
			console.log("IS PASTING");
            for(var i=0;i<pattern.length;i++){
                if(pattern[i].number===nPattern){
                	console.log("HIT");
                    pattern[i].matrix=pattern[$scope.copyClipboard].matrix;
                    return;
                }
            }
			var tmppattern = new Pattern();
            tmppattern.number = nPattern;
            var index = 0;
            for(var k=0;k<pattern.length;k++){
                if(pattern[k].number===$scope.copyClipboard)
                    index=k;
            }
            console.log("SELECTED PATTERN: " + index);
            console.log(pattern[index].matrix);
            console.log("SELECTED PATTERN");
            $scope.matrix = pattern[index].matrix;
            tmppattern.matrix = $scope.matrix;
            console.log(tmppattern);
            //tmppattern.matrix = pattern[index].matrix;
            pattern.push(tmppattern);
			console.log("AFTER PUSH");
			console.log(pattern);
			$scope.copyClipboard = 0;
			$scope.resetPatternAction();
			return;
		}
		console.log("NPATTERN: " + nPattern);
		$scope.patternSelected = nPattern;
		for(var j=0;j<pattern.length;j++) {
			if(pattern[j].number===nPattern) {
				console.log("PATTERN FOUNDED IS: " + pattern[j].number);
				console.log(pattern);
				$scope.matrix = pattern[j].matrix;
				$scope.select($scope.mapSelected);
				return;
			}
			else continue;
		}
		console.log("NEW PATTERN");
		var newpattern = new Pattern();
		newpattern.number = nPattern;
		$scope.matrix = newpattern.matrix;
        $scope.select($scope.mapSelected);
        pattern.push(newpattern);
        console.log(pattern);
	};

	$scope.copyPattern = function() {
        for(var i=0;i<pattern.length;i++){
            $scope.animationPattern[pattern[i].number]=1;
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
		  $scope.animationPattern[i]=1;
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
