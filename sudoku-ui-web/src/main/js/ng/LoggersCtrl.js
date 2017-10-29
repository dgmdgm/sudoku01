console && console.log("### LoggersCtrl.js: begin");

var sudokuApp = sudokuApp || angular.module('sudokuApp', []);

sudokuApp.controller('LoggersCtrl', function ($scope) {
    console.trace("LoggersCtrl: begin");



    console.trace("LoggersCtrl: end");
  });

console && console.log("### LoggersCtrl.js: end");
