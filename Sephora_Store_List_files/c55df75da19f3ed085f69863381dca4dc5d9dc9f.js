(function(){
    //This whole thing is a signal hack done for:
    //https://jira.sephora.com/browse/ILLUPH-63718
	
	try {
		//Select the sign in button in the header
		var headerSignInLink = $("[seph-sign-in]"),
			accountLink = $("[seph-needs-login]"),
			signInModalScope,
			allSignInButtons,
			i;

		if(accountLink){
			allSignInButtons = $.merge(headerSignInLink, accountLink);
		}
		else {
			allSignInButtons = headerSignInLink;
		}

		for(i=0; i<allSignInButtons.length; i+=1 ){

			//Attach listener that waits a second before attaching the next listener because the modal needs time to load and exist in the DOM
			$(headerSignInLink[i]).on("click", function(){
				window.setTimeout(function(){

					signInModalScope = angular.element(".Modal-body").scope();

					signInModalScope.$on("signIn", function(){
						wa.forNextPage({"events": "event100"});
					});
				}, 1200);
			});
		}

	} catch(e){}

}());