app.controller('FormCtrl', function($scope, $http) {

    function init() {
        $scope.form = [];
        var form = $http.get('/form/1').then(function(data) {
            $scope.form = data.data;
        });
    }

    $scope.showNextSteps = function(options, value) {
        // first find nextSteps
        var nextSteps = [];
        for (var k = 0; k < options.length; k++) {
            if (options[k].value == value) {
                if (typeof options[k].nextSteps !== "undefined") {
                    nextSteps = options[k].nextSteps;
                }
                k = options.length;
            }
        }

        // todo: hide elements

        // show the field
        for (var i = 0; i < nextSteps.length; i++) {
            for (var j = 0; j < $scope.form.length; j++) {
                if ($scope.form[j].id == nextSteps[i]) {
                    $scope.form[j].show = true;
                }
            }
        }
    };

    init();

});
