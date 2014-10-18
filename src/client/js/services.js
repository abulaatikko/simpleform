app.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl, successFn, errorFn){
        var data = new FormData();
        data.append('file', file);
        $http({
            url: uploadUrl,
            method: "POST",
            data: data,
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .then(
            function(res) {successFn(res);},
            function(res) {errorFn(res);}
        );
    };
}]);
