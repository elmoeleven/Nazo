angular.module('Nazo')
  .controller('MainCtrl', ['$scope', '$location', 'GameManager', function ($scope, $location, GameManager) {

    $scope.play = function () {
      $location.path('/play');
    };
  }]);