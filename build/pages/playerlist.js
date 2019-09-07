'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// let mapGetters = Vuex.mapGetters;

var PlayerStats = Vue.component('playerstats', {
  template: '\n   <div class="col-lg-6 offset-lg-3 justify-content-center ">\n   <div class="row">\n    <div class="col animated fadeInLeft">\n      <div class="d-flex flex-row align-items-center justify-content-center">\n        <div class="flex-fill">\n            <h3 class="text-center bebas">{{playerName}}\n            <span class="d-inline-block flag-icon" :title="player.country_full"                 :class="\'flag-icon-\'+player.country | lowercase"></span>\n            <i class="fa d-inline-block" v-bind:class="{\'fa-male\': player.gender === \'m\',\'fa-female\': player.gender === \'f\' ,\n    \'fa-users\': player.is_team == \'yes\' }" aria-hidden="true"></i></h3>\n        </div>\n        <div>\n              <img width="100px" height="100px" class="rounded img-thumbnail img-fluid mx-auto d-block shadow-sm" :src="player.photo" />\n        </div>\n        <div class="qstats flex-fill">\n            <h4>{{pstats.pPosition}}</h4>\n        </div>\n      </div>\n      <div class="d-flex align-items-center justify-content-center">\n              <b-btn v-b-toggle.collapse1 class="m-3">Quick Stats</b-btn>\n              <b-btn v-b-toggle.collapse2 class="m-3">Round by Round </b-btn>\n              <b-btn v-b-toggle.collapse3 class="m-3">Charts</b-btn>\n              <button type="button" title="Close stats" class="btn btn-danger" @click="closeCard()"><i class="fas fa-times"></i></button>\n      </div>\n    </div>\n    </div>\n    <div class="row">\n    <div class="col">\n        <b-collapse id="collapse1">\n          <b-card class="animated flipInX">\n          <div class="card-header text-center">Quick Stats -{{playerName}}</div>\n              <ul class="list-group list-group-flush stats">\n                  <li class="list-group-item">Points:\n                      <span>{{pstats.pPoints}} / {{total_rounds}}</span>\n                  </li>\n                  <li class="list-group-item">Current rank:\n                      <span>{{pstats.pRank}} </span>\n                  </li>\n                  <li class="list-group-item">Highest Score:\n                      <span>{{pstats.pHiScore}}</span> in round <em>{{pstats.pHiScoreRounds}}</em>\n                  </li>\n                  <li class="list-group-item">Lowest Score:\n                      <span>{{pstats.pLoScore}}</span> in round <em>{{pstats.pLoScoreRounds}}</em>\n                  </li>\n                  <li class="list-group-item">Ave Score:\n                      <span>{{pstats.pAve}}</span>\n                  </li>\n                  <li class="list-group-item">Ave Opp Score:\n                      <span>{{pstats.pAveOpp}}</span>\n                  </li>\n              </ul>\n            </b-card>\n      </b-collapse>\n    <!---- Round By Round Results -->\n      <b-collapse id="collapse2">\n          <b-card class="animated fadeInUp">\n            <h4>Round By Round Summary </h4>\n            <ul class="list-group list-group-flush" v-for="(report, i) in pstats.pRbyR" :key="i">\n                <li v-html="report.report" v-if="report.result==\'win\'" class="list-group-item list-group-item-success">{{report.report}}</li>\n                <li v-html="report.report" v-else-if="report.result ==\'draw\'" class="list-group-item list-group-item-warning">{{report.report}}</li>\n                <li v-html="report.report" v-else-if="report.result ==\'loss\'" class="list-group-item list-group-item-danger">{{report.report}}</li>\n                <li v-html="report.report" v-else-if="report.result ==\'AR\'" class="list-group-item list-group-item-info">{{report.report}}</li>\n                <li v-html="report.report" v-else class="list-group-item list-group-item-light">{{report.report}}</li>\n              </ul>\n          </b-card>\n        </b-collapse>\n        <!-- Charts -->\n        <b-collapse id="collapse3">\n          <b-card class="animated fadeInDown">\n          <div class="card-header text-center">Stats Charts - {{playerName}}</div>\n          <div class="d-flex align-items-center justify-content-center">\n            <b-form-radio-group\n              id="radio-chart"\n              size="sm"\n              v-model="chartType"\n              :options="chartSel"\n              name="radio-options"\n              buttons\n              button-variant="outline-primary">\n            </b-form-radio-group>\n            <b-button @click="updateChart(\'score\')" variant="link" class="text-decoration-none ml-2" :disabled="chartModel==\'score\'" :pressed="chartModel==\'score\'"><i class="fa fa-file-word" aria-hidden="true"></i> Scores</b-button>\n            <b-button @click="updateChart(\'opscore\')" variant="link" class="text-decoration-none ml-2" :disabled="chartModel==\'opscore\'" :pressed="chartModel==\'opscore\'"><i class="fa fa-file-word-o" aria-hidden="true"></i> Opp Scores</b-button>\n            <b-button @click="updateChart(\'mixed\')" variant="link" class="text-decoration-none ml-2" :disabled="chartModel==\'mixed\'" :pressed="chartModel==\'mixed\'"><i class="fas fa-file-csv" aria-hidden="true"></i> Mixed Scores</b-button>\n            </div>\n\n\n\n          <div id="chart">\n            <apexchart :type=chartType height=400 :options="chartOptions" :series="series" />\n          </div>\n        </b-card>\n      </b-collapse>\n      </div>\n  </div>\n</div>\n  ',
  props: ['pstats'],
  components: {
    apexchart: VueApexCharts
  },
  data: function data() {
    return {
      player: '',
      playerName: '',
      allScores: [],
      allOppScores: [],
      chartType: 'bar',
      chartSel: [{ text: 'Bar', value: 'bar' }, { text: 'Line', value: 'line' }],
      chartModel: 'score',
      series: [{
        name: 'Score',
        data: []
      }],
      chartOptions: {
        chart: {
          height: 400,
          zoom: {
            enabled: false
          },
          shadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 1
          }
        },
        colors: ['#77B6EA', '#545454'],
        dataLabels: {
          enabled: true
        },
        stroke: {
          curve: 'smooth' // straight
        },
        title: {
          text: "Player's Scores",
          align: 'left'
        },
        grid: {
          borderColor: '#e7e7e7',
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        xaxis: {
          categories: [],
          title: {
            text: 'Rounds'
          }
        },
        yaxis: {
          title: {
            text: 'Scores'
          },
          min: 150,
          max: 900
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          floating: true,
          offsetY: -25,
          offsetX: -5
        }
      }
    };
  },
  // mounted: function () {
  // },
  created: function created() {
    this.player = this.pstats.player[0];
    this.playerName = this.player.post_title;
    var rounds = _.range(1, this.total_rounds + 1);
    var rds = _.map(rounds, function (num) {
      return 'Rd ' + num;
    });
    console.log(rds);
    this.chartOptions.xaxis.categories = rds;
    this.allScores = _.flatten(this.pstats.allScores);
    this.allOppScores = _.flatten(this.pstats.allOppScores);
    this.updateChart(this.chartModel);
  },
  beforeDestroy: function beforeDestroy() {
    this.$store.commit('SET_SHOWSTATS', false);
  },
  methods: {

    updateChart: function updateChart(type) {
      console.log('-------------Updating..-----------------------');
      this.chartOptions.title.align = 'left';
      this.chartModel = type;
      if ('score' == this.chartModel) {
        this.chartOptions.title.text = "Scores";
        this.series = [{
          name: 'Scores',
          data: this.allScores
        }];
      }
      if ('opscore' == this.chartModel) {
        this.chartOptions.title.text = "Opponent's Scores";
        this.series = [{
          name: 'Opponent Scores',
          data: this.allOppScores
        }];
      }
      if ('mixed' == this.chartModel) {
        this.chartOptions.title.text = "Mixed Scores";
        this.series = [{
          name: 'Scores',
          data: this.allScores
        }, {
          name: 'Opponent Scores',
          data: this.allOppScores
        }];
      }
    },
    closeCard: function closeCard() {
      console.log('----------CloseCard--------------------------');
      this.$store.commit('SET_SHOWSTATS', false);
    }
  },
  computed: _extends({}, mapGetters({
    total_rounds: 'TOTAL_ROUNDS',
    players: 'PLAYERS',
    showStats: 'SHOWSTATS'
  }))

});
var PlayerList = Vue.component('allplayers', {
  template: '\n  <div class="row row-eq-height align-items-center" id="players-list">\n      <template v-if="showStats">\n         <playerstats :pstats="pStats"></playerstats>\n      </template>\n      <template v-else>\n    <div class="playerCols col-md-2 col-xs-6 col-sm-4 p-4 " v-for="player in players" :key="player.id" >\n            <h4 class="mx-auto"><b-badge>{{player.tou_no}}</b-badge>\n            {{player.post_title }}\n            <span class="d-block mx-auto">\n            <i class="mx-auto flag-icon" :class="\'flag-icon-\'+player.country | lowercase" :title="player.country_full"></i>\n            <i class="ml-2 fa" :class="{\'fa-male\': player.gender == \'m\',\n        \'fa-female\': player.gender == \'f\',\n        \'fa-users\': player.is_team == \'yes\' }"\n                    aria-hidden="true"></i>\n             </span>\n            </h4>\n            <div class="mx-auto text-center animated fadeIn">\n                <b-img v-if="player.photo" rounded="circle" fluid block width="80px" height="80px" class="shadow-sm" :src="player.photo" />\n                <span class="d-block mx-auto">\n                <span v-on:click="showPlayerStats(player.id)" title="Open player\'s stats"><i class="fas fa-chart-pie" aria-hidden="true"></i></span>\n                </span>\n          </div>\n       </div>\n      </template>\n    </div>\n    ',
  components: {
    playerstats: PlayerStats
  },
  data: function data() {
    return {
      pStats: {}

    };
  },
  methods: {
    showPlayerStats: function showPlayerStats(id) {

      var data = this.result_data;
      var player = _.filter(this.players, { id: id });
      // console.log(_.pickBy(this.players,'post_title'))
      var name = _.map(player, "post_title") + ""; // convert to string
      var player_tno = parseInt(_.map(player, 'tou_no'));
      console.log(name);
      var lastdata = _.find(this.lastRdData, { pno: player_tno });

      // console.log(lastdata);

      var pdata = _.chain(data).map(function (m) {
        return _.filter(m, { pno: player_tno });
      }).value();
      /* console.log('------------Player Data------------------------');
      console.log(pdata);
      console.log('------------------------------------'); */

      var allScores = _.chain(pdata).map(function (m) {
        var scores = _.flattenDeep(_.map(m, "score"));
        return scores;
      }).value();
      var allOppScores = _.chain(pdata).map(function (m) {
        var oppscores = _.flattenDeep(_.map(m, "oppo_score"));
        return oppscores;
      }).value();

      var pHiScore = _.maxBy(allScores) + "";
      var pLoScore = _.minBy(allScores) + "";
      var pHiOppScore = _.maxBy(allOppScores) + "";
      var pLoOppScore = _.minBy(allOppScores) + "";

      var pHiScoreRounds = _.map(_.filter(_.flattenDeep(pdata), function (d) {
        return d.score == parseInt(pHiScore);
      }, this), "round");

      this.pStats.pHiScoreRounds = pHiScoreRounds.join();

      var pLoScoreRounds = _.map(_.filter(_.flattenDeep(pdata), function (d) {
        return d.score == parseInt(pLoScore);
      }, this), "round");

      this.pStats.pLoScoreRounds = pLoScoreRounds.join();

      var pRbyR = _.map(pdata, function (t) {
        return _.map(t, function (l) {
          var result = "";
          if (l.result === "win") {
            result = "won";
          } else if (l.result === "draw" && l.score == 0 && l.oppo_score == 0) {
            result = "AR";
          } else {
            result = "lost";
          }
          var starting = "replying";
          if (l.start == "y") {
            starting = "starting";
          }
          if (result == "AR") {
            l["report"] = "In round " + l.round + " " + name + '<em v-if="l.start">, (' + starting + ")</em> is playing <strong>" + l.oppo + "</strong>. Results are being awaited";
          } else {
            l["report"] = "In round " + l.round + " " + name + '<em v-if="l.start">, (' + starting + ")</em> played <strong>" + l.oppo + "</strong> and " + result + " <em>" + l.score + " - " + l.oppo_score + "</em> a difference of " + l.diff + '. <span class="summary">In this round, <em>' + name + "</em> is ranked <strong>" + l.position + "</strong> with <strong>" + l.points + "</strong> points and a cumulative spread of " + l.margin + " </span>";
          }
          return l;
        });
      });

      //   console.log(_.flattenDeep(this.pRbyR));

      this.pStats.player = player;
      this.pStats.pAveOpp = lastdata.ave_opp_score;
      this.pStats.pAve = lastdata.ave_score;
      this.pStats.pRank = lastdata.rank;
      this.pStats.pPosition = lastdata.position;
      this.pStats.pPoints = lastdata.points;
      this.pStats.pHiScore = pHiScore;
      this.pStats.pLoScore = pLoScore;
      this.pStats.pHiOppScore = pHiOppScore;
      this.pStats.pLoOppScore = pLoOppScore;
      this.pStats.pRbyR = _.flattenDeep(pRbyR);
      this.pStats.allScores = allScores;
      this.pStats.allOppScores = allOppScores;

      this.$store.commit('SET_SHOWSTATS', true);
    }
  },
  computed: _extends({}, mapGetters({
    result_data: 'RESULTDATA',
    players: 'PLAYERS',
    total_players: 'TOTALPLAYERS',
    total_rounds: 'TOTAL_ROUNDS',
    showStats: 'SHOWSTATS'
  }), {
    lastRdData: {
      get: function get() {
        var len = this.result_data.length;
        return this.result_data[len - 1];
      },
      set: function set(value) {
        this.lastRdData = value;
      }
    }
  })
});

