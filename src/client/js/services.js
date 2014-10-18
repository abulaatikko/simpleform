app.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(url, fields, file, success, error){
        var fd = new FormData();
        for (var i = 0; i < fields.length; i++) {
            for (var key in fields[i]) {
                fd.append(key, fields[i][key]);
            }
        }
        fd.append('file', file);

        $http({
            url: url,
            method: "POST",
            data: fd,
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .then(
            function(res) {success(res);},
            function(res) {error(res);}
        );
    };
}]);
