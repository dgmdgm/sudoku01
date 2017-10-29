console && console.log("### SanitizeFilter.js: begin");

//var sudokuApp = sudokuApp || angular.module('sudokuApp', []);

sudokuApp.filter('sanitize', function ($sce) {
    console.trace("SanitizeFilter: begin");

    console.trace("SanitizeFilter: end");
    return function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

  });

console && console.log("### SanitizeFilter.js: end");
