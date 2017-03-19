var app = angular.module('randomUsers', ['ngAnimate', 'googlechart', 'ngSanitize', 'ui.bootstrap']);

app.factory('dataService', function($http, $q){
    var _genders = {};
    return{

        getUsersData: function(){

            var deferred = $q.defer();
            var numberOfUsers = 21;
            var options = {
                method: 'GET',
                url: 'https://randomuser.me/api/?results='+numberOfUsers

            };
            var callback = function (response) {
                deferred.resolve(response.data);
            };
            var errorCallBack = function (response) {
                deferred.reject(response);
            };
            $http(options).then(callback, errorCallBack);
            return deferred.promise;
        },

        getChartObject: function (users) {

            var myChartObject = {};
            var male = [
                {v: "male"},
                {v: users.male}
            ];
            var female = [
                {v: "female"},
                {v: users.female}
            ];
            myChartObject.type = "PieChart";
            myChartObject.data = {"cols": [
                {id: "t", label: "Topping", type: "string"},
                {id: "s", label: "Slices", type: "number"}
            ], "rows": [
                {c: male},
                {c: female}
            ]};

            myChartObject.options = {
                'title': 'Gender'
            };
            return myChartObject

        },

        setGenders: function (users) {
            var usersGender = {
                male: 0,
                female: 0
            };
            for (var i = 0; i<users.length; i++) {
                if (users[i].gender == "male") {
                    usersGender.male++;
                } else {
                    usersGender.female++;
                }
            }
            return _genders = usersGender;
        },

        getGenders: function () {
            return _genders;
        }

    }
});

app.controller('usersAccordionCtrl', function ($uibModal, $scope, dataService) {
    
    $scope.oneAtATime = true;
    $scope.status = {
        isCustomHeaderOpen: false,
        isFirstOpen: true,
        isFirstDisabled: false,
        open: false
    };
    $scope.promiseObj = dataService.getUsersData();

    $scope.promiseObj.then(function(value) {
        $scope.results = value;
        $scope.users = $scope.results.results;
        $scope.userLength = $scope.users.length;
        $scope.status = {
            isCustomHeaderOpen: new Array($scope.userLength)
        };
        for (var i = 0; i < $scope.userLength; i++) {
            $scope.status.isCustomHeaderOpen[i] = false;
        }
        dataService.setGenders($scope.users)
    });
    
    $scope.toggleAllItems = function(index){

        for (var i = 0; i < $scope.userLength; i++) {
            if (i == index) continue;
            $scope.status.isCustomHeaderOpen[i] = false;
        }
        $scope.status.isCustomHeaderOpen[index] = !$scope.status.isCustomHeaderOpen[index];
    };

    //creating modal window
    $scope.animationsEnabled = true;

    $scope.open = function (size) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'views/modalView.html',
            controller: 'ModalInstanceCtrl',
            size: size
        });
        modalInstance.result.then(function () {});
    };

    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };

});

app.controller("GenericChartCtrl", function ($scope, dataService) {

    $scope.userGenders = dataService.getGenders();
    $scope.myChartObject = dataService.getChartObject($scope.userGenders);

});

app.controller('ModalInstanceCtrl', function ($uibModalInstance, $scope) {
    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.close();
    };
});