var Results = Vue.component('results', {
  template: '\n    <b-table hover responsive-sm striped foot-clone :fields="results_fields"\n    :items="result(currentRound)" head-variant="dark" class="animated fadeInUp">\n        <template slot="table-caption">\n            {{caption}}\n        </template>\n  </b-table>\n    ',
  props: ['caption', 'currentRound', 'resultdata'],
  data: function data() {
    return {
      results_fields: []
    };
  },
  created: function created() {
    this.results_fields = [{ key: 'rank', label: '#', class: 'text-center', sortable: true }, { key: 'player', label: 'Player', sortable: true },
    // { key: 'position',label: 'Position','class':'text-center'},
    {
      key: 'score',
      label: 'Score',
      class: 'text-center',
      sortable: true,
      formatter: function formatter(value, key, item) {
        if (item.oppo_score == 0 && item.score == 0) {
          return 'AR';
        } else {
          return item.score;
        }
      }
    }, { key: 'oppo', label: 'Opponent' },
    // { key: 'opp_position', label: 'Position','class': 'text-center'},
    {
      key: 'oppo_score',
      label: 'Score',
      class: 'text-center',
      sortable: true,
      formatter: function formatter(value, key, item) {
        if (item.oppo_score == 0 && item.score == 0) {
          return 'AR';
        } else {
          return item.oppo_score;
        }
      }
    }, {
      key: 'diff',
      label: 'Spread',
      class: 'text-center',
      sortable: true,
      formatter: function formatter(value, key, item) {
        if (item.oppo_score == 0 && item.score == 0) {
          return '-';
        }
        if (value > 0) {
          return '+' + value;
        }
        return '' + value;
      }
    }];
  },

  methods: {
    result: function result(r) {
      var round = r - 1;
      var data = _.clone(this.resultdata[round]);

      _.forEach(data, function (r) {
        var opp_no = r['oppo_no'];
        // Find where the opponent's current position and add to collection
        var row = _.find(data, { pno: opp_no });
        r['opp_position'] = row['position'];
        // check result (win, loss, draw)
        var result = r['result'];
        r['_cellVariants'] = [];
        r['_cellVariants']['lastGame'] = 'warning';
        if (result === 'win') {
          r['_cellVariants']['lastGame'] = 'success';
        }
        if (result === 'loss') {
          r['_cellVariants']['lastGame'] = 'danger';
        }
      });

      return _.chain(data).sortBy('margin').sortBy('points').value().reverse();
    }
  }
});

var Standings = Vue.component('standings', {
  template: '\n    <b-table responsive-sm hover striped foot-clone :items="result(currentRound)" :fields="standings_fields" head-variant="dark" class="animated fadeInUp">\n        <template slot="table-caption">\n            {{caption}}\n        </template>\n        <template>\n            <template slot="rank" slot-scope="data">\n            {{data.value.rank}}\n            </template>\n            <template slot="player" slot-scope="data">\n            {{data.value.player}}\n            </template>\n            <template slot="wonLost"></template>\n            <template slot="margin" slot-scope="data">\n            {{data.value.margin}}\n            </template>\n            <template slot="lastGame">\n            </template>\n        </template>\n    </b-table>\n   ',
  props: ['caption', 'currentRound', 'resultdata'],
  data: function data() {
    return {
      standings_fields: []
    };
  },
  mounted: function mounted() {
    this.standings_fields = [{ key: 'rank', class: 'text-center', sortable: true }, { key: 'player', class: 'text-center' }, {
      key: 'wonLost',
      label: 'Won-Lost',
      class: 'text-center',
      formatter: function formatter(value, key, item) {
        var loss = item.round - item.points;
        return item.points + ' - ' + loss;
      }
    }, {
      key: 'margin',
      label: 'Spread',
      class: 'text-center',
      sortable: true,
      formatter: function formatter(value) {
        if (value > 0) {
          return '+' + value;
        }
        return '' + value;
      }
    }, {
      key: 'lastGame',
      label: 'Last Game',
      sortable: false,
      formatter: function formatter(value, key, item) {
        if (item.score == 0 && item.oppo_score == 0 && item.result == 'draw') {
          return 'Awaiting result of game ' + item.round + ' vs ' + item.oppo;
        }
        return 'a ' + item.score + '-' + item.oppo_score + '  ' + item.result.toUpperCase() + ' vs ' + item.oppo + ' ';
      }
    }];
  },

  methods: {
    result: function result(r) {
      var round = r - 1;
      var data = _.clone(this.resultdata[round]);
      _.forEach(data, function (r) {
        var opp_no = r['oppo_no'];
        // Find where the opponent's current position and add to collection
        var row = _.find(data, { pno: opp_no });
        r['opp_position'] = row['position'];
        // check result (win, loss, draw)
        var result = r['result'];

        r['_cellVariants'] = [];
        r['_cellVariants']['lastGame'] = 'warning';
        if (result === 'win') {
          r['_cellVariants']['lastGame'] = 'success';
        }
        if (result === 'loss') {
          r['_cellVariants']['lastGame'] = 'danger';
        }
        if (result === 'draw') {
          if (r['score'] == 0 && r['oppo_score'] == 0) {
            r['_cellVariants']['lastGame'] = 'info';
          } else {
            r['_cellVariants']['lastGame'] = 'warning';
          }
        }
      });

      return _.chain(data).sortBy('margin').sortBy('points').value().reverse();
    }
  }
});

var Pairings = Vue.component('pairings', {
  template: '\n<table class="table table-sm table-hover table-responsive-sm table-striped  animated fadeInUp">\n    <caption>{{caption}}</caption>\n    <thead class="thead-dark">\n        <tr>\n        <th scope="col">#</th>\n        <th scope="col">Player</th>\n        <th scope="col">Opponent</th>\n        </tr>\n    </thead>\n    <tbody>\n        <tr v-for="(player,i) in pairing(currentRound)" :key="i">\n        <th scope="row">{{i + 1}}</th>\n        <td><sup v-if="player.start ==\'y\'">*</sup>{{player.player}}</td>\n        <td><sup v-if="player.start ==\'n\'">*</sup>{{player.oppo}}</td>\n        </tr>\n    </tbody>\n  </table>\n',
  props: ['caption', 'currentRound', 'resultdata'],

  methods: {
    // get pairing
    pairing: function pairing(r) {
      var round = r - 1;
      var round_res = this.resultdata[round];
      // Sort by player numbering if round 1 to obtain round 1 pairing
      if (r === 1) {
        round_res = _.sortBy(round_res, 'pno');
      }

      var paired_players = [];

      var rp = _.map(round_res, function (r) {
        var player = r['pno'];
        var opponent = r['oppo_no'];
        if (_.includes(paired_players, player)) {
          return false;
        }
        paired_players.push(player);
        paired_players.push(opponent);
        return r;
      });
      return _.compact(rp);
    }
  }
});