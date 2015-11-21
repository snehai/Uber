var mqClient = require('../rpc/client');

exports.riderLogin = function(req,res)
{
	var username = req.param("email");
	var password = req.param("password");
	var reqType = "riderLogin";
	var msg_payload = { "username": username, "password": password, "reqType": reqType };
		
	console.log("In POST Request = UserName:"+ username+" "+password);
	mqClient.makeRequest('rider',msg_payload, function(err,results){
		console.log(results);
		if(err){
			res.end('An error occurred');
            console.log(err);
		}
		else 
		{
			if(results.code == 200){
				console.log("valid Login");
				var userDetails = results.result[0];
				console.log('session'+req.session);
				req.session.CustomerID = userDetails.CustomerID;
				req.session.firstname = userDetails.FirstName;
				req.session.save();
				console.log(req.session.userid+' '+req.session.firstname);
				res.render("rider_home",{firstname:req.session.firstname,friendsRequests:'',nousermessage:""});
			}
			else {    
				
				console.log("Invalid Login");
				if (!err) {
				res.render("rider_login",{errormessage : 'Sorry, the email or password does not match our records !!', message : ''});
				}else {
		            res.end('An error occurred');
		            console.log(err);
		        }
			}
		}  
	});
}

exports.driverLogin = function(req,res)
{
	console.log('here');
	var username = req.param("email");
	var password = req.param("password");
	var msg_payload = { "username": username, "password": password };
		
	console.log("In POST Request = UserName:"+ username+" "+password);
	mqClient.makeRequest('driver_login_queue',msg_payload, function(err,results){
		console.log(results);
		if(err){
			res.end('An error occurred');
            console.log(err);
		}
		else 
		{
			if(results.code == 200){
				console.log("valid Login");
				var userDetails = results.result[0];
				req.session.userid = userDetails.userid;
				req.session.firstname = userDetails.firstname;
				req.session.fullname = userDetails.fullname;
				req.session.save();
				res.render("driver_home",{firstname:req.session.firstname,friendsRequests:'',nousermessage:""});
			}
			else {    
				
				console.log("Invalid Login");
				if (!err) {
				res.render("driver_login",{errormessage : 'Sorry, the email or password does not match our records !!', message : ''});
				}else {
		            res.end('An error occurred');
		            console.log(err);
		        }
			}
		}  
	});
}