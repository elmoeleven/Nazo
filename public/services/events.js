angular.module('Nazo')
  .service('EventManager', ['$location', '$rootScope', 'Pathfinder', function ($location, $rootScope, Pathfinder) {
    this.init = function(sz) {
      this.count = 0;
      this.eliminated = 0;
      this.b1 = null;
      this.b2 = null;
      this.size = sz.x * sz.y;
    };

    this.handler = function(b) {
      var self = this;
      if (self.count === 0) {
        self.b1 = b;
        self.count++;
      } else {
        self.b2 = b;
        self.count++;
      }

      if (self.count === 2) {
        if (
          (this.b1 !== this.b2) &&
          (this.b1.getContent() !== null) &&
          (this.b2.getContent() !== null) &&
          (this.b1.getContent() === this.b2.getContent())
        ) {
          if (Pathfinder.adjacent(this.b1,this.b2)) {
            Pathfinder.updates(this.b1.getPos(), this.b2.getPos());
            this.b1.emptyBlock();
            this.b2.emptyBlock();
            self.updateScore();
            self.eliminated += 2;
          } else {
            if (
              (Pathfinder.lateral(this.b1, this.b2)) ||
              (Pathfinder.corner(this.b1, this.b2)) ||
              (Pathfinder.combination(this.b1, this.b2))
            ) {
              Pathfinder.follower();
              Pathfinder.updates(this.b1.getPos(), this.b2.getPos());
              this.b1.emptyBlock();
              this.b2.emptyBlock();
              self.updateScore();
              self.eliminated += 2;
            }
          }
        }
        self.reset();

        if (self.eliminated === self.size) {
          $rootScope.$emit('level-won');
        }
      }
    };

    this.updateScore = function() {
      $rootScope.$emit('score-update');
    };

    this.reset = function() {
      this.count = 0;
      this.b1.toggleSelected();
      this.b2.toggleSelected();
      this.b1 = null;
      this.b2 = null;
      $rootScope.$emit('refactor-check');
    };
  }]);