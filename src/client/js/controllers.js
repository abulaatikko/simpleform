app.controller('FormCtrl', function($scope, $http) {

    function init() {
        $scope.form = [];
        var form = $http.get('/form/1').then(function(data) {
            $scope.form = data.data;
        });
    }

    init();

});
