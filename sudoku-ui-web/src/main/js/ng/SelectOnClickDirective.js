console && console.log("### SelectOnClickDirective.js: begin");

// Copied from http://stackoverflow.com/questions/14995884/select-text-on-input-focus

//var sudokuApp = sudokuApp || angular.module('sudokuApp', []);

sudokuApp.directive('selectOnClick', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function () {
                if (!$window.getSelection().toString()) {
                    // Required for mobile Safari
                    this.setSelectionRange(0, this.value.length)
                }
            });
        }
    };
}]);


console && console.log("### SelectOnClickDirective.js: end");
