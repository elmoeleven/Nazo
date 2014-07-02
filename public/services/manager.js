angular.module('Nazo')
  .service('GameManager', ['$rootScope', '$timeout', '$location', 'Grid', 'Randoms', 'EventManager', 'Pathfinder',
    function ($rootScope, $timeout, $location, Grid, Randoms, EventManager, Pathfinder) {
    this.contentList = [
      'fa-ambulance',
      'fa-hand-o-down',
      'fa-automobile',
      'fa-cab',
      'fa-bitbucket-square',
      'fa-codepen',
      'fa-coffee',
      'fa-cog',
      'fa-cogs',
      'fa-file-text',
      'fa-file',
      'fa-pinterest-square',
      'fa-send',
      'fa-send-o',
      'fa-truck',
      'fa-twitter-square',
      'fa-user-md',
      'fa-user',
      'fa-university',
      'fa-tumblr-square',
      'fa-quote-right',
      'fa-quote-left',
      'fa-qq'
    ];

    var gm = this;

    this.levelup = function() {
      this.over = false;
      this.win = false;
      this.hintCount = 5;
      this.addTimeCount = 3;
      this.elapsed = 0;
      this.threshold = 0;

      $rootScope.addTimeCount = this.addTimeCount;
      $rootScope.hintCount = this.hintCount;
      $rootScope.over = this.over;
      $rootScope.victory = this.win;
      $rootScope.currentScore = this.currentScore;
    };

    this.reinit = function() {
      this.over = false;
      this.win = false;
      this.currentScore = 0;
      this.hintCount = 5;
      this.addTimeCount = 3;
      this.elapsed = 0;
      this.threshold = 0;

      $rootScope.addTimeCount = this.addTimeCount;
      $rootScope.hintCount = this.hintCount;
      $rootScope.over = this.over;
      $rootScope.victory = this.win;
      $rootScope.currentScore = this.currentScore;
    };
    this.reinit();

    this.createGamespace = function (gridSize, size, seed, lvlup) {
      Randoms.init({
        size: size,
        seed: seed
      });
      this.randoms = Randoms.create();

      Grid.init({
        size: gridSize,
        leeway: {
          x: gridSize.x - size.x,
          y: gridSize.y - size.y
        }
      });
      Grid.buildGrid(this.randoms, this.contentList);
      EventManager.init(size);
      Pathfinder.init({
        gridSize: gridSize,
        flat: Grid.getFlat(),
        edges: Grid.getEdges()
      });

      $rootScope.grid = Grid.getTangible();

      if (Pathfinder.availablePaths()) return true;
      else this.createGamespace(gridSize, size, seed, lvlup);
    };

    this.newGame = function(gridSize, size, seed, lvlup) {
      this.createGamespace(gridSize, size, seed, lvlup);

      if (lvlup) this.levelup();
      else this.reinit();

      this.resetTimer();
    };

    this.resetTimer = function() {
      $rootScope.$broadcast('timer-set-countdown', $rootScope.countdownValue);
      $rootScope.$broadcast('timer-start');
    };

    this.gameOver = function() {
      $rootScope.over = true;
      $rootScope.$apply();
    };

    this.victory = function() {
      self.win = true;
      $rootScope.victory = true;
      $rootScope.$broadcast('timer-stop');
    };

    this.addTime = function() {
      if (this.addTimeCount >= 1) {
        var a = this.elapsed > 10 ? 10 : this.elapsed;
        $rootScope.$broadcast('timer-add-cd-seconds', a);
        this.elapsed = 0;
      }
      return --this.addTimeCount;
    };

    this.punt = function(block) {
      EventManager.handler(block);
    };

    this.hint = function() {
      if (this.hintCount >= 1) {
        Pathfinder.availablePaths(true);
      }
      return --this.hintCount;
    };

    $rootScope.$on('timer-stopped', function() {
      if (!self.victory) gm.gameOver();
    });

    $rootScope.$on('score-update', function() {
      gm.currentScore += 50;
      gm.threshold += 50;
      if (gm.threshold === 200) {
        gm.addTimeCount++;
        gm.threshold = 0;
      }
      $rootScope.scoreUpdate = true;
      $timeout(function() {
          $rootScope.scoreUpdate = false;
        }, 300);
      $rootScope.currentScore = gm.currentScore;
    });

    $rootScope.$on('level-won', function() {
      gm.victory();
    });

    $rootScope.$on('timer-tick', function() {
      gm.elapsed++;
    });

  }]);