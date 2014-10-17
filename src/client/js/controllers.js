app.controller('FormCtrl', function($scope, $http) {

    function init() {
        $scope.form = [];
        $http.get('/form/1').then(function(data) {
            $scope.form = data.data;
        });
    }

    function isChildShown(fieldId, maxIterations) {
        if (maxIterations-- < 0) {
            return false;
        }
        var form = $scope.form;
        var i, j, k = 0;

        for (k = 0; k < form.length; k++) {
            if (form[k].id != fieldId) {
                continue;
            }

            if (form[k].show) {
                return true;
            }

            if (typeof form[k].options !== "undefined" && form[k].options) {
                for (j = 0; j < form[k].options.length; j++) {
                    if (typeof form[k].options[j].nextSteps !== "undefined" && form[k].options[j].nextSteps) {
                        for (i = 0; i < form[k].options[j].nextSteps.length; i++) {
                            if (isChildShown(form[k].options[j].nextSteps[i], maxIterations)) {
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
        var options = field.options;

        var i, j, k = 0;

        // first find field's nextSteps
        var nextSteps = [];
        for (i = 0; i < options.length; i++) {
            if (options[i].value == field.value) {
                if (typeof options[i].nextSteps !== "undefined") {
                    nextSteps = options[i].nextSteps;
                }
                i = options.length;
            }
        }

        // show the field itself and the nextStep fields but hide the rest
        for (j = 0; j < $scope.form.length; j++) {
            if ($scope.form[j].id == field.id) {
                $scope.form[j].show = true;
            } else {
                $scope.form[j].show = false;
                // show the nextStep fields
                for (i = 0; i < nextSteps.length; i++) {
                    if ($scope.form[j].id == nextSteps[i]) {
                        $scope.form[j].show = true;
                    }
                }
            }
        }
        // show all the fields whose child in nextStep tree is shown
        for (j = 0; j < $scope.form.length; j++) {
            var maxIterations = 100;
            if (isChildShown($scope.form[j].id, maxIterations)) {
                $scope.form[j].show = true;
            }
        }
        // empty values
        for (j = 0; j < $scope.form.length; j++) {
            if ($scope.form[j].show === false) {
                if (typeof $scope.form[j].value !== 'undefined') {
                    $scope.form[j].value = '';
                }
            }
        }
    };

    init();

});
