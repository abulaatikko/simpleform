app.controller('FormCtrl', function($scope, $http) {

    function init() {
        $scope.form = [];
        var form = $http.get('/form/1').then(function(data) {
            $scope.form = data.data;
        });
    }

    var brake = 0;
    function isChildShown(fieldId) {
        if (brake++ > 100) {
            return false;
        }
        var form = $scope.form;

        for (var k = 0; k < form.length; k++) {
            if (form[k].id != fieldId) {
                continue;
            }

            if (form[k].show) {
                return true;
            }

            if (typeof form[k].options !== "undefined" && form[k].options) {
                for (var j = 0; j < form[k].options.length; j++) {
                    if (typeof form[k].options[j].nextSteps !== "undefined" && form[k].options[j].nextSteps) {
                        for (var i = 0; i < form[k].options[j].nextSteps.length; i++) {
                            if (isChildShown(form[k].options[j].nextSteps[i])) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
       
        return false;
    }

    $scope.showNextSteps = function(field) {
$s = new Date().getTime();
        var options = field.options;

        // first find field's nextSteps
        var nextSteps = [];
        for (var i = 0; i < options.length; i++) {
            if (options[i].value == field.value) {
                if (typeof options[i].nextSteps !== "undefined") {
                    nextSteps = options[i].nextSteps;
                }
                k = options.length;
            }
        }

        for (var j = 0; j < $scope.form.length; j++) {
            if ($scope.form[j].id == field.id) {
                $scope.form[j].show = true;
            } else {
                $scope.form[j].show = false;
            }
            // show the nextStep fields
            for (i = 0; i < nextSteps.length; i++) {
                if ($scope.form[j].id == nextSteps[i]) {
                    $scope.form[j].show = true;
                }
            }
        }
        for (j = 0; j < $scope.form.length; j++) {
            if (isChildShown($scope.form[j].id)) {
                $scope.form[j].show = true;
            }
        }
        // empty values
        for (j = 0; j < $scope.form.length; j++) {
            if ($scope.form[j].show === false) {
                $scope.form[j].value = false;
            }
        }

$e = new Date().getTime();
console.log($e-$s + ' ms');
    };

    init();

});
