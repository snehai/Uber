var riderModule = angular.module("riderModule", ['ui.router']);

riderModule.controller("RiderController", function($http, $scope, $rootScope, $state){
	var $rootScope = [];
});

riderModule.config(function($stateProvider, $urlRouterProvider) {


	  $stateProvider
	    .state("Rides", {
	    	views: {
	    		"viewRides" : {
	    			  url         : "/rides",
	    			  templateUrl : "/viewRides",
	    			  controller  : function($scope , $http){
	    				  $http.get("/getRides").
	    				  then(function(response) {
	    						  $scope.rides = response.data.rideDetails;	
	    						  console.log($scope.rides);
	    					  }, function(response) {
	    						  console.log(response);
	    					  });
	    			}
	    	}}
	      
	    }).state("Payment", {
	    	views: {
	    		"viewPayment" : {
	    			  url         : "/payment",
	    			  templateUrl : "/viewPayment",
	    			  controller  : function($scope , $http){
	    				 $scope.test = "welcome";
	    				  
	    				
	    		}
	    	}}
	      
	    });

});

