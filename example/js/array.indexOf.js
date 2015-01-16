if(!Array.prototype.indexOf){
	Array.prototype.indexOf =  function(item){
		for(var i = 0, len = this.length; i < len; i++){
			if(this[i] === item){
				return i;
			}
		}
		return -1;
	};
}