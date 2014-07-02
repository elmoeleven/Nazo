angular.module('Nazo')
  .factory('Block', ['$timeout', function ($timeout) {
    var Block = function(pos) {
      this.position = { x: pos.x, y: pos.y};
      this.empty = false;
      this.edge = false;
      this.selected = false;
      this.follow = false;
      this.content = null;
      this.hint = false;
    };

    Block.prototype = {
      setEmpty: function() {
        this.empty = true;
      },
      emptyBlock: function() {
        this.setEmpty();
        this.emptyContent();
        this.setFollow();
      },
      setPos: function(pos) {
        this.position = { x: pos.x, y: pos.y};
      },
      isEmpty: function() {
        return this.empty;
      },
      emptyContent: function() {
        this.content = null;
      },
      makeEdge: function() {
        this.edge = true;
      },
      setFollow: function() {
        var self = this;
        self.follow = true;
        $timeout(function() {
          self.follow = false;
        }, 300);
      },
      setHint: function() {
        var self = this;
        self.hint = true;
        $timeout(function() {
          self.hint = false;
        }, 500);
      },
      setContent: function(cnt) {
        this.content = cnt;
      },
      toggleSelected: function() {
        if (this.selected) {
          this.selected = false;
        } else {
          this.selected = true;
        }
      },
      getContent: function() {
        return this.content;
      },
      getPos: function() {
        return this.position;
      }
    };

    return Block;
  }])
  .service('Grid', ['Block', function (Block) {

    this.init = function(o) {
      this.grid = {};
      this.grid.rows = [];
      this.edges = {};
      this.flat = {};
      this.size = o.size;
      this.leeway = o.leeway;
    };

    this.buildGrid = function(rl, cl) {
      var lbx = this.leeway.x / 2;
      var ubx = this.size.x - lbx;
      var lby = this.leeway.y / 2;
      var uby = this.size.y - lby;
      var count = 0;

      for(var i = 0; i < this.size.x; i++) {
        var row = {};
        row.spots = [];

        for(var j = 0; j < this.size.y; j++) {
          var block = new Block({ x: i, y: j});

          if (i < lbx || j < lby || i >= ubx || j >= uby) {
            block.setEmpty();
          }
          else {
            var key = i + ',' + j;
            if (
              i === lbx ||
              i === ubx-1 ||
              j === lby ||
              j === uby-1
            ) {
              block.makeEdge();
              this.edges[key] = block;
            }

            this.flat[key] = block;
            block.setContent(cl[rl[count]]);
            count++;
          }
          row.spots.push(block);
        }
        this.grid.rows.push(row);
      }
    };

    // this.refactor = function() {
    // };

    this.getTangible = function () {
      return this.grid;
    };
    this.getEdges = function() {
      return this.edges;
    };
    this.getFlat = function() {
      return this.flat;
    };

  }]);
