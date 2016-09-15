/* jshint node:true, evil:true*/

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
	.controller('appController', function($scope, $document, clipboard) {
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
			var inputObject;
			try {
				try {
					inputObject = eval('(' + $scope.jsonInput + ')');
				} catch (e){
					inputObject = JSON.parse($scope.jsonInput);
				}
				
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
			var inputJson = document.getElementById('input-json');
			setTimeout(function(){
				inputJson.focus();
				inputJson.select();
			}, 1);
			
		};
	});