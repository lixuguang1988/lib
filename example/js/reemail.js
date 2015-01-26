function isValidEmail(sText){
	var reEmail = /^(?:\w+\.?)*\w+@(?:\w+\.?)*\w+$/;
	return reEmail.test(sText);
}
