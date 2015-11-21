var mqClient = require('../rpc/client');


exports.riderSignup = function(req,res,next){
	
	var email = req.param("email");
	var password = req.param("password");
	var firstname = req.param("firstname");
	var lastname = req.param("lastname");
	var fullname = firstname+" "+lastname;
	var address = req.param("address");
	var city = req.param("city");
	var state = req.param("state");
	var zipCode = req.param("zipCode");
	var mobileNumber = req.param("mobileNumber");
	var creditcardNumber = req.param("creditcardNumber");
	var reqType = "riderSignUp";
	var msg_payload = { "email": email, "password": password, "firstname":firstname, "lastname":lastname, "address":address, "city":city,"state":state,"zipCode": zipCode,
			"mobileNumber":mobileNumber,"creditcardNumber":creditcardNumber, "reqType": reqType};
	mqClient.makeRequest('rider',msg_payload, function(err,results){
		console.log("inside");
		console.log(results.code);
		console.log(results);
		if(err){
			console.log(err);
			res.render('error',{message:'',errormessage:"An error has occured."});
			return;
		}
		else 
		{
			if(results.code == 200){
				console.log("valid signup");
				res.render('rider_home',{message:"Successfully signed up! You can now login with your email and password.",errormessage:''});
			}
			else {    
				
				console.log("Invalid signup");
				res.send({"login":"Fail"});
			}
		}  
	});
	
/*	var selectUser = "select EMAILID from users where emailid = '"+ email +"'";
	mysql.fetchData(function(err,results){
		if(err){
			console.log(err);
			res.render('error',{message:'',errormessage:"An error has occured."});
			return;
		}else{
			if(results.length > 0){
				res.render('login',{errormessage:"Email id already exists!!"});
			}else{
				var insertUser= "insert into USERS (EMAILID,PASSWORD,FIRSTNAME,LASTNAME,FULLNAME,BIRTHDAY,SEX) values ('"+email +
				"','"+password +"','"+firstname +"','"+lastname+"','"+fullname+"','"+birthday+"','"+sex+"');"
				console.log("Query is:"+insertUser);
				mysql.fetchData(function(err,results){
					if(err){
						throw err;
					}
				},insertUser);
				res.render('login',{message:"Successfully signed up! You can now login with your email and password.",errormessage:''});
			}
		}
	},selectUser);*/
};

exports.driverSignup = function(req,res,something){
	console.log(something);
	
	var email = req.param("email");
	var password = req.param("password");
	var firstname = req.param("firstname");
	var lastname = req.param("lastname");
	var fullname = firstname+" "+lastname;
	var address = req.param("address");
	var city = req.param("city");
	var state = req.param("state");
	var zipCode = req.param("zipCode");
	var mobileNumber = req.param("mobileNumber");
	var carType = req.param("carType");
	var reqType = "driverSignUp";
	var msg_payload = { "email": email, "password": password, "firstname":firstname, "lastname":lastname, "address":address, "city":city,"state":state,"zipCode": zipCode,
			"mobileNumber":mobileNumber,"carType":carType, "reqType": reqType};
	mqClient.makeRequest('driver_signup_queue',msg_payload, function(err,results){
		console.log("inside");
		console.log(results.code);
		console.log(results);
		if(err){
			console.log(err);
			res.render('error',{message:'',errormessage:"An error has occured."});
			return;
		}
		else 
		{
			if(results.code == 200){
				console.log("valid signup");
				res.render('driver_login',{message:"Successfully signed up! You can now login with your email and password.",errormessage:''});
			}
			else {    
				
				console.log("Invalid signup");
				res.send({"login":"Fail"});
			}
		}  
	});
};