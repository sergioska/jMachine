Utils = { 
    deepCopy: function(obj) {
        if (Object.prototype.toString.call(obj) === '[object Array]') {
            var out = [], i = 0, len = obj.length;
            for ( ; i < len; i++ ) {
                out[i] = arguments.callee(obj[i]);
            }
            return out;
        }
        if (typeof obj === 'object') {
            var out1 = {}, j;
            for ( j in obj ) {
                out1[j] = arguments.callee(obj[j]);
            }
            return out1;
        }
        return obj;
    }
};