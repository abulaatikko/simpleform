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
console.log('FIELDID:' + fieldId);

            if (typeof form[k].options !== "undefined" && form[k].options) {
                for (var j = 0; j < form[k].options.length; j++) {
                    if (typeof form[k].options[j].nextSteps !== "undefined" && form[k].options[j].nextSteps) {
//console.log(form[k].options[j].nextSteps);
                        for (var i = 0; i < form[k].options[j].nextSteps.length; i++) {
console.log('HUM: ' + form[k].options[j].nextSteps[i]);
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

    $scope.showNextSteps = function(field, value) {
$s = new Date().getTime();
        var options = field.options;

        // first find field's nextSteps
        var nextSteps = [];
        for (var i = 0; i < options.length; i++) {
            if (options[i].value == value) {
                if (typeof options[i].nextSteps !== "undefined") {
                    nextSteps = options[i].nextSteps;
                }
                k = options.length;
            }
        }

        // hide all fields except the field itself
        for (i = 0; i < $scope.form.length; i++) {
            if ($scope.form[i].id == field.id) {
                $scope.form[i].show = true;
            } else {
                $scope.form[i].show = false;
            }
        }

        // show the nextStep fields
        for (i = 0; i < nextSteps.length; i++) {
            for (var j = 0; j < $scope.form.length; j++) {
                if ($scope.form[j].id == nextSteps[i]) {
                    $scope.form[j].show = true;
                }
            }
        }
        

        // show all the parent fields of the shown fields
        for (i = 0; i < $scope.form.length; i++) {
            if (isChildShown($scope.form[i].id)) {
                $scope.form[i].show = true;
            }
        }
console.log($scope.form);
        
$e = new Date().getTime();
console.log($e-$s + ' ms');
    };

    init();

});
