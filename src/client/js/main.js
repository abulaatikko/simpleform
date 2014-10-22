var app = angular.module('simpleform', ['ui.router']);

app.config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('front', {
        url: "",
        templateUrl: "partials/form.html",
        controller: 'FormController'
    });
}]);
