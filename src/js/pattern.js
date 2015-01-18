var Pattern = function() {
	this.number = 0;
	this.matrix = [
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
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
			];
};

var PatternManager = function() {
	this.pattern = [];
};

PatternManager.prototype.dummyPattern = function(number) {
	var dummyItem = new Pattern();
	dummyItem.number = number;
	return dummyItem;
};

PatternManager.prototype.setPattern = function(number, matrix) {
	// before find if item already exists
	for(var i=0;i<this.pattern.length;i++) {
		if(this.pattern[i].number===number) {
			var newItem = new Pattern();
			newItem.number=number;
			if (matrix.length!==0) {
				newItem.matrix = matrix;
			}
			this.pattern[i] = Utils.deepCopy(newItem);
			return this.pattern[i];
		}
	}
	// create a new pattern item
	var patternItem = new Pattern();
	patternItem.number = number;
	if (matrix.length!==0)
		patternItem.matrix = matrix;
	this.pattern.push(patternItem);
	return patternItem;
};

PatternManager.prototype.getPattern = function(number) {
	for(var i=0;i<this.pattern.length;i++) {
		if(this.pattern[i].number===number) {
			return this.pattern[i];
		}
	}
	return false;
};

PatternManager.prototype.getPatterns = function() {
	return this.pattern;
};

PatternManager.prototype.paste = function(srcItem, dstItem) {
	var srcPattern = this.getPattern(srcItem);
	var dstPattern = this.getPattern(dstItem);
	this.setPattern(dstItem, srcPattern.matrix);
	return;
};

