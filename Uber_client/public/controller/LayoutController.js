angular.module("homeModule")
.controller("LayoutController",LayoutController);

LayoutController.$inject = ['$scope','LayoutService'];

function LayoutController($scope,LayoutService){
	
	getFriendRequests();

	function getFriendRequests(){
		LayoutService.getFriendRequests()
		 .success(function(data){
			 $scope.friendsRequests = data.friendsRequests;
			 console.log($scope.friendsRequests);
		 });
	};
	
	$scope.acceptFriendRequest = function(friendid){
		console.log(friendid);
		LayoutService.acceptFriendRequest(friendid)
		 .success(function(data){
			 });
	};
	
	$scope.createGroup = function(group){
		console.log($scope.group);
		LayoutService.createGroup(group)
		 .success(function(data){
		 });
		$scope.group = {
				groupname : "",
				members : []
		};
	};
	
	
	
}



