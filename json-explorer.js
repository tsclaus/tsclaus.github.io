'use strict';

/*
	JSON Explorer
	Published 2015 by Tahsis Claus under MIT Liscense
*/

(function() {
	var app = angular.module("t-tools", []);

	app.directive("jsonExplorer", ['$parse',
		function($parse) {
			return {
				restrict: 'A',
				scope: true,
				link: function(scope, element, attrs) {
					scope.$watch(function() {
						return $parse(attrs.jsonExplorer)(scope.$parent);
					}, function(newVal) {
						scope.json = newVal;
					});
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

			$scope.testClick = function() {
				$scope.test = {
					penis: true
				}
			};
		}
	]);

})();