var mqClient = require('../rpc/client');

function homeRouteConfig(app,passport){
	
	this.app=app;
	this.passport=passport;
	this.routeTable= [];
	this.init();
}

homeRouteConfig.prototype.init = function(){
	
	var self = this;
	require('../config/passport')(self.passport);
	this.addRoutes();
	this.processRoutes();
}


homeRouteConfig.prototype.processRoutes = function(){
	
	var self = this;
	self.routeTable.forEach(function(route){
		
		if(route.requestType == 'get'){
			self.app.get(route.requestUrl,route.callbackFunction);
		}
		else if(route.requestType == 'post'){
			self.app.post(route.requestUrl,route.callbackFunction);
		}
		
	});
}

homeRouteConfig.prototype.addRoutes = function(){
	
	var self =  this;
	var passport = self.passport;
	
    self.routeTable.push({
		
		requestType : 'get',
	    requestUrl  : '/',
	    callbackFunction : function (request,response){
	    	response.render('index', { title: 'Express' });
	    }
	});
    
    self.routeTable.push({
		
		requestType : 'get',
	    requestUrl  : '/loginPage',
	    callbackFunction : function (request,response){
	    	response.render('login_page');
	    }
	});
    
    self.routeTable.push({
		
		requestType : 'get',
	    requestUrl  : '/riderloginPage',
	    callbackFunction : function (request,response){
	    	response.render('login_rider');
	    }
	});
    
    self.routeTable.push({
		
		requestType : 'get',
	    requestUrl  : '/driverloginPage',
	    callbackFunction : function (request,response){
	    	response.render('login_driver');
	    }
	});
    
 self.routeTable.push({
		
		requestType : 'get',
	    requestUrl  : '/riderLogin',
	    callbackFunction : function (request,response){
	    	response.render('rider_login');
	    }
	});
    
    self.routeTable.push({
		
		requestType : 'get',
	    requestUrl  : '/driverLogin',
	    callbackFunction : function (request,response){
	    	response.render('driver_login');
	    }
	});
    
   self.routeTable.push({
		
		requestType : 'get',
	    requestUrl  : '/riderSignupPage',
	    callbackFunction : function (request,response){
	    	response.render('rider_signup');
	    }
	});
   
    self.routeTable.push({
		
		requestType : 'get',
	    requestUrl  : '/driverSignupPage',
	    callbackFunction : function (request,response){
	    	response.render('driver_signup',{errormessage:''});
	    }
	});
    
   self.routeTable.push({
    	
    	requestType : 'post',
	    requestUrl  : '/driverLogin',
	    callbackFunction : function (req, res, next){
	    	passport.authenticate('local-driver-login', function(err, user, info) {
	      	    if (err) {
	      	       return res.render('error',{message:'',errormessage:"An error has occured."});
	      	     }
	      	    if(user)
	      	    {
	      	    	return res.render("driver_home",{firstname:req.session.firstname,friendsRequests:'',nousermessage:""});
	      	    }else{
	      	    	return res.render("driver_login",{errormessage : 'Sorry, the email or password does not match our records !!', message : ''});
	      	    }
	      	  })(req, res, next);
	    }
	});
    
    self.routeTable.push({
    	
    	requestType : 'post',
	    requestUrl  : '/driverSignup',
	    callbackFunction : function (req, res, next){
	  		passport.authenticate('local-driver-signup', function(err, user, info) {
	  	    if (err) {
	  	       return res.render('error', {message:'',errormessage:"An error has occured."});
	  	     }
	  	    if(user)
	  	    {
	  	    	return res.render('driver_home',{message:"Successfully signed up! You can now login with your email and password.",errormessage:''});
	  	    }else{
	  	    	return res.render('driver_signup',{message:'',errormessage:"Email id already exists!!"});
	  	    }
	  	  })(req, res, next);
	    }
	  });
    
    self.routeTable.push({

    	    requestType : 'get',
    	    requestUrl  : '/getRides',
    	    callbackFunction : function (request,response){
    	    	var reqType = "getRides";
    	    	var msg_payload = { "CustomerID": request.session.CustomerID, "reqType": reqType };
    	    	mqClient.makeRequest('rider',msg_payload, function(err,results){
    	    		console.log('session'+ request.session.CustomerID);
    	    		console.log(results.rideDetails);
    	    		response.json({ rideDetails : results.rideDetails});
    	    	});
    	    }
    	});
    
    self.routeTable.push({

    	requestType : 'get',
    	    requestUrl  : '/viewRides',
    	    callbackFunction : function (request,response){
    	    response.render('rides');
    	    }
    	});
    	    
    self.routeTable.push({
    	requestType : 'get',
    	    requestUrl  : '/viewPayment',
    	    callbackFunction : function (request,response){
    	    response.render('payment');
    	    }
    	});
    
 /*  self.routeTable.push({
		
		requestType : 'post',
	    requestUrl  : '/listNearByDrivers',
	    callbackFunction : function (request,response){
	    	console.log('inside route config');
	    	console.log(request.body);
	    }
	});*/
    
    self.routeTable.push({
    	requestType : 'post',
    	   requestUrl  : '/listNearByDrivers',
    	   callbackFunction : function (req, res){
//    	     if(req.session.userId == undefined || req.session.userId == null) {
//    	     res.json({status: "pls login first"});
//    	     }
    	   
    	    var reqType = "listNearByDrivers";
    	var msgPayload = {
    	reqType: reqType,
    	userLat: req.body.userLat,//37.3380000
    	userLng: req.body.userLng  //-121.8840000
    	};
    	console.log("listNearByDrivers");
    	console.log(req.body);
    	placeRequest('queue1', msgPayload);
    	   }
    	});
	
	
    
    self.routeTable.push({
		
		requestType : 'get',
	    requestUrl  : '/logout',
	    callbackFunction : function (request,response){
	    	request.logout();
	    	request.redirect('/');
	    }
	});
    
}

function placeRequest(qName, msgPayload) {
	mqClient.makeRequest(qName, msgPayload, function(err, response){
	if(err) {
	console.log("error occured" + err);
	response.status = err;
	res.json(response);
	}
	else {
	if(!response.errorOccured) {
	response.status = "success";
	console.log("Client:" + msgPayload.reqType + " success; server response below");
	console.log(response);
	res.json(response);
	}
	else{
	console.log("Client:" + msgPayload.reqType + " failed. some error occured at server, err msg below:");
	console.log(response.status);
	res.json(response);
	}
	}
	});
}

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the login page
    res.redirect('/');
}

module.exports = homeRouteConfig;