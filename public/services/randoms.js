angular.module('Nazo')
  .service('Randoms', [function () {
    this.init = function(o) {
      this.list = [];
      this.size = o.size.x * o.size.y / 2;
      this.seed = o.seed;
    };

    this.create = function() {
      for (var i = 0; i < this.size; i++) {
        var n = Math.floor(Math.random() * this.seed * 10000) % (this.seed + 1);
        this.list.push(n);
        this.list.push(n);
      }

      this.messify();

      return this.list;
    };

    this.messify = function() {
      for (var j = 0; j < this.list.length; j++) {
        var n = Math.floor(Math.random() * this.size * 10000) % (this.size * 2);
        var t = this.list[j];
        this.list[j] = this.list[n];
        this.list[n] = t;
      }
    };
  }]);