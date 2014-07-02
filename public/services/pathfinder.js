angular.module('Nazo')
  .service('Pathfinder', ['$rootScope', function ($rootScope) {

    this.init = function(o) {
      this.follow = [];
      this.flat = o.flat;
      this.edges = o.edges;
      this.gridSize = o.gridSize;
    };

    this.update = function(o) {
      this.flat = o.flat;
      this.edges = o.edges;
    };

    this.follower = function() {
      var self = this;
      for (var i = 0; i < this.follow.length; i++) {
        this.follow[i].setFollow();
      }
      this.follow = [];
    };

    this.updates = function(a, b) {
      var self = this;
      var k = a.x + ',' + a.y;
      var j = b.x + ',' + b.y;
      self.flat[k] = null;
      self.flat[j] = null;
      self.edges[k] = null;
      self.edges[j] = null;
    };

    this.cascade = function(a,b) {
      var self = this;

      if (
        (a !== null) && (b !== null) &&
        (a.getContent() === b.getContent()) &&
        (self.adjacent(a,b) ||
        self.lateral (a,b)  ||
        self.corner(a,b)    ||
        self.combination(a,b))
      ) {
        return true;
      }
      return false;
    };

    this.availablePaths = function(hint) {
      var self = this;
      var hash = $rootScope.grid;

      for (var i in self.edges) {
        var a = self.edges[i];
        for (var j in self.edges.length) {
          var b = self.edges[j];
          if (self.cascade(a,b)) {
            var _a = a.getPos();
            var _b = b.getPos();
            if (hint) {
              hash.rows[_a.x].spots[_a.y].setHint();
              hash.rows[_b.x].spots[_b.y].setHint();
            }
            return true;
          }
        }
      }


      for (var k in self.flat) {
        var c = self.flat[k];
        for (var h in self.flat) {
          var d = self.flat[h];
          if (self.cascade(c,d)) {
            var _c = c.getPos();
            var _d = d.getPos();
            if (hint) {
              hash.rows[_c.x].spots[_c.y].setHint();
              hash.rows[_d.x].spots[_d.y].setHint();
            }
            return true;
          }
        }
      }

      return false;
    };

    this.adjacent = function(b1, b2) {
      var s = b1.getPos();
      var p = b2.getPos();

      return (
        ((Math.abs(p.x-s.x) === 1) && p.y === s.y) ||
        ((Math.abs(p.y-s.y) === 1) && p.x === s.x)
      );
    };

    this.lateral = function(b1, b2) {
      var self = this;
      var s = b1.getPos();
      var p = b2.getPos();
      var hash = $rootScope.grid;
      var a = false;
      var b = false;

      if (self.adjacent(b1,b2)) return true;

      if (s.x === p.x) {
        var i = s.y < p.y ? s.y : p.y;
        i = i + 1;
        var i_b = s.y > p.y ? s.y : p.y;
        var i_a = true;

        for (i; i < i_b; i++) {
          var _x = hash.rows[p.x].spots[i];
          if (_x.isEmpty()) {
            a = true;
            this.follow.push(_x);
            continue;
          } else {
            a = false;
            this.follow = [];
            return a;
          }
        }
      }

      if (s.y === p.y) {
        var j = s.x < p.x ? s.x : p.x;
        j = j + 1;
        var j_b = s.x > p.x ? s.x : p.x;
        var j_a = true;
        for (j; j < j_b; j++) {
          var _y = hash.rows[j].spots[p.y];
          if (_y.isEmpty()) {
            b = true;
            this.follow.push(_y);
            continue;
          } else {
            b = false;
            this.follow = [];
            return b;
          }
        }
      }

      return a || b;
    };

    this.corner = function(b1, b2) {
      var self = this;
      var hash = $rootScope.grid;
      var s = b1.getPos();
      var p = b2.getPos();

      if (s !== p) {
        var c1 = hash.rows[s.x].spots[p.y];
        var c2 = hash.rows[p.x].spots[s.y];

        if ((self.lateral(b1, c1)) &&
          (self.lateral(c1, b2)) &&
          c1.isEmpty()) {
          this.follow.push(c1);
          return true;
        } else {
          if (self.lateral(b1, c2) &&
            (self.lateral(c2, b2)) &&
            c2.isEmpty()) {
            this.follow.push(c2);
            return true;
          }
        }
      }

      return false;
    };

    this.combination = function(b1, b2) {
      var self = this;
      var hash = $rootScope.grid;
      var s = b1.getPos();
      var p = b2.getPos();

      if (s !== p) {

        for (var i = s.x + 1; i < self.gridSize.x; i++) {
          var _a = hash.rows[i].spots[s.y];
          if (!_a.isEmpty()) {
            this.follow = [];
            break;
          } else {
            if (
              (self.lateral(_a,b2) ||
              self.corner(_a,b2)) &&
              (_a.isEmpty())
            ) {
              this.follow.push(_a);
              return true;
            }
          }
        }


        for (var j = s.x - 1; j >= 0; j--) {
          var _b = hash.rows[j].spots[s.y];
          if (!_b.isEmpty()) {
            this.follow = [];
            break;
          } else {
            if (
              (self.lateral(_b,b2) ||
              self.corner(_b,b2)) &&
              (_b.isEmpty())
            ) {
              this.follow.push(_b);
              return true;
            }
          }
        }


        for (var k = s.y - 1; k >= 0; k--) {
          var _c = hash.rows[s.x].spots[k];
          if (!_c.isEmpty()) {
            this.follow = [];
            break;
          } else {
            if (
              (self.lateral(_c,b2) ||
              self.corner(_c,b2)) &&
              (_c.isEmpty())
            ) {
              this.follow.push(_c);
              return true;
            }
          }
        }


        for (var l = s.y + 1; l < self.gridSize.y; l++) {
          var _d = hash.rows[s.x].spots[l];
          if (!_d.isEmpty()) {
            this.follow = [];
            break;
          } else {
            if (
              (self.lateral(_d,b2) ||
              self.corner(_d,b2)) &&
              (_d.isEmpty())
            ) {
              this.follow.push(_d);
              return true;
            }
          }
        }
      }

      return false;
    };
  }]);