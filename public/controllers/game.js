angular.module('Nazo')
  .controller('GameCtrl', ['$scope', '$location', 'GameManager',
    function ($scope, $location, GameManager) {
    var self = this;
    $scope.countdownValue = 60;
    $scope.updateGrid = false;

    this.levels = [
      { x: 6, y: 6 },
      { x: 6, y: 8 },
      { x: 8, y: 8 },
      { x: 8, y: 10 },
      { x: 10, y: 10 }
    ];

    this.level = 0;
    this.grid_sz = {x: 10, y: 10};
    this.game_sz = this.levels[this.level];
    this.game_sd = 21;

    gm = GameManager;

    this.newGame = function() {
      gm.newGame(
        this.grid_sz,
        this.game_sz,
        this.game_sd
      );
    };

    $scope.retry = function() {
      gm.newGame(
        self.grid_sz,
        self.game_sz,
        self.game_sd
      );
    };

    $scope.nextLevel = function() {
      self.level++;
      if (self.level >= 4) self.level = 4;
      self.game_sz = self.levels[self.level];
      gm.newGame(
        self.grid_sz,
        self.game_sz,
        self.game_sd,
        true
      );
    };

    $scope.addTime = function() {
      this.addTimeCount = gm.addTime();
    };

    $scope.handleClick = function() {
      if (this.block.isEmpty()) return;
      this.block.toggleSelected();
      this.scoreUpdate = false;
      gm.punt(this.block);
    };

    $scope.hint = function() {
      this.hintCount = gm.hint();
    };

    $scope.quit = function() {
      $location.path('/');
    };

    this.newGame();

  }]);