/* jshint node:true*/

'use strict';

var angular = require('angular');
var toJsonTable = require('json-to-table');
var toMarkdownTable = require('markdown-table');
var marked = require('marked');
var jsonFormat = require('json-format');

angular
	.module('app', [
		require('angular-sanitize'),
		require('angular-highlightjs'),
		require('angular-clipboard').name,
	])
	.controller('appController', function($scope, clipboard) {
		$scope.jsonInputVisible = true;
		$scope.jsonToMarkdownTable = function() {
			$scope.error = null;
			$scope.processed = false;
			$scope.jsonOutput = '';
			$scope.markdownOutput = '';
			$scope.htmlOutput = '';
			if(!$scope.jsonInput.trim()){
				return;
			}
			try {
				var inputObject = JSON.parse($scope.jsonInput);
				var jsonTable = toJsonTable(inputObject);
				$scope.jsonOutput = jsonFormat(inputObject);
				$scope.markdownOutput = toMarkdownTable(jsonTable);
				$scope.htmlOutput = marked($scope.markdownOutput);
				$scope.processed = true;
			} catch(e){
				$scope.error = e;
				throw e;
			}
		};

		$scope.copyJson = function(){
			clipboard.copyText($scope.jsonOutput);
		};

		$scope.copyMarkdown = function(){
			clipboard.copyText($scope.markdownOutput);
		};

		$scope.copyHtml = function(){
			clipboard.copyText($scope.htmlOutput);
		};

		$scope.hideJsonInput = function() {
			if($scope.processed){
				$scope.jsonInputVisible = false;
			}
		};

		$scope.showJsonInput = function() {
			$scope.jsonInputVisible = true;
		};
	});