var dbUtil = require('./dbUtil');
var response = {};


exports.riderSignup = function(msg, callback){
	var query = "insert into customer (firstname , lastname, address, city, state, zipcode, phonenumber, email, password,creditcard) values " +"('"+ 
	msg.firstname +"','"+ msg.lastname + "','"+msg.address + "','"+ msg.city +"','"+ msg.state +
	"','"+ msg.zipCode +"','"+ msg.mobileNumber +"','"+ msg.email  +"','"+ msg.password+"','"+ msg.creditcardNumber+"');";
	
	console.log("Query is:"+query);
	var dbConn = dbUtil.getSqlConn();
	dbConn.query(query, function(err, rows) {
		if(err){
			response.code = "401";
			response.value = "Failed Signup";
			}else{
			response.code = "200";
			response.value = "Succes Signup";
		}
		callback(null, response);
	});

}

exports.riderLogin = function(msg, callback){
   var query="select * from customer where email ='"+ msg.username+"'";
	console.log("Query is:"+query);
	var dbConn = dbUtil.getSqlConn();
	dbConn.query(query, function(err, rows) {
		if (err) {
		        console.log(err);
		        response.code = "401";
		        response.value = "Failed Login";
		      } else if (rows.length) {
		    	 response.code = "200";
		    	 response.value = "Succes Login";
		    	 response.result = rows;
		      } else {
		        console.log('No document(s) found with defined "find" criteria!');
		        response.code = "401";
		        response.value = "Failed Login";
		      }
		callback(null, response);
	});
}


exports.driverSignup = function(msg, callback){

	var query = "insert into driver (firstname , lastname, address, city, state, zipcode, phonenumber, email, password,cartype) values  " +"('"+
	  msg.firstname +"','"+ msg.lastname + "','"+msg.address + "','"+ msg.city +"','"
	+ msg.state +"','"+ msg.zipCode +"','"+ msg.mobileNumber +"','"+ msg.email +"','"+ msg.password +"','"+ msg.carType+"');";
	
	console.log("Query is:"+query);
	
	dbConn.query(query, function(err, rows) {
		if(err){
			response.code = "401";
			response.value = "Failed Signup";
		}else{
			response.code = "200";
			response.value = "Succes Signup";
		}
		callback(null, response);
	});

}


exports.driverLogin = function(msg, callback){
    
	var query="select * from driver where email ='"+ msg.username+"'";
	console.log("Query is:"+query);
	dbConn.query(query, function(err, rows) {
		 if (err) {
		        console.log(err);
		        response.code = "401";
		        response.value = "Failed Login";
		      } else if (result.length) {
		    	response.code = "200";
		    	response.value = "Succes Login";
		    	response.result = result;
		      } else {
		        console.log('No document(s) found with defined "find" criteria!');
		        response.code = "401";
		        response.value = "Failed Login";
		      }
		callback(null, response);
	});
}

exports.getRides = function(msg, callback){
    var query="select r.pickuplocation,r.dropofflocation,r.ridedate,d.firstname from rides r join driver d on d.driverid = r.driverid where customerid ='"+ msg.CustomerID+"' and r.isactive = 1";
	console.log("Query is:"+query);
	var dbConn = dbUtil.getSqlConn();
	dbConn.query(query, function(err, rows) {
		 if (err) {
		        console.log(err);
		        response.code = "401";
		        response.value = "Failed Login";
		      } else if (rows.length) {
		    	 response.code = "200";
		    	 response.value = "Succes Login";
		    	 response.rideDetails = rows;
		      } else {
		        console.log('No document(s) found with defined "find" criteria!');
		        response.code = "401";
		        response.value = "Failed Login";
		      }
		callback(null, response);
	});
}


/*Method to list nearby drivers in 10mile radius*/
exports.listNearByDrivers = function(msgPayload, callback) {
	var userLat = msgPayload.userLat;
	var userLng = msgPayload.userLng;
	var dbConn = dbUtil.getSqlConn();
	var radius = 16093.4; // 10 miles in meters
	//point1: (lat1, lng1): lat1 = radius * sin(135 deg); lng1 = radius * cos(135 deg)
	var lat1 = (userLat + 0.1 + ((radius * Math.sin(2.35619))/ 110540)).toFixed(2);
	var lng1 = (userLng - 0.1 + ((radius * Math.cos(2.35619))/111320 * Math.cos(userLat))).toFixed(2);
	//point2: (lat2, lng2): lat2 = radius * sin(315 deg); lng2 = radius * cos(315 deg)
	console.log("(lat1, lng1) = (" + lat1 + "," + lng1 + ")");
	var lat2 =  (userLat - 0.1 + ((radius * Math.sin(5.49779))/ 110540)).toFixed(2);
	var lng2 = (userLng + 0.1 + ((radius * Math.cos(5.49779))/111320 * Math.cos(userLat))).toFixed(2);
		
	console.log("(lat2, lng2) = (" + lat2 + "," + lng2 + ")");
	var query = "select firstName, lastName, phoneNumber, carType, latitude, longitude, " +	
			"( 3959 * acos( cos( radians(" + userLat + ") ) " + 
            "* cos( radians( driver.latitude ) ) " + 
            "* cos( radians( driver.longitude ) - radians(" + userLng + ") ) " + 
            "+ sin( radians(" + userLat + ") ) * sin( radians( driver.latitude ) ) ) ) AS distance " +  
            " from driver where isActive = 1 and driver.latitude between " + lat2 + " and " + lat1 + 
            " and driver.longitude between " + lng1 + " and " + lng2 +
            " having distance < 10 ORDER BY distance;"
            
    console.log("query: " + query);
	dbConn.query(query, function(err, rows) {		
		if (err) {
			console.log(err);
			response.errorOccured = true;
			response.status = err;
			callback(null, response);				
		} 
		else {					
			console.log("Server: " + msgPayload.reqType +" successful");
			console.log(rows);
			response.errorOccured = false;
			response.driverList = rows;
			callback(null, response);
		}
	});
}

/*Method to book a ride.Sends a notification to driver regarding the ride*/
exports.bookARide = function(msgPayload, callback) {
	var srcLat = msgPayload.srcLat,
	srcLng = msgPayload.srcLng,
	destLat = msgPayload.destLat,
	destLng = msgPayload.destLng,
	notifDriverId = msgPayload.notifDriverId,
	notifCustId = msgPayload.notifCustId,
	custLastName = msgPayload.custLastName,
	custFirstName = msgPayload.custFirstName,
	custPhone = msgPayload.custPhone,
	notifType = msgPayload.notifType;//1 = Ride Request; 0 = Cancel Request
	
	var dbConn = dbUtil.getSqlConn();
	var data1 = {
			notifDriverId: notifDriverId,
			notifCustId: notifCustId,
			custLastName: custLastName,
			custFirstName: custFirstName,
			notifType: notifType,
			custPhone: custPhone
	};
	var query = "insert into driverNotifications set ? ";
	dbConn.query(query, data1, function(err, rows) {
		if(err) {
			console.log(err);
			response.errorOccured = true;
			response.status = err;
			callback(null, response);
		}
		else {
			console.log("Server: " + msgPayload.reqType +" successful");
			response.errorOccured = false;
			callback(null, response);
		}
	});
}