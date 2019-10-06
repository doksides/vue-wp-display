'use strict';

var LoWins = Vue.component('lowins', {
  template: '<!-- Low Winning Scores -->\n    <b-table responsive hover striped foot-clone :items="getLowScore(\'win\')" :fields="lowwins_fields" head-variant="dark">\n        <template slot="table-caption">\n            {{caption}}\n        </template>\n    </b-table>\n    ',
  props: ['caption', 'resultdata'],
  data: function data() {
    return {
      lowwins_fields: []
    };
  },
  beforeMount: function beforeMount() {
    this.lowwins_fields = [{ key: 'round', sortable: true }, { key: 'score', label: 'Winning Score', sortable: true }, { key: 'player', label: 'Winner', sortable: true }, { key: 'oppo_score', label: 'Losing Score' }, { key: 'oppo', label: 'Loser' }];
  },
  methods: {
    getLowScore: function getLowScore(result) {
      var data = _.clone(this.resultdata);
      return _.chain(data).map(function (r) {
        return _.chain(r).map(function (m) {
          return m;
        }).filter(function (n) {
          return n['result'] === result;
        }).minBy(function (w) {
          return w.score;
        }).value();
      }).sortBy('score').value();
    }
  }
});

var HiWins = Vue.component('hiwins', {
  template: '<!-- High Winning Scores -->\n    <b-table  responsive hover striped foot-clone :items="getHiScore(\'win\')" :fields="highwins_fields" head-variant="dark">\n        <template slot="table-caption">\n            {{caption}}\n        </template>\n    </b-table>',
  props: ['caption', 'resultdata'],
  data: function data() {
    return {
      highwins_fields: []
    };
  },
  beforeMount: function beforeMount() {
    this.highwins_fields = [{ key: 'round', sortable: true }, { key: 'score', label: 'Winning Score', sortable: true }, { key: 'player', label: 'Winner', sortable: true }, { key: 'oppo_score', label: 'Losing Score' }, { key: 'oppo', label: 'Loser' }];
  },
  methods: {
    getHiScore: function getHiScore(result) {
      var data = _.clone(this.resultdata);
      return _.chain(data).map(function (r) {
        return _.chain(r).map(function (m) {
          return m;
        }).filter(function (n) {
          return n['result'] === result;
        }).maxBy(function (w) {
          return w.score;
        }).value();
      }).sortBy('score').value().reverse();
    }
  }
});

var HiLoss = Vue.component('hiloss', {
  template: '\n    <!-- High Losing Scores -->\n   <b-table  responsive hover striped foot-clone :items="getHiScore(\'loss\')" :fields="hiloss_fields" head-variant="dark">\n        <template slot="table-caption">\n            {{caption}}\n        </template>\n    </b-table>\n',
  props: ['caption', 'resultdata'],
  data: function data() {
    return {
      hiloss_fields: []
    };
  },
  beforeMount: function beforeMount() {
    this.hiloss_fields = [{ key: 'round', sortable: true }, { key: 'score', label: 'Losing Score', sortable: true }, { key: 'player', label: 'Loser', sortable: true }, { key: 'oppo_score', label: 'Winning Score' }, { key: 'oppo', label: 'Winner' }];
  },
  methods: {
    getHiScore: function getHiScore(result) {
      var data = _.clone(this.resultdata);
      return _.chain(data).map(function (r) {
        return _.chain(r).map(function (m) {
          return m;
        }).filter(function (n) {
          return n['result'] === result;
        }).max(function (w) {
          return w.score;
        }).value();
      }).sortBy('score').value().reverse();
    }
  }
});

var ComboScores = Vue.component('comboscores', {
  template: '\n  <b-table  responsive hover striped foot-clone :items="hicombo()" :fields="hicombo_fields" head-variant="dark">\n    <template slot="table-caption">\n        {{caption}}\n    </template>\n  </b-table>\n',
  props: ['caption', 'resultdata'],
  data: function data() {
    return {
      hicombo_fields: []
    };
  },
  beforeMount: function beforeMount() {
    this.hicombo_fields = [{ key: 'round', sortable: true }, {
      key: 'combo_score',
      label: 'Combined Score',
      sortable: true,
      class: 'text-center'
    }, {
      key: 'score',
      label: 'Winning Score',
      class: 'text-center',
      sortable: true
    }, {
      key: 'oppo_score',
      label: 'Losing Score',
      class: 'text-center',
      sortable: true
    }, { key: 'player', label: 'Winner', class: 'text-center' }, { key: 'oppo', label: 'Loser', class: 'text-center' }];
  },
  methods: {
    hicombo: function hicombo() {
      var data = _.clone(this.resultdata);
      return _.chain(data).map(function (r) {
        return _.chain(r).map(function (m) {
          return m;
        }).filter(function (n) {
          return n['result'] === 'win';
        }).maxBy(function (w) {
          return w.combo_score;
        }).value();
      }).sortBy('combo_score').value().reverse();
    }
  }
});

var TotalScores = Vue.component('totalscores', {
  template: '\n    <b-table   responsive hover striped foot-clone :items="stats" :fields="totalscore_fields" head-variant="dark">\n        <template slot="table-caption">\n            {{caption}}\n        </template>\n        <template slot="index" slot-scope="data">\n            {{data.index + 1}}\n        </template>\n    </b-table>\n',
  props: ['caption', 'stats'],
  data: function data() {
    return {
      totalscore_fields: []
    };
  },
  beforeMount: function beforeMount() {
    this.totalscore_fields = ['index', { key: 'position', sortable: true }, {
      key: 'total_score',
      label: 'Total Score',
      class: 'text-center',
      sortable: true
    }, { key: 'player', label: 'Player', class: 'text-center' }, {
      key: 'wonLost',
      label: 'Won-Lost',
      sortable: false,
      class: 'text-center',
      formatter: function formatter(value, key, item) {
        var loss = item.round - item.points;
        return item.points + ' - ' + loss;
      }
    }, {
      key: 'margin',
      label: 'Spread',
      class: 'text-center',
      formatter: function formatter(value) {
        if (value > 0) {
          return '+' + value;
        }
        return '' + value;
      }
    }];
  }
});

var TotalOppScores = Vue.component('oppscores', {
  template: '\n    <b-table   responsive hover striped foot-clone :items="stats" :fields="totaloppscore_fields" head-variant="dark">\n            <template slot="table-caption">\n                {{caption}}\n            </template>\n            <template slot="index" slot-scope="data">\n                {{data.index + 1}}\n            </template>\n    </b-table>\n',
  props: ['caption', 'stats'],
  data: function data() {
    return {
      totaloppscore_fields: []
    };
  },
  beforeMount: function beforeMount() {
    this.totaloppscore_fields = ['index', { key: 'position', sortable: true }, {
      key: 'total_oppscore',
      label: 'Total Opponent Score',
      class: 'text-center',
      sortable: true
    }, { key: 'player', label: 'Player', class: 'text-center' }, {
      key: 'wonLost',
      label: 'Won-Lost',
      sortable: false,
      class: 'text-center',
      formatter: function formatter(value, key, item) {
        var loss = item.round - item.points;
        return item.points + ' - ' + loss;
      }
    }, {
      key: 'margin',
      label: 'Spread',
      class: 'text-center',
      formatter: function formatter(value) {
        if (value > 0) {
          return '+' + value;
        }
        return '' + value;
      }
    }];
  }
});

var AveScores = Vue.component('avescores', {
  template: '\n    <b-table  responsive hover striped foot-clone :items="stats" :fields="avescore_fields" head-variant="dark">\n        <template slot="table-caption">\n            {{caption}}\n        </template>\n        <template slot="index" slot-scope="data">\n            {{data.index + 1}}\n        </template>\n    </b-table>\n',
  props: ['caption', 'stats'],
  data: function data() {
    return {
      avescore_fields: []
    };
  },
  beforeMount: function beforeMount() {
    this.avescore_fields = ['index', { key: 'position', sortable: true }, {
      key: 'ave_score',
      label: 'Average Score',
      class: 'text-center',
      sortable: true
    }, { key: 'player', label: 'Player', class: 'text-center' }, {
      key: 'wonLost',
      label: 'Won-Lost',
      sortable: false,
      class: 'text-center',
      formatter: function formatter(value, key, item) {
        var loss = item.round - item.points;
        return item.points + ' - ' + loss;
      }
    }, {
      key: 'margin',
      label: 'Spread',
      class: 'text-center',
      formatter: function formatter(value) {
        if (value > 0) {
          return '+' + value;
        }
        return '' + value;
      }
    }];
  }
});
var AveOppScores = Vue.component('aveoppscores', {
  template: '\n    <b-table  hover responsive striped foot-clone :items="stats" :fields="aveoppscore_fields" head-variant="dark">\n        <template slot="table-caption">\n            {{caption}}\n        </template>\n        <template slot="index" slot-scope="data">\n            {{data.index + 1}}\n        </template>\n    </b-table>\n',
  props: ['caption', 'stats'],
  data: function data() {
    return {
      aveoppscore_fields: []
    };
  },
  beforeMount: function beforeMount() {
    this.aveoppscore_fields = ['index', { key: 'position', sortable: true }, {
      key: 'ave_opp_score',
      label: 'Average Opponent Score',
      class: 'text-center',
      sortable: true
    }, { key: 'player', label: 'Player', class: 'text-center' }, {
      key: 'wonLost',
      label: 'Won-Lost',
      sortable: false,
      class: 'text-center',
      formatter: function formatter(value, key, item) {
        var loss = item.round - item.points;
        return item.points + ' - ' + loss;
      }
    }, {
      key: 'margin',
      label: 'Spread',
      class: 'text-center',
      formatter: function formatter(value) {
        if (value > 0) {
          return '+' + value;
        }
        return '' + value;
      }
    }];
  }
});

var LoSpread = Vue.component('lospread', {
  template: '\n    <b-table  responsive hover striped foot-clone :items="loSpread()" :fields="lospread_fields" head-variant="dark">\n        <template slot="table-caption">\n            {{caption}}\n        </template>\n    </b-table>\n',
  props: ['caption', 'resultdata'],
  data: function data() {
    return {
      lospread_fields: []
    };
  },
  beforeMount: function beforeMount() {
    this.lospread_fields = ['round', { key: 'diff', label: 'Spread', sortable: true }, { key: 'score', label: 'Winning Score', sortable: true }, { key: 'oppo_score', label: 'Losing Score', sortable: true }, { key: 'player', label: 'Winner', sortable: true }, { key: 'oppo', label: 'Loser', sortable: true }];
  },
  methods: {
    loSpread: function loSpread() {
      var data = _.clone(this.resultdata);
      return _.chain(data).map(function (r) {
        return _.chain(r).map(function (m) {
          return m;
        }).filter(function (n) {
          return n['result'] === 'win';
        }).minBy(function (w) {
          return w.diff;
        }).value();
      }).sortBy('diff').value();
    }
  }
});

var HiSpread = Vue.component('hispread', {
  template: '\n    <b-table  responsive hover striped foot-clone :items="hiSpread()" :fields="hispread_fields" head-variant="dark">\n        <template slot="table-caption">\n            {{caption}}\n        </template>\n    </b-table>\n    ',
  props: ['caption', 'resultdata'],
  data: function data() {
    return {
      hispread_fields: []
    };
  },
  beforeMount: function beforeMount() {
    this.hispread_fields = ['round', { key: 'diff', label: 'Spread', sortable: true }, { key: 'score', label: 'Winning Score', sortable: true }, { key: 'oppo_score', label: 'Losing Score', sortable: true }, { key: 'player', label: 'Winner', sortable: true }, { key: 'oppo', label: 'Loser', sortable: true }];
  },
  methods: {
    hiSpread: function hiSpread() {
      var data = _.clone(this.resultdata);
      return _.chain(data).map(function (r) {
        return _.chain(r).map(function (m) {
          return m;
        }).filter(function (n) {
          return n['result'] === 'win';
        }).max(function (w) {
          return w.diff;
        }).value();
      }).sortBy('diff').value().reverse();
    }
  }
});