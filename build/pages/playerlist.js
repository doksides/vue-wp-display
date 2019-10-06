'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var player_mixed_series = [{ name: '', data: [] }];
var player_rank_series = [{ name: '', data: [] }];
var player_radial_chart_series = [];
var player_radial_chart_config = {
  plotOptions: {
    radialBar: {
      hollow: { size: '50%' }
    }
  },
  colors: [],
  labels: []
};

var player_rank_chart_config = {
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
    text: '',
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
      text: ''
    },
    min: null,
    max: null
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    floating: true,
    offsetY: -25,
    offsetX: -5
  }
};

var PlayerStats = Vue.component('playerstats', {
  template: '\n  <div class="col-lg-10 offset-lg-1 justify-content-center">\n    <div class="row">\n      <div class="col-lg-8 offset-lg-2">\n        <div class="animated fadeInLeftBig" id="pheader">\n          <div class="d-flex align-items-center align-content-center justify-content-center mt-5">\n            <div>\n              <h4 class="text-center bebas">{{playerName}}\n                <span class="d-block mx-auto" style="font-size:small">\n                  <i class="mx-3 flag-icon" :class="\'flag-icon-\'+player.country | lowercase"\n                    :title="player.country_full"></i>\n                  <i class="mx-3 fa" :class="{\'fa-male\': player.gender == \'m\',\n                   \'fa-female\': player.gender == \'f\',\'fa-users\': player.is_team == \'yes\' }" aria-hidden="true">\n                  </i>\n                </span>\n              </h4>\n            </div>\n            <div>\n              <img width="100px" height="100px" class="img-thumbnail img-fluid mx-3 d-block shadow-sm"\n                :src="player.photo" />\n            </div>\n            <div>\n              <h4 class="text-center yanone mx-3">{{pstats.pPosition}} position</h4>\n            </div>\n          </div>\n        </div> <!-- #pheader-->\n\n        <div class="d-flex align-items-center align-content-center justify-content-center">\n          <b-btn v-b-toggle.collapse1 class="m-1">Quick Stats</b-btn>\n          <b-btn v-b-toggle.collapse2 class="m-1">Round by Round </b-btn>\n          <b-btn v-b-toggle.collapse3 class="m-1">Charts</b-btn>\n          <b-button title="Close" size="sm" @click="closeCard()" class="m-1" variant="outline-danger" :disabled="!show"\n            :pressed.sync="show"><i class="fas fa-times"></i></b-button>\n        </div>\n      </div>\n    </div>\n    <div class="row">\n      <div class="col-lg-8 offset-lg-2">\n        <b-collapse id="collapse1">\n          <b-card class="animated flipInX">\n            <div class="card-header text-center">Quick Stats</div>\n            <ul class="list-group list-group-flush stats">\n              <li class="list-group-item">Points:\n                <span>{{pstats.pPoints}} / {{total_rounds}}</span>\n              </li>\n              <li class="list-group-item">Rank:\n                <span>{{pstats.pRank}} </span>\n              </li>\n              <li class="list-group-item">Highest Score:\n                <span>{{pstats.pHiScore}}</span> in round <em>{{pstats.pHiScoreRounds}}</em>\n              </li>\n              <li class="list-group-item">Lowest Score:\n                <span>{{pstats.pLoScore}}</span> in round <em>{{pstats.pLoScoreRounds}}</em>\n              </li>\n              <li class="list-group-item">Ave Score:\n                <span>{{pstats.pAve}}</span>\n              </li>\n              <li class="list-group-item">Ave Opp Score:\n                <span>{{pstats.pAveOpp}}</span>\n              </li>\n            </ul>\n          </b-card>\n        </b-collapse>\n        <!---- Round By Round Results -->\n        <b-collapse id="collapse2">\n          <b-card class="animated fadeInUp">\n            <h4>Round By Round Summary </h4>\n            <ul class="list-group list-group-flush" v-for="(report, i) in pstats.pRbyR" :key="i">\n              <li v-html="report.report" v-if="report.result==\'win\'" class="list-group-item list-group-item-success">\n                {{report.report}}</li>\n              <li v-html="report.report" v-else-if="report.result ==\'draw\'"\n                class="list-group-item list-group-item-warning">{{report.report}}</li>\n              <li v-html="report.report" v-else-if="report.result ==\'loss\'"\n                class="list-group-item list-group-item-danger">{{report.report}}</li>\n              <li v-html="report.report" v-else-if="report.result ==\'awaiting\'" class="list-group-item list-group-item-info">\n                {{report.report}}</li>\n              <li v-html="report.report" v-else class="list-group-item list-group-item-light">{{report.report}}</li>\n            </ul>\n          </b-card>\n        </b-collapse>\n        <!-- Charts -->\n        <b-collapse id="collapse3">\n          <b-card class="animated fadeInDown">\n            <div class="card-header text-center">Stats Charts</div>\n            <div class="d-flex align-items-center justify-content-center">\n              <div>\n                <b-button @click="updateChart(\'mixed\')" variant="link" class="text-decoration-none ml-1"\n                  :disabled="chartModel==\'mixed\'" :pressed="chartModel==\'mixed\'"><i class="fas fa-file-csv"\n                    aria-hidden="true"></i> Mixed Scores</b-button>\n                <b-button @click="updateChart(\'rank\')" variant="link" class="text-decoration-none ml-1"\n                  :disabled="chartModel==\'rank\'" :pressed="chartModel==\'rank\'"><i class="fas fa-chart-line"\n                    aria-hidden="true"></i> Rank per Rd</b-button>\n                <b-button @click="updateChart(\'wins\')" variant="link" class="text-decoration-none ml-1"\n                  :disabled="chartModel==\'wins\'" :pressed="chartModel==\'wins\'"><i class="fas fa-balance-scale fa-stack"\n                    aria-hidden="true"></i> Starts/Replies Wins(%)</b-button>\n              </div>\n            </div>\n            <div id="chart">\n              <apexchart v-if="chartModel==\'mixed\'" type=line height=400 :options="chartOptions"\n                :series="seriesMixed" />\n              <apexchart v-if="chartModel==\'rank\'" type=\'line\' height=400 :options="chartOptionsRank"\n                :series="seriesRank" />\n              <apexchart v-if="chartModel==\'wins\'" type=radialBar height=400 :options="chartOptRadial"\n                :series="seriesRadial" />\n            </div>\n          </b-card>\n        </b-collapse>\n      </div>\n    </div>\n  </div>\n  ',
  props: ['pstats'],
  components: {
    apexchart: VueApexCharts
  },
  data: function data() {
    return {
      player: '',
      show: true,
      playerName: '',
      allScores: [],
      allOppScores: [],
      allRanks: [],
      total_players: null,
      chartModel: 'rank',
      seriesMixed: player_mixed_series,
      seriesRank: player_rank_series,
      seriesRadial: player_radial_chart_series,
      chartOptRadial: player_radial_chart_config,
      chartOptionsRank: player_rank_chart_config,
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
            opacity: 0.5
          }
        },
        colors: ['#8FBC8F', '#545454'],
        dataLabels: {
          enabled: true
        },
        stroke: {
          curve: 'straight' // smooth
        },
        title: {
          text: '',
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
            text: ''
          },
          min: null,
          max: null
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
  mounted: function mounted() {
    this.doScroll();
    console.log(this.seriesRadial);
    this.show = this.showStats;
    this.allScores = _.flatten(this.pstats.allScores);
    this.allOppScores = _.flatten(this.pstats.allOppScores);
    this.allRanks = _.flatten(this.pstats.allRanks);
    this.updateChart(this.chartModel);
    this.total_players = this.players.length;
    this.player = this.pstats.player[0];
    this.playerName = this.player.post_title;
  },
  created: function created() {},
  beforeDestroy: function beforeDestroy() {
    this.closeCard();
  },

  methods: {

    doScroll: function doScroll() {
      // When the user scrolls the page, execute myFunction
      window.onscroll = function () {
        myFunction();
      };

      // Get the header
      var header = document.getElementById("pheader");

      // Get the offset position of the navbar
      var sticky = header.offsetTop;
      var h = header.offsetHeight + 50;

      // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
      function myFunction() {
        if (window.pageYOffset > sticky + h) {
          header.classList.add("sticky");
        } else {
          header.classList.remove("sticky");
        }
      }
    },
    setChartCategories: function setChartCategories() {
      var rounds = _.range(1, this.total_rounds + 1);
      var rds = _.map(rounds, function (num) {
        return 'Rd ' + num;
      });
      this.chartOptions.xaxis.categories = rds;
    },
    updateChart: function updateChart(type) {
      //console.log('-------------Updating..-----------------------');
      this.chartModel = type;
      this.chartOptions.title.align = 'left';
      var firstName = _.trim(_.split(this.playerName, ' ', 2)[0]);
      if ('rank' == type) {
        // this. = 'bar';
        this.chartOptionsRank.title.text = 'Ranking: ' + this.playerName;
        this.chartOptionsRank.yaxis.min = 0;
        this.chartOptionsRank.yaxis.max = this.total_players;
        this.seriesRank = [{
          name: firstName + ' rank this rd',
          data: this.allRanks
        }];
      }
      if ('mixed' == type) {
        this.setChartCategories();
        this.chartOptions.title.text = 'Scores: ' + this.playerName;
        this.chartOptions.yaxis.min = 100;
        this.chartOptions.yaxis.max = 900;
        this.seriesMixed = [{
          name: '' + firstName,
          data: this.allScores
        }, {
          name: 'Opponent',
          data: this.allOppScores
        }];
      }
      if ('wins' == type) {
        this.chartOptRadial.labels = [];
        this.chartOptRadial.colors = [];
        this.chartOptRadial.labels.unshift('Starts: % Wins', 'Replies: % Wins');
        this.chartOptRadial.colors.unshift('#7CFC00', '#BDB76B');
        console.log(this.chartOptRadial);
        var s = _.round(100 * (this.pstats.startWins / this.pstats.starts), 1);
        var r = _.round(100 * (this.pstats.replyWins / this.pstats.replies), 1);
        this.seriesRadial = [];
        this.seriesRadial.unshift(s, r);
        console.log(this.seriesRadial);
      }
    },
    closeCard: function closeCard() {
      // console.log('----------Closing Card--------------------------');
      this.$store.dispatch('DO_STATS', false);
    }
  },
  computed: _extends({}, mapGetters({
    total_rounds: 'TOTAL_ROUNDS',
    players: 'PLAYERS',
    showStats: 'SHOWSTATS'
  }))

});
var PlayerList = Vue.component('allplayers', {
  template: '\n  <div class="row justify-content-center align-items-center" id="players-list">\n      <template v-if="showStats">\n         <playerstats :pstats="pStats"></playerstats>\n      </template>\n      <template v-else>\n    <div class="playerCols col-lg-2 col-sm-6 col-12 p-4 " v-for="player in players" :key="player.id" >\n            <h4 class="mx-auto"><b-badge>{{player.tou_no}}</b-badge>\n            {{player.post_title }}\n            <span class="d-block mx-auto"  style="font-size:small">\n            <i class="mx-auto flag-icon" :class="\'flag-icon-\'+player.country | lowercase" :title="player.country_full"></i>\n            <i class="ml-2 fa" :class="{\'fa-male\': player.gender == \'m\',\n        \'fa-female\': player.gender == \'f\',\n        \'fa-users\': player.is_team == \'yes\' }"\n                    aria-hidden="true"></i>\n             </span>\n            </h4>\n            <div class="mx-auto text-center animated fadeIn">\n            <b-img-lazy v-bind="imgProps" :alt="player.post_title" :src="player.photo" />\n                <span class="d-block mx-auto">\n                <span @click="showPlayerStats(player.id)" title="Open player\'s stats"><i class="fas fa-chart-bar" aria-hidden="true"></i></span>\n                </span>\n          </div>\n       </div>\n      </template>\n    </div>\n    ',
  components: {
    playerstats: PlayerStats
  },
  data: function data() {
    return {
      pStats: {},
      imgProps: {
        center: true,
        block: true,
        rounded: 'circle',
        fluid: true,
        blank: true,
        blankColor: '#bbb',
        width: '80px',
        height: '80px',
        class: 'shadow-sm'
      }
    };
  },
  methods: {
    showPlayerStats: function showPlayerStats(id) {
      this.$store.commit('COMPUTE_PLAYER_STATS', id);
      this.pStats.player = this.player;
      this.pStats.pAveOpp = this.lastdata.ave_opp_score;
      this.pStats.pAve = this.lastdata.ave_score;
      this.pStats.pRank = this.lastdata.rank;
      this.pStats.pPosition = this.lastdata.position;
      this.pStats.pPoints = this.lastdata.points;
      this.pStats.pHiScore = this.player_stats.pHiScore;
      this.pStats.pLoScore = this.player_stats.pLoScore;
      this.pStats.pHiOppScore = this.player_stats.pHiOppScore;
      this.pStats.pLoOppScore = this.player_stats.pLoOppScore;
      this.pStats.pHiScoreRounds = this.player_stats.pHiScoreRounds;
      this.pStats.pLoScoreRounds = this.player_stats.pLoScoreRounds;
      this.pStats.allRanks = this.player_stats.allRanks;
      this.pStats.allScores = this.player_stats.allScores;
      this.pStats.allOppScores = this.player_stats.allOppScores;
      this.pStats.pRbyR = this.player_stats.pRbyR;
      this.pStats.startWins = this.player_stats.startWins;
      this.pStats.starts = this.player_stats.starts;
      this.pStats.replyWins = this.player_stats.replyWins;
      this.pStats.replies = this.player_stats.replies;

      this.$store.dispatch('DO_STATS', true);
    }
  },
  computed: _extends({}, mapGetters({
    result_data: 'RESULTDATA',
    players: 'PLAYERS',
    total_players: 'TOTALPLAYERS',
    total_rounds: 'TOTAL_ROUNDS',
    showStats: 'SHOWSTATS',
    lastdata: 'LASTRDDATA',
    playerdata: 'PLAYERDATA',
    player: 'PLAYER',
    player_stats: 'PLAYER_STATS'
  }))
});

var Results = Vue.component('results', {
  template: '\n    <b-table hover responsive striped foot-clone :fields="results_fields" :items="result(currentRound)" head-variant="dark" class="animated fadeInUp">\n        <template slot="table-caption">\n            {{caption}}\n        </template>\n    </b-table>\n    ',
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
        r['opp_position'] = row.position;
        // check result (win, loss, draw)
        var result = r.result;
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
  template: '\n    <b-table responsive hover striped foot-clone :items="result(currentRound)" :fields="standings_fields" head-variant="dark" class="animated fadeInUp">\n        <template slot="table-caption">\n            {{caption}}\n        </template>\n        <template>\n            <template slot="rank" slot-scope="data">\n            {{data.value.rank}}\n            </template>\n            <template slot="player" slot-scope="data">\n            {{data.value.player}}\n            </template>\n            <template slot="wonLost"></template>\n            <template slot="margin" slot-scope="data">\n            {{data.value.margin}}\n            </template>\n            <template slot="lastGame">\n            </template>\n        </template>\n    </b-table>\n   ',
  props: ['caption', 'currentRound', 'resultdata'],
  data: function data() {
    return {
      standings_fields: []
    };
  },
  mounted: function mounted() {
    this.standings_fields = [{ key: 'rank', class: 'text-center', sortable: true }, { key: 'player', class: 'text-center' }, {
      key: 'wonLost',
      label: 'Win-Draw-Loss',
      class: 'text-center',
      formatter: function formatter(value, key, item) {
        return item.wins + ' - ' + item.draws + ' - ' + item.losses;
      }
    }, {
      key: 'points',
      label: 'Points',
      class: 'text-center',
      formatter: function formatter(value, key, item) {
        if (item.ar > 0) {
          return item.points + '*';
        }
        return '' + item.points;
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
        if (item.score == 0 && item.oppo_score == 0 && item.result == 'awaiting') {
          return 'Awaiting result of game ' + item.round + ' vs ' + item.oppo;
        } else {
          return 'a ' + item.score + '-' + item.oppo_score + '\n            ' + item.result.toUpperCase() + ' vs ' + item.oppo + ' ';
        }
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
        if (result === 'awaiting') {
          r['_cellVariants']['lastGame'] = 'info';
        }
        if (result === 'draw') {
          r['_cellVariants']['lastGame'] = 'warning';
        }
      });
      return _.chain(data).sortBy('margin').sortBy('points').value().reverse();
    }
  }
});

var Pairings = Vue.component('pairings', {
  template: '\n<table class="table table-hover table-responsive table-striped  animated fadeInUp">\n    <caption>{{caption}}</caption>\n    <thead class="thead-dark">\n        <tr>\n        <th scope="col">#</th>\n        <th scope="col">Player</th>\n        <th scope="col">Opponent</th>\n        </tr>\n    </thead>\n    <tbody>\n        <tr v-for="(player,i) in pairing(currentRound)" :key="i">\n        <th scope="row">{{i + 1}}</th>\n        <td><sup v-if="player.start ==\'y\'">*</sup>{{player.player}}</td>\n        <td><sup v-if="player.start ==\'n\'">*</sup>{{player.oppo}}</td>\n        </tr>\n    </tbody>\n  </table>\n',
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