var processReq = require('./processRequest');

/*Method to handle the incoming client requests*/
exports.handleRequest = function (msgPayload, callback) {	
	var reqType = msgPayload.reqType;		
	switch(reqType) {
		case "signUp":
			console.log("Server: routing to sign up");
			processReq.signUp(msgPayload, callback);
			break;
		case "login":
			processReq.login(msgPayload, callback);
			break;		
		case "logout":
			processReq.logout(msgPayload, callback);
			break;
		case "listNearByDrivers":
			processReq.listNearByDrivers(msgPayload, callback);
			break;
		case "bookARide":
			processReq.bookARide(msgPayload, callback);
			break;
		case "riderSignUp":
			processReq.riderSignup(msgPayload, callback);
			break;
		case "riderLogin":
			processReq.riderLogin(msgPayload, callback);
			break;	
		case "driverSignUp":
			processReq.bookARide(msgPayload, callback);
			break;
		case "driverLogin":
			processReq.bookARide(msgPayload, callback);
			break;
		case "getRides":
			processReq.getRides(msgPayload, callback);
			break;

		}
}