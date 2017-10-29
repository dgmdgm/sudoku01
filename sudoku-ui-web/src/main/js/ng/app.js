console && console.log("### appConfig.js: begin");

// Must be loaded before module users
var sudokuApp = sudokuApp || angular.module('sudokuApp', ['ngRoute', 'ngSanitize']);

// Mute loggers
//var lang = Module("lang");
Logger.setAllTrace(false);
Logger.setAllDebug(false);

console && console.log("### appConfig.js: end");
