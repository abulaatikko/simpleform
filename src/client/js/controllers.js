app.controller('FormCtrl', ['$scope', '$http', 'fileUpload', function($scope, $http, fileUpload) {

    function init() {
        $scope.form = [];
        $http.get('/form/1').then(function(data) {
            $scope.form = data.data;
        });
    }

    $scope.description = '';
    $scope.image = null;
    $scope.name = '';
    $scope.fileUploading = false;
    $scope.submit = function() {
        $scope.fileUploading = true;

        var fields = [];
        fields.push({description: $scope.description});
        fields.push({name: $scope.name});
    
        for (var i = 0; i < $scope.form.length; i++) {
            if (typeof $scope.form[i].value !== 'undefined' && $scope.form[i].value !== '') {
                var obj = {};
                obj[$scope.form[i].name] = $scope.form[i].value;
                fields.push(obj);
            }
        }
        
        var file = $scope.image ? $scope.image : null;

        fileUpload.uploadFileToUrl('/answer', fields, file, function(response) {
            $scope.fileUploading = false;
        }, function(response) {
            console.log('error', response);
        });
    };

    $scope.showNextSteps = function(field) {
        var options = field.options;

        var i, j, k = 0;

        // first find field's nextFields
        var nextFields = [];
        for (i = 0; i < options.length; i++) {
            if (options[i].value == field.value) {
                if (typeof options[i].nextFields !== "undefined") {
                    nextFields = options[i].nextFields;
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
                for (i = 0; i < nextFields.length; i++) {
                    if ($scope.form[j].id == nextFields[i]) {
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
                    if (typeof form[k].options[j].nextFields !== "undefined" && form[k].options[j].nextFields) {
                        for (i = 0; i < form[k].options[j].nextFields.length; i++) {
                            if (isChildShown(form[k].options[j].nextFields[i], maxIterations)) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
       
        return false;
    }

    init();

}]);
