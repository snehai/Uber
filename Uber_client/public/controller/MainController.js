(function () {
    "use strict";
    
    angular.module("uber")
    .controller("MainController",MainController);
    
    MainController.$inject = ['$scope','$http'];


    function MainController($scope, $http) {
    	
    	$scope.createPost = function(home){
    		if(home.post != ""){
    			$http.post('/createPost',
    					{
    				      post : home.post
    					}).
    					  then(function(response) {
    						 console.log(response);
    					  }, function(response) {
    						  console.log(response);
    					  });
    		
    		}
    	};

    }
}());