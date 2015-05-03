/*
	JSON Explorer
	Published 2015 by Tahsis Claus under MIT Liscense
*/

function() {
	var app = angular.module("t-tools", []);

	app.directive("jsonExplorer", ['$parse',
		function($parse) {
			return {
				restrict: 'A',
				scope: true,
				link: function(scope, element, attrs) {
					scope.json = $parse(scope, attrs.jsonExplorer);
				}
			}
		}
	]);

	app.controller("exampleCtrl", ['$scope',
		function($scope) {
			$scope.test = {
				user: "tsclaus",
				password: "blah"
			};
		}
	]);

}();