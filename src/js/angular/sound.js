// Sound service definition
machine.factory('Sound', function(){
	var Sound = (function () {
	    var df = document.createDocumentFragment();
	    return function Sound(src) {
	    	var allSoundInstance = [];
	    	for(var i=0;i<allSoundInstance.length;i++){
	    		if(allSoundInstance[i].source.indexOf(src)){
	    			df.appendChild(allSoundInstance[i].sound);
	    			allSoundInstance[i].sound.addEventListener('ended', function(){});
	    			return allSoundInstance[i].sound;
	    		}
	    	}
	        var snd = new Audio(src);
	        var item = {sound: snd, source: src};
	        allSoundInstance.push(item);
	        df.appendChild(snd); // keep in fragment until finished playing
	        snd.addEventListener('ended', function () {/*df.removeChild(snd);*/});
	        //snd.play();
	        return snd;
	    };
	}());
	return Sound;
});