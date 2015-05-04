'use strict';

/*
	JSON Explorer
	Published 2015 by Tahsis Claus under MIT Liscense
*/

(function() {
	function type(val) {
		if(typeof val !== "object") {
			return typeof val;
		}
		else {
			if(val.constructor == Date)
				return "date";
			if(val.constructor == Array)
				return "array";
			if(val.constructor == Object)
				return "object";
			throw "Error: cannot determine type of value";
		}
	}

	function Node(val, parent) {
		var self = this;

		this.val = val;
		this.type = type(val);

		if(parent) {
			this.parent = parent;
			this.siblings = parent.children;
		}
		else{
			this.siblings = {root: this}
			this.reference = "root";
		}

		if(this.type == "array") {
			this.children = [];
			this.val.forEach(function(val, index) {
				var child = new Node(val, self);
				child.reference = index;
				self.children.push(child);
			});
		}

		if(this.type == "object") {
			this.children = {};
			Object.getOwnPropertyNames(this.val).forEach(function(key) {
				var child = new Node(self.val[key], self);
				child.reference = key;
				self.children[key] = child;
			});
		}

		return this;
	}

	var app = angular.module("t-tools", ['ngScrollable']);

	app.directive("jsonExplorer", ['$parse',
		function($parse) {
			return {
				restrict: 'A',
				scope: true,
				link: function(scope, element, attrs) {
					scope.$watch(function() {
						return $parse(attrs.jsonExplorer)(scope.$parent);
					}, function(newVal) {
						scope.currentNode = new Node(newVal);
						console.log(scope.currentNode);
					});

					scope.gui = {};

					scope.siblingAdd = function() {
						if(scope.gui.addSiblingType && (scope.currentNode.parent.type !== "object" || (scope.gui.addSiblingKey && !scope.currentNode.siblings[scope.gui.addSiblingKey]))) {
							var node;
							switch(scope.gui.addSiblingType) {
								case "number":
									node = new Node(0, scope.currentNode.parent);
									break;
								case "string":
									node = new Node("", scope.currentNode.parent);
									break;
								case "object":
									node = new Node({}, scope.currentNode.parent);
									break;
								case "array":
									node = new Node([], scope.currentNode.parent);
									break;
							}
							if(scope.currentNode.parent.type == "object") {
								node.reference = scope.gui.addSiblingKey;
								scope.currentNode.siblings[scope.gui.addSiblingKey] = node;
							}
							else {
								node.reference = scope.currentNode.siblings.length;
								scope.currentNode.siblings.push(node);
							}
						}
					};

					scope.click = function(node) {
						scope.currentNode = node;
					};
				}
			}
		}
	]);

	app.controller("exampleCtrl", ['$scope',
		function($scope) {
			$scope.test = {
				user: "tsclaus",
				password: "blah",
				testarr: [{name: "nigga"}, 12, "abc"],
				testobj: {
					subobj: {
						test: "val"
					},
					testnum: 19,
					string: "hello"
				}
			};
		}
	]);

})();