(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _playerlist = require("./playerlist");

var _stats = require("./stats");

var _scoreboard = _interopRequireDefault(require("./scoreboard"));

var _top = _interopRequireDefault(require("./top"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// import {LoadingAlert, ErrorAlert} from './alerts';
var LoadingAlert, ErrorAlert;
var CateDetail = Vue.component('cate', {
  template: "\n    <div class=\"container-fluid\">\n    <div v-if=\"resultdata\" class=\"row no-gutters justify-content-center align-items-center\">\n        <div class=\"col-12\">\n            <b-breadcrumb :items=\"breadcrumbs\" />\n        </div>\n    </div>\n    <div v-if=\"loading||error\" class=\"row justify-content-center align-content-center align-items-center\">\n        <div v-if=\"loading\" class=\"col align-self-center\">\n            <loading></loading>\n        </div>\n        <div v-if=\"error\" class=\"col align-self-center\">\n          <error>\n          <p slot=\"error\">{{error}}</p>\n          <p slot=\"error_msg\">{{error_msg}}</p>\n          </error>\n        </div>\n    </div>\n    <template v-if=\"!(error||loading)\">\n        <div class=\"row justify-content-center align-items-center\">\n            <div class=\"col-12 d-flex\">\n              <b-img class=\"thumbnail logo ml-auto\" :src=\"logo\" :alt=\"event_title\" />\n              <h2 class=\"text-left bebas\">{{ event_title }}\n              <span :title=\"total_rounds+ ' rounds, ' + total_players +' players'\" v-show=\"total_rounds\" class=\"text-center d-block\">{{ total_rounds }} Games   {{ total_players}} <i class=\"fas fa-users\"></i> </span>\n              </h2>\n            </div>\n        </div>\n        <div class=\"row justify-content-center align-items-center\">\n            <div class=\"col-12 d-flex justify-content-center align-items-center\">\n                <div class=\"text-center\">\n                <b-button @click=\"viewIndex=0\" variant=\"link\" class=\"text-decoration-none\" :disabled=\"viewIndex==0\" :pressed=\"viewIndex==0\"><i class=\"fa fa-users\" aria-hidden=\"true\"></i> Players</b-button>\n                <b-button @click=\"viewIndex=1\" variant=\"link\" class=\"text-decoration-none\" :disabled=\"viewIndex==1\" :pressed=\"viewIndex==1\"> <i class=\"fa fa-user-plus\"></i> Pairings</b-button>\n                <b-button @click=\"viewIndex=2\" variant=\"link\" class=\"text-decoration-none\" :disabled=\"viewIndex==2\" :pressed=\"viewIndex==2\"><i class=\"fas fa-sticky-note\" aria-hidden=\"true\"></i> Results</b-button>\n                <b-button @click=\"viewIndex=3\" variant=\"link\" class=\"text-decoration-none\" :disabled=\"viewIndex==3\" :pressed=\"viewIndex==3\"><i class=\"fas fa-sort-numeric-down    \"></i> Standings</b-button>\n                <b-button @click=\"viewIndex=4\" variant=\"link\" class=\"text-decoration-none\" :disabled=\"viewIndex==4\" :pressed=\"viewIndex==4\"><i class=\"fas fa-chart-pie\"></i> Statistics</b-button>\n                <!---\n                <b-button  @click=\"viewIndex=5\" :to=\"{ name: 'Scoreboard', params: { event_slug: slug}}\"  variant=\"link\" class=\"text-decoration-none\" active-class=\"currentView\" :disabled=\"viewIndex==5\" :pressed=\"viewIndex==5\"><i class=\"fas fa-chalkboard-teacher\"></i>\n                Scoreboard</b-button>\n                -->\n                <b-button  @click=\"viewIndex=5\" variant=\"link\" class=\"text-decoration-none\" active-class=\"currentView\" :disabled=\"viewIndex==5\" :pressed=\"viewIndex==5\"><i class=\"fas fa-chalkboard-teacher\"></i>\n                Scoreboard</b-button>\n                <b-button  @click=\"viewIndex=6\" variant=\"link\" class=\"text-decoration-none\" active-class=\"currentView\" :disabled=\"viewIndex==6\" :pressed=\"viewIndex==6\"><i class=\"fas fa-medal\"></i>\n                Top Performers</b-button>\n                </div>\n            </div>\n        </div>\n        <div class=\"row justify-content-center align-items-center\">\n            <div class=\"col-md-10 offset-md-1 col-12 d-flex flex-column\">\n              <h3 class=\"text-center bebas p-0 m-0\"> {{tab_heading}}\n              <span v-if=\"viewIndex >0 && viewIndex < 4\">\n              {{ currentRound }}\n              </span>\n              </h3>\n              <template v-if=\"showPagination\">\n                  <b-pagination align=\"center\" :total-rows=\"total_rounds\" v-model=\"currentRound\" :per-page=\"1\"\n                      :hide-ellipsis=\"true\" aria-label=\"Navigation\" change=\"roundChange\">\n                  </b-pagination>\n              </template>\n            </div>\n        </div>\n        <template v-if=\"viewIndex==0\">\n          <allplayers></allplayers>\n        </template>\n        <template v-if=\"viewIndex==6\">\n          <performers></performers>\n        </template>\n        <template v-else-if=\"viewIndex==5\">\n        <scoreboard></scoreboard>\n        </template>\n        <div v-else-if=\"viewIndex==4\" class=\"row d-flex justify-content-center align-items-center\">\n            <div class=\"col-md-10 offset-md-0 col\">\n                <b-tabs content-class=\"mt-3 statsTabs\" pills small lazy no-fade  v-model=\"tabIndex\">\n                    <b-tab title=\"High Wins\" lazy>\n                        <hiwins  :resultdata=\"resultdata\" :caption=\"caption\">\n                        </hiwins>\n                    </b-tab>\n                    <b-tab title=\"High Losses\" lazy>\n                        <hiloss :resultdata=\"resultdata\" :caption=\"caption\">\n                        </hiloss>\n                    </b-tab>\n                    <b-tab title=\"Low Wins\" lazy>\n                        <lowins  :resultdata=\"resultdata\" :caption=\"caption\">\n                        </lowins>\n                    </b-tab>\n                    <b-tab title=\"Combined Scores\">\n                        <comboscores :resultdata=\"resultdata\" :caption=\"caption\">\n                        </comboscores>\n                    </b-tab>\n                    <b-tab title=\"Total Scores\">\n                        <totalscores :caption=\"caption\" :stats=\"fetchStats('total_score')\"></totalscores>\n                    </b-tab>\n                    <b-tab title=\"Total Opp Scores\">\n                        <oppscores :caption=\"caption\" :stats=\"fetchStats('total_oppscore')\"></oppscores>\n                    </b-tab>\n                    <b-tab title=\"Ave Scores\">\n                        <avescores :caption=\"caption\" :stats=\"fetchStats('ave_score')\"></avescores>\n                    </b-tab>\n                    <b-tab title=\"Ave Opp Scores\">\n                        <aveoppscores :caption=\"caption\" :stats=\"fetchStats('ave_oppscore')\"></aveoppscores>\n                    </b-tab>\n                    <b-tab title=\"High Spreads \" lazy>\n                        <hispread :resultdata=\"resultdata\" :caption=\"caption\"></hispread>\n                    </b-tab>\n                    <b-tab title=\"Low Spreads\" lazy>\n                        <lospread :resultdata=\"resultdata\" :caption=\"caption\"></lospread>\n                    </b-tab>\n\n                </b-tabs>\n            </div>\n        </div>\n        <div v-else class=\"row justify-content-center align-items-center\">\n            <div class=\"col-md-8 offset-md-2 col-12\">\n                <pairings v-if=\"viewIndex==1\" :currentRound=\"currentRound\" :resultdata=\"resultdata\" :caption=\"caption\"></pairings>\n                <results v-if=\"viewIndex==2\" :currentRound=\"currentRound\" :resultdata=\"resultdata\" :caption=\"caption\"></results>\n                <standings v-if=\"viewIndex==3\" :currentRound=\"currentRound\" :resultdata=\"resultdata\" :caption=\"caption\"></standings>\n          </div>\n        </div>\n    </template>\n</div>\n",
  components: {
    loading: LoadingAlert,
    error: ErrorAlert,
    allplayers: _playerlist.PlayerList,
    pairings: _playerlist.Pairings,
    results: _playerlist.Results,
    standings: _playerlist.Standings,
    hiwins: _stats.HiWins,
    hiloss: _stats.HiLoss,
    lowin: _stats.LoWins,
    comboscores: _stats.ComboScores,
    totalscores: _stats.TotalScores,
    oppscores: _stats.TotalOppScores,
    avescores: _stats.AveScores,
    aveoppscores: _stats.AveOppScores,
    hispread: _stats.HiSpread,
    lospread: _stats.LoSpread,
    // 'luckystiff-table': LuckyStiffTable,
    // 'tuffluck-table': TuffLuckTable
    scoreboard: _scoreboard["default"],
    performers: _top["default"]
  },
  data: function data() {
    return {
      // parent_slug: this.$route.params.slug,
      slug: this.$route.params.event_slug,
      path: this.$route.path,
      // gameid: this.$route.query.id,
      tourney_slug: '',
      isActive: false,
      gamedata: [],
      tabIndex: 0,
      viewIndex: 0,
      currentRound: 1,
      tab_heading: '',
      caption: '',
      showPagination: false,
      luckystiff: [],
      tuffluck: [],
      timer: ''
    };
  },
  created: function created() {
    console.log('Category mounted');
    var p = this.slug.split('-');
    p.shift();
    this.tourney_slug = p.join('-');
    this.fetchData();
  },
  watch: {
    viewIndex: {
      handler: function handler(val, oldVal) {
        console.log('*****viewIndex****');
        console.log(val);

        if (val != 4) {
          this.getView(val);
        }
      },
      immediate: true
    }
  },
  beforeUpdate: function beforeUpdate() {
    document.title = this.event_title;

    if (this.viewIndex == 4) {
      this.getTabs(this.tabIndex);
    }
  },
  methods: {
    fetchData: function fetchData() {
      this.$store.dispatch('FETCH_DATA', this.slug);
    },
    getView: function getView(val) {
      console.log('Ran getView function val-> ' + val);

      switch (val) {
        case 0:
          this.showPagination = false;
          this.tab_heading = 'Players';
          this.caption = '';
          break;

        case 1:
          this.showPagination = true;
          this.tab_heading = 'Pairing Round - ';
          this.caption = '*Plays first';
          break;

        case 2:
          this.showPagination = true;
          this.tab_heading = 'Results Round - ';
          this.caption = 'Results';
          break;

        case 3:
          this.showPagination = true;
          this.tab_heading = 'Standings after Round - ';
          this.caption = 'Standings';
          break;

        default:
          this.showPagination = false;
          this.tab_heading = '';
          this.caption = '';
          break;
      } // return true

    },
    getTabs: function getTabs(val) {
      console.log('Ran getTabs function-> ' + val);

      switch (val) {
        case 0:
          this.showPagination = false;
          this.tab_heading = 'High Winning Scores';
          this.caption = 'High Winning Scores';
          break;

        case 1:
          this.showPagination = false;
          this.tab_heading = 'High Losing Scores';
          this.caption = 'High Losing Scores';
          break;

        case 2:
          this.showPagination = false;
          this.tab_heading = 'Low Winning Scores';
          this.caption = 'Low Winning Scores';
          break;

        case 3:
          this.showPagination = false;
          this.tab_heading = 'Highest Combined Scores';
          this.caption = 'Highest Combined Score per round';
          break;

        case 4:
          this.showPagination = false;
          this.tab_heading = 'Total Scores';
          this.caption = 'Total Player Scores Statistics';
          break;

        case 5:
          this.showPagination = false;
          this.tab_heading = 'Total Opponent Scores';
          this.caption = 'Total Opponent Scores Statistics';
          break;

        case 6:
          this.showPagination = false;
          this.tab_heading = 'Average Scores';
          this.caption = 'Ranking by Average Player Scores';
          break;

        case 7:
          this.showPagination = false;
          this.tab_heading = 'Average Opponent Scores';
          this.caption = 'Ranking by Average Opponent Scores';
          break;

        case 8:
          this.showPagination = false;
          this.tab_heading = 'High Spreads';
          this.caption = 'Highest Spread per round ';
          break;

        case 9:
          this.showPagination = false;
          this.tab_heading = 'Low Spreads';
          this.caption = 'Lowest Spreads per round';
          break;

        case 10:
          this.showPagination = false;
          this.tab_heading = 'Lucky Stiffs';
          this.caption = 'Lucky Stiffs (frequent low margin/spread winners)';
          break;

        case 11:
          this.showPagination = false;
          this.tab_heading = 'Tuff Luck';
          this.caption = 'Tuff Luck (frequent low margin/spread losers)';
          break;

        default:
          this.showPagination = false;
          this.tab_heading = 'Select a Tab';
          this.caption = '';
          break;
      } // return true

    },
    roundChange: function roundChange(page) {
      // console.log(page);
      // console.log(this.currentRound);
      this.currentRound = page;
    },
    cancelAutoUpdate: function cancelAutoUpdate() {
      clearInterval(this.timer);
    },
    fetchStats: function fetchStats(key) {
      var lastRdData = this.resultdata[this.total_rounds - 1];
      return _.sortBy(lastRdData, key).reverse();
    },
    tufflucky: function tufflucky() {
      var result = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'win';
      // method runs both luckystiff and tuffluck tables
      var data = this.resultdata; //JSON.parse(this.event_data.results);

      var players = _.map(this.players, 'post_title');

      var lsdata = [];

      var highsix = _.chain(players).map(function (n) {
        var res = _.chain(data).map(function (list) {
          return _.chain(list).filter(function (d) {
            return d['player'] === n && d['result'] === result;
          }).value();
        }).flattenDeep().sortBy('diff').value();

        if (result === 'win') {
          return _.first(res, 6);
        }

        return _.takeRight(res, 6);
      }).filter(function (n) {
        return n.length > 5;
      }).value();

      _.map(highsix, function (h) {
        var lastdata = _.takeRight(data);

        var diff = _.chain(h).map('diff').map(function (n) {
          return Math.abs(n);
        }).value();

        var name = h[0]['player'];

        var sum = _.reduce(diff, function (memo, num) {
          return memo + num;
        }, 0);

        var player_data = _.find(lastdata, {
          player: name
        });

        var mar = player_data['margin'];
        var won = player_data['points'];
        var loss = player_data['round'] - won; // push values into lsdata array

        lsdata.push({
          player: name,
          spread: diff,
          sum_spread: sum,
          cummulative_spread: mar,
          won_loss: "".concat(won, " - ").concat(loss)
        });
      });

      return _.sortBy(lsdata, 'sum_spread');
    },
    toNextRd: function toNextRd() {
      var x = this.total_rounds;
      var n = this.currentRound + 1;

      if (n <= x) {
        this.currentRound = n;
      }
    },
    toPrevRd: function toPrevRd() {
      var n = this.currentRound - 1;

      if (n >= 1) {
        this.currentRound = n;
      }
    },
    toFirstRd: function toFirstRd() {
      if (this.currentRound != 1) {
        this.currentRound = 1;
      }
    },
    toLastRd: function toLastRd() {
      // console.log(' going to last round')
      if (this.currentRound != this.total_rounds) {
        this.currentRound = this.total_rounds;
      }
    }
  },
  computed: _objectSpread({}, Vuex.mapGetters({
    players: 'PLAYERS',
    total_players: 'TOTALPLAYERS',
    resultdata: 'RESULTDATA',
    event_data: 'EVENTSTATS',
    error: 'ERROR',
    loading: 'LOADING',
    category: 'CATEGORY',
    total_rounds: 'TOTAL_ROUNDS',
    parent_slug: 'PARENTSLUG',
    event_title: 'EVENT_TITLE',
    tourney_title: 'TOURNEY_TITLE',
    logo: 'LOGO_URL'
  }), {
    breadcrumbs: function breadcrumbs() {
      return [{
        text: 'Tournaments',
        to: {
          name: 'TourneysList'
        }
      }, {
        text: this.tourney_title,
        to: {
          name: 'TourneyDetail',
          params: {
            slug: this.tourney_slug
          }
        }
      }, {
        text: this.category,
        active: true
      }];
    },
    error_msg: function error_msg() {
      return "We are currently experiencing network issues fetching this page ".concat(this.path, " ");
    }
  })
}); // export default CateDetail;

},{"./playerlist":2,"./scoreboard":3,"./stats":4,"./top":5}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PlayerStats = exports.Results = exports.PlayerList = exports.Standings = exports.Pairings = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var player_mixed_series = [{
  name: '',
  data: []
}];
var player_rank_series = [{
  name: '',
  data: []
}];
var player_radial_chart_series = [];
var player_radial_chart_config = {
  plotOptions: {
    radialBar: {
      hollow: {
        size: '50%'
      }
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
      colors: ['#f3f3f3', 'transparent'],
      // takes an array which will be repeated on columns
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
  template: "\n  <div class=\"col-lg-10 offset-lg-1 justify-content-center\">\n    <div class=\"row\">\n      <div class=\"col-lg-8 offset-lg-2\">\n        <div class=\"animated fadeInLeftBig\" id=\"pheader\">\n          <div class=\"d-flex align-items-center align-content-center justify-content-center mt-5\">\n            <div>\n              <h4 class=\"text-center bebas\">{{playerName}}\n                <span class=\"d-block mx-auto\" style=\"font-size:small\">\n                  <i class=\"mx-3 flag-icon\" :class=\"'flag-icon-'+player.country | lowercase\"\n                    :title=\"player.country_full\"></i>\n                  <i class=\"mx-3 fa\" :class=\"{'fa-male': player.gender == 'm',\n                   'fa-female': player.gender == 'f','fa-users': player.is_team == 'yes' }\" aria-hidden=\"true\">\n                  </i>\n                </span>\n              </h4>\n            </div>\n            <div>\n              <img width=\"100px\" height=\"100px\" class=\"img-thumbnail img-fluid mx-3 d-block shadow-sm\"\n                :src=\"player.photo\" />\n            </div>\n            <div>\n              <h4 class=\"text-center yanone mx-3\">{{pstats.pPosition}} position</h4>\n            </div>\n          </div>\n        </div> <!-- #pheader-->\n\n        <div class=\"d-flex align-items-center align-content-center justify-content-center\">\n          <b-btn v-b-toggle.collapse1 class=\"m-1\">Quick Stats</b-btn>\n          <b-btn v-b-toggle.collapse2 class=\"m-1\">Round by Round </b-btn>\n          <b-btn v-b-toggle.collapse3 class=\"m-1\">Charts</b-btn>\n          <b-button title=\"Close\" size=\"sm\" @click=\"closeCard()\" class=\"m-1\" variant=\"outline-danger\" :disabled=\"!show\"\n            :pressed.sync=\"show\"><i class=\"fas fa-times\"></i></b-button>\n        </div>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"col-lg-8 offset-lg-2\">\n        <b-collapse id=\"collapse1\">\n          <b-card class=\"animated flipInX\">\n            <div class=\"card-header text-center\">Quick Stats</div>\n            <ul class=\"list-group list-group-flush stats\">\n              <li class=\"list-group-item\">Points:\n                <span>{{pstats.pPoints}} / {{total_rounds}}</span>\n              </li>\n              <li class=\"list-group-item\">Rank:\n                <span>{{pstats.pRank}} </span>\n              </li>\n              <li class=\"list-group-item\">Highest Score:\n                <span>{{pstats.pHiScore}}</span> in round <em>{{pstats.pHiScoreRounds}}</em>\n              </li>\n              <li class=\"list-group-item\">Lowest Score:\n                <span>{{pstats.pLoScore}}</span> in round <em>{{pstats.pLoScoreRounds}}</em>\n              </li>\n              <li class=\"list-group-item\">Ave Score:\n                <span>{{pstats.pAve}}</span>\n              </li>\n              <li class=\"list-group-item\">Ave Opp Score:\n                <span>{{pstats.pAveOpp}}</span>\n              </li>\n            </ul>\n          </b-card>\n        </b-collapse>\n        <!---- Round By Round Results -->\n        <b-collapse id=\"collapse2\">\n          <b-card class=\"animated fadeInUp\">\n            <h4>Round By Round Summary </h4>\n            <ul class=\"list-group list-group-flush\" v-for=\"(report, i) in pstats.pRbyR\" :key=\"i\">\n              <li v-html=\"report.report\" v-if=\"report.result=='win'\" class=\"list-group-item list-group-item-success\">\n                {{report.report}}</li>\n              <li v-html=\"report.report\" v-else-if=\"report.result =='draw'\"\n                class=\"list-group-item list-group-item-warning\">{{report.report}}</li>\n              <li v-html=\"report.report\" v-else-if=\"report.result =='loss'\"\n                class=\"list-group-item list-group-item-danger\">{{report.report}}</li>\n              <li v-html=\"report.report\" v-else-if=\"report.result =='awaiting'\" class=\"list-group-item list-group-item-info\">\n                {{report.report}}</li>\n              <li v-html=\"report.report\" v-else class=\"list-group-item list-group-item-light\">{{report.report}}</li>\n            </ul>\n          </b-card>\n        </b-collapse>\n        <!-- Charts -->\n        <b-collapse id=\"collapse3\">\n          <b-card class=\"animated fadeInDown\">\n            <div class=\"card-header text-center\">Stats Charts</div>\n            <div class=\"d-flex align-items-center justify-content-center\">\n              <div>\n                <b-button @click=\"updateChart('mixed')\" variant=\"link\" class=\"text-decoration-none ml-1\"\n                  :disabled=\"chartModel=='mixed'\" :pressed=\"chartModel=='mixed'\"><i class=\"fas fa-file-csv\"\n                    aria-hidden=\"true\"></i> Mixed Scores</b-button>\n                <b-button @click=\"updateChart('rank')\" variant=\"link\" class=\"text-decoration-none ml-1\"\n                  :disabled=\"chartModel=='rank'\" :pressed=\"chartModel=='rank'\"><i class=\"fas fa-chart-line\"\n                    aria-hidden=\"true\"></i> Rank per Rd</b-button>\n                <b-button @click=\"updateChart('wins')\" variant=\"link\" class=\"text-decoration-none ml-1\"\n                  :disabled=\"chartModel=='wins'\" :pressed=\"chartModel=='wins'\"><i class=\"fas fa-balance-scale fa-stack\"\n                    aria-hidden=\"true\"></i> Starts/Replies Wins(%)</b-button>\n              </div>\n            </div>\n            <div id=\"chart\">\n              <apexchart v-if=\"chartModel=='mixed'\" type=line height=400 :options=\"chartOptions\"\n                :series=\"seriesMixed\" />\n              <apexchart v-if=\"chartModel=='rank'\" type='line' height=400 :options=\"chartOptionsRank\"\n                :series=\"seriesRank\" />\n              <apexchart v-if=\"chartModel=='wins'\" type=radialBar height=400 :options=\"chartOptRadial\"\n                :series=\"seriesRadial\" />\n            </div>\n          </b-card>\n        </b-collapse>\n      </div>\n    </div>\n  </div>\n  ",
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
            colors: ['#f3f3f3', 'transparent'],
            // takes an array which will be repeated on columns
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
      }; // Get the header


      var header = document.getElementById("pheader"); // Get the offset position of the navbar

      var sticky = header.offsetTop;
      var h = header.offsetHeight + 50; // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position

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
        this.chartOptionsRank.title.text = "Ranking: ".concat(this.playerName);
        this.chartOptionsRank.yaxis.min = 0;
        this.chartOptionsRank.yaxis.max = this.total_players;
        this.seriesRank = [{
          name: "".concat(firstName, " rank this rd"),
          data: this.allRanks
        }];
      }

      if ('mixed' == type) {
        this.setChartCategories();
        this.chartOptions.title.text = "Scores: ".concat(this.playerName);
        this.chartOptions.yaxis.min = 100;
        this.chartOptions.yaxis.max = 900;
        this.seriesMixed = [{
          name: "".concat(firstName),
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
  computed: _objectSpread({}, Vuex.mapGetters({
    total_rounds: 'TOTAL_ROUNDS',
    players: 'PLAYERS',
    showStats: 'SHOWSTATS'
  }))
});
exports.PlayerStats = PlayerStats;
var PlayerList = Vue.component('allplayers', {
  template: "\n  <div class=\"row justify-content-center align-items-center\" id=\"players-list\">\n      <template v-if=\"showStats\">\n         <playerstats :pstats=\"pStats\"></playerstats>\n      </template>\n      <template v-else>\n    <div class=\"playerCols col-lg-2 col-sm-6 col-12 p-4 \" v-for=\"player in players\" :key=\"player.id\" >\n            <h4 class=\"mx-auto\"><b-badge>{{player.tou_no}}</b-badge>\n            {{player.post_title }}\n            <span class=\"d-block mx-auto\"  style=\"font-size:small\">\n            <i class=\"mx-auto flag-icon\" :class=\"'flag-icon-'+player.country | lowercase\" :title=\"player.country_full\"></i>\n            <i class=\"ml-2 fa\" :class=\"{'fa-male': player.gender == 'm',\n        'fa-female': player.gender == 'f',\n        'fa-users': player.is_team == 'yes' }\"\n                    aria-hidden=\"true\"></i>\n             </span>\n            </h4>\n            <div class=\"mx-auto text-center animated fadeIn\">\n            <b-img-lazy v-bind=\"imgProps\" :alt=\"player.post_title\" :src=\"player.photo\" />\n                <span class=\"d-block mx-auto\">\n                <span @click=\"showPlayerStats(player.id)\" title=\"Open player's stats\"><i class=\"fas fa-chart-bar\" aria-hidden=\"true\"></i></span>\n                </span>\n          </div>\n       </div>\n      </template>\n    </div>\n    ",
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
        "class": 'shadow-sm'
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
  computed: _objectSpread({}, Vuex.mapGetters({
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
exports.PlayerList = PlayerList;
var Results = Vue.component('results', {
  template: "\n    <b-table hover responsive striped foot-clone :fields=\"results_fields\" :items=\"result(currentRound)\" head-variant=\"dark\" class=\"animated fadeInUp\">\n        <template slot=\"table-caption\">\n            {{caption}}\n        </template>\n    </b-table>\n    ",
  props: ['caption', 'currentRound', 'resultdata'],
  data: function data() {
    return {
      results_fields: []
    };
  },
  created: function created() {
    this.results_fields = [{
      key: 'rank',
      label: '#',
      "class": 'text-center',
      sortable: true
    }, {
      key: 'player',
      label: 'Player',
      sortable: true
    }, // { key: 'position',label: 'Position','class':'text-center'},
    {
      key: 'score',
      label: 'Score',
      "class": 'text-center',
      sortable: true,
      formatter: function formatter(value, key, item) {
        if (item.oppo_score == 0 && item.score == 0) {
          return 'AR';
        } else {
          return item.score;
        }
      }
    }, {
      key: 'oppo',
      label: 'Opponent'
    }, // { key: 'opp_position', label: 'Position','class': 'text-center'},
    {
      key: 'oppo_score',
      label: 'Score',
      "class": 'text-center',
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
      "class": 'text-center',
      sortable: true,
      formatter: function formatter(value, key, item) {
        if (item.oppo_score == 0 && item.score == 0) {
          return '-';
        }

        if (value > 0) {
          return "+".concat(value);
        }

        return "".concat(value);
      }
    }];
  },
  methods: {
    result: function result(r) {
      var round = r - 1;

      var data = _.clone(this.resultdata[round]);

      _.forEach(data, function (r) {
        var opp_no = r['oppo_no']; // Find where the opponent's current position and add to collection

        var row = _.find(data, {
          pno: opp_no
        });

        r['opp_position'] = row.position; // check result (win, loss, draw)

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
exports.Results = Results;
var Standings = Vue.component('standings', {
  template: "\n    <b-table responsive hover striped foot-clone :items=\"result(currentRound)\" :fields=\"standings_fields\" head-variant=\"dark\" class=\"animated fadeInUp\">\n        <template slot=\"table-caption\">\n            {{caption}}\n        </template>\n        <template>\n            <template slot=\"rank\" slot-scope=\"data\">\n            {{data.value.rank}}\n            </template>\n            <template slot=\"player\" slot-scope=\"data\">\n            {{data.value.player}}\n            </template>\n            <template slot=\"wonLost\"></template>\n            <template slot=\"margin\" slot-scope=\"data\">\n            {{data.value.margin}}\n            </template>\n            <template slot=\"lastGame\">\n            </template>\n        </template>\n    </b-table>\n   ",
  props: ['caption', 'currentRound', 'resultdata'],
  data: function data() {
    return {
      standings_fields: []
    };
  },
  mounted: function mounted() {
    this.standings_fields = [{
      key: 'rank',
      "class": 'text-center',
      sortable: true
    }, {
      key: 'player',
      "class": 'text-center'
    }, {
      key: 'wonLost',
      label: 'Win-Draw-Loss',
      "class": 'text-center',
      formatter: function formatter(value, key, item) {
        return "".concat(item.wins, " - ").concat(item.draws, " - ").concat(item.losses);
      }
    }, {
      key: 'points',
      label: 'Points',
      "class": 'text-center',
      formatter: function formatter(value, key, item) {
        if (item.ar > 0) {
          return "".concat(item.points, "*");
        }

        return "".concat(item.points);
      }
    }, {
      key: 'margin',
      label: 'Spread',
      "class": 'text-center',
      sortable: true,
      formatter: function formatter(value) {
        if (value > 0) {
          return "+".concat(value);
        }

        return "".concat(value);
      }
    }, {
      key: 'lastGame',
      label: 'Last Game',
      sortable: false,
      formatter: function formatter(value, key, item) {
        if (item.score == 0 && item.oppo_score == 0 && item.result == 'awaiting') {
          return "Awaiting result of game ".concat(item.round, " vs ").concat(item.oppo);
        } else {
          return "a ".concat(item.score, "-").concat(item.oppo_score, "\n            ").concat(item.result.toUpperCase(), " vs ").concat(item.oppo, " ");
        }
      }
    }];
  },
  methods: {
    result: function result(r) {
      var round = r - 1;

      var data = _.clone(this.resultdata[round]);

      _.forEach(data, function (r) {
        var opp_no = r['oppo_no']; // Find where the opponent's current position and add to collection

        var row = _.find(data, {
          pno: opp_no
        });

        r['opp_position'] = row['position']; // check result (win, loss, draw)

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
exports.Standings = Standings;
var Pairings = Vue.component('pairings', {
  template: "\n<table class=\"table table-hover table-responsive table-striped  animated fadeInUp\">\n    <caption>{{caption}}</caption>\n    <thead class=\"thead-dark\">\n        <tr>\n        <th scope=\"col\">#</th>\n        <th scope=\"col\">Player</th>\n        <th scope=\"col\">Opponent</th>\n        </tr>\n    </thead>\n    <tbody>\n        <tr v-for=\"(player,i) in pairing(currentRound)\" :key=\"i\">\n        <th scope=\"row\">{{i + 1}}</th>\n        <td><sup v-if=\"player.start =='y'\">*</sup>{{player.player}}</td>\n        <td><sup v-if=\"player.start =='n'\">*</sup>{{player.oppo}}</td>\n        </tr>\n    </tbody>\n  </table>\n",
  props: ['caption', 'currentRound', 'resultdata'],
  methods: {
    // get pairing
    pairing: function pairing(r) {
      var round = r - 1;
      var round_res = this.resultdata[round]; // Sort by player numbering if round 1 to obtain round 1 pairing

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
exports.Pairings = Pairings;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Scoreboard = Vue.component('scoreboard', {
  template: "\n  <div class=\"row d-flex align-items-center justify-content-center\">\n  <template v-if=\"loading||error\">\n        <div v-if=\"loading\" class=\"col align-self-center\">\n            <loading></loading>\n        </div>\n        <div v-if=\"error\" class=\"col align-self-center\">\n            <error>\n            <p slot=\"error\">{{error}}</p>\n            <p slot=\"error_msg\">{{error_msg}}</p>\n            </error>\n        </div>\n  </template>\n  <template v-else>\n  <div class=\"col\" id=\"scoreboard\">\n    <div class=\"row no-gutters d-flex align-items-center justify-content-center\" v-for=\"i in rowCount\" :key=\"i\">\n      <div class=\"col-lg-3 col-sm-6 col-12 \" v-for=\"player in itemCountInRow(i)\" :key=\"player.rank\">\n        <b-media class=\"pb-0 mb-1 mr-1\" vertical-align=\"center\">\n          <div slot=\"aside\">\n            <b-row class=\"justify-content-center\">\n              <b-col>\n                <b-img rounded=\"circle\" :src=\"player.photo\" width=\"50\" height=\"50\" :alt=\"player.player\" class=\"animated fadeIn\"/>\n              </b-col>\n            </b-row>\n            <b-row class=\"justify-content-center\">\n              <b-col cols=\"12\" md=\"auto\">\n                <span class=\"flag-icon\" :title=\"player.country_full\"\n                  :class=\"'flag-icon-'+player.country | lowercase\"></span>\n              </b-col>\n              <b-col col lg=\"2\">\n                <i class=\"fa\" v-bind:class=\"{'fa-male': player.gender === 'm',\n                     'fa-female': player.gender === 'f' }\" aria-hidden=\"true\"></i>\n              </b-col>\n            </b-row>\n            <b-row class=\"text-center\" v-if=\"player.team\">\n              <b-col><span>{{player.team}}</span></b-col>\n            </b-row>\n            <b-row>\n              <b-col class=\"text-white\" v-bind:class=\"{'text-warning': player.result === 'draw',\n             'text-info': player.result === 'awaiting',\n             'text-danger': player.result === 'loss',\n             'text-success': player.result === 'win' }\">\n                <h4 class=\"text-center position  mt-1\">\n                  {{player.position}}\n                  <i class=\"fa\" v-bind:class=\"{'fa-long-arrow-up': player.rank < player.lastrank,'fa-long-arrow-down': player.rank > player.lastrank,\n                 'fa-arrows-h': player.rank == player.lastrank }\" aria-hidden=\"true\"></i>\n                </h4>\n              </b-col>\n            </b-row>\n          </div>\n          <h5 class=\"m-0  animated fadeInLeft\">{{player.player}}</h5>\n          <p class=\"card-text mt-0\">\n            <span class=\"sdata points p-1\">{{player.points}}-{{player.losses}}</span>\n            <span class=\"sdata mar\">{{player.margin | addplus}}</span>\n            <span class=\"sdata p1\">was {{player.lastposition}}</span>\n          </p>\n          <div class=\"row\">\n            <b-col>\n              <span v-if=\"player.result =='awaiting' \" class=\"bg-info d-inline p-1 ml-1 text-white result\">{{\n                                   player.result | firstchar }}</span>\n              <span v-else class=\"d-inline p-1 ml-1 text-white result\" v-bind:class=\"{'bg-warning': player.result === 'draw',\n                         'bg-danger': player.result === 'loss',\n                         'bg-info': player.result === 'awaiting',\n                         'bg-success': player.result === 'win' }\">\n                {{player.result | firstchar}}</span>\n              <span v-if=\"player.result =='awaiting' \" class=\"text-info d-inline p-1  sdata\">Awaiting\n                Result</span>\n              <span v-else class=\"d-inline p-1 sdata\" v-bind:class=\"{'text-warning': player.result === 'draw',\n                       'text-danger': player.result === 'loss',\n                       'text-success': player.result === 'win' }\">{{player.score}}\n                - {{player.oppo_score}}</span>\n              <span class=\"d-block p-0 ml-1 opp\">vs {{player.oppo}}</span>\n            </b-col>\n          </div>\n          <div class=\"row align-content-center\">\n            <b-col>\n              <span :title=\"res\" v-for=\"res in player.prevresults\" :key=\"res.key\"\n                class=\"d-inline-block p-1 text-white sdata-res text-center\" v-bind:class=\"{'bg-warning': res === 'draw',\n                     'bg-info': res === 'awaiting',\n                     'bg-danger': res === 'loss',\n                     'bg-success': res === 'win' }\">{{res|firstchar}}</span>\n            </b-col>\n          </div>\n        </b-media>\n      </div>\n    </div>\n  </div>\n  </template>\n</div>\n    ",
  data: function data() {
    return {
      itemsPerRow: 4,
      per_page: 40,
      parent_slug: this.$route.params.slug,
      pageurl: baseURL + this.$route.path,
      slug: this.$route.params.event_slug,
      reloading: false,
      currentPage: 1,
      period: 0.5,
      timer: null,
      scoreboard_data: [],
      response_data: [],
      // players: [],
      // total_rounds: 0,
      currentRound: null,
      event_title: '',
      is_live_game: true
    };
  },
  mounted: function mounted() {
    // this.fetchScoreboardData();
    this.processDetails(this.currentPage);
    this.timer = setInterval(function () {
      this.reload();
    }.bind(this), this.period * 60000);
  },
  beforeDestroy: function beforeDestroy() {
    // window.removeEventListener('resize', this.getWindowWidth);
    this.cancelAutoUpdate();
  },
  methods: {
    cancelAutoUpdate: function cancelAutoUpdate() {
      clearInterval(this.timer);
    },
    fetchScoreboardData: function fetchScoreboardData() {
      this.$store.dispatch('FETCH_DATA', this.slug);
      console.log(this.slug);
    },
    reload: function reload() {
      if (this.is_live_game == true) {
        this.processDetails(this.currentPage);
      }
    },
    itemCountInRow: function itemCountInRow(index) {
      return this.scoreboard_data.slice((index - 1) * this.itemsPerRow, index * this.itemsPerRow);
    },
    processDetails: function processDetails(currentPage) {
      var _this = this;

      console.log(this.result_data);
      var resultdata = this.result_data;

      var initialRdData = _.initial(_.clone(resultdata));

      var previousRdData = _.last(initialRdData);

      var lastRdD = _.last(_.clone(resultdata));

      var lastRdData = _.map(lastRdD, function (player) {
        var x = player.pno - 1;
        player.photo = _this.players[x].photo;
        player.gender = _this.players[x].gender;
        player.country_full = _this.players[x].country_full;
        player.country = _this.players[x].country; // if (
        //   player.result == 'draw' &&
        //   player.score == 0 &&
        //   player.oppo_score == 0
        // ) {
        //   player.result = 'AR';
        // }

        if (previousRdData) {
          var playerData = _.find(previousRdData, {
            player: player.player
          });

          player.lastposition = playerData['position'];
          player.lastrank = playerData['rank']; // previous rounds results

          player.prevresults = _.chain(initialRdData).flattenDeep().filter(function (v) {
            return v.player === player.player;
          }).map('result').value();
        }

        return player;
      }); // this.total_rounds = resultdata.length;


      this.currentRound = lastRdData[0].round;

      var chunks = _.chunk(lastRdData, this.total_players); // this.reloading = false


      this.scoreboard_data = chunks[currentPage - 1];
    }
  },
  computed: _objectSpread({}, Vuex.mapGetters({
    result_data: 'RESULTDATA',
    players: 'PLAYERS',
    total_players: 'TOTALPLAYERS',
    total_rounds: 'TOTAL_ROUNDS',
    loading: 'LOADING',
    error: 'ERROR',
    category: 'CATEGORY'
  }), {
    rowCount: function rowCount() {
      return Math.ceil(this.scoreboard_data.length / this.itemsPerRow);
    },
    error_msg: function error_msg() {
      return "We are currently experiencing network issues fetching this page ".concat(this.pageurl, " ");
    }
  })
});
var _default = Scoreboard;
exports["default"] = _default;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoSpread = exports.HiSpread = exports.AveOppScores = exports.AveScores = exports.TotalOppScores = exports.TotalScores = exports.ComboScores = exports.HiLoss = exports.LoWins = exports.HiWins = void 0;
var LoWins = Vue.component('lowins', {
  template: "<!-- Low Winning Scores -->\n    <b-table responsive hover striped foot-clone :items=\"getLowScore('win')\" :fields=\"lowwins_fields\" head-variant=\"dark\">\n        <template slot=\"table-caption\">\n            {{caption}}\n        </template>\n    </b-table>\n    ",
  props: ['caption', 'resultdata'],
  data: function data() {
    return {
      lowwins_fields: []
    };
  },
  beforeMount: function beforeMount() {
    this.lowwins_fields = [{
      key: 'round',
      sortable: true
    }, {
      key: 'score',
      label: 'Winning Score',
      sortable: true
    }, {
      key: 'player',
      label: 'Winner',
      sortable: true
    }, {
      key: 'oppo_score',
      label: 'Losing Score'
    }, {
      key: 'oppo',
      label: 'Loser'
    }];
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
exports.LoWins = LoWins;
var HiWins = Vue.component('hiwins', {
  template: "<!-- High Winning Scores -->\n    <b-table  responsive hover striped foot-clone :items=\"getHiScore('win')\" :fields=\"highwins_fields\" head-variant=\"dark\">\n        <template slot=\"table-caption\">\n            {{caption}}\n        </template>\n    </b-table>",
  props: ['caption', 'resultdata'],
  data: function data() {
    return {
      highwins_fields: []
    };
  },
  beforeMount: function beforeMount() {
    this.highwins_fields = [{
      key: 'round',
      sortable: true
    }, {
      key: 'score',
      label: 'Winning Score',
      sortable: true
    }, {
      key: 'player',
      label: 'Winner',
      sortable: true
    }, {
      key: 'oppo_score',
      label: 'Losing Score'
    }, {
      key: 'oppo',
      label: 'Loser'
    }];
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
exports.HiWins = HiWins;
var HiLoss = Vue.component('hiloss', {
  template: "\n    <!-- High Losing Scores -->\n   <b-table  responsive hover striped foot-clone :items=\"getHiScore('loss')\" :fields=\"hiloss_fields\" head-variant=\"dark\">\n        <template slot=\"table-caption\">\n            {{caption}}\n        </template>\n    </b-table>\n",
  props: ['caption', 'resultdata'],
  data: function data() {
    return {
      hiloss_fields: []
    };
  },
  beforeMount: function beforeMount() {
    this.hiloss_fields = [{
      key: 'round',
      sortable: true
    }, {
      key: 'score',
      label: 'Losing Score',
      sortable: true
    }, {
      key: 'player',
      label: 'Loser',
      sortable: true
    }, {
      key: 'oppo_score',
      label: 'Winning Score'
    }, {
      key: 'oppo',
      label: 'Winner'
    }];
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
exports.HiLoss = HiLoss;
var ComboScores = Vue.component('comboscores', {
  template: "\n  <b-table  responsive hover striped foot-clone :items=\"hicombo()\" :fields=\"hicombo_fields\" head-variant=\"dark\">\n    <template slot=\"table-caption\">\n        {{caption}}\n    </template>\n  </b-table>\n",
  props: ['caption', 'resultdata'],
  data: function data() {
    return {
      hicombo_fields: []
    };
  },
  beforeMount: function beforeMount() {
    this.hicombo_fields = [{
      key: 'round',
      sortable: true
    }, {
      key: 'combo_score',
      label: 'Combined Score',
      sortable: true,
      "class": 'text-center'
    }, {
      key: 'score',
      label: 'Winning Score',
      "class": 'text-center',
      sortable: true
    }, {
      key: 'oppo_score',
      label: 'Losing Score',
      "class": 'text-center',
      sortable: true
    }, {
      key: 'player',
      label: 'Winner',
      "class": 'text-center'
    }, {
      key: 'oppo',
      label: 'Loser',
      "class": 'text-center'
    }];
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
exports.ComboScores = ComboScores;
var TotalScores = Vue.component('totalscores', {
  template: "\n    <b-table   responsive hover striped foot-clone :items=\"stats\" :fields=\"totalscore_fields\" head-variant=\"dark\">\n        <template slot=\"table-caption\">\n            {{caption}}\n        </template>\n        <template slot=\"index\" slot-scope=\"data\">\n            {{data.index + 1}}\n        </template>\n    </b-table>\n",
  props: ['caption', 'stats'],
  data: function data() {
    return {
      totalscore_fields: []
    };
  },
  beforeMount: function beforeMount() {
    this.totalscore_fields = ['index', {
      key: 'position',
      sortable: true
    }, {
      key: 'total_score',
      label: 'Total Score',
      "class": 'text-center',
      sortable: true
    }, {
      key: 'player',
      label: 'Player',
      "class": 'text-center'
    }, {
      key: 'wonLost',
      label: 'Won-Lost',
      sortable: false,
      "class": 'text-center',
      formatter: function formatter(value, key, item) {
        var loss = item.round - item.points;
        return "".concat(item.points, " - ").concat(loss);
      }
    }, {
      key: 'margin',
      label: 'Spread',
      "class": 'text-center',
      formatter: function formatter(value) {
        if (value > 0) {
          return "+".concat(value);
        }

        return "".concat(value);
      }
    }];
  }
});
exports.TotalScores = TotalScores;
var TotalOppScores = Vue.component('oppscores', {
  template: "\n    <b-table   responsive hover striped foot-clone :items=\"stats\" :fields=\"totaloppscore_fields\" head-variant=\"dark\">\n            <template slot=\"table-caption\">\n                {{caption}}\n            </template>\n            <template slot=\"index\" slot-scope=\"data\">\n                {{data.index + 1}}\n            </template>\n    </b-table>\n",
  props: ['caption', 'stats'],
  data: function data() {
    return {
      totaloppscore_fields: []
    };
  },
  beforeMount: function beforeMount() {
    this.totaloppscore_fields = ['index', {
      key: 'position',
      sortable: true
    }, {
      key: 'total_oppscore',
      label: 'Total Opponent Score',
      "class": 'text-center',
      sortable: true
    }, {
      key: 'player',
      label: 'Player',
      "class": 'text-center'
    }, {
      key: 'wonLost',
      label: 'Won-Lost',
      sortable: false,
      "class": 'text-center',
      formatter: function formatter(value, key, item) {
        var loss = item.round - item.points;
        return "".concat(item.points, " - ").concat(loss);
      }
    }, {
      key: 'margin',
      label: 'Spread',
      "class": 'text-center',
      formatter: function formatter(value) {
        if (value > 0) {
          return "+".concat(value);
        }

        return "".concat(value);
      }
    }];
  }
});
exports.TotalOppScores = TotalOppScores;
var AveScores = Vue.component('avescores', {
  template: "\n    <b-table  responsive hover striped foot-clone :items=\"stats\" :fields=\"avescore_fields\" head-variant=\"dark\">\n        <template slot=\"table-caption\">\n            {{caption}}\n        </template>\n        <template slot=\"index\" slot-scope=\"data\">\n            {{data.index + 1}}\n        </template>\n    </b-table>\n",
  props: ['caption', 'stats'],
  data: function data() {
    return {
      avescore_fields: []
    };
  },
  beforeMount: function beforeMount() {
    this.avescore_fields = ['index', {
      key: 'position',
      sortable: true
    }, {
      key: 'ave_score',
      label: 'Average Score',
      "class": 'text-center',
      sortable: true
    }, {
      key: 'player',
      label: 'Player',
      "class": 'text-center'
    }, {
      key: 'wonLost',
      label: 'Won-Lost',
      sortable: false,
      "class": 'text-center',
      formatter: function formatter(value, key, item) {
        var loss = item.round - item.points;
        return "".concat(item.points, " - ").concat(loss);
      }
    }, {
      key: 'margin',
      label: 'Spread',
      "class": 'text-center',
      formatter: function formatter(value) {
        if (value > 0) {
          return "+".concat(value);
        }

        return "".concat(value);
      }
    }];
  }
});
exports.AveScores = AveScores;
var AveOppScores = Vue.component('aveoppscores', {
  template: "\n    <b-table  hover responsive striped foot-clone :items=\"stats\" :fields=\"aveoppscore_fields\" head-variant=\"dark\">\n        <template slot=\"table-caption\">\n            {{caption}}\n        </template>\n        <template slot=\"index\" slot-scope=\"data\">\n            {{data.index + 1}}\n        </template>\n    </b-table>\n",
  props: ['caption', 'stats'],
  data: function data() {
    return {
      aveoppscore_fields: []
    };
  },
  beforeMount: function beforeMount() {
    this.aveoppscore_fields = ['index', {
      key: 'position',
      sortable: true
    }, {
      key: 'ave_opp_score',
      label: 'Average Opponent Score',
      "class": 'text-center',
      sortable: true
    }, {
      key: 'player',
      label: 'Player',
      "class": 'text-center'
    }, {
      key: 'wonLost',
      label: 'Won-Lost',
      sortable: false,
      "class": 'text-center',
      formatter: function formatter(value, key, item) {
        var loss = item.round - item.points;
        return "".concat(item.points, " - ").concat(loss);
      }
    }, {
      key: 'margin',
      label: 'Spread',
      "class": 'text-center',
      formatter: function formatter(value) {
        if (value > 0) {
          return "+".concat(value);
        }

        return "".concat(value);
      }
    }];
  }
});
exports.AveOppScores = AveOppScores;
var LoSpread = Vue.component('lospread', {
  template: "\n    <b-table  responsive hover striped foot-clone :items=\"loSpread()\" :fields=\"lospread_fields\" head-variant=\"dark\">\n        <template slot=\"table-caption\">\n            {{caption}}\n        </template>\n    </b-table>\n",
  props: ['caption', 'resultdata'],
  data: function data() {
    return {
      lospread_fields: []
    };
  },
  beforeMount: function beforeMount() {
    this.lospread_fields = ['round', {
      key: 'diff',
      label: 'Spread',
      sortable: true
    }, {
      key: 'score',
      label: 'Winning Score',
      sortable: true
    }, {
      key: 'oppo_score',
      label: 'Losing Score',
      sortable: true
    }, {
      key: 'player',
      label: 'Winner',
      sortable: true
    }, {
      key: 'oppo',
      label: 'Loser',
      sortable: true
    }];
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
exports.LoSpread = LoSpread;
var HiSpread = Vue.component('hispread', {
  template: "\n    <b-table  responsive hover striped foot-clone :items=\"hiSpread()\" :fields=\"hispread_fields\" head-variant=\"dark\">\n        <template slot=\"table-caption\">\n            {{caption}}\n        </template>\n    </b-table>\n    ",
  props: ['caption', 'resultdata'],
  data: function data() {
    return {
      hispread_fields: []
    };
  },
  beforeMount: function beforeMount() {
    this.hispread_fields = ['round', {
      key: 'diff',
      label: 'Spread',
      sortable: true
    }, {
      key: 'score',
      label: 'Winning Score',
      sortable: true
    }, {
      key: 'oppo_score',
      label: 'Losing Score',
      sortable: true
    }, {
      key: 'player',
      label: 'Winner',
      sortable: true
    }, {
      key: 'oppo',
      label: 'Loser',
      sortable: true
    }];
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
exports.HiSpread = HiSpread;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var mapGetters = Vuex.mapGetters;
var topPerformers = Vue.component('top-stats', {
  template: "\n  <div class=\"col-lg-10 offset-lg-1 justify-content-center\">\n    <div class=\"row\">\n      <div class=\"col-lg-2 col-sm-4 col-12\">\n        <div class=\"mt-5 d-flex flex-column align-content-center align-items-center justify-content-center\">\n          <b-button variant=\"btn-outline-success\" title=\"Top 3\" class=\"m-2 btn-block\" @click=\"showPic('top3')\" :pressed=\"currentView=='top3'\">\n            <i class=\"fas fa-trophy m-1\" aria-hidden=\"true\"></i>Top 3</b-button>\n          <b-button variant=\"btn-outline-success\" title=\"Highest Game Scores\" class=\"m-2 btn-block\" @click=\"showPic('higames')\" :pressed=\"currentView=='higames'\">\n            <i class=\"fas fa-bullseye m-1\" aria-hidden=\"true\"></i>High Games</b-button>\n          <b-button variant=\"btn-outline-success\" title=\"Highest Average Scores\" class=\"m-2 btn-block\" :pressed=\"currentView=='hiaves'\"\n            @click=\"showPic('hiaves')\">\n            <i class=\"fas fa-thumbs-up m-1\" aria-hidden=\"true\"></i>High Ave. Scores</b-button>\n          <b-button variant=\"btn-outline-success\" title=\"Lowest Average Opponent Scores\" class=\"m-2 btn-block\" @click=\"showPic('looppaves')\" :pressed=\"currentView=='looppaves'\">\n            <i class=\"fas fa-beer mr-1\" aria-hidden=\"true\"></i>Low Opp Ave</b-button>\n        </div>\n      </div>\n      <div class=\"col-lg-10 col-sm-8 col-12\">\n        <div class=\"row\">\n          <div class=\"col-12 justify-content-center align-content-center\">\n            <h3>{{title}}</h3>\n          </div>\n        </div>\n        <div class=\"row\">\n          <div class=\"col-sm-4 col-12 animated fadeInRightBig\" v-for=\"(item, index) in stats\">\n            <h4 class=\"p-2 text-center bebas bg-dark text-white\">{{item.player}}</h4>\n            <div class=\"d-flex flex-column justify-content-center align-items-center\">\n              <img :src=\"players[item.pno-1].photo\" width='120' height='120' class=\"img-fluid rounded-circle\"\n                :alt=\"players[item.pno-1].post_title|lowercase\">\n              <span class=\"d-block ml-5\">\n                <i class=\"mx-1 flag-icon\" :class=\"'flag-icon-'+players[item.pno-1].country | lowercase\"\n                  :title=\"players[item.pno-1].country_full\"></i>\n                <i class=\"mx-1 fa\"\n                  :class=\"{'fa-male': players[item.pno-1].gender == 'm', 'fa-female': players[item.pno-1].gender == 'f'}\"\n                  aria-hidden=\"true\">\n                </i>\n              </span>\n            </div>\n            <div class=\"d-flex flex-row justify-content-center align-content-center bg-dark text-white\">\n              <span class=\"mx-1 display-5 d-inline-block align-self-center\" v-if=\"item.points\">{{item.points}}</span>\n              <span class=\"mx-1 display-5 d-inline-block align-self-center\" v-if=\"item.margin\">{{item.margin|addplus}}</span>\n              <span class=\"mx-1 text-center display-5 d-inline-block align-self-center\" v-if=\"item.score\">Round {{item.round}} vs {{item.oppo}}</span>\n            </div>\n            <div class=\"d-flex justify-content-center align-items-center bg-success text-white\">\n              <div v-if=\"item.score\" class=\"display-4 yanone d-inline-flex\">{{item.score}}</div>\n              <div v-if=\"item.position\" class=\"display-4 yanone d-inline-flex\">{{item.position}}</div>\n              <div v-if=\"item.ave_score\" class=\"display-4 yanone d-inline-flex\">{{item.ave_score}}</div>\n              <div v-if=\"item.ave_opp_score\" class=\"display-4 yanone d-inline-flex\">{{item.ave_opp_score}}</div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n  ",
  data: function data() {
    return {
      title: '',
      profiles: [],
      stats: [],
      currentView: ''
    };
  },
  created: function created() {
    this.showPic('top3');
  },
  methods: {
    showPic: function showPic(t) {
      this.currentView = t;
      var stats = [];

      if (t == 'hiaves') {
        arr = this.getStats('ave_score');
        r = _.take(arr, 3).map(function (p) {
          return _.pick(p, ['player', 'pno', 'ave_score']);
        });
        this.title = 'Highest Average Scores';
      }

      if (t == 'looppaves') {
        arr = this.getStats('ave_opp_score');
        r = _.takeRight(arr, 3).reverse().map(function (p) {
          return _.pick(p, ['player', 'pno', 'ave_opp_score']);
        });
        this.title = 'Lowest Opponent Average Scores';
      }

      if (t == 'higames') {
        arr = this.computeStats();
        r = _.take(arr, 3).map(function (p) {
          return _.pick(p, ['player', 'pno', 'score', 'round', 'oppo']);
        });
        this.title = 'High Game Scores';
      }

      if (t == 'top3') {
        arr = this.getStats('points');
        s = _.sortBy(arr, ['points', 'margin']).reverse();
        r = _.take(s, 3).map(function (p) {
          return _.pick(p, ['player', 'pno', 'points', 'margin', 'position']);
        });
        this.title = 'Top 3';
      }

      this.stats = r; // this.profiles = this.players[r.pno-1];
    },
    getStats: function getStats(key) {
      return _.sortBy(this.finalstats, key).reverse();
    },
    computeStats: function computeStats() {
      var data = _.clone(this.resultdata);

      return _.chain(data).map(function (r) {
        return _.chain(r).map(function (m) {
          return m;
        }).filter(function (n) {
          return n['result'] === 'win';
        }).maxBy(function (w) {
          return w.score;
        }).value();
      }).sortBy('score').value().reverse();
    }
  },
  computed: _objectSpread({}, mapGetters({
    players: 'PLAYERS',
    total_rounds: 'TOTAL_ROUNDS',
    finalstats: 'FINAL_ROUND_STATS',
    resultdata: 'RESULTDATA',
    ongoing: 'ONGOING_TOURNEY'
  }))
});
var _default = topPerformers;
exports["default"] = _default;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ2dWUvcGFnZXMvY2F0ZWdvcnkuanMiLCJ2dWUvcGFnZXMvcGxheWVybGlzdC5qcyIsInZ1ZS9wYWdlcy9zY29yZWJvYXJkLmpzIiwidnVlL3BhZ2VzL3N0YXRzLmpzIiwidnVlL3BhZ2VzL3RvcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDR0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7QUFOQTtBQUNBLElBQUksWUFBSixFQUFrQixVQUFsQjtBQU1BLElBQUksVUFBVSxHQUFHLEdBQUcsQ0FBQyxTQUFKLENBQWMsTUFBZCxFQUFzQjtBQUNyQyxFQUFBLFFBQVEsNnhPQUQ2QjtBQXlIckMsRUFBQSxVQUFVLEVBQUU7QUFDVixJQUFBLE9BQU8sRUFBRSxZQURDO0FBRVYsSUFBQSxLQUFLLEVBQUUsVUFGRztBQUdWLElBQUEsVUFBVSxFQUFFLHNCQUhGO0FBSVYsSUFBQSxRQUFRLEVBQUUsb0JBSkE7QUFLVixJQUFBLE9BQU8sRUFBRSxtQkFMQztBQU1WLElBQUEsU0FBUyxFQUFFLHFCQU5EO0FBT1YsSUFBQSxNQUFNLEVBQUUsYUFQRTtBQVFWLElBQUEsTUFBTSxFQUFFLGFBUkU7QUFTVixJQUFBLEtBQUssRUFBRSxhQVRHO0FBVVYsSUFBQSxXQUFXLEVBQUUsa0JBVkg7QUFXVixJQUFBLFdBQVcsRUFBRSxrQkFYSDtBQVlWLElBQUEsU0FBUyxFQUFFLHFCQVpEO0FBYVYsSUFBQSxTQUFTLEVBQUUsZ0JBYkQ7QUFjVixJQUFBLFlBQVksRUFBRSxtQkFkSjtBQWVWLElBQUEsUUFBUSxFQUFFLGVBZkE7QUFnQlYsSUFBQSxRQUFRLEVBQUUsZUFoQkE7QUFpQlY7QUFDQTtBQUNBLElBQUEsVUFBVSxFQUFFLHNCQW5CRjtBQW9CVixJQUFBLFVBQVUsRUFBRTtBQXBCRixHQXpIeUI7QUErSXJDLEVBQUEsSUFBSSxFQUFFLGdCQUFXO0FBQ2YsV0FBTztBQUNMO0FB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R0FnQkosT0FoQkksRUFBUDtBQWlCRDtBQTVETSxHQW5Fb0M7QUFpSTdDLEVBQUEsUUFBUSxvQkFDSCxVQUFVLENBQUM7QUFDWixJQUFBLE9BQU8sRUFBRSxTQURHO0FBRVosSUFBQSxZQUFZLEVBQUUsY0FGRjtBQUdaLElBQUEsVUFBVSxFQUFFLG1CQUhBO0FBSVosSUFBQSxVQUFVLEVBQUUsWUFKQTtBQUtaLElBQUEsT0FBTyxFQUFFO0FBTEcsR0FBRCxDQURQO0FBaklxQyxDQUEzQixDQUFwQjtlQTJJZSxhIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8gaW1wb3J0IHtMb2FkaW5nQWxlcnQsIEVycm9yQWxlcnR9IGZyb20gJy4vYWxlcnRzJztcclxubGV0IExvYWRpbmdBbGVydCwgRXJyb3JBbGVydDtcclxuXHJcbmltcG9ydCB7IFBhaXJpbmdzLCBTdGFuZGluZ3MsIFBsYXllckxpc3QsIFJlc3VsdHMsIFBsYXllclN0YXRzIH0gZnJvbSAnLi9wbGF5ZXJsaXN0JztcclxuaW1wb3J0IHsgSGlXaW5zLCBMb1dpbnMsIEhpTG9zcywgQ29tYm9TY29yZXMsIFRvdGFsU2NvcmVzLCBUb3RhbE9wcFNjb3JlcywgQXZlU2NvcmVzLCBBdmVPcHBTY29yZXMsIEhpU3ByZWFkLCBMb1NwcmVhZCB9IGZyb20gJy4vc3RhdHMnO1xyXG5pbXBvcnQgU2NvcmVib2FyZCBmcm9tICcuL3Njb3JlYm9hcmQnO1xyXG5pbXBvcnQgdG9wUGVyZm9ybWVycyBmcm9tICcuL3RvcCc7XHJcbnZhciBDYXRlRGV0YWlsID0gVnVlLmNvbXBvbmVudCgnY2F0ZScsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lci1mbHVpZFwiPlxyXG4gICAgPGRpdiB2LWlmPVwicmVzdWx0ZGF0YVwiIGNsYXNzPVwicm93IG5vLWd1dHRlcnMganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyXCI+XHJcbiAgICAgICAgICAgIDxiLWJyZWFkY3J1bWIgOml0ZW1zPVwiYnJlYWRjcnVtYnNcIiAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IHYtaWY9XCJsb2FkaW5nfHxlcnJvclwiIGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24tY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgPGRpdiB2LWlmPVwibG9hZGluZ1wiIGNsYXNzPVwiY29sIGFsaWduLXNlbGYtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxsb2FkaW5nPjwvbG9hZGluZz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IHYtaWY9XCJlcnJvclwiIGNsYXNzPVwiY29sIGFsaWduLXNlbGYtY2VudGVyXCI+XHJcbiAgICAgICAgICA8ZXJyb3I+XHJcbiAgICAgICAgICA8cCBzbG90PVwiZXJyb3JcIj57e2Vycm9yfX08L3A+XHJcbiAgICAgICAgICA8cCBzbG90PVwiZXJyb3JfbXNnXCI+e3tlcnJvcl9tc2d9fTwvcD5cclxuICAgICAgICAgIDwvZXJyb3I+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIDx0ZW1wbGF0ZSB2LWlmPVwiIShlcnJvcnx8bG9hZGluZylcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTIgZC1mbGV4XCI+XHJcbiAgICAgICAgICAgICAgPGItaW1nIGNsYXNzPVwidGh1bWJuYWlsIGxvZ28gbWwtYXV0b1wiIDpzcmM9XCJsb2dvXCIgOmFsdD1cImV2ZW50X3RpdGxlXCIgLz5cclxuICAgICAgICAgICAgICA8aDIgY2xhc3M9XCJ0ZXh0LWxlZnQgYmViYXNcIj57eyBldmVudF90aXRsZSB9fVxyXG4gICAgICAgICAgICAgIDxzcGFuIDp0aXRsZT1cInRvdGFsX3JvdW5kcysgJyByb3VuZHMsICcgKyB0b3RhbF9wbGF5ZXJzICsnIHBsYXllcnMnXCIgdi1zaG93PVwidG90YWxfcm91bmRzXCIgY2xhc3M9XCJ0ZXh0LWNlbnRlciBkLWJsb2NrXCI+e3sgdG90YWxfcm91bmRzIH19IEdhbWVzICAge3sgdG90YWxfcGxheWVyc319IDxpIGNsYXNzPVwiZmFzIGZhLXVzZXJzXCI+PC9pPiA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9oMj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGQtZmxleCBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRleHQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8Yi1idXR0b24gQGNsaWNrPVwidmlld0luZGV4PTBcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmVcIiA6ZGlzYWJsZWQ9XCJ2aWV3SW5kZXg9PTBcIiA6cHJlc3NlZD1cInZpZXdJbmRleD09MFwiPjxpIGNsYXNzPVwiZmEgZmEtdXNlcnNcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+IFBsYXllcnM8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uIEBjbGljaz1cInZpZXdJbmRleD0xXCIgdmFyaWFudD1cImxpbmtcIiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lXCIgOmRpc2FibGVkPVwidmlld0luZGV4PT0xXCIgOnByZXNzZWQ9XCJ2aWV3SW5kZXg9PTFcIj4gPGkgY2xhc3M9XCJmYSBmYS11c2VyLXBsdXNcIj48L2k+IFBhaXJpbmdzPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiBAY2xpY2s9XCJ2aWV3SW5kZXg9MlwiIHZhcmlhbnQ9XCJsaW5rXCIgY2xhc3M9XCJ0ZXh0LWRlY29yYXRpb24tbm9uZVwiIDpkaXNhYmxlZD1cInZpZXdJbmRleD09MlwiIDpwcmVzc2VkPVwidmlld0luZGV4PT0yXCI+PGkgY2xhc3M9XCJmYXMgZmEtc3RpY2t5LW5vdGVcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+IFJlc3VsdHM8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uIEBjbGljaz1cInZpZXdJbmRleD0zXCIgdmFyaWFudD1cImxpbmtcIiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lXCIgOmRpc2FibGVkPVwidmlld0luZGV4PT0zXCIgOnByZXNzZWQ9XCJ2aWV3SW5kZXg9PTNcIj48aSBjbGFzcz1cImZhcyBmYS1zb3J0LW51bWVyaWMtZG93biAgICBcIj48L2k+IFN0YW5kaW5nczwvYi1idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8Yi1idXR0b24gQGNsaWNrPVwidmlld0luZGV4PTRcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmVcIiA6ZGlzYWJsZWQ9XCJ2aWV3SW5kZXg9PTRcIiA6cHJlc3NlZD1cInZpZXdJbmRleD09NFwiPjxpIGNsYXNzPVwiZmFzIGZhLWNoYXJ0LXBpZVwiPjwvaT4gU3RhdGlzdGljczwvYi1idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8IS0tLVxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uICBAY2xpY2s9XCJ2aWV3SW5kZXg9NVwiIDp0bz1cInsgbmFtZTogJ1Njb3JlYm9hcmQnLCBwYXJhbXM6IHsgZXZlbnRfc2x1Zzogc2x1Z319XCIgIHZhcmlhbnQ9XCJsaW5rXCIgY2xhc3M9XCJ0ZXh0LWRlY29yYXRpb24tbm9uZVwiIGFjdGl2ZS1jbGFzcz1cImN1cnJlbnRWaWV3XCIgOmRpc2FibGVkPVwidmlld0luZGV4PT01XCIgOnByZXNzZWQ9XCJ2aWV3SW5kZXg9PTVcIj48aSBjbGFzcz1cImZhcyBmYS1jaGFsa2JvYXJkLXRlYWNoZXJcIj48L2k+XHJcbiAgICAgICAgICAgICAgICBTY29yZWJvYXJkPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICAgIC0tPlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uICBAY2xpY2s9XCJ2aWV3SW5kZXg9NVwiIHZhcmlhbnQ9XCJsaW5rXCIgY2xhc3M9XCJ0ZXh0LWRlY29yYXRpb24tbm9uZVwiIGFjdGl2ZS1jbGFzcz1cImN1cnJlbnRWaWV3XCIgOmRpc2FibGVkPVwidmlld0luZGV4PT01XCIgOnByZXNzZWQ9XCJ2aWV3SW5kZXg9PTVcIj48aSBjbGFzcz1cImZhcyBmYS1jaGFsa2JvYXJkLXRlYWNoZXJcIj48L2k+XHJcbiAgICAgICAgICAgICAgICBTY29yZWJvYXJkPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiAgQGNsaWNrPVwidmlld0luZGV4PTZcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmVcIiBhY3RpdmUtY2xhc3M9XCJjdXJyZW50Vmlld1wiIDpkaXNhYmxlZD1cInZpZXdJbmRleD09NlwiIDpwcmVzc2VkPVwidmlld0luZGV4PT02XCI+PGkgY2xhc3M9XCJmYXMgZmEtbWVkYWxcIj48L2k+XHJcbiAgICAgICAgICAgICAgICBUb3AgUGVyZm9ybWVyczwvYi1idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTEwIG9mZnNldC1tZC0xIGNvbC0xMiBkLWZsZXggZmxleC1jb2x1bW5cIj5cclxuICAgICAgICAgICAgICA8aDMgY2xhc3M9XCJ0ZXh0LWNlbnRlciBiZWJhcyBwLTAgbS0wXCI+IHt7dGFiX2hlYWRpbmd9fVxyXG4gICAgICAgICAgICAgIDxzcGFuIHYtaWY9XCJ2aWV3SW5kZXggPjAgJiYgdmlld0luZGV4IDwgNFwiPlxyXG4gICAgICAgICAgICAgIHt7IGN1cnJlbnRSb3VuZCB9fVxyXG4gICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2gzPlxyXG4gICAgICAgICAgICAgIDx0ZW1wbGF0ZSB2LWlmPVwic2hvd1BhZ2luYXRpb25cIj5cclxuICAgICAgICAgICAgICAgICAgPGItcGFnaW5hdGlvbiBhbGlnbj1cImNlbnRlclwiIDp0b3RhbC1yb3dzPVwidG90YWxfcm91bmRzXCIgdi1tb2RlbD1cImN1cnJlbnRSb3VuZFwiIDpwZXItcGFnZT1cIjFcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgOmhpZGUtZWxsaXBzaXM9XCJ0cnVlXCIgYXJpYS1sYWJlbD1cIk5hdmlnYXRpb25cIiBjaGFuZ2U9XCJyb3VuZENoYW5nZVwiPlxyXG4gICAgICAgICAgICAgICAgICA8L2ItcGFnaW5hdGlvbj5cclxuICAgICAgICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8dGVtcGxhdGUgdi1pZj1cInZpZXdJbmRleD09MFwiPlxyXG4gICAgICAgICAgPGFsbHBsYXllcnM+PC9hbGxwbGF5ZXJzPlxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgPHRlbXBsYXRlIHYtaWY9XCJ2aWV3SW5kZXg9PTZcIj5cclxuICAgICAgICAgIDxwZXJmb3JtZXJzPjwvcGVyZm9ybWVycz5cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSB2LWVsc2UtaWY9XCJ2aWV3SW5kZXg9PTVcIj5cclxuICAgICAgICA8c2NvcmVib2FyZD48L3Njb3JlYm9hcmQ+XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICA8ZGl2IHYtZWxzZS1pZj1cInZpZXdJbmRleD09NFwiIGNsYXNzPVwicm93IGQtZmxleCBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTEwIG9mZnNldC1tZC0wIGNvbFwiPlxyXG4gICAgICAgICAgICAgICAgPGItdGFicyBjb250ZW50LWNsYXNzPVwibXQtMyBzdGF0c1RhYnNcIiBwaWxscyBzbWFsbCBsYXp5IG5vLWZhZGUgIHYtbW9kZWw9XCJ0YWJJbmRleFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxiLXRhYiB0aXRsZT1cIkhpZ2ggV2luc1wiIGxhenk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoaXdpbnMgIDpyZXN1bHRkYXRhPVwicmVzdWx0ZGF0YVwiIDpjYXB0aW9uPVwiY2FwdGlvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2hpd2lucz5cclxuICAgICAgICAgICAgICAgICAgICA8L2ItdGFiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxiLXRhYiB0aXRsZT1cIkhpZ2ggTG9zc2VzXCIgbGF6eT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGhpbG9zcyA6cmVzdWx0ZGF0YT1cInJlc3VsdGRhdGFcIiA6Y2FwdGlvbj1cImNhcHRpb25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9oaWxvc3M+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9iLXRhYj5cclxuICAgICAgICAgICAgICAgICAgICA8Yi10YWIgdGl0bGU9XCJMb3cgV2luc1wiIGxhenk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsb3dpbnMgIDpyZXN1bHRkYXRhPVwicmVzdWx0ZGF0YVwiIDpjYXB0aW9uPVwiY2FwdGlvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xvd2lucz5cclxuICAgICAgICAgICAgICAgICAgICA8L2ItdGFiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxiLXRhYiB0aXRsZT1cIkNvbWJpbmVkIFNjb3Jlc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Y29tYm9zY29yZXMgOnJlc3VsdGRhdGE9XCJyZXN1bHRkYXRhXCIgOmNhcHRpb249XCJjYXB0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvY29tYm9zY29yZXM+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9iLXRhYj5cclxuICAgICAgICAgICAgICAgICAgICA8Yi10YWIgdGl0bGU9XCJUb3RhbCBTY29yZXNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRvdGFsc2NvcmVzIDpjYXB0aW9uPVwiY2FwdGlvblwiIDpzdGF0cz1cImZldGNoU3RhdHMoJ3RvdGFsX3Njb3JlJylcIj48L3RvdGFsc2NvcmVzPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvYi10YWI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGItdGFiIHRpdGxlPVwiVG90YWwgT3BwIFNjb3Jlc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8b3Bwc2NvcmVzIDpjYXB0aW9uPVwiY2FwdGlvblwiIDpzdGF0cz1cImZldGNoU3RhdHMoJ3RvdGFsX29wcHNjb3JlJylcIj48L29wcHNjb3Jlcz5cclxuICAgICAgICAgICAgICAgICAgICA8L2ItdGFiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxiLXRhYiB0aXRsZT1cIkF2ZSBTY29yZXNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGF2ZXNjb3JlcyA6Y2FwdGlvbj1cImNhcHRpb25cIiA6c3RhdHM9XCJmZXRjaFN0YXRzKCdhdmVfc2NvcmUnKVwiPjwvYXZlc2NvcmVzPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvYi10YWI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGItdGFiIHRpdGxlPVwiQXZlIE9wcCBTY29yZXNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGF2ZW9wcHNjb3JlcyA6Y2FwdGlvbj1cImNhcHRpb25cIiA6c3RhdHM9XCJmZXRjaFN0YXRzKCdhdmVfb3Bwc2NvcmUnKVwiPjwvYXZlb3Bwc2NvcmVzPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvYi10YWI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGItdGFiIHRpdGxlPVwiSGlnaCBTcHJlYWRzIFwiIGxhenk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoaXNwcmVhZCA6cmVzdWx0ZGF0YT1cInJlc3VsdGRhdGFcIiA6Y2FwdGlvbj1cImNhcHRpb25cIj48L2hpc3ByZWFkPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvYi10YWI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGItdGFiIHRpdGxlPVwiTG93IFNwcmVhZHNcIiBsYXp5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bG9zcHJlYWQgOnJlc3VsdGRhdGE9XCJyZXN1bHRkYXRhXCIgOmNhcHRpb249XCJjYXB0aW9uXCI+PC9sb3NwcmVhZD5cclxuICAgICAgICAgICAgICAgICAgICA8L2ItdGFiPlxyXG5cclxuICAgICAgICAgICAgICAgIDwvYi10YWJzPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IHYtZWxzZSBjbGFzcz1cInJvdyBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTggb2Zmc2V0LW1kLTIgY29sLTEyXCI+XHJcbiAgICAgICAgICAgICAgICA8cGFpcmluZ3Mgdi1pZj1cInZpZXdJbmRleD09MVwiIDpjdXJyZW50Um91bmQ9XCJjdXJyZW50Um91bmRcIiA6cmVzdWx0ZGF0YT1cInJlc3VsdGRhdGFcIiA6Y2FwdGlvbj1cImNhcHRpb25cIj48L3BhaXJpbmdzPlxyXG4gICAgICAgICAgICAgICAgPHJlc3VsdHMgdi1pZj1cInZpZXdJbmRleD09MlwiIDpjdXJyZW50Um91bmQ9XCJjdXJyZW50Um91bmRcIiA6cmVzdWx0ZGF0YT1cInJlc3VsdGRhdGFcIiA6Y2FwdGlvbj1cImNhcHRpb25cIj48L3Jlc3VsdHM+XHJcbiAgICAgICAgICAgICAgICA8c3RhbmRpbmdzIHYtaWY9XCJ2aWV3SW5kZXg9PTNcIiA6Y3VycmVudFJvdW5kPVwiY3VycmVudFJvdW5kXCIgOnJlc3VsdGRhdGE9XCJyZXN1bHRkYXRhXCIgOmNhcHRpb249XCJjYXB0aW9uXCI+PC9zdGFuZGluZ3M+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvdGVtcGxhdGU+XHJcbjwvZGl2PlxyXG5gLFxyXG4gIGNvbXBvbmVudHM6IHtcclxuICAgIGxvYWRpbmc6IExvYWRpbmdBbGVydCxcclxuICAgIGVycm9yOiBFcnJvckFsZXJ0LFxyXG4gICAgYWxscGxheWVyczogUGxheWVyTGlzdCxcclxuICAgIHBhaXJpbmdzOiBQYWlyaW5ncyxcclxuICAgIHJlc3VsdHM6IFJlc3VsdHMsXHJcbiAgICBzdGFuZGluZ3M6IFN0YW5kaW5ncyxcclxuICAgIGhpd2luczogSGlXaW5zLFxyXG4gICAgaGlsb3NzOiBIaUxvc3MsXHJcbiAgICBsb3dpbjogTG9XaW5zLFxyXG4gICAgY29tYm9zY29yZXM6IENvbWJvU2NvcmVzLFxyXG4gICAgdG90YWxzY29yZXM6IFRvdGFsU2NvcmVzLFxyXG4gICAgb3Bwc2NvcmVzOiBUb3RhbE9wcFNjb3JlcyxcclxuICAgIGF2ZXNjb3JlczogQXZlU2NvcmVzLFxyXG4gICAgYXZlb3Bwc2NvcmVzOiBBdmVPcHBTY29yZXMsXHJcbiAgICBoaXNwcmVhZDogSGlTcHJlYWQsXHJcbiAgICBsb3NwcmVhZDogTG9TcHJlYWQsXHJcbiAgICAvLyAnbHVja3lzdGlmZi10YWJsZSc6IEx1Y2t5U3RpZmZUYWJsZSxcclxuICAgIC8vICd0dWZmbHVjay10YWJsZSc6IFR1ZmZMdWNrVGFibGVcclxuICAgIHNjb3JlYm9hcmQ6IFNjb3JlYm9hcmQsXHJcbiAgICBwZXJmb3JtZXJzOiB0b3BQZXJmb3JtZXJzLFxyXG4gIH0sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAvLyBwYXJlbnRfc2x1ZzogdGhpcy4kcm91dGUucGFyYW1zLnNsdWcsXHJcbiAgICAgIHNsdWc6IHRoaXMuJHJvdXRlLnBhcmFtcy5ldmVudF9zbHVnLFxyXG4gICAgICBwYXRoOiB0aGlzLiRyb3V0ZS5wYXRoLFxyXG4gICAgICAvLyBnYW1laWQ6IHRoaXMuJHJvdXRlLnF1ZXJ5LmlkLFxyXG4gICAgICB0b3VybmV5X3NsdWc6ICcnLFxyXG4gICAgICBpc0FjdGl2ZTogZmFsc2UsXHJcbiAgICAgIGdhbWVkYXRhOiBbXSxcclxuICAgICAgdGFiSW5kZXg6IDAsXHJcbiAgICAgIHZpZXdJbmRleDogMCxcclxuICAgICAgY3VycmVudFJvdW5kOiAxLFxyXG4gICAgICB0YWJfaGVhZGluZzogJycsXHJcbiAgICAgIGNhcHRpb246ICcnLFxyXG4gICAgICBzaG93UGFnaW5hdGlvbjogZmFsc2UsXHJcbiAgICAgIGx1Y2t5c3RpZmY6IFtdLFxyXG4gICAgICB0dWZmbHVjazogW10sXHJcbiAgICAgIHRpbWVyOiAnJyxcclxuICAgIH07XHJcbiAgfSxcclxuICBjcmVhdGVkOiBmdW5jdGlvbigpIHtcclxuICAgIGNvbnNvbGUubG9nKCdDYXRlZ29yeSBtb3VudGVkJyk7XHJcbiAgICB2YXIgcCA9IHRoaXMuc2x1Zy5zcGxpdCgnLScpO1xyXG4gICAgcC5zaGlmdCgpO1xyXG4gICAgdGhpcy50b3VybmV5X3NsdWcgPSBwLmpvaW4oJy0nKTtcclxuICAgIHRoaXMuZmV0Y2hEYXRhKCk7XHJcbiAgfSxcclxuXHJcbiAgd2F0Y2g6IHtcclxuICAgIHZpZXdJbmRleDoge1xyXG4gICAgICBoYW5kbGVyOiBmdW5jdGlvbih2YWwsIG9sZFZhbCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCcqKioqKnZpZXdJbmRleCoqKionKTtcclxuICAgICAgICBjb25zb2xlLmxvZyh2YWwpO1xyXG4gICAgICAgIGlmICh2YWwgIT0gNCkge1xyXG4gICAgICAgICAgdGhpcy5nZXRWaWV3KHZhbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBpbW1lZGlhdGU6IHRydWUsXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgYmVmb3JlVXBkYXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICBkb2N1bWVudC50aXRsZSA9IHRoaXMuZXZlbnRfdGl0bGU7XHJcbiAgICBpZiAodGhpcy52aWV3SW5kZXggPT0gNCkge1xyXG4gICAgICB0aGlzLmdldFRhYnModGhpcy50YWJJbmRleCk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBmZXRjaERhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB0aGlzLiRzdG9yZS5kaXNwYXRjaCgnRkVUQ0hfREFUQScsIHRoaXMuc2x1Zyk7XHJcbiAgICB9LFxyXG4gICAgZ2V0VmlldzogZnVuY3Rpb24odmFsKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdSYW4gZ2V0VmlldyBmdW5jdGlvbiB2YWwtPiAnICsgdmFsKTtcclxuICAgICAgc3dpdGNoICh2YWwpIHtcclxuICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ1BsYXllcnMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJyc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnUGFpcmluZyBSb3VuZCAtICc7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSAnKlBsYXlzIGZpcnN0JztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdSZXN1bHRzIFJvdW5kIC0gJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICdSZXN1bHRzJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdTdGFuZGluZ3MgYWZ0ZXIgUm91bmQgLSAnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ1N0YW5kaW5ncyc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICcnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJyc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICAvLyByZXR1cm4gdHJ1ZVxyXG4gICAgfSxcclxuICAgIGdldFRhYnM6IGZ1bmN0aW9uKHZhbCkge1xyXG4gICAgICBjb25zb2xlLmxvZygnUmFuIGdldFRhYnMgZnVuY3Rpb24tPiAnICsgdmFsKTtcclxuICAgICAgc3dpdGNoICh2YWwpIHtcclxuICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ0hpZ2ggV2lubmluZyBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ0hpZ2ggV2lubmluZyBTY29yZXMnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdIaWdoIExvc2luZyBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ0hpZ2ggTG9zaW5nIFNjb3Jlcyc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ0xvdyBXaW5uaW5nIFNjb3Jlcyc7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSAnTG93IFdpbm5pbmcgU2NvcmVzJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnSGlnaGVzdCBDb21iaW5lZCBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ0hpZ2hlc3QgQ29tYmluZWQgU2NvcmUgcGVyIHJvdW5kJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnVG90YWwgU2NvcmVzJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICdUb3RhbCBQbGF5ZXIgU2NvcmVzIFN0YXRpc3RpY3MnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA1OlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdUb3RhbCBPcHBvbmVudCBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ1RvdGFsIE9wcG9uZW50IFNjb3JlcyBTdGF0aXN0aWNzJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNjpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnQXZlcmFnZSBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ1JhbmtpbmcgYnkgQXZlcmFnZSBQbGF5ZXIgU2NvcmVzJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNzpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnQXZlcmFnZSBPcHBvbmVudCBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ1JhbmtpbmcgYnkgQXZlcmFnZSBPcHBvbmVudCBTY29yZXMnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA4OlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdIaWdoIFNwcmVhZHMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ0hpZ2hlc3QgU3ByZWFkIHBlciByb3VuZCAnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA5OlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdMb3cgU3ByZWFkcyc7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSAnTG93ZXN0IFNwcmVhZHMgcGVyIHJvdW5kJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMTA6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ0x1Y2t5IFN0aWZmcyc7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSAnTHVja3kgU3RpZmZzIChmcmVxdWVudCBsb3cgbWFyZ2luL3NwcmVhZCB3aW5uZXJzKSc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDExOlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdUdWZmIEx1Y2snO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ1R1ZmYgTHVjayAoZnJlcXVlbnQgbG93IG1hcmdpbi9zcHJlYWQgbG9zZXJzKSc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdTZWxlY3QgYSBUYWInO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJyc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICAvLyByZXR1cm4gdHJ1ZVxyXG4gICAgfSxcclxuICAgIHJvdW5kQ2hhbmdlOiBmdW5jdGlvbihwYWdlKSB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHBhZ2UpO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmN1cnJlbnRSb3VuZCk7XHJcbiAgICAgIHRoaXMuY3VycmVudFJvdW5kID0gcGFnZTtcclxuICAgIH0sXHJcbiAgICBjYW5jZWxBdXRvVXBkYXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcclxuICAgIH0sXHJcbiAgICBmZXRjaFN0YXRzOiBmdW5jdGlvbihrZXkpIHtcclxuICAgICAgbGV0IGxhc3RSZERhdGEgPSB0aGlzLnJlc3VsdGRhdGFbdGhpcy50b3RhbF9yb3VuZHMgLSAxXTtcclxuICAgICAgcmV0dXJuIF8uc29ydEJ5KGxhc3RSZERhdGEsIGtleSkucmV2ZXJzZSgpO1xyXG4gICAgfSxcclxuICAgIHR1ZmZsdWNreTogZnVuY3Rpb24ocmVzdWx0ID0gJ3dpbicpIHtcclxuICAgICAgLy8gbWV0aG9kIHJ1bnMgYm90aCBsdWNreXN0aWZmIGFuZCB0dWZmbHVjayB0YWJsZXNcclxuICAgICAgbGV0IGRhdGEgPSB0aGlzLnJlc3VsdGRhdGE7IC8vSlNPTi5wYXJzZSh0aGlzLmV2ZW50X2RhdGEucmVzdWx0cyk7XHJcbiAgICAgIGxldCBwbGF5ZXJzID0gXy5tYXAodGhpcy5wbGF5ZXJzLCAncG9zdF90aXRsZScpO1xyXG4gICAgICBsZXQgbHNkYXRhID0gW107XHJcbiAgICAgIGxldCBoaWdoc2l4ID0gXy5jaGFpbihwbGF5ZXJzKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgbGV0IHJlcyA9IF8uY2hhaW4oZGF0YSlcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbihsaXN0KSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIF8uY2hhaW4obGlzdClcclxuICAgICAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24oZCkge1xyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gZFsncGxheWVyJ10gPT09IG4gJiYgZFsncmVzdWx0J10gPT09IHJlc3VsdDtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudmFsdWUoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZsYXR0ZW5EZWVwKClcclxuICAgICAgICAgICAgLnNvcnRCeSgnZGlmZicpXHJcbiAgICAgICAgICAgIC52YWx1ZSgpO1xyXG4gICAgICAgICAgaWYgKHJlc3VsdCA9PT0gJ3dpbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF8uZmlyc3QocmVzLCA2KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBfLnRha2VSaWdodChyZXMsIDYpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmZpbHRlcihmdW5jdGlvbihuKSB7XHJcbiAgICAgICAgICByZXR1cm4gbi5sZW5ndGggPiA1O1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnZhbHVlKCk7XHJcblxyXG4gICAgICBfLm1hcChoaWdoc2l4LCBmdW5jdGlvbihoKSB7XHJcbiAgICAgICAgbGV0IGxhc3RkYXRhID0gXy50YWtlUmlnaHQoZGF0YSk7XHJcbiAgICAgICAgbGV0IGRpZmYgPSBfLmNoYWluKGgpXHJcbiAgICAgICAgICAubWFwKCdkaWZmJylcclxuICAgICAgICAgIC5tYXAoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5hYnMobik7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnZhbHVlKCk7XHJcbiAgICAgICAgbGV0IG5hbWUgPSBoWzBdWydwbGF5ZXInXTtcclxuICAgICAgICBsZXQgc3VtID0gXy5yZWR1Y2UoXHJcbiAgICAgICAgICBkaWZmLFxyXG4gICAgICAgICAgZnVuY3Rpb24obWVtbywgbnVtKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtZW1vICsgbnVtO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIDBcclxuICAgICAgICApO1xyXG4gICAgICAgIGxldCBwbGF5ZXJfZGF0YSA9IF8uZmluZChsYXN0ZGF0YSwge1xyXG4gICAgICAgICAgcGxheWVyOiBuYW1lLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxldCBtYXIgPSBwbGF5ZXJfZGF0YVsnbWFyZ2luJ107XHJcbiAgICAgICAgbGV0IHdvbiA9IHBsYXllcl9kYXRhWydwb2ludHMnXTtcclxuICAgICAgICBsZXQgbG9zcyA9IHBsYXllcl9kYXRhWydyb3VuZCddIC0gd29uO1xyXG4gICAgICAgIC8vIHB1c2ggdmFsdWVzIGludG8gbHNkYXRhIGFycmF5XHJcbiAgICAgICAgbHNkYXRhLnB1c2goe1xyXG4gICAgICAgICAgcGxheWVyOiBuYW1lLFxyXG4gICAgICAgICAgc3ByZWFkOiBkaWZmLFxyXG4gICAgICAgICAgc3VtX3NwcmVhZDogc3VtLFxyXG4gICAgICAgICAgY3VtbXVsYXRpdmVfc3ByZWFkOiBtYXIsXHJcbiAgICAgICAgICB3b25fbG9zczogYCR7d29ufSAtICR7bG9zc31gLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIF8uc29ydEJ5KGxzZGF0YSwgJ3N1bV9zcHJlYWQnKTtcclxuICAgIH0sXHJcbiAgICB0b05leHRSZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGxldCB4ID0gdGhpcy50b3RhbF9yb3VuZHM7XHJcbiAgICAgIGxldCBuID0gdGhpcy5jdXJyZW50Um91bmQgKyAxO1xyXG4gICAgICBpZiAobiA8PSB4KSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50Um91bmQgPSBuO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgdG9QcmV2UmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICBsZXQgbiA9IHRoaXMuY3VycmVudFJvdW5kIC0gMTtcclxuICAgICAgaWYgKG4gPj0gMSkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudFJvdW5kID0gbjtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHRvRmlyc3RSZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRSb3VuZCAhPSAxKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50Um91bmQgPSAxO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgdG9MYXN0UmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnIGdvaW5nIHRvIGxhc3Qgcm91bmQnKVxyXG4gICAgICBpZiAodGhpcy5jdXJyZW50Um91bmQgIT0gdGhpcy50b3RhbF9yb3VuZHMpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRSb3VuZCA9IHRoaXMudG90YWxfcm91bmRzO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIC4uLlZ1ZXgubWFwR2V0dGVycyh7XHJcbiAgICAgIHBsYXllcnM6ICdQTEFZRVJTJyxcclxuICAgICAgdG90YWxfcGxheWVyczogJ1RPVEFMUExBWUVSUycsXHJcbiAgICAgIHJlc3VsdGRhdGE6ICdSRVNVTFREQVRBJyxcclxuICAgICAgZXZlbnRfZGF0YTogJ0VWRU5UU1RBVFMnLFxyXG4gICAgICBlcnJvcjogJ0VSUk9SJyxcclxuICAgICAgbG9hZGluZzogJ0xPQURJTkcnLFxyXG4gICAgICBjYXRlZ29yeTogJ0NBVEVHT1JZJyxcclxuICAgICAgdG90YWxfcm91bmRzOiAnVE9UQUxfUk9VTkRTJyxcclxuICAgICAgcGFyZW50X3NsdWc6ICdQQVJFTlRTTFVHJyxcclxuICAgICAgZXZlbnRfdGl0bGU6ICdFVkVOVF9USVRMRScsXHJcbiAgICAgIHRvdXJuZXlfdGl0bGU6ICdUT1VSTkVZX1RJVExFJyxcclxuICAgICAgbG9nbzogJ0xPR09fVVJMJyxcclxuICAgIH0pLFxyXG4gICAgYnJlYWRjcnVtYnM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6ICdUb3VybmFtZW50cycsXHJcbiAgICAgICAgICB0bzoge1xyXG4gICAgICAgICAgICBuYW1lOiAnVG91cm5leXNMaXN0JyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiB0aGlzLnRvdXJuZXlfdGl0bGUsXHJcbiAgICAgICAgICB0bzoge1xyXG4gICAgICAgICAgICBuYW1lOiAnVG91cm5leURldGFpbCcsXHJcbiAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgIHNsdWc6IHRoaXMudG91cm5leV9zbHVnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6IHRoaXMuY2F0ZWdvcnksXHJcbiAgICAgICAgICBhY3RpdmU6IHRydWUsXHJcbiAgICAgICAgfSxcclxuICAgICAgXTtcclxuICAgIH0sXHJcbiAgICBlcnJvcl9tc2c6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gYFdlIGFyZSBjdXJyZW50bHkgZXhwZXJpZW5jaW5nIG5ldHdvcmsgaXNzdWVzIGZldGNoaW5nIHRoaXMgcGFnZSAke1xyXG4gICAgICAgIHRoaXMucGF0aFxyXG4gICAgICB9IGA7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4vLyBleHBvcnQgZGVmYXVsdCBDYXRlRGV0YWlsOyIsInZhciBwbGF5ZXJfbWl4ZWRfc2VyaWVzID0gW3sgbmFtZTogJycsICBkYXRhOiBbXSB9XTtcclxudmFyIHBsYXllcl9yYW5rX3NlcmllcyA9IFt7IG5hbWU6ICcnLCAgZGF0YTogW10gfV07XHJcbnZhciBwbGF5ZXJfcmFkaWFsX2NoYXJ0X3NlcmllcyA9IFtdICA7XHJcbnZhciBwbGF5ZXJfcmFkaWFsX2NoYXJ0X2NvbmZpZyA9IHtcclxuICBwbG90T3B0aW9uczoge1xyXG4gICAgcmFkaWFsQmFyOiB7XHJcbiAgICAgIGhvbGxvdzogeyBzaXplOiAnNTAlJywgfVxyXG4gICAgfSxcclxuICB9LFxyXG4gIGNvbG9yczogW10sXHJcbiAgbGFiZWxzOiBbXSxcclxufTtcclxuXHJcbnZhciBwbGF5ZXJfcmFua19jaGFydF9jb25maWcgPSB7XHJcbiAgY2hhcnQ6IHtcclxuICAgIGhlaWdodDogNDAwLFxyXG4gICAgem9vbToge1xyXG4gICAgICBlbmFibGVkOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIHNoYWRvdzoge1xyXG4gICAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgICBjb2xvcjogJyMwMDAnLFxyXG4gICAgICB0b3A6IDE4LFxyXG4gICAgICBsZWZ0OiA3LFxyXG4gICAgICBibHVyOiAxMCxcclxuICAgICAgb3BhY2l0eTogMVxyXG4gICAgfSxcclxuICB9LFxyXG4gIGNvbG9yczogWycjNzdCNkVBJywgJyM1NDU0NTQnXSxcclxuICBkYXRhTGFiZWxzOiB7XHJcbiAgICBlbmFibGVkOiB0cnVlXHJcbiAgfSxcclxuICBzdHJva2U6IHtcclxuICAgIGN1cnZlOiAnc21vb3RoJyAvLyBzdHJhaWdodFxyXG4gIH0sXHJcbiAgdGl0bGU6IHtcclxuICAgIHRleHQ6ICcnLFxyXG4gICAgYWxpZ246ICdsZWZ0J1xyXG4gIH0sXHJcbiAgZ3JpZDoge1xyXG4gICAgYm9yZGVyQ29sb3I6ICcjZTdlN2U3JyxcclxuICAgIHJvdzoge1xyXG4gICAgICBjb2xvcnM6IFsnI2YzZjNmMycsICd0cmFuc3BhcmVudCddLCAvLyB0YWtlcyBhbiBhcnJheSB3aGljaCB3aWxsIGJlIHJlcGVhdGVkIG9uIGNvbHVtbnNcclxuICAgICAgb3BhY2l0eTogMC41XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgeGF4aXM6IHtcclxuICAgIGNhdGVnb3JpZXM6IFtdLFxyXG4gICAgdGl0bGU6IHtcclxuICAgICAgdGV4dDogJ1JvdW5kcydcclxuICAgIH1cclxuICB9LFxyXG4gIHlheGlzOiB7XHJcbiAgICB0aXRsZToge1xyXG4gICAgICB0ZXh0OiAnJ1xyXG4gICAgfSxcclxuICAgIG1pbjogbnVsbCxcclxuICAgIG1heDogbnVsbFxyXG4gIH0sXHJcbiAgbGVnZW5kOiB7XHJcbiAgICBwb3NpdGlvbjogJ3RvcCcsXHJcbiAgICBob3Jpem9udGFsQWxpZ246ICdyaWdodCcsXHJcbiAgICBmbG9hdGluZzogdHJ1ZSxcclxuICAgIG9mZnNldFk6IC0yNSxcclxuICAgIG9mZnNldFg6IC01XHJcbiAgfVxyXG59O1xyXG5cclxuXHJcbnZhciBQbGF5ZXJTdGF0cyA9IFZ1ZS5jb21wb25lbnQoJ3BsYXllcnN0YXRzJywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgPGRpdiBjbGFzcz1cImNvbC1sZy0xMCBvZmZzZXQtbGctMSBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbGctOCBvZmZzZXQtbGctMlwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJhbmltYXRlZCBmYWRlSW5MZWZ0QmlnXCIgaWQ9XCJwaGVhZGVyXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGFsaWduLWl0ZW1zLWNlbnRlciBhbGlnbi1jb250ZW50LWNlbnRlciBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIG10LTVcIj5cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICA8aDQgY2xhc3M9XCJ0ZXh0LWNlbnRlciBiZWJhc1wiPnt7cGxheWVyTmFtZX19XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImQtYmxvY2sgbXgtYXV0b1wiIHN0eWxlPVwiZm9udC1zaXplOnNtYWxsXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwibXgtMyBmbGFnLWljb25cIiA6Y2xhc3M9XCInZmxhZy1pY29uLScrcGxheWVyLmNvdW50cnkgfCBsb3dlcmNhc2VcIlxyXG4gICAgICAgICAgICAgICAgICAgIDp0aXRsZT1cInBsYXllci5jb3VudHJ5X2Z1bGxcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwibXgtMyBmYVwiIDpjbGFzcz1cInsnZmEtbWFsZSc6IHBsYXllci5nZW5kZXIgPT0gJ20nLFxyXG4gICAgICAgICAgICAgICAgICAgJ2ZhLWZlbWFsZSc6IHBsYXllci5nZW5kZXIgPT0gJ2YnLCdmYS11c2Vycyc6IHBsYXllci5pc190ZWFtID09ICd5ZXMnIH1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cclxuICAgICAgICAgICAgICAgICAgPC9pPlxyXG4gICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDwvaDQ+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgIDxpbWcgd2lkdGg9XCIxMDBweFwiIGhlaWdodD1cIjEwMHB4XCIgY2xhc3M9XCJpbWctdGh1bWJuYWlsIGltZy1mbHVpZCBteC0zIGQtYmxvY2sgc2hhZG93LXNtXCJcclxuICAgICAgICAgICAgICAgIDpzcmM9XCJwbGF5ZXIucGhvdG9cIiAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICA8aDQgY2xhc3M9XCJ0ZXh0LWNlbnRlciB5YW5vbmUgbXgtM1wiPnt7cHN0YXRzLnBQb3NpdGlvbn19IHBvc2l0aW9uPC9oND5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj4gPCEtLSAjcGhlYWRlci0tPlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGFsaWduLWl0ZW1zLWNlbnRlciBhbGlnbi1jb250ZW50LWNlbnRlciBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCI+XHJcbiAgICAgICAgICA8Yi1idG4gdi1iLXRvZ2dsZS5jb2xsYXBzZTEgY2xhc3M9XCJtLTFcIj5RdWljayBTdGF0czwvYi1idG4+XHJcbiAgICAgICAgICA8Yi1idG4gdi1iLXRvZ2dsZS5jb2xsYXBzZTIgY2xhc3M9XCJtLTFcIj5Sb3VuZCBieSBSb3VuZCA8L2ItYnRuPlxyXG4gICAgICAgICAgPGItYnRuIHYtYi10b2dnbGUuY29sbGFwc2UzIGNsYXNzPVwibS0xXCI+Q2hhcnRzPC9iLWJ0bj5cclxuICAgICAgICAgIDxiLWJ1dHRvbiB0aXRsZT1cIkNsb3NlXCIgc2l6ZT1cInNtXCIgQGNsaWNrPVwiY2xvc2VDYXJkKClcIiBjbGFzcz1cIm0tMVwiIHZhcmlhbnQ9XCJvdXRsaW5lLWRhbmdlclwiIDpkaXNhYmxlZD1cIiFzaG93XCJcclxuICAgICAgICAgICAgOnByZXNzZWQuc3luYz1cInNob3dcIj48aSBjbGFzcz1cImZhcyBmYS10aW1lc1wiPjwvaT48L2ItYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiY29sLWxnLTggb2Zmc2V0LWxnLTJcIj5cclxuICAgICAgICA8Yi1jb2xsYXBzZSBpZD1cImNvbGxhcHNlMVwiPlxyXG4gICAgICAgICAgPGItY2FyZCBjbGFzcz1cImFuaW1hdGVkIGZsaXBJblhcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQtaGVhZGVyIHRleHQtY2VudGVyXCI+UXVpY2sgU3RhdHM8L2Rpdj5cclxuICAgICAgICAgICAgPHVsIGNsYXNzPVwibGlzdC1ncm91cCBsaXN0LWdyb3VwLWZsdXNoIHN0YXRzXCI+XHJcbiAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtXCI+UG9pbnRzOlxyXG4gICAgICAgICAgICAgICAgPHNwYW4+e3twc3RhdHMucFBvaW50c319IC8ge3t0b3RhbF9yb3VuZHN9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiPlJhbms6XHJcbiAgICAgICAgICAgICAgICA8c3Bhbj57e3BzdGF0cy5wUmFua319IDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiPkhpZ2hlc3QgU2NvcmU6XHJcbiAgICAgICAgICAgICAgICA8c3Bhbj57e3BzdGF0cy5wSGlTY29yZX19PC9zcGFuPiBpbiByb3VuZCA8ZW0+e3twc3RhdHMucEhpU2NvcmVSb3VuZHN9fTwvZW0+XHJcbiAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW1cIj5Mb3dlc3QgU2NvcmU6XHJcbiAgICAgICAgICAgICAgICA8c3Bhbj57e3BzdGF0cy5wTG9TY29yZX19PC9zcGFuPiBpbiByb3VuZCA8ZW0+e3twc3RhdHMucExvU2NvcmVSb3VuZHN9fTwvZW0+XHJcbiAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW1cIj5BdmUgU2NvcmU6XHJcbiAgICAgICAgICAgICAgICA8c3Bhbj57e3BzdGF0cy5wQXZlfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW1cIj5BdmUgT3BwIFNjb3JlOlxyXG4gICAgICAgICAgICAgICAgPHNwYW4+e3twc3RhdHMucEF2ZU9wcH19PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICA8L2ItY2FyZD5cclxuICAgICAgICA8L2ItY29sbGFwc2U+XHJcbiAgICAgICAgPCEtLS0tIFJvdW5kIEJ5IFJvdW5kIFJlc3VsdHMgLS0+XHJcbiAgICAgICAgPGItY29sbGFwc2UgaWQ9XCJjb2xsYXBzZTJcIj5cclxuICAgICAgICAgIDxiLWNhcmQgY2xhc3M9XCJhbmltYXRlZCBmYWRlSW5VcFwiPlxyXG4gICAgICAgICAgICA8aDQ+Um91bmQgQnkgUm91bmQgU3VtbWFyeSA8L2g0PlxyXG4gICAgICAgICAgICA8dWwgY2xhc3M9XCJsaXN0LWdyb3VwIGxpc3QtZ3JvdXAtZmx1c2hcIiB2LWZvcj1cIihyZXBvcnQsIGkpIGluIHBzdGF0cy5wUmJ5UlwiIDprZXk9XCJpXCI+XHJcbiAgICAgICAgICAgICAgPGxpIHYtaHRtbD1cInJlcG9ydC5yZXBvcnRcIiB2LWlmPVwicmVwb3J0LnJlc3VsdD09J3dpbidcIiBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBsaXN0LWdyb3VwLWl0ZW0tc3VjY2Vzc1wiPlxyXG4gICAgICAgICAgICAgICAge3tyZXBvcnQucmVwb3J0fX08L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSB2LWh0bWw9XCJyZXBvcnQucmVwb3J0XCIgdi1lbHNlLWlmPVwicmVwb3J0LnJlc3VsdCA9PSdkcmF3J1wiXHJcbiAgICAgICAgICAgICAgICBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBsaXN0LWdyb3VwLWl0ZW0td2FybmluZ1wiPnt7cmVwb3J0LnJlcG9ydH19PC9saT5cclxuICAgICAgICAgICAgICA8bGkgdi1odG1sPVwicmVwb3J0LnJlcG9ydFwiIHYtZWxzZS1pZj1cInJlcG9ydC5yZXN1bHQgPT0nbG9zcydcIlxyXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW0gbGlzdC1ncm91cC1pdGVtLWRhbmdlclwiPnt7cmVwb3J0LnJlcG9ydH19PC9saT5cclxuICAgICAgICAgICAgICA8bGkgdi1odG1sPVwicmVwb3J0LnJlcG9ydFwiIHYtZWxzZS1pZj1cInJlcG9ydC5yZXN1bHQgPT0nYXdhaXRpbmcnXCIgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW0gbGlzdC1ncm91cC1pdGVtLWluZm9cIj5cclxuICAgICAgICAgICAgICAgIHt7cmVwb3J0LnJlcG9ydH19PC9saT5cclxuICAgICAgICAgICAgICA8bGkgdi1odG1sPVwicmVwb3J0LnJlcG9ydFwiIHYtZWxzZSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBsaXN0LWdyb3VwLWl0ZW0tbGlnaHRcIj57e3JlcG9ydC5yZXBvcnR9fTwvbGk+XHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICA8L2ItY2FyZD5cclxuICAgICAgICA8L2ItY29sbGFwc2U+XHJcbiAgICAgICAgPCEtLSBDaGFydHMgLS0+XHJcbiAgICAgICAgPGItY29sbGFwc2UgaWQ9XCJjb2xsYXBzZTNcIj5cclxuICAgICAgICAgIDxiLWNhcmQgY2xhc3M9XCJhbmltYXRlZCBmYWRlSW5Eb3duXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLWhlYWRlciB0ZXh0LWNlbnRlclwiPlN0YXRzIENoYXJ0czwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGFsaWduLWl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiBAY2xpY2s9XCJ1cGRhdGVDaGFydCgnbWl4ZWQnKVwiIHZhcmlhbnQ9XCJsaW5rXCIgY2xhc3M9XCJ0ZXh0LWRlY29yYXRpb24tbm9uZSBtbC0xXCJcclxuICAgICAgICAgICAgICAgICAgOmRpc2FibGVkPVwiY2hhcnRNb2RlbD09J21peGVkJ1wiIDpwcmVzc2VkPVwiY2hhcnRNb2RlbD09J21peGVkJ1wiPjxpIGNsYXNzPVwiZmFzIGZhLWZpbGUtY3N2XCJcclxuICAgICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+IE1peGVkIFNjb3JlczwvYi1idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8Yi1idXR0b24gQGNsaWNrPVwidXBkYXRlQ2hhcnQoJ3JhbmsnKVwiIHZhcmlhbnQ9XCJsaW5rXCIgY2xhc3M9XCJ0ZXh0LWRlY29yYXRpb24tbm9uZSBtbC0xXCJcclxuICAgICAgICAgICAgICAgICAgOmRpc2FibGVkPVwiY2hhcnRNb2RlbD09J3JhbmsnXCIgOnByZXNzZWQ9XCJjaGFydE1vZGVsPT0ncmFuaydcIj48aSBjbGFzcz1cImZhcyBmYS1jaGFydC1saW5lXCJcclxuICAgICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+IFJhbmsgcGVyIFJkPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiBAY2xpY2s9XCJ1cGRhdGVDaGFydCgnd2lucycpXCIgdmFyaWFudD1cImxpbmtcIiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lIG1sLTFcIlxyXG4gICAgICAgICAgICAgICAgICA6ZGlzYWJsZWQ9XCJjaGFydE1vZGVsPT0nd2lucydcIiA6cHJlc3NlZD1cImNoYXJ0TW9kZWw9PSd3aW5zJ1wiPjxpIGNsYXNzPVwiZmFzIGZhLWJhbGFuY2Utc2NhbGUgZmEtc3RhY2tcIlxyXG4gICAgICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT4gU3RhcnRzL1JlcGxpZXMgV2lucyglKTwvYi1idXR0b24+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGlkPVwiY2hhcnRcIj5cclxuICAgICAgICAgICAgICA8YXBleGNoYXJ0IHYtaWY9XCJjaGFydE1vZGVsPT0nbWl4ZWQnXCIgdHlwZT1saW5lIGhlaWdodD00MDAgOm9wdGlvbnM9XCJjaGFydE9wdGlvbnNcIlxyXG4gICAgICAgICAgICAgICAgOnNlcmllcz1cInNlcmllc01peGVkXCIgLz5cclxuICAgICAgICAgICAgICA8YXBleGNoYXJ0IHYtaWY9XCJjaGFydE1vZGVsPT0ncmFuaydcIiB0eXBlPSdsaW5lJyBoZWlnaHQ9NDAwIDpvcHRpb25zPVwiY2hhcnRPcHRpb25zUmFua1wiXHJcbiAgICAgICAgICAgICAgICA6c2VyaWVzPVwic2VyaWVzUmFua1wiIC8+XHJcbiAgICAgICAgICAgICAgPGFwZXhjaGFydCB2LWlmPVwiY2hhcnRNb2RlbD09J3dpbnMnXCIgdHlwZT1yYWRpYWxCYXIgaGVpZ2h0PTQwMCA6b3B0aW9ucz1cImNoYXJ0T3B0UmFkaWFsXCJcclxuICAgICAgICAgICAgICAgIDpzZXJpZXM9XCJzZXJpZXNSYWRpYWxcIiAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvYi1jYXJkPlxyXG4gICAgICAgIDwvYi1jb2xsYXBzZT5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuICBgLFxyXG4gIHByb3BzOiBbJ3BzdGF0cyddLFxyXG4gIGNvbXBvbmVudHM6IHtcclxuICAgIGFwZXhjaGFydDogVnVlQXBleENoYXJ0cyxcclxuICB9LFxyXG4gIGRhdGE6IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHBsYXllcjogJycsXHJcbiAgICAgIHNob3c6IHRydWUsXHJcbiAgICAgIHBsYXllck5hbWU6ICcnLFxyXG4gICAgICBhbGxTY29yZXM6IFtdLFxyXG4gICAgICBhbGxPcHBTY29yZXM6IFtdLFxyXG4gICAgICBhbGxSYW5rczogW10sXHJcbiAgICAgIHRvdGFsX3BsYXllcnM6IG51bGwsXHJcbiAgICAgIGNoYXJ0TW9kZWw6ICdyYW5rJyxcclxuICAgICAgc2VyaWVzTWl4ZWQ6IHBsYXllcl9taXhlZF9zZXJpZXMsXHJcbiAgICAgIHNlcmllc1Jhbms6IHBsYXllcl9yYW5rX3NlcmllcyxcclxuICAgICAgc2VyaWVzUmFkaWFsOiBwbGF5ZXJfcmFkaWFsX2NoYXJ0X3NlcmllcyxcclxuICAgICAgY2hhcnRPcHRSYWRpYWw6IHBsYXllcl9yYWRpYWxfY2hhcnRfY29uZmlnLFxyXG4gICAgICBjaGFydE9wdGlvbnNSYW5rOiBwbGF5ZXJfcmFua19jaGFydF9jb25maWcsXHJcbiAgICAgIGNoYXJ0T3B0aW9uczoge1xyXG4gICAgICAgIGNoYXJ0OiB7XHJcbiAgICAgICAgICBoZWlnaHQ6IDQwMCxcclxuICAgICAgICAgIHpvb206IHtcclxuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2VcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBzaGFkb3c6IHtcclxuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgICAgICAgICAgY29sb3I6ICcjMDAwJyxcclxuICAgICAgICAgICAgdG9wOiAxOCxcclxuICAgICAgICAgICAgbGVmdDogNyxcclxuICAgICAgICAgICAgYmx1cjogMTAsXHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDAuNVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvbG9yczogWycjOEZCQzhGJywgJyM1NDU0NTQnXSxcclxuICAgICAgICBkYXRhTGFiZWxzOiB7XHJcbiAgICAgICAgICBlbmFibGVkOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzdHJva2U6IHtcclxuICAgICAgICAgIGN1cnZlOiAnc3RyYWlnaHQnIC8vIHNtb290aFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgIHRleHQ6ICcnLFxyXG4gICAgICAgICAgYWxpZ246ICdsZWZ0J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgYm9yZGVyQ29sb3I6ICcjZTdlN2U3JyxcclxuICAgICAgICAgIHJvdzoge1xyXG4gICAgICAgICAgICBjb2xvcnM6IFsnI2YzZjNmMycsICd0cmFuc3BhcmVudCddLCAvLyB0YWtlcyBhbiBhcnJheSB3aGljaCB3aWxsIGJlIHJlcGVhdGVkIG9uIGNvbHVtbnNcclxuICAgICAgICAgICAgb3BhY2l0eTogMC41XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgeGF4aXM6IHtcclxuICAgICAgICAgIGNhdGVnb3JpZXM6IFtdLFxyXG4gICAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgICAgdGV4dDogJ1JvdW5kcydcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHlheGlzOiB7XHJcbiAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICB0ZXh0OiAnJ1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1pbjogbnVsbCxcclxuICAgICAgICAgIG1heDogbnVsbFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICBwb3NpdGlvbjogJ3RvcCcsXHJcbiAgICAgICAgICBob3Jpem9udGFsQWxpZ246ICdyaWdodCcsXHJcbiAgICAgICAgICBmbG9hdGluZzogdHJ1ZSxcclxuICAgICAgICAgIG9mZnNldFk6IC0yNSxcclxuICAgICAgICAgIG9mZnNldFg6IC01XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBtb3VudGVkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmRvU2Nyb2xsKCk7XHJcbiAgICBjb25zb2xlLmxvZyh0aGlzLnNlcmllc1JhZGlhbClcclxuICAgIHRoaXMuc2hvdyA9IHRoaXMuc2hvd1N0YXRzO1xyXG4gICAgdGhpcy5hbGxTY29yZXMgPSBfLmZsYXR0ZW4odGhpcy5wc3RhdHMuYWxsU2NvcmVzKTtcclxuICAgIHRoaXMuYWxsT3BwU2NvcmVzID0gXy5mbGF0dGVuKHRoaXMucHN0YXRzLmFsbE9wcFNjb3Jlcyk7XHJcbiAgICB0aGlzLmFsbFJhbmtzID0gXy5mbGF0dGVuKHRoaXMucHN0YXRzLmFsbFJhbmtzKTtcclxuICAgIHRoaXMudXBkYXRlQ2hhcnQodGhpcy5jaGFydE1vZGVsKTtcclxuICAgIHRoaXMudG90YWxfcGxheWVycyA9IHRoaXMucGxheWVycy5sZW5ndGg7XHJcbiAgICB0aGlzLnBsYXllciA9IHRoaXMucHN0YXRzLnBsYXllclswXTtcclxuICAgIHRoaXMucGxheWVyTmFtZSA9IHRoaXMucGxheWVyLnBvc3RfdGl0bGU7XHJcbiAgfSxcclxuICBjcmVhdGVkOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gIH0sXHJcbiAgYmVmb3JlRGVzdHJveSgpIHtcclxuICAgIHRoaXMuY2xvc2VDYXJkKCk7XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcblxyXG4gICAgZG9TY3JvbGw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgLy8gV2hlbiB0aGUgdXNlciBzY3JvbGxzIHRoZSBwYWdlLCBleGVjdXRlIG15RnVuY3Rpb25cclxuICAgICAgd2luZG93Lm9uc2Nyb2xsID0gZnVuY3Rpb24oKSB7bXlGdW5jdGlvbigpfTtcclxuXHJcbiAgICAgIC8vIEdldCB0aGUgaGVhZGVyXHJcbiAgICAgIHZhciBoZWFkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBoZWFkZXJcIik7XHJcblxyXG4gICAgICAvLyBHZXQgdGhlIG9mZnNldCBwb3NpdGlvbiBvZiB0aGUgbmF2YmFyXHJcbiAgICAgIHZhciBzdGlja3kgPSBoZWFkZXIub2Zmc2V0VG9wO1xyXG4gICAgICB2YXIgaCA9IGhlYWRlci5vZmZzZXRIZWlnaHQgKyA1MDtcclxuXHJcbiAgICAgIC8vIEFkZCB0aGUgc3RpY2t5IGNsYXNzIHRvIHRoZSBoZWFkZXIgd2hlbiB5b3UgcmVhY2ggaXRzIHNjcm9sbCBwb3NpdGlvbi4gUmVtb3ZlIFwic3RpY2t5XCIgd2hlbiB5b3UgbGVhdmUgdGhlIHNjcm9sbCBwb3NpdGlvblxyXG4gICAgICBmdW5jdGlvbiBteUZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICh3aW5kb3cucGFnZVlPZmZzZXQgPiAoc3RpY2t5ICsgaCkpIHtcclxuICAgICAgICAgIGhlYWRlci5jbGFzc0xpc3QuYWRkKFwic3RpY2t5XCIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBoZWFkZXIuY2xhc3NMaXN0LnJlbW92ZShcInN0aWNreVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICB9LFxyXG4gICAgc2V0Q2hhcnRDYXRlZ29yaWVzOiBmdW5jdGlvbigpe1xyXG4gICAgICBsZXQgcm91bmRzID0gXy5yYW5nZSgxLCB0aGlzLnRvdGFsX3JvdW5kcyArIDEpO1xyXG4gICAgICBsZXQgcmRzID0gXy5tYXAocm91bmRzLCBmdW5jdGlvbihudW0peyByZXR1cm4gJ1JkICcrIG51bTsgfSk7XHJcbiAgICAgIHRoaXMuY2hhcnRPcHRpb25zLnhheGlzLmNhdGVnb3JpZXMgPSByZHM7XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlQ2hhcnQ6IGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICAgIC8vY29uc29sZS5sb2coJy0tLS0tLS0tLS0tLS1VcGRhdGluZy4uLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcclxuICAgICAgdGhpcy5jaGFydE1vZGVsID0gdHlwZTtcclxuICAgICAgdGhpcy5jaGFydE9wdGlvbnMudGl0bGUuYWxpZ24gPSAnbGVmdCc7XHJcbiAgICAgIHZhciBmaXJzdE5hbWUgPSBfLnRyaW0oXy5zcGxpdCh0aGlzLnBsYXllck5hbWUsICcgJywgMilbMF0pO1xyXG4gICAgICBpZiAoJ3JhbmsnID09IHR5cGUpIHtcclxuICAgICAgICAvLyB0aGlzLiA9ICdiYXInO1xyXG4gICAgICAgIHRoaXMuY2hhcnRPcHRpb25zUmFuay50aXRsZS50ZXh0ID1gUmFua2luZzogJHt0aGlzLnBsYXllck5hbWV9YDtcclxuICAgICAgICB0aGlzLmNoYXJ0T3B0aW9uc1JhbmsueWF4aXMubWluID0gMDtcclxuICAgICAgICB0aGlzLmNoYXJ0T3B0aW9uc1JhbmsueWF4aXMubWF4ID10aGlzLnRvdGFsX3BsYXllcnM7XHJcbiAgICAgICAgdGhpcy5zZXJpZXNSYW5rID0gW3tcclxuICAgICAgICAgIG5hbWU6IGAke2ZpcnN0TmFtZX0gcmFuayB0aGlzIHJkYCxcclxuICAgICAgICAgIGRhdGE6IHRoaXMuYWxsUmFua3NcclxuICAgICAgICB9XVxyXG4gICAgICB9XHJcbiAgICAgIGlmICgnbWl4ZWQnID09IHR5cGUpIHtcclxuICAgICAgICB0aGlzLnNldENoYXJ0Q2F0ZWdvcmllcygpXHJcbiAgICAgICAgdGhpcy5jaGFydE9wdGlvbnMudGl0bGUudGV4dCA9IGBTY29yZXM6ICR7dGhpcy5wbGF5ZXJOYW1lfWA7XHJcbiAgICAgICAgdGhpcy5jaGFydE9wdGlvbnMueWF4aXMubWluID0gMTAwO1xyXG4gICAgICAgIHRoaXMuY2hhcnRPcHRpb25zLnlheGlzLm1heCA9IDkwMDtcclxuICAgICAgICB0aGlzLnNlcmllc01peGVkID0gW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiBgJHtmaXJzdE5hbWV9YCxcclxuICAgICAgICAgICAgZGF0YTogdGhpcy5hbGxTY29yZXNcclxuICAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgbmFtZTogJ09wcG9uZW50JyxcclxuICAgICAgICAgIGRhdGE6IHRoaXMuYWxsT3BwU2NvcmVzXHJcbiAgICAgICAgIH1dXHJcbiAgICAgIH1cclxuICAgICAgaWYgKCd3aW5zJyA9PSB0eXBlKSB7XHJcbiAgICAgICAgdGhpcy5jaGFydE9wdFJhZGlhbC5sYWJlbHM9IFtdO1xyXG4gICAgICAgIHRoaXMuY2hhcnRPcHRSYWRpYWwuY29sb3JzID1bXTtcclxuICAgICAgICB0aGlzLmNoYXJ0T3B0UmFkaWFsLmxhYmVscy51bnNoaWZ0KCdTdGFydHM6ICUgV2lucycsJ1JlcGxpZXM6ICUgV2lucycpO1xyXG4gICAgICAgIHRoaXMuY2hhcnRPcHRSYWRpYWwuY29sb3JzLnVuc2hpZnQoJyM3Q0ZDMDAnLCAnI0JEQjc2QicpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuY2hhcnRPcHRSYWRpYWwpO1xyXG4gICAgICAgIHZhciBzID0gXy5yb3VuZCgxMDAgKiAodGhpcy5wc3RhdHMuc3RhcnRXaW5zIC8gdGhpcy5wc3RhdHMuc3RhcnRzKSwxKTtcclxuICAgICAgICB2YXIgciA9IF8ucm91bmQoMTAwICogKHRoaXMucHN0YXRzLnJlcGx5V2lucyAvIHRoaXMucHN0YXRzLnJlcGxpZXMpLDEpO1xyXG4gICAgICAgIHRoaXMuc2VyaWVzUmFkaWFsID0gW107XHJcbiAgICAgICAgdGhpcy5zZXJpZXNSYWRpYWwudW5zaGlmdChzLHIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc2VyaWVzUmFkaWFsKVxyXG4gICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIGNsb3NlQ2FyZDogZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJy0tLS0tLS0tLS1DbG9zaW5nIENhcmQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xyXG4gICAgICB0aGlzLiRzdG9yZS5kaXNwYXRjaCgnRE9fU1RBVFMnLCBmYWxzZSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBjb21wdXRlZDoge1xyXG4gICAgLi4uVnVleC5tYXBHZXR0ZXJzKHtcclxuICAgICAgdG90YWxfcm91bmRzOiAnVE9UQUxfUk9VTkRTJyxcclxuICAgICAgcGxheWVyczogJ1BMQVlFUlMnLFxyXG4gICAgICBzaG93U3RhdHM6ICdTSE9XU1RBVFMnLFxyXG4gICAgfSksXHJcbiAgfSxcclxuXHJcbn0pO1xyXG5cclxudmFyIFBsYXllckxpc3QgPSAgVnVlLmNvbXBvbmVudCgnYWxscGxheWVycycse1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgPGRpdiBjbGFzcz1cInJvdyBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiIGlkPVwicGxheWVycy1saXN0XCI+XHJcbiAgICAgIDx0ZW1wbGF0ZSB2LWlmPVwic2hvd1N0YXRzXCI+XHJcbiAgICAgICAgIDxwbGF5ZXJzdGF0cyA6cHN0YXRzPVwicFN0YXRzXCI+PC9wbGF5ZXJzdGF0cz5cclxuICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgPHRlbXBsYXRlIHYtZWxzZT5cclxuICAgIDxkaXYgY2xhc3M9XCJwbGF5ZXJDb2xzIGNvbC1sZy0yIGNvbC1zbS02IGNvbC0xMiBwLTQgXCIgdi1mb3I9XCJwbGF5ZXIgaW4gcGxheWVyc1wiIDprZXk9XCJwbGF5ZXIuaWRcIiA+XHJcbiAgICAgICAgICAgIDxoNCBjbGFzcz1cIm14LWF1dG9cIj48Yi1iYWRnZT57e3BsYXllci50b3Vfbm99fTwvYi1iYWRnZT5cclxuICAgICAgICAgICAge3twbGF5ZXIucG9zdF90aXRsZSB9fVxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImQtYmxvY2sgbXgtYXV0b1wiICBzdHlsZT1cImZvbnQtc2l6ZTpzbWFsbFwiPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cIm14LWF1dG8gZmxhZy1pY29uXCIgOmNsYXNzPVwiJ2ZsYWctaWNvbi0nK3BsYXllci5jb3VudHJ5IHwgbG93ZXJjYXNlXCIgOnRpdGxlPVwicGxheWVyLmNvdW50cnlfZnVsbFwiPjwvaT5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJtbC0yIGZhXCIgOmNsYXNzPVwieydmYS1tYWxlJzogcGxheWVyLmdlbmRlciA9PSAnbScsXHJcbiAgICAgICAgJ2ZhLWZlbWFsZSc6IHBsYXllci5nZW5kZXIgPT0gJ2YnLFxyXG4gICAgICAgICdmYS11c2Vycyc6IHBsYXllci5pc190ZWFtID09ICd5ZXMnIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cclxuICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgPC9oND5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm14LWF1dG8gdGV4dC1jZW50ZXIgYW5pbWF0ZWQgZmFkZUluXCI+XHJcbiAgICAgICAgICAgIDxiLWltZy1sYXp5IHYtYmluZD1cImltZ1Byb3BzXCIgOmFsdD1cInBsYXllci5wb3N0X3RpdGxlXCIgOnNyYz1cInBsYXllci5waG90b1wiIC8+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImQtYmxvY2sgbXgtYXV0b1wiPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gQGNsaWNrPVwic2hvd1BsYXllclN0YXRzKHBsYXllci5pZClcIiB0aXRsZT1cIk9wZW4gcGxheWVyJ3Mgc3RhdHNcIj48aSBjbGFzcz1cImZhcyBmYS1jaGFydC1iYXJcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICA8L2Rpdj5cclxuICAgICAgPC90ZW1wbGF0ZT5cclxuICAgIDwvZGl2PlxyXG4gICAgYCxcclxuICAgIGNvbXBvbmVudHM6IHtcclxuICAgICAgcGxheWVyc3RhdHM6IFBsYXllclN0YXRzLFxyXG4gICAgfSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHBTdGF0czoge30sXHJcbiAgICAgIGltZ1Byb3BzOiB7XHJcbiAgICAgICAgY2VudGVyOiB0cnVlLFxyXG4gICAgICAgIGJsb2NrOiB0cnVlLFxyXG4gICAgICAgIHJvdW5kZWQ6ICdjaXJjbGUnLFxyXG4gICAgICAgIGZsdWlkIDogdHJ1ZSxcclxuICAgICAgICBibGFuazogdHJ1ZSxcclxuICAgICAgICBibGFua0NvbG9yOiAnI2JiYicsXHJcbiAgICAgICAgd2lkdGg6ICc4MHB4JyxcclxuICAgICAgICBoZWlnaHQ6ICc4MHB4JyxcclxuICAgICAgICBjbGFzczogJ3NoYWRvdy1zbSdcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgc2hvd1BsYXllclN0YXRzOiBmdW5jdGlvbiAoaWQpIHtcclxuICAgICAgdGhpcy4kc3RvcmUuY29tbWl0KCdDT01QVVRFX1BMQVlFUl9TVEFUUycsIGlkKTtcclxuICAgICAgdGhpcy5wU3RhdHMucGxheWVyID0gdGhpcy5wbGF5ZXI7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBBdmVPcHAgPSB0aGlzLmxhc3RkYXRhLmF2ZV9vcHBfc2NvcmU7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBBdmUgPSB0aGlzLmxhc3RkYXRhLmF2ZV9zY29yZTtcclxuICAgICAgdGhpcy5wU3RhdHMucFJhbmsgPSB0aGlzLmxhc3RkYXRhLnJhbms7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBQb3NpdGlvbiA9IHRoaXMubGFzdGRhdGEucG9zaXRpb247XHJcbiAgICAgIHRoaXMucFN0YXRzLnBQb2ludHMgPSB0aGlzLmxhc3RkYXRhLnBvaW50cztcclxuICAgICAgdGhpcy5wU3RhdHMucEhpU2NvcmUgPSB0aGlzLnBsYXllcl9zdGF0cy5wSGlTY29yZTtcclxuICAgICAgdGhpcy5wU3RhdHMucExvU2NvcmUgPSB0aGlzLnBsYXllcl9zdGF0cy5wTG9TY29yZTtcclxuICAgICAgdGhpcy5wU3RhdHMucEhpT3BwU2NvcmUgPSB0aGlzLnBsYXllcl9zdGF0cy5wSGlPcHBTY29yZTtcclxuICAgICAgdGhpcy5wU3RhdHMucExvT3BwU2NvcmUgPSB0aGlzLnBsYXllcl9zdGF0cy5wTG9PcHBTY29yZTtcclxuICAgICAgdGhpcy5wU3RhdHMucEhpU2NvcmVSb3VuZHMgPSB0aGlzLnBsYXllcl9zdGF0cy5wSGlTY29yZVJvdW5kcztcclxuICAgICAgdGhpcy5wU3RhdHMucExvU2NvcmVSb3VuZHMgPSB0aGlzLnBsYXllcl9zdGF0cy5wTG9TY29yZVJvdW5kcztcclxuICAgICAgdGhpcy5wU3RhdHMuYWxsUmFua3MgPSB0aGlzLnBsYXllcl9zdGF0cy5hbGxSYW5rcztcclxuICAgICAgdGhpcy5wU3RhdHMuYWxsU2NvcmVzID0gdGhpcy5wbGF5ZXJfc3RhdHMuYWxsU2NvcmVzO1xyXG4gICAgICB0aGlzLnBTdGF0cy5hbGxPcHBTY29yZXMgPSB0aGlzLnBsYXllcl9zdGF0cy5hbGxPcHBTY29yZXM7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBSYnlSID0gdGhpcy5wbGF5ZXJfc3RhdHMucFJieVI7XHJcbiAgICAgIHRoaXMucFN0YXRzLnN0YXJ0V2lucyA9IHRoaXMucGxheWVyX3N0YXRzLnN0YXJ0V2lucztcclxuICAgICAgdGhpcy5wU3RhdHMuc3RhcnRzID0gdGhpcy5wbGF5ZXJfc3RhdHMuc3RhcnRzO1xyXG4gICAgICB0aGlzLnBTdGF0cy5yZXBseVdpbnMgPSB0aGlzLnBsYXllcl9zdGF0cy5yZXBseVdpbnM7XHJcbiAgICAgIHRoaXMucFN0YXRzLnJlcGxpZXMgPSB0aGlzLnBsYXllcl9zdGF0cy5yZXBsaWVzO1xyXG5cclxuICAgICAgdGhpcy4kc3RvcmUuZGlzcGF0Y2goJ0RPX1NUQVRTJyx0cnVlKTtcclxuICAgIH1cclxuICB9LFxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICAuLi5WdWV4Lm1hcEdldHRlcnMoe1xyXG4gICAgICByZXN1bHRfZGF0YTogJ1JFU1VMVERBVEEnLFxyXG4gICAgICBwbGF5ZXJzOiAnUExBWUVSUycsXHJcbiAgICAgIHRvdGFsX3BsYXllcnM6ICdUT1RBTFBMQVlFUlMnLFxyXG4gICAgICB0b3RhbF9yb3VuZHM6ICdUT1RBTF9ST1VORFMnLFxyXG4gICAgICBzaG93U3RhdHM6ICdTSE9XU1RBVFMnLFxyXG4gICAgICBsYXN0ZGF0YTogJ0xBU1RSRERBVEEnLFxyXG4gICAgICBwbGF5ZXJkYXRhOiAnUExBWUVSREFUQScsXHJcbiAgICAgIHBsYXllcjogJ1BMQVlFUicsXHJcbiAgICAgIHBsYXllcl9zdGF0czogJ1BMQVlFUl9TVEFUUydcclxuICAgIH0pLFxyXG4gICAgLy8gbGFzdFJkRGF0YToge1xyXG4gICAgLy8gICBnZXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gICAgIHZhciBsZW4gPSB0aGlzLnJlc3VsdF9kYXRhLmxlbmd0aDtcclxuICAgIC8vICAgICByZXR1cm4gdGhpcy5yZXN1bHRfZGF0YVtsZW4gLSAxXVxyXG4gICAgLy8gICB9LFxyXG4gICAgLy8gICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAvLyAgICAgdGhpcy5sYXN0UmREYXRhID0gdmFsdWVcclxuICAgIC8vICAgfVxyXG4gICAgLy8gfSxcclxuICB9XHJcbn0pO1xyXG5cclxuIHZhciBSZXN1bHRzID0gVnVlLmNvbXBvbmVudCgncmVzdWx0cycsIHtcclxuICAgdGVtcGxhdGU6IGBcclxuICAgIDxiLXRhYmxlIGhvdmVyIHJlc3BvbnNpdmUgc3RyaXBlZCBmb290LWNsb25lIDpmaWVsZHM9XCJyZXN1bHRzX2ZpZWxkc1wiIDppdGVtcz1cInJlc3VsdChjdXJyZW50Um91bmQpXCIgaGVhZC12YXJpYW50PVwiZGFya1wiIGNsYXNzPVwiYW5pbWF0ZWQgZmFkZUluVXBcIj5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cInRhYmxlLWNhcHRpb25cIj5cclxuICAgICAgICAgICAge3tjYXB0aW9ufX1cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgPC9iLXRhYmxlPlxyXG4gICAgYCxcclxuICBwcm9wczogWydjYXB0aW9uJywgJ2N1cnJlbnRSb3VuZCcsICdyZXN1bHRkYXRhJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICByZXN1bHRzX2ZpZWxkczogW10sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgY3JlYXRlZDogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLnJlc3VsdHNfZmllbGRzID0gW1xyXG4gICAgICB7IGtleTogJ3JhbmsnLCBsYWJlbDogJyMnLCBjbGFzczogJ3RleHQtY2VudGVyJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdwbGF5ZXInLCBsYWJlbDogJ1BsYXllcicsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIC8vIHsga2V5OiAncG9zaXRpb24nLGxhYmVsOiAnUG9zaXRpb24nLCdjbGFzcyc6J3RleHQtY2VudGVyJ30sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdzY29yZScsXHJcbiAgICAgICAgbGFiZWw6ICdTY29yZScsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIGtleSwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgaWYgKGl0ZW0ub3Bwb19zY29yZSA9PSAwICYmIGl0ZW0uc2NvcmUgPT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ0FSJztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtLnNjb3JlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHsga2V5OiAnb3BwbycsIGxhYmVsOiAnT3Bwb25lbnQnIH0sXHJcbiAgICAgIC8vIHsga2V5OiAnb3BwX3Bvc2l0aW9uJywgbGFiZWw6ICdQb3NpdGlvbicsJ2NsYXNzJzogJ3RleHQtY2VudGVyJ30sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdvcHBvX3Njb3JlJyxcclxuICAgICAgICBsYWJlbDogJ1Njb3JlJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwga2V5LCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICBpZiAoaXRlbS5vcHBvX3Njb3JlID09IDAgJiYgaXRlbS5zY29yZSA9PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnQVInO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW0ub3Bwb19zY29yZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnZGlmZicsXHJcbiAgICAgICAgbGFiZWw6ICdTcHJlYWQnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICAgIGZvcm1hdHRlcjogKHZhbHVlLCBrZXksIGl0ZW0pID0+IHtcclxuICAgICAgICAgIGlmIChpdGVtLm9wcG9fc2NvcmUgPT0gMCAmJiBpdGVtLnNjb3JlID09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuICctJztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICh2YWx1ZSA+IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGArJHt2YWx1ZX1gO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGAke3ZhbHVlfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIF07XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICByZXN1bHQ6IGZ1bmN0aW9uKHIpIHtcclxuICAgICAgbGV0IHJvdW5kID0gciAtIDE7XHJcbiAgICAgIGxldCBkYXRhID0gXy5jbG9uZSh0aGlzLnJlc3VsdGRhdGFbcm91bmRdKTtcclxuXHJcbiAgICAgIF8uZm9yRWFjaChkYXRhLCBmdW5jdGlvbihyKSB7XHJcbiAgICAgICAgbGV0IG9wcF9ubyA9IHJbJ29wcG9fbm8nXTtcclxuICAgICAgICAvLyBGaW5kIHdoZXJlIHRoZSBvcHBvbmVudCdzIGN1cnJlbnQgcG9zaXRpb24gYW5kIGFkZCB0byBjb2xsZWN0aW9uXHJcbiAgICAgICAgbGV0IHJvdyA9IF8uZmluZChkYXRhLCB7IHBubzogb3BwX25vIH0pO1xyXG4gICAgICAgIHJbJ29wcF9wb3NpdGlvbiddID0gcm93LnBvc2l0aW9uO1xyXG4gICAgICAgIC8vIGNoZWNrIHJlc3VsdCAod2luLCBsb3NzLCBkcmF3KVxyXG4gICAgICAgIGxldCByZXN1bHQgPSByLnJlc3VsdDtcclxuICAgICAgICByWydfY2VsbFZhcmlhbnRzJ10gPSBbXTtcclxuICAgICAgICByWydfY2VsbFZhcmlhbnRzJ11bJ2xhc3RHYW1lJ10gPSAnd2FybmluZyc7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gJ3dpbicpIHtcclxuICAgICAgICAgIHJbJ19jZWxsVmFyaWFudHMnXVsnbGFzdEdhbWUnXSA9ICdzdWNjZXNzJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gJ2xvc3MnKSB7XHJcbiAgICAgICAgICByWydfY2VsbFZhcmlhbnRzJ11bJ2xhc3RHYW1lJ10gPSAnZGFuZ2VyJztcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgcmV0dXJuIF8uY2hhaW4oZGF0YSlcclxuICAgICAgICAuc29ydEJ5KCdtYXJnaW4nKVxyXG4gICAgICAgIC5zb3J0QnkoJ3BvaW50cycpXHJcbiAgICAgICAgLnZhbHVlKClcclxuICAgICAgICAucmV2ZXJzZSgpO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbnZhciBTdGFuZGluZ3MgPSBWdWUuY29tcG9uZW50KCdzdGFuZGluZ3MnLHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPGItdGFibGUgcmVzcG9uc2l2ZSBob3ZlciBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwicmVzdWx0KGN1cnJlbnRSb3VuZClcIiA6ZmllbGRzPVwic3RhbmRpbmdzX2ZpZWxkc1wiIGhlYWQtdmFyaWFudD1cImRhcmtcIiBjbGFzcz1cImFuaW1hdGVkIGZhZGVJblVwXCI+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICA8dGVtcGxhdGU+XHJcbiAgICAgICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwicmFua1wiIHNsb3Qtc2NvcGU9XCJkYXRhXCI+XHJcbiAgICAgICAgICAgIHt7ZGF0YS52YWx1ZS5yYW5rfX1cclxuICAgICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJwbGF5ZXJcIiBzbG90LXNjb3BlPVwiZGF0YVwiPlxyXG4gICAgICAgICAgICB7e2RhdGEudmFsdWUucGxheWVyfX1cclxuICAgICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ3b25Mb3N0XCI+PC90ZW1wbGF0ZT5cclxuICAgICAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJtYXJnaW5cIiBzbG90LXNjb3BlPVwiZGF0YVwiPlxyXG4gICAgICAgICAgICB7e2RhdGEudmFsdWUubWFyZ2lufX1cclxuICAgICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJsYXN0R2FtZVwiPlxyXG4gICAgICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8L2ItdGFibGU+XHJcbiAgIGAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdjdXJyZW50Um91bmQnLCAncmVzdWx0ZGF0YSddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc3RhbmRpbmdzX2ZpZWxkczogW10sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgbW91bnRlZDogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLnN0YW5kaW5nc19maWVsZHMgPSBbXHJcbiAgICAgIHsga2V5OiAncmFuaycsIGNsYXNzOiAndGV4dC1jZW50ZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ3BsYXllcicsIGNsYXNzOiAndGV4dC1jZW50ZXInIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICd3b25Mb3N0JyxcclxuICAgICAgICBsYWJlbDogJ1dpbi1EcmF3LUxvc3MnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIGZvcm1hdHRlcjogKHZhbHVlLCBrZXksIGl0ZW0pID0+IHtcclxuICAgICAgICAgIHJldHVybiBgJHtpdGVtLndpbnN9IC0gJHtpdGVtLmRyYXdzfSAtICR7aXRlbS5sb3NzZXN9YDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAncG9pbnRzJyxcclxuICAgICAgICBsYWJlbDogJ1BvaW50cycsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIGtleSwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgaWYgKGl0ZW0uYXIgPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgJHtpdGVtLnBvaW50c30qYDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBgJHtpdGVtLnBvaW50c31gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdtYXJnaW4nLFxyXG4gICAgICAgIGxhYmVsOiAnU3ByZWFkJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgICBmb3JtYXR0ZXI6IHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICh2YWx1ZSA+IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGArJHt2YWx1ZX1gO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGAke3ZhbHVlfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ2xhc3RHYW1lJyxcclxuICAgICAgICBsYWJlbDogJ0xhc3QgR2FtZScsXHJcbiAgICAgICAgc29ydGFibGU6IGZhbHNlLFxyXG4gICAgICAgIGZvcm1hdHRlcjogKHZhbHVlLCBrZXksIGl0ZW0pID0+IHtcclxuICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgaXRlbS5zY29yZSA9PSAwICYmXHJcbiAgICAgICAgICAgIGl0ZW0ub3Bwb19zY29yZSA9PSAwICYmXHJcbiAgICAgICAgICAgIGl0ZW0ucmVzdWx0ID09ICdhd2FpdGluZydcclxuICAgICAgICAgICkge1xyXG4gICAgICAgICAgICByZXR1cm4gYEF3YWl0aW5nIHJlc3VsdCBvZiBnYW1lICR7aXRlbS5yb3VuZH0gdnMgJHtpdGVtLm9wcG99YDtcclxuICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICByZXR1cm4gYGEgJHtpdGVtLnNjb3JlfS0ke2l0ZW0ub3Bwb19zY29yZX1cclxuICAgICAgICAgICAgJHtpdGVtLnJlc3VsdC50b1VwcGVyQ2FzZSgpfSB2cyAke2l0ZW0ub3Bwb30gYDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIHJlc3VsdChyKSB7XHJcbiAgICAgIGxldCByb3VuZCA9IHIgLSAxO1xyXG4gICAgICBsZXQgZGF0YSA9IF8uY2xvbmUodGhpcy5yZXN1bHRkYXRhW3JvdW5kXSk7XHJcbiAgICAgIF8uZm9yRWFjaChkYXRhLCBmdW5jdGlvbihyKSB7XHJcbiAgICAgICAgbGV0IG9wcF9ubyA9IHJbJ29wcG9fbm8nXTtcclxuICAgICAgICAvLyBGaW5kIHdoZXJlIHRoZSBvcHBvbmVudCdzIGN1cnJlbnQgcG9zaXRpb24gYW5kIGFkZCB0byBjb2xsZWN0aW9uXHJcbiAgICAgICAgbGV0IHJvdyA9IF8uZmluZChkYXRhLCB7IHBubzogb3BwX25vIH0pO1xyXG4gICAgICAgIHJbJ29wcF9wb3NpdGlvbiddID0gcm93Wydwb3NpdGlvbiddO1xyXG4gICAgICAgIC8vIGNoZWNrIHJlc3VsdCAod2luLCBsb3NzLCBkcmF3KVxyXG4gICAgICAgIGxldCByZXN1bHQgPSByWydyZXN1bHQnXTtcclxuXHJcbiAgICAgICAgclsnX2NlbGxWYXJpYW50cyddID0gW107XHJcbiAgICAgICAgclsnX2NlbGxWYXJpYW50cyddWydsYXN0R2FtZSddID0gJ3dhcm5pbmcnO1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09ICd3aW4nKSB7XHJcbiAgICAgICAgICByWydfY2VsbFZhcmlhbnRzJ11bJ2xhc3RHYW1lJ10gPSAnc3VjY2Vzcyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXN1bHQgPT09ICdsb3NzJykge1xyXG4gICAgICAgICAgclsnX2NlbGxWYXJpYW50cyddWydsYXN0R2FtZSddID0gJ2Rhbmdlcic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXN1bHQgPT09ICdhd2FpdGluZycpIHtcclxuICAgICAgICAgIHJbJ19jZWxsVmFyaWFudHMnXVsnbGFzdEdhbWUnXSA9ICdpbmZvJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gJ2RyYXcnKSB7XHJcbiAgICAgICAgICByWydfY2VsbFZhcmlhbnRzJ11bJ2xhc3RHYW1lJ10gPSAnd2FybmluZyc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIF8uY2hhaW4oZGF0YSlcclxuICAgICAgICAuc29ydEJ5KCdtYXJnaW4nKVxyXG4gICAgICAgIC5zb3J0QnkoJ3BvaW50cycpXHJcbiAgICAgICAgLnZhbHVlKClcclxuICAgICAgICAucmV2ZXJzZSgpO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbmNvbnN0IFBhaXJpbmdzID1WdWUuY29tcG9uZW50KCdwYWlyaW5ncycsICB7XHJcbiAgdGVtcGxhdGU6IGBcclxuPHRhYmxlIGNsYXNzPVwidGFibGUgdGFibGUtaG92ZXIgdGFibGUtcmVzcG9uc2l2ZSB0YWJsZS1zdHJpcGVkICBhbmltYXRlZCBmYWRlSW5VcFwiPlxyXG4gICAgPGNhcHRpb24+e3tjYXB0aW9ufX08L2NhcHRpb24+XHJcbiAgICA8dGhlYWQgY2xhc3M9XCJ0aGVhZC1kYXJrXCI+XHJcbiAgICAgICAgPHRyPlxyXG4gICAgICAgIDx0aCBzY29wZT1cImNvbFwiPiM8L3RoPlxyXG4gICAgICAgIDx0aCBzY29wZT1cImNvbFwiPlBsYXllcjwvdGg+XHJcbiAgICAgICAgPHRoIHNjb3BlPVwiY29sXCI+T3Bwb25lbnQ8L3RoPlxyXG4gICAgICAgIDwvdHI+XHJcbiAgICA8L3RoZWFkPlxyXG4gICAgPHRib2R5PlxyXG4gICAgICAgIDx0ciB2LWZvcj1cIihwbGF5ZXIsaSkgaW4gcGFpcmluZyhjdXJyZW50Um91bmQpXCIgOmtleT1cImlcIj5cclxuICAgICAgICA8dGggc2NvcGU9XCJyb3dcIj57e2kgKyAxfX08L3RoPlxyXG4gICAgICAgIDx0ZD48c3VwIHYtaWY9XCJwbGF5ZXIuc3RhcnQgPT0neSdcIj4qPC9zdXA+e3twbGF5ZXIucGxheWVyfX08L3RkPlxyXG4gICAgICAgIDx0ZD48c3VwIHYtaWY9XCJwbGF5ZXIuc3RhcnQgPT0nbidcIj4qPC9zdXA+e3twbGF5ZXIub3Bwb319PC90ZD5cclxuICAgICAgICA8L3RyPlxyXG4gICAgPC90Ym9keT5cclxuICA8L3RhYmxlPlxyXG5gLFxyXG4gIHByb3BzOiBbJ2NhcHRpb24nLCAnY3VycmVudFJvdW5kJywgJ3Jlc3VsdGRhdGEnXSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgLy8gZ2V0IHBhaXJpbmdcclxuICAgIHBhaXJpbmcocikge1xyXG4gICAgICBsZXQgcm91bmQgPSByIC0gMTtcclxuICAgICAgbGV0IHJvdW5kX3JlcyA9IHRoaXMucmVzdWx0ZGF0YVtyb3VuZF07XHJcbiAgICAgIC8vIFNvcnQgYnkgcGxheWVyIG51bWJlcmluZyBpZiByb3VuZCAxIHRvIG9idGFpbiByb3VuZCAxIHBhaXJpbmdcclxuICAgICAgaWYgKHIgPT09IDEpIHtcclxuICAgICAgICByb3VuZF9yZXMgPSBfLnNvcnRCeShyb3VuZF9yZXMsICdwbm8nKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IHBhaXJlZF9wbGF5ZXJzID0gW107XHJcblxyXG4gICAgICBsZXQgcnAgPSBfLm1hcChyb3VuZF9yZXMsIGZ1bmN0aW9uKHIpIHtcclxuICAgICAgICBsZXQgcGxheWVyID0gclsncG5vJ107XHJcbiAgICAgICAgbGV0IG9wcG9uZW50ID0gclsnb3Bwb19ubyddO1xyXG4gICAgICAgIGlmIChfLmluY2x1ZGVzKHBhaXJlZF9wbGF5ZXJzLCBwbGF5ZXIpKSB7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBhaXJlZF9wbGF5ZXJzLnB1c2gocGxheWVyKTtcclxuICAgICAgICBwYWlyZWRfcGxheWVycy5wdXNoKG9wcG9uZW50KTtcclxuICAgICAgICByZXR1cm4gcjtcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiBfLmNvbXBhY3QocnApO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCB7UGFpcmluZ3MsIFN0YW5kaW5ncywgUGxheWVyTGlzdCwgUmVzdWx0cywgUGxheWVyU3RhdHMsfVxyXG5cclxuIiwiXHJcbnZhciBTY29yZWJvYXJkID0gVnVlLmNvbXBvbmVudCgnc2NvcmVib2FyZCcse1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgPGRpdiBjbGFzcz1cInJvdyBkLWZsZXggYWxpZ24taXRlbXMtY2VudGVyIGp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICA8dGVtcGxhdGUgdi1pZj1cImxvYWRpbmd8fGVycm9yXCI+XHJcbiAgICAgICAgPGRpdiB2LWlmPVwibG9hZGluZ1wiIGNsYXNzPVwiY29sIGFsaWduLXNlbGYtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxsb2FkaW5nPjwvbG9hZGluZz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IHYtaWY9XCJlcnJvclwiIGNsYXNzPVwiY29sIGFsaWduLXNlbGYtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxlcnJvcj5cclxuICAgICAgICAgICAgPHAgc2xvdD1cImVycm9yXCI+e3tlcnJvcn19PC9wPlxyXG4gICAgICAgICAgICA8cCBzbG90PVwiZXJyb3JfbXNnXCI+e3tlcnJvcl9tc2d9fTwvcD5cclxuICAgICAgICAgICAgPC9lcnJvcj5cclxuICAgICAgICA8L2Rpdj5cclxuICA8L3RlbXBsYXRlPlxyXG4gIDx0ZW1wbGF0ZSB2LWVsc2U+XHJcbiAgPGRpdiBjbGFzcz1cImNvbFwiIGlkPVwic2NvcmVib2FyZFwiPlxyXG4gICAgPGRpdiBjbGFzcz1cInJvdyBuby1ndXR0ZXJzIGQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXIganVzdGlmeS1jb250ZW50LWNlbnRlclwiIHYtZm9yPVwiaSBpbiByb3dDb3VudFwiIDprZXk9XCJpXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbGctMyBjb2wtc20tNiBjb2wtMTIgXCIgdi1mb3I9XCJwbGF5ZXIgaW4gaXRlbUNvdW50SW5Sb3coaSlcIiA6a2V5PVwicGxheWVyLnJhbmtcIj5cclxuICAgICAgICA8Yi1tZWRpYSBjbGFzcz1cInBiLTAgbWItMSBtci0xXCIgdmVydGljYWwtYWxpZ249XCJjZW50ZXJcIj5cclxuICAgICAgICAgIDxkaXYgc2xvdD1cImFzaWRlXCI+XHJcbiAgICAgICAgICAgIDxiLXJvdyBjbGFzcz1cImp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICA8Yi1jb2w+XHJcbiAgICAgICAgICAgICAgICA8Yi1pbWcgcm91bmRlZD1cImNpcmNsZVwiIDpzcmM9XCJwbGF5ZXIucGhvdG9cIiB3aWR0aD1cIjUwXCIgaGVpZ2h0PVwiNTBcIiA6YWx0PVwicGxheWVyLnBsYXllclwiIGNsYXNzPVwiYW5pbWF0ZWQgZmFkZUluXCIvPlxyXG4gICAgICAgICAgICAgIDwvYi1jb2w+XHJcbiAgICAgICAgICAgIDwvYi1yb3c+XHJcbiAgICAgICAgICAgIDxiLXJvdyBjbGFzcz1cImp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICA8Yi1jb2wgY29scz1cIjEyXCIgbWQ9XCJhdXRvXCI+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImZsYWctaWNvblwiIDp0aXRsZT1cInBsYXllci5jb3VudHJ5X2Z1bGxcIlxyXG4gICAgICAgICAgICAgICAgICA6Y2xhc3M9XCInZmxhZy1pY29uLScrcGxheWVyLmNvdW50cnkgfCBsb3dlcmNhc2VcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9iLWNvbD5cclxuICAgICAgICAgICAgICA8Yi1jb2wgY29sIGxnPVwiMlwiPlxyXG4gICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYVwiIHYtYmluZDpjbGFzcz1cInsnZmEtbWFsZSc6IHBsYXllci5nZW5kZXIgPT09ICdtJyxcclxuICAgICAgICAgICAgICAgICAgICAgJ2ZhLWZlbWFsZSc6IHBsYXllci5nZW5kZXIgPT09ICdmJyB9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxyXG4gICAgICAgICAgICAgIDwvYi1jb2w+XHJcbiAgICAgICAgICAgIDwvYi1yb3c+XHJcbiAgICAgICAgICAgIDxiLXJvdyBjbGFzcz1cInRleHQtY2VudGVyXCIgdi1pZj1cInBsYXllci50ZWFtXCI+XHJcbiAgICAgICAgICAgICAgPGItY29sPjxzcGFuPnt7cGxheWVyLnRlYW19fTwvc3Bhbj48L2ItY29sPlxyXG4gICAgICAgICAgICA8L2Itcm93PlxyXG4gICAgICAgICAgICA8Yi1yb3c+XHJcbiAgICAgICAgICAgICAgPGItY29sIGNsYXNzPVwidGV4dC13aGl0ZVwiIHYtYmluZDpjbGFzcz1cInsndGV4dC13YXJuaW5nJzogcGxheWVyLnJlc3VsdCA9PT0gJ2RyYXcnLFxyXG4gICAgICAgICAgICAgJ3RleHQtaW5mbyc6IHBsYXllci5yZXN1bHQgPT09ICdhd2FpdGluZycsXHJcbiAgICAgICAgICAgICAndGV4dC1kYW5nZXInOiBwbGF5ZXIucmVzdWx0ID09PSAnbG9zcycsXHJcbiAgICAgICAgICAgICAndGV4dC1zdWNjZXNzJzogcGxheWVyLnJlc3VsdCA9PT0gJ3dpbicgfVwiPlxyXG4gICAgICAgICAgICAgICAgPGg0IGNsYXNzPVwidGV4dC1jZW50ZXIgcG9zaXRpb24gIG10LTFcIj5cclxuICAgICAgICAgICAgICAgICAge3twbGF5ZXIucG9zaXRpb259fVxyXG4gICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhXCIgdi1iaW5kOmNsYXNzPVwieydmYS1sb25nLWFycm93LXVwJzogcGxheWVyLnJhbmsgPCBwbGF5ZXIubGFzdHJhbmssJ2ZhLWxvbmctYXJyb3ctZG93bic6IHBsYXllci5yYW5rID4gcGxheWVyLmxhc3RyYW5rLFxyXG4gICAgICAgICAgICAgICAgICdmYS1hcnJvd3MtaCc6IHBsYXllci5yYW5rID09IHBsYXllci5sYXN0cmFuayB9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgPC9oND5cclxuICAgICAgICAgICAgICA8L2ItY29sPlxyXG4gICAgICAgICAgICA8L2Itcm93PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8aDUgY2xhc3M9XCJtLTAgIGFuaW1hdGVkIGZhZGVJbkxlZnRcIj57e3BsYXllci5wbGF5ZXJ9fTwvaDU+XHJcbiAgICAgICAgICA8cCBjbGFzcz1cImNhcmQtdGV4dCBtdC0wXCI+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2RhdGEgcG9pbnRzIHAtMVwiPnt7cGxheWVyLnBvaW50c319LXt7cGxheWVyLmxvc3Nlc319PC9zcGFuPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNkYXRhIG1hclwiPnt7cGxheWVyLm1hcmdpbiB8IGFkZHBsdXN9fTwvc3Bhbj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzZGF0YSBwMVwiPndhcyB7e3BsYXllci5sYXN0cG9zaXRpb259fTwvc3Bhbj5cclxuICAgICAgICAgIDwvcD5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgPGItY29sPlxyXG4gICAgICAgICAgICAgIDxzcGFuIHYtaWY9XCJwbGF5ZXIucmVzdWx0ID09J2F3YWl0aW5nJyBcIiBjbGFzcz1cImJnLWluZm8gZC1pbmxpbmUgcC0xIG1sLTEgdGV4dC13aGl0ZSByZXN1bHRcIj57e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5yZXN1bHQgfCBmaXJzdGNoYXIgfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gdi1lbHNlIGNsYXNzPVwiZC1pbmxpbmUgcC0xIG1sLTEgdGV4dC13aGl0ZSByZXN1bHRcIiB2LWJpbmQ6Y2xhc3M9XCJ7J2JnLXdhcm5pbmcnOiBwbGF5ZXIucmVzdWx0ID09PSAnZHJhdycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAnYmctZGFuZ2VyJzogcGxheWVyLnJlc3VsdCA9PT0gJ2xvc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgJ2JnLWluZm8nOiBwbGF5ZXIucmVzdWx0ID09PSAnYXdhaXRpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgJ2JnLXN1Y2Nlc3MnOiBwbGF5ZXIucmVzdWx0ID09PSAnd2luJyB9XCI+XHJcbiAgICAgICAgICAgICAgICB7e3BsYXllci5yZXN1bHQgfCBmaXJzdGNoYXJ9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiB2LWlmPVwicGxheWVyLnJlc3VsdCA9PSdhd2FpdGluZycgXCIgY2xhc3M9XCJ0ZXh0LWluZm8gZC1pbmxpbmUgcC0xICBzZGF0YVwiPkF3YWl0aW5nXHJcbiAgICAgICAgICAgICAgICBSZXN1bHQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gdi1lbHNlIGNsYXNzPVwiZC1pbmxpbmUgcC0xIHNkYXRhXCIgdi1iaW5kOmNsYXNzPVwieyd0ZXh0LXdhcm5pbmcnOiBwbGF5ZXIucmVzdWx0ID09PSAnZHJhdycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgJ3RleHQtZGFuZ2VyJzogcGxheWVyLnJlc3VsdCA9PT0gJ2xvc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICd0ZXh0LXN1Y2Nlc3MnOiBwbGF5ZXIucmVzdWx0ID09PSAnd2luJyB9XCI+e3twbGF5ZXIuc2NvcmV9fVxyXG4gICAgICAgICAgICAgICAgLSB7e3BsYXllci5vcHBvX3Njb3JlfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkLWJsb2NrIHAtMCBtbC0xIG9wcFwiPnZzIHt7cGxheWVyLm9wcG99fTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9iLWNvbD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBhbGlnbi1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8Yi1jb2w+XHJcbiAgICAgICAgICAgICAgPHNwYW4gOnRpdGxlPVwicmVzXCIgdi1mb3I9XCJyZXMgaW4gcGxheWVyLnByZXZyZXN1bHRzXCIgOmtleT1cInJlcy5rZXlcIlxyXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJkLWlubGluZS1ibG9jayBwLTEgdGV4dC13aGl0ZSBzZGF0YS1yZXMgdGV4dC1jZW50ZXJcIiB2LWJpbmQ6Y2xhc3M9XCJ7J2JnLXdhcm5pbmcnOiByZXMgPT09ICdkcmF3JyxcclxuICAgICAgICAgICAgICAgICAgICAgJ2JnLWluZm8nOiByZXMgPT09ICdhd2FpdGluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICdiZy1kYW5nZXInOiByZXMgPT09ICdsb3NzJyxcclxuICAgICAgICAgICAgICAgICAgICAgJ2JnLXN1Y2Nlc3MnOiByZXMgPT09ICd3aW4nIH1cIj57e3Jlc3xmaXJzdGNoYXJ9fTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9iLWNvbD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvYi1tZWRpYT5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuICA8L3RlbXBsYXRlPlxyXG48L2Rpdj5cclxuICAgIGAsXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBpdGVtc1BlclJvdzogNCxcclxuICAgICAgcGVyX3BhZ2U6IDQwLFxyXG4gICAgICBwYXJlbnRfc2x1ZzogdGhpcy4kcm91dGUucGFyYW1zLnNsdWcsXHJcbiAgICAgIHBhZ2V1cmw6IGJhc2VVUkwgKyB0aGlzLiRyb3V0ZS5wYXRoLFxyXG4gICAgICBzbHVnOiB0aGlzLiRyb3V0ZS5wYXJhbXMuZXZlbnRfc2x1ZyxcclxuICAgICAgcmVsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgY3VycmVudFBhZ2U6IDEsXHJcbiAgICAgIHBlcmlvZDogMC41LFxyXG4gICAgICB0aW1lcjogbnVsbCxcclxuICAgICAgc2NvcmVib2FyZF9kYXRhOiBbXSxcclxuICAgICAgcmVzcG9uc2VfZGF0YTogW10sXHJcbiAgICAgIC8vIHBsYXllcnM6IFtdLFxyXG4gICAgICAvLyB0b3RhbF9yb3VuZHM6IDAsXHJcbiAgICAgIGN1cnJlbnRSb3VuZDogbnVsbCxcclxuICAgICAgZXZlbnRfdGl0bGU6ICcnLFxyXG4gICAgICBpc19saXZlX2dhbWU6IHRydWUsXHJcbiAgICB9O1xyXG4gIH0sXHJcblxyXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIHRoaXMuZmV0Y2hTY29yZWJvYXJkRGF0YSgpO1xyXG4gICAgdGhpcy5wcm9jZXNzRGV0YWlscyh0aGlzLmN1cnJlbnRQYWdlKVxyXG4gICAgdGhpcy50aW1lciA9IHNldEludGVydmFsKFxyXG4gICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnJlbG9hZCgpO1xyXG4gICAgICB9LmJpbmQodGhpcyksXHJcbiAgICAgIHRoaXMucGVyaW9kICogNjAwMDBcclxuICAgICk7XHJcblxyXG4gIH0sXHJcbiAgYmVmb3JlRGVzdHJveTogZnVuY3Rpb24oKSB7XHJcbiAgICAvLyB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5nZXRXaW5kb3dXaWR0aCk7XHJcbiAgICB0aGlzLmNhbmNlbEF1dG9VcGRhdGUoKTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgICBjYW5jZWxBdXRvVXBkYXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcclxuICAgIH0sXHJcbiAgICBmZXRjaFNjb3JlYm9hcmREYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgdGhpcy4kc3RvcmUuZGlzcGF0Y2goJ0ZFVENIX0RBVEEnLCB0aGlzLnNsdWcpO1xyXG4gICAgICBjb25zb2xlLmxvZyh0aGlzLnNsdWcpO1xyXG4gICAgfSxcclxuICAgIHJlbG9hZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmICh0aGlzLmlzX2xpdmVfZ2FtZSA9PSB0cnVlKSB7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzRGV0YWlscyh0aGlzLmN1cnJlbnRQYWdlKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGl0ZW1Db3VudEluUm93OiBmdW5jdGlvbihpbmRleCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5zY29yZWJvYXJkX2RhdGEuc2xpY2UoXHJcbiAgICAgICAgKGluZGV4IC0gMSkgKiB0aGlzLml0ZW1zUGVyUm93LFxyXG4gICAgICAgIGluZGV4ICogdGhpcy5pdGVtc1BlclJvd1xyXG4gICAgICApO1xyXG4gICAgfSxcclxuICAgIHByb2Nlc3NEZXRhaWxzOiBmdW5jdGlvbihjdXJyZW50UGFnZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyh0aGlzLnJlc3VsdF9kYXRhKVxyXG4gICAgICBsZXQgcmVzdWx0ZGF0YSA9IHRoaXMucmVzdWx0X2RhdGE7XHJcbiAgICAgIGxldCBpbml0aWFsUmREYXRhID0gXy5pbml0aWFsKF8uY2xvbmUocmVzdWx0ZGF0YSkpO1xyXG4gICAgICBsZXQgcHJldmlvdXNSZERhdGEgPSBfLmxhc3QoaW5pdGlhbFJkRGF0YSk7XHJcbiAgICAgIGxldCBsYXN0UmREID0gXy5sYXN0KF8uY2xvbmUocmVzdWx0ZGF0YSkpO1xyXG4gICAgICBsZXQgbGFzdFJkRGF0YSA9IF8ubWFwKGxhc3RSZEQsIHBsYXllciA9PiB7XHJcbiAgICAgICAgbGV0IHggPSBwbGF5ZXIucG5vIC0gMTtcclxuICAgICAgICBwbGF5ZXIucGhvdG8gPSB0aGlzLnBsYXllcnNbeF0ucGhvdG87XHJcbiAgICAgICAgcGxheWVyLmdlbmRlciA9IHRoaXMucGxheWVyc1t4XS5nZW5kZXI7XHJcbiAgICAgICAgcGxheWVyLmNvdW50cnlfZnVsbCA9IHRoaXMucGxheWVyc1t4XS5jb3VudHJ5X2Z1bGw7XHJcbiAgICAgICAgcGxheWVyLmNvdW50cnkgPSB0aGlzLnBsYXllcnNbeF0uY291bnRyeTtcclxuICAgICAgICAvLyBpZiAoXHJcbiAgICAgICAgLy8gICBwbGF5ZXIucmVzdWx0ID09ICdkcmF3JyAmJlxyXG4gICAgICAgIC8vICAgcGxheWVyLnNjb3JlID09IDAgJiZcclxuICAgICAgICAvLyAgIHBsYXllci5vcHBvX3Njb3JlID09IDBcclxuICAgICAgICAvLyApIHtcclxuICAgICAgICAvLyAgIHBsYXllci5yZXN1bHQgPSAnQVInO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICBpZiAocHJldmlvdXNSZERhdGEpIHtcclxuICAgICAgICAgIGxldCBwbGF5ZXJEYXRhID0gXy5maW5kKHByZXZpb3VzUmREYXRhLCB7XHJcbiAgICAgICAgICAgIHBsYXllcjogcGxheWVyLnBsYXllcixcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgcGxheWVyLmxhc3Rwb3NpdGlvbiA9IHBsYXllckRhdGFbJ3Bvc2l0aW9uJ107XHJcbiAgICAgICAgICBwbGF5ZXIubGFzdHJhbmsgPSBwbGF5ZXJEYXRhWydyYW5rJ107XHJcbiAgICAgICAgICAvLyBwcmV2aW91cyByb3VuZHMgcmVzdWx0c1xyXG4gICAgICAgICAgcGxheWVyLnByZXZyZXN1bHRzID0gXy5jaGFpbihpbml0aWFsUmREYXRhKVxyXG4gICAgICAgICAgICAuZmxhdHRlbkRlZXAoKVxyXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKHYpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdi5wbGF5ZXIgPT09IHBsYXllci5wbGF5ZXI7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5tYXAoJ3Jlc3VsdCcpXHJcbiAgICAgICAgICAgIC52YWx1ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGxheWVyO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIHRoaXMudG90YWxfcm91bmRzID0gcmVzdWx0ZGF0YS5sZW5ndGg7XHJcbiAgICAgIHRoaXMuY3VycmVudFJvdW5kID0gbGFzdFJkRGF0YVswXS5yb3VuZDtcclxuICAgICAgbGV0IGNodW5rcyA9IF8uY2h1bmsobGFzdFJkRGF0YSwgdGhpcy50b3RhbF9wbGF5ZXJzKTtcclxuICAgICAgLy8gdGhpcy5yZWxvYWRpbmcgPSBmYWxzZVxyXG4gICAgICB0aGlzLnNjb3JlYm9hcmRfZGF0YSA9IGNodW5rc1tjdXJyZW50UGFnZSAtIDFdO1xyXG4gICAgfSxcclxuICB9LFxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICAuLi5WdWV4Lm1hcEdldHRlcnMoe1xyXG4gICAgICByZXN1bHRfZGF0YTogJ1JFU1VMVERBVEEnLFxyXG4gICAgICBwbGF5ZXJzOiAnUExBWUVSUycsXHJcbiAgICAgIHRvdGFsX3BsYXllcnM6ICdUT1RBTFBMQVlFUlMnLFxyXG4gICAgICB0b3RhbF9yb3VuZHM6ICdUT1RBTF9ST1VORFMnLFxyXG4gICAgICBsb2FkaW5nOiAnTE9BRElORycsXHJcbiAgICAgIGVycm9yOiAnRVJST1InLFxyXG4gICAgICBjYXRlZ29yeTogJ0NBVEVHT1JZJyxcclxuICAgIH0pLFxyXG4gICAgcm93Q291bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gTWF0aC5jZWlsKHRoaXMuc2NvcmVib2FyZF9kYXRhLmxlbmd0aCAvIHRoaXMuaXRlbXNQZXJSb3cpO1xyXG4gICAgfSxcclxuICAgIGVycm9yX21zZzogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiBgV2UgYXJlIGN1cnJlbnRseSBleHBlcmllbmNpbmcgbmV0d29yayBpc3N1ZXMgZmV0Y2hpbmcgdGhpcyBwYWdlICR7XHJcbiAgICAgICAgdGhpcy5wYWdldXJsXHJcbiAgICAgIH0gYDtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTY29yZWJvYXJkOyIsIiB2YXIgTG9XaW5zID0gVnVlLmNvbXBvbmVudCgnbG93aW5zJywge1xyXG4gIHRlbXBsYXRlOiBgPCEtLSBMb3cgV2lubmluZyBTY29yZXMgLS0+XHJcbiAgICA8Yi10YWJsZSByZXNwb25zaXZlIGhvdmVyIHN0cmlwZWQgZm9vdC1jbG9uZSA6aXRlbXM9XCJnZXRMb3dTY29yZSgnd2luJylcIiA6ZmllbGRzPVwibG93d2luc19maWVsZHNcIiBoZWFkLXZhcmlhbnQ9XCJkYXJrXCI+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgIDwvYi10YWJsZT5cclxuICAgIGAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdyZXN1bHRkYXRhJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBsb3d3aW5zX2ZpZWxkczogW10sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgYmVmb3JlTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5sb3d3aW5zX2ZpZWxkcyA9IFtcclxuICAgICAgeyBrZXk6ICdyb3VuZCcsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAnc2NvcmUnLCBsYWJlbDogJ1dpbm5pbmcgU2NvcmUnLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ3BsYXllcicsIGxhYmVsOiAnV2lubmVyJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdvcHBvX3Njb3JlJywgbGFiZWw6ICdMb3NpbmcgU2NvcmUnIH0sXHJcbiAgICAgIHsga2V5OiAnb3BwbycsIGxhYmVsOiAnTG9zZXInIH0sXHJcbiAgICBdO1xyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgZ2V0TG93U2NvcmU6IGZ1bmN0aW9uKHJlc3VsdCkge1xyXG4gICAgICB2YXIgZGF0YSA9IF8uY2xvbmUodGhpcy5yZXN1bHRkYXRhKTtcclxuICAgICAgcmV0dXJuIF8uY2hhaW4oZGF0YSlcclxuICAgICAgICAubWFwKGZ1bmN0aW9uKHIpIHtcclxuICAgICAgICAgIHJldHVybiBfLmNoYWluKHIpXHJcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24obSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBtO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gblsncmVzdWx0J10gPT09IHJlc3VsdDtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm1pbkJ5KGZ1bmN0aW9uKHcpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdy5zY29yZTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnZhbHVlKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuc29ydEJ5KCdzY29yZScpXHJcbiAgICAgICAgLnZhbHVlKCk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG5cclxuIHZhciBIaVdpbnMgPVZ1ZS5jb21wb25lbnQoJ2hpd2lucycsIHtcclxuICB0ZW1wbGF0ZTogYDwhLS0gSGlnaCBXaW5uaW5nIFNjb3JlcyAtLT5cclxuICAgIDxiLXRhYmxlICByZXNwb25zaXZlIGhvdmVyIHN0cmlwZWQgZm9vdC1jbG9uZSA6aXRlbXM9XCJnZXRIaVNjb3JlKCd3aW4nKVwiIDpmaWVsZHM9XCJoaWdod2luc19maWVsZHNcIiBoZWFkLXZhcmlhbnQ9XCJkYXJrXCI+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgIDwvYi10YWJsZT5gLFxyXG4gIHByb3BzOiBbJ2NhcHRpb24nLCAncmVzdWx0ZGF0YSddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgaGlnaHdpbnNfZmllbGRzOiBbXSxcclxuICAgIH07XHJcbiAgfSxcclxuICBiZWZvcmVNb3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmhpZ2h3aW5zX2ZpZWxkcyA9IFtcclxuICAgICAgeyBrZXk6ICdyb3VuZCcsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAnc2NvcmUnLCBsYWJlbDogJ1dpbm5pbmcgU2NvcmUnLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ3BsYXllcicsIGxhYmVsOiAnV2lubmVyJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdvcHBvX3Njb3JlJywgbGFiZWw6ICdMb3NpbmcgU2NvcmUnIH0sXHJcbiAgICAgIHsga2V5OiAnb3BwbycsIGxhYmVsOiAnTG9zZXInIH0sXHJcbiAgICBdO1xyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgZ2V0SGlTY29yZTogZnVuY3Rpb24ocmVzdWx0KSB7XHJcbiAgICAgIHZhciBkYXRhID0gXy5jbG9uZSh0aGlzLnJlc3VsdGRhdGEpO1xyXG4gICAgICByZXR1cm4gXy5jaGFpbihkYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24ocikge1xyXG4gICAgICAgICAgcmV0dXJuIF8uY2hhaW4ocilcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbihtKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG07XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgICAgIHJldHVybiBuWydyZXN1bHQnXSA9PT0gcmVzdWx0O1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAubWF4QnkoZnVuY3Rpb24odykge1xyXG4gICAgICAgICAgICAgIHJldHVybiB3LnNjb3JlO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudmFsdWUoKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5zb3J0QnkoJ3Njb3JlJylcclxuICAgICAgICAudmFsdWUoKVxyXG4gICAgICAgIC5yZXZlcnNlKCk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG5cclxuIHZhciBIaUxvc3MgPSBWdWUuY29tcG9uZW50KCdoaWxvc3MnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDwhLS0gSGlnaCBMb3NpbmcgU2NvcmVzIC0tPlxyXG4gICA8Yi10YWJsZSAgcmVzcG9uc2l2ZSBob3ZlciBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwiZ2V0SGlTY29yZSgnbG9zcycpXCIgOmZpZWxkcz1cImhpbG9zc19maWVsZHNcIiBoZWFkLXZhcmlhbnQ9XCJkYXJrXCI+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgIDwvYi10YWJsZT5cclxuYCxcclxuICBwcm9wczogWydjYXB0aW9uJywgJ3Jlc3VsdGRhdGEnXSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGhpbG9zc19maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZU1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuaGlsb3NzX2ZpZWxkcyA9IFtcclxuICAgICAgeyBrZXk6ICdyb3VuZCcsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAnc2NvcmUnLCBsYWJlbDogJ0xvc2luZyBTY29yZScsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdMb3NlcicsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAnb3Bwb19zY29yZScsIGxhYmVsOiAnV2lubmluZyBTY29yZScgfSxcclxuICAgICAgeyBrZXk6ICdvcHBvJywgbGFiZWw6ICdXaW5uZXInIH0sXHJcbiAgICBdO1xyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgZ2V0SGlTY29yZTogZnVuY3Rpb24ocmVzdWx0KSB7XHJcbiAgICAgIHZhciBkYXRhID0gXy5jbG9uZSh0aGlzLnJlc3VsdGRhdGEpO1xyXG4gICAgICByZXR1cm4gXy5jaGFpbihkYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24ocikge1xyXG4gICAgICAgICAgcmV0dXJuIF8uY2hhaW4ocilcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbihtKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG07XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgICAgIHJldHVybiBuWydyZXN1bHQnXSA9PT0gcmVzdWx0O1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAubWF4KGZ1bmN0aW9uKHcpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdy5zY29yZTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnZhbHVlKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuc29ydEJ5KCdzY29yZScpXHJcbiAgICAgICAgLnZhbHVlKClcclxuICAgICAgICAucmV2ZXJzZSgpO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbiB2YXIgQ29tYm9TY29yZXMgPSBWdWUuY29tcG9uZW50KCdjb21ib3Njb3JlcycsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gIDxiLXRhYmxlICByZXNwb25zaXZlIGhvdmVyIHN0cmlwZWQgZm9vdC1jbG9uZSA6aXRlbXM9XCJoaWNvbWJvKClcIiA6ZmllbGRzPVwiaGljb21ib19maWVsZHNcIiBoZWFkLXZhcmlhbnQ9XCJkYXJrXCI+XHJcbiAgICA8dGVtcGxhdGUgc2xvdD1cInRhYmxlLWNhcHRpb25cIj5cclxuICAgICAgICB7e2NhcHRpb259fVxyXG4gICAgPC90ZW1wbGF0ZT5cclxuICA8L2ItdGFibGU+XHJcbmAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdyZXN1bHRkYXRhJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBoaWNvbWJvX2ZpZWxkczogW10sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgYmVmb3JlTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5oaWNvbWJvX2ZpZWxkcyA9IFtcclxuICAgICAgeyBrZXk6ICdyb3VuZCcsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdjb21ib19zY29yZScsXHJcbiAgICAgICAgbGFiZWw6ICdDb21iaW5lZCBTY29yZScsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdzY29yZScsXHJcbiAgICAgICAgbGFiZWw6ICdXaW5uaW5nIFNjb3JlJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ29wcG9fc2NvcmUnLFxyXG4gICAgICAgIGxhYmVsOiAnTG9zaW5nIFNjb3JlJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgICAgeyBrZXk6ICdwbGF5ZXInLCBsYWJlbDogJ1dpbm5lcicsIGNsYXNzOiAndGV4dC1jZW50ZXInIH0sXHJcbiAgICAgIHsga2V5OiAnb3BwbycsIGxhYmVsOiAnTG9zZXInLCBjbGFzczogJ3RleHQtY2VudGVyJyB9LFxyXG4gICAgXTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGhpY29tYm8oKSB7XHJcbiAgICAgIGxldCBkYXRhID0gXy5jbG9uZSh0aGlzLnJlc3VsdGRhdGEpO1xyXG4gICAgICByZXR1cm4gXy5jaGFpbihkYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24ocikge1xyXG4gICAgICAgICAgcmV0dXJuIF8uY2hhaW4ocilcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbihtKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG07XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgICAgIHJldHVybiBuWydyZXN1bHQnXSA9PT0gJ3dpbic7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5tYXhCeShmdW5jdGlvbih3KSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHcuY29tYm9fc2NvcmU7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC52YWx1ZSgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnNvcnRCeSgnY29tYm9fc2NvcmUnKVxyXG4gICAgICAgIC52YWx1ZSgpXHJcbiAgICAgICAgLnJldmVyc2UoKTtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG4gdmFyIFRvdGFsU2NvcmVzID0gVnVlLmNvbXBvbmVudCgndG90YWxzY29yZXMnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxiLXRhYmxlICAgcmVzcG9uc2l2ZSBob3ZlciBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwic3RhdHNcIiA6ZmllbGRzPVwidG90YWxzY29yZV9maWVsZHNcIiBoZWFkLXZhcmlhbnQ9XCJkYXJrXCI+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cImluZGV4XCIgc2xvdC1zY29wZT1cImRhdGFcIj5cclxuICAgICAgICAgICAge3tkYXRhLmluZGV4ICsgMX19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgIDwvYi10YWJsZT5cclxuYCxcclxuICBwcm9wczogWydjYXB0aW9uJywgJ3N0YXRzJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0b3RhbHNjb3JlX2ZpZWxkczogW10sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgYmVmb3JlTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy50b3RhbHNjb3JlX2ZpZWxkcyA9IFtcclxuICAgICAgJ2luZGV4JyxcclxuICAgICAgeyBrZXk6ICdwb3NpdGlvbicsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICd0b3RhbF9zY29yZScsXHJcbiAgICAgICAgbGFiZWw6ICdUb3RhbCBTY29yZScsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdQbGF5ZXInLCBjbGFzczogJ3RleHQtY2VudGVyJyB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnd29uTG9zdCcsXHJcbiAgICAgICAgbGFiZWw6ICdXb24tTG9zdCcsXHJcbiAgICAgICAgc29ydGFibGU6IGZhbHNlLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIGZvcm1hdHRlcjogKHZhbHVlLCBrZXksIGl0ZW0pID0+IHtcclxuICAgICAgICAgIGxldCBsb3NzID0gaXRlbS5yb3VuZCAtIGl0ZW0ucG9pbnRzO1xyXG4gICAgICAgICAgcmV0dXJuIGAke2l0ZW0ucG9pbnRzfSAtICR7bG9zc31gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdtYXJnaW4nLFxyXG4gICAgICAgIGxhYmVsOiAnU3ByZWFkJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBmb3JtYXR0ZXI6IHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICh2YWx1ZSA+IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGArJHt2YWx1ZX1gO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGAke3ZhbHVlfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIF07XHJcbiAgfSxcclxufSk7XHJcblxyXG4gdmFyIFRvdGFsT3BwU2NvcmVzID1WdWUuY29tcG9uZW50KCdvcHBzY29yZXMnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxiLXRhYmxlICAgcmVzcG9uc2l2ZSBob3ZlciBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwic3RhdHNcIiA6ZmllbGRzPVwidG90YWxvcHBzY29yZV9maWVsZHNcIiBoZWFkLXZhcmlhbnQ9XCJkYXJrXCI+XHJcbiAgICAgICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwidGFibGUtY2FwdGlvblwiPlxyXG4gICAgICAgICAgICAgICAge3tjYXB0aW9ufX1cclxuICAgICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJpbmRleFwiIHNsb3Qtc2NvcGU9XCJkYXRhXCI+XHJcbiAgICAgICAgICAgICAgICB7e2RhdGEuaW5kZXggKyAxfX1cclxuICAgICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgIDwvYi10YWJsZT5cclxuYCxcclxuICBwcm9wczogWydjYXB0aW9uJywgJ3N0YXRzJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0b3RhbG9wcHNjb3JlX2ZpZWxkczogW10sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgYmVmb3JlTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy50b3RhbG9wcHNjb3JlX2ZpZWxkcyA9IFtcclxuICAgICAgJ2luZGV4JyxcclxuICAgICAgeyBrZXk6ICdwb3NpdGlvbicsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICd0b3RhbF9vcHBzY29yZScsXHJcbiAgICAgICAgbGFiZWw6ICdUb3RhbCBPcHBvbmVudCBTY29yZScsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdQbGF5ZXInLCBjbGFzczogJ3RleHQtY2VudGVyJyB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnd29uTG9zdCcsXHJcbiAgICAgICAgbGFiZWw6ICdXb24tTG9zdCcsXHJcbiAgICAgICAgc29ydGFibGU6IGZhbHNlLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIGZvcm1hdHRlcjogKHZhbHVlLCBrZXksIGl0ZW0pID0+IHtcclxuICAgICAgICAgIGxldCBsb3NzID0gaXRlbS5yb3VuZCAtIGl0ZW0ucG9pbnRzO1xyXG4gICAgICAgICAgcmV0dXJuIGAke2l0ZW0ucG9pbnRzfSAtICR7bG9zc31gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdtYXJnaW4nLFxyXG4gICAgICAgIGxhYmVsOiAnU3ByZWFkJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBmb3JtYXR0ZXI6IHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICh2YWx1ZSA+IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGArJHt2YWx1ZX1gO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGAke3ZhbHVlfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIF07XHJcbiAgfSxcclxufSk7XHJcblxyXG4gdmFyIEF2ZVNjb3JlcyA9IFZ1ZS5jb21wb25lbnQoJ2F2ZXNjb3JlcycsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPGItdGFibGUgIHJlc3BvbnNpdmUgaG92ZXIgc3RyaXBlZCBmb290LWNsb25lIDppdGVtcz1cInN0YXRzXCIgOmZpZWxkcz1cImF2ZXNjb3JlX2ZpZWxkc1wiIGhlYWQtdmFyaWFudD1cImRhcmtcIj5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cInRhYmxlLWNhcHRpb25cIj5cclxuICAgICAgICAgICAge3tjYXB0aW9ufX1cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwiaW5kZXhcIiBzbG90LXNjb3BlPVwiZGF0YVwiPlxyXG4gICAgICAgICAgICB7e2RhdGEuaW5kZXggKyAxfX1cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgPC9iLXRhYmxlPlxyXG5gLFxyXG4gIHByb3BzOiBbJ2NhcHRpb24nLCAnc3RhdHMnXSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGF2ZXNjb3JlX2ZpZWxkczogW10sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgYmVmb3JlTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5hdmVzY29yZV9maWVsZHMgPSBbXHJcbiAgICAgICdpbmRleCcsXHJcbiAgICAgIHsga2V5OiAncG9zaXRpb24nLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnYXZlX3Njb3JlJyxcclxuICAgICAgICBsYWJlbDogJ0F2ZXJhZ2UgU2NvcmUnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgICB7IGtleTogJ3BsYXllcicsIGxhYmVsOiAnUGxheWVyJywgY2xhc3M6ICd0ZXh0LWNlbnRlcicgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ3dvbkxvc3QnLFxyXG4gICAgICAgIGxhYmVsOiAnV29uLUxvc3QnLFxyXG4gICAgICAgIHNvcnRhYmxlOiBmYWxzZSxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwga2V5LCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICBsZXQgbG9zcyA9IGl0ZW0ucm91bmQgLSBpdGVtLnBvaW50cztcclxuICAgICAgICAgIHJldHVybiBgJHtpdGVtLnBvaW50c30gLSAke2xvc3N9YDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnbWFyZ2luJyxcclxuICAgICAgICBsYWJlbDogJ1NwcmVhZCcsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgZm9ybWF0dGVyOiB2YWx1ZSA9PiB7XHJcbiAgICAgICAgICBpZiAodmFsdWUgPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgKyR7dmFsdWV9YDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBgJHt2YWx1ZX1gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG4gIH0sXHJcbn0pO1xyXG4gdmFyIEF2ZU9wcFNjb3JlcyA9IFZ1ZS5jb21wb25lbnQoJ2F2ZW9wcHNjb3JlcycsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPGItdGFibGUgIGhvdmVyIHJlc3BvbnNpdmUgc3RyaXBlZCBmb290LWNsb25lIDppdGVtcz1cInN0YXRzXCIgOmZpZWxkcz1cImF2ZW9wcHNjb3JlX2ZpZWxkc1wiIGhlYWQtdmFyaWFudD1cImRhcmtcIj5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cInRhYmxlLWNhcHRpb25cIj5cclxuICAgICAgICAgICAge3tjYXB0aW9ufX1cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwiaW5kZXhcIiBzbG90LXNjb3BlPVwiZGF0YVwiPlxyXG4gICAgICAgICAgICB7e2RhdGEuaW5kZXggKyAxfX1cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgPC9iLXRhYmxlPlxyXG5gLFxyXG4gIHByb3BzOiBbJ2NhcHRpb24nLCAnc3RhdHMnXSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGF2ZW9wcHNjb3JlX2ZpZWxkczogW10sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgYmVmb3JlTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5hdmVvcHBzY29yZV9maWVsZHMgPSBbXHJcbiAgICAgICdpbmRleCcsXHJcbiAgICAgIHsga2V5OiAncG9zaXRpb24nLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnYXZlX29wcF9zY29yZScsXHJcbiAgICAgICAgbGFiZWw6ICdBdmVyYWdlIE9wcG9uZW50IFNjb3JlJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgICAgeyBrZXk6ICdwbGF5ZXInLCBsYWJlbDogJ1BsYXllcicsIGNsYXNzOiAndGV4dC1jZW50ZXInIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICd3b25Mb3N0JyxcclxuICAgICAgICBsYWJlbDogJ1dvbi1Mb3N0JyxcclxuICAgICAgICBzb3J0YWJsZTogZmFsc2UsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIGtleSwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgbGV0IGxvc3MgPSBpdGVtLnJvdW5kIC0gaXRlbS5wb2ludHM7XHJcbiAgICAgICAgICByZXR1cm4gYCR7aXRlbS5wb2ludHN9IC0gJHtsb3NzfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ21hcmdpbicsXHJcbiAgICAgICAgbGFiZWw6ICdTcHJlYWQnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIGZvcm1hdHRlcjogdmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKHZhbHVlID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYCske3ZhbHVlfWA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gYCR7dmFsdWV9YDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICB9LFxyXG59KTtcclxuXHJcbiB2YXIgTG9TcHJlYWQgPSBWdWUuY29tcG9uZW50KCdsb3NwcmVhZCcsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPGItdGFibGUgIHJlc3BvbnNpdmUgaG92ZXIgc3RyaXBlZCBmb290LWNsb25lIDppdGVtcz1cImxvU3ByZWFkKClcIiA6ZmllbGRzPVwibG9zcHJlYWRfZmllbGRzXCIgaGVhZC12YXJpYW50PVwiZGFya1wiPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwidGFibGUtY2FwdGlvblwiPlxyXG4gICAgICAgICAgICB7e2NhcHRpb259fVxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8L2ItdGFibGU+XHJcbmAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdyZXN1bHRkYXRhJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBsb3NwcmVhZF9maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZU1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMubG9zcHJlYWRfZmllbGRzID0gW1xyXG4gICAgICAncm91bmQnLFxyXG4gICAgICB7IGtleTogJ2RpZmYnLCBsYWJlbDogJ1NwcmVhZCcsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAnc2NvcmUnLCBsYWJlbDogJ1dpbm5pbmcgU2NvcmUnLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ29wcG9fc2NvcmUnLCBsYWJlbDogJ0xvc2luZyBTY29yZScsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdXaW5uZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ29wcG8nLCBsYWJlbDogJ0xvc2VyJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgIF07XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBsb1NwcmVhZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGxldCBkYXRhID0gXy5jbG9uZSh0aGlzLnJlc3VsdGRhdGEpO1xyXG4gICAgICByZXR1cm4gXy5jaGFpbihkYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24ocikge1xyXG4gICAgICAgICAgcmV0dXJuIF8uY2hhaW4ocilcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbihtKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG07XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgICAgIHJldHVybiBuWydyZXN1bHQnXSA9PT0gJ3dpbic7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5taW5CeShmdW5jdGlvbih3KSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHcuZGlmZjtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnZhbHVlKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuc29ydEJ5KCdkaWZmJylcclxuICAgICAgICAudmFsdWUoKTtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG4gY29uc3QgSGlTcHJlYWQgPSAgIFZ1ZS5jb21wb25lbnQoJ2hpc3ByZWFkJyx7XHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxiLXRhYmxlICByZXNwb25zaXZlIGhvdmVyIHN0cmlwZWQgZm9vdC1jbG9uZSA6aXRlbXM9XCJoaVNwcmVhZCgpXCIgOmZpZWxkcz1cImhpc3ByZWFkX2ZpZWxkc1wiIGhlYWQtdmFyaWFudD1cImRhcmtcIj5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cInRhYmxlLWNhcHRpb25cIj5cclxuICAgICAgICAgICAge3tjYXB0aW9ufX1cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgPC9iLXRhYmxlPlxyXG4gICAgYCxcclxuICBwcm9wczogWydjYXB0aW9uJywgJ3Jlc3VsdGRhdGEnXSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGhpc3ByZWFkX2ZpZWxkczogW10sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgYmVmb3JlTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5oaXNwcmVhZF9maWVsZHMgPSBbXHJcbiAgICAgICdyb3VuZCcsXHJcbiAgICAgIHsga2V5OiAnZGlmZicsIGxhYmVsOiAnU3ByZWFkJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdzY29yZScsIGxhYmVsOiAnV2lubmluZyBTY29yZScsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAnb3Bwb19zY29yZScsIGxhYmVsOiAnTG9zaW5nIFNjb3JlJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdwbGF5ZXInLCBsYWJlbDogJ1dpbm5lcicsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAnb3BwbycsIGxhYmVsOiAnTG9zZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgXTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGhpU3ByZWFkOiBmdW5jdGlvbigpIHtcclxuICAgICAgbGV0IGRhdGEgPSBfLmNsb25lKHRoaXMucmVzdWx0ZGF0YSk7XHJcbiAgICAgIHJldHVybiBfLmNoYWluKGRhdGEpXHJcbiAgICAgICAgLm1hcChmdW5jdGlvbihyKSB7XHJcbiAgICAgICAgICByZXR1cm4gXy5jaGFpbihyKVxyXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uKG0pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gbTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbihuKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG5bJ3Jlc3VsdCddID09PSAnd2luJztcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm1heChmdW5jdGlvbih3KSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHcuZGlmZjtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnZhbHVlKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuc29ydEJ5KCdkaWZmJylcclxuICAgICAgICAudmFsdWUoKVxyXG4gICAgICAgIC5yZXZlcnNlKCk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG5leHBvcnQge0hpV2lucywgTG9XaW5zLEhpTG9zcyxDb21ib1Njb3JlcyxUb3RhbFNjb3JlcyxUb3RhbE9wcFNjb3JlcyxBdmVTY29yZXMsQXZlT3BwU2NvcmVzLEhpU3ByZWFkLCBMb1NwcmVhZH0iLCJsZXQgbWFwR2V0dGVycyA9IFZ1ZXgubWFwR2V0dGVycztcclxubGV0IHRvcFBlcmZvcm1lcnMgPSBWdWUuY29tcG9uZW50KCd0b3Atc3RhdHMnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICA8ZGl2IGNsYXNzPVwiY29sLWxnLTEwIG9mZnNldC1sZy0xIGp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cImNvbC1sZy0yIGNvbC1zbS00IGNvbC0xMlwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJtdC01IGQtZmxleCBmbGV4LWNvbHVtbiBhbGlnbi1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXIganVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICAgICAgPGItYnV0dG9uIHZhcmlhbnQ9XCJidG4tb3V0bGluZS1zdWNjZXNzXCIgdGl0bGU9XCJUb3AgM1wiIGNsYXNzPVwibS0yIGJ0bi1ibG9ja1wiIEBjbGljaz1cInNob3dQaWMoJ3RvcDMnKVwiIDpwcmVzc2VkPVwiY3VycmVudFZpZXc9PSd0b3AzJ1wiPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS10cm9waHkgbS0xXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlRvcCAzPC9iLWJ1dHRvbj5cclxuICAgICAgICAgIDxiLWJ1dHRvbiB2YXJpYW50PVwiYnRuLW91dGxpbmUtc3VjY2Vzc1wiIHRpdGxlPVwiSGlnaGVzdCBHYW1lIFNjb3Jlc1wiIGNsYXNzPVwibS0yIGJ0bi1ibG9ja1wiIEBjbGljaz1cInNob3dQaWMoJ2hpZ2FtZXMnKVwiIDpwcmVzc2VkPVwiY3VycmVudFZpZXc9PSdoaWdhbWVzJ1wiPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1idWxsc2V5ZSBtLTFcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+SGlnaCBHYW1lczwvYi1idXR0b24+XHJcbiAgICAgICAgICA8Yi1idXR0b24gdmFyaWFudD1cImJ0bi1vdXRsaW5lLXN1Y2Nlc3NcIiB0aXRsZT1cIkhpZ2hlc3QgQXZlcmFnZSBTY29yZXNcIiBjbGFzcz1cIm0tMiBidG4tYmxvY2tcIiA6cHJlc3NlZD1cImN1cnJlbnRWaWV3PT0naGlhdmVzJ1wiXHJcbiAgICAgICAgICAgIEBjbGljaz1cInNob3dQaWMoJ2hpYXZlcycpXCI+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLXRodW1icy11cCBtLTFcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+SGlnaCBBdmUuIFNjb3JlczwvYi1idXR0b24+XHJcbiAgICAgICAgICA8Yi1idXR0b24gdmFyaWFudD1cImJ0bi1vdXRsaW5lLXN1Y2Nlc3NcIiB0aXRsZT1cIkxvd2VzdCBBdmVyYWdlIE9wcG9uZW50IFNjb3Jlc1wiIGNsYXNzPVwibS0yIGJ0bi1ibG9ja1wiIEBjbGljaz1cInNob3dQaWMoJ2xvb3BwYXZlcycpXCIgOnByZXNzZWQ9XCJjdXJyZW50Vmlldz09J2xvb3BwYXZlcydcIj5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtYmVlciBtci0xXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPkxvdyBPcHAgQXZlPC9iLWJ1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbGctMTAgY29sLXNtLTggY29sLTEyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMiBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWNvbnRlbnQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxoMz57e3RpdGxlfX08L2gzPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS00IGNvbC0xMiBhbmltYXRlZCBmYWRlSW5SaWdodEJpZ1wiIHYtZm9yPVwiKGl0ZW0sIGluZGV4KSBpbiBzdGF0c1wiPlxyXG4gICAgICAgICAgICA8aDQgY2xhc3M9XCJwLTIgdGV4dC1jZW50ZXIgYmViYXMgYmctZGFyayB0ZXh0LXdoaXRlXCI+e3tpdGVtLnBsYXllcn19PC9oND5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBmbGV4LWNvbHVtbiBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgIDxpbWcgOnNyYz1cInBsYXllcnNbaXRlbS5wbm8tMV0ucGhvdG9cIiB3aWR0aD0nMTIwJyBoZWlnaHQ9JzEyMCcgY2xhc3M9XCJpbWctZmx1aWQgcm91bmRlZC1jaXJjbGVcIlxyXG4gICAgICAgICAgICAgICAgOmFsdD1cInBsYXllcnNbaXRlbS5wbm8tMV0ucG9zdF90aXRsZXxsb3dlcmNhc2VcIj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImQtYmxvY2sgbWwtNVwiPlxyXG4gICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJteC0xIGZsYWctaWNvblwiIDpjbGFzcz1cIidmbGFnLWljb24tJytwbGF5ZXJzW2l0ZW0ucG5vLTFdLmNvdW50cnkgfCBsb3dlcmNhc2VcIlxyXG4gICAgICAgICAgICAgICAgICA6dGl0bGU9XCJwbGF5ZXJzW2l0ZW0ucG5vLTFdLmNvdW50cnlfZnVsbFwiPjwvaT5cclxuICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwibXgtMSBmYVwiXHJcbiAgICAgICAgICAgICAgICAgIDpjbGFzcz1cInsnZmEtbWFsZSc6IHBsYXllcnNbaXRlbS5wbm8tMV0uZ2VuZGVyID09ICdtJywgJ2ZhLWZlbWFsZSc6IHBsYXllcnNbaXRlbS5wbm8tMV0uZ2VuZGVyID09ICdmJ31cIlxyXG4gICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIj5cclxuICAgICAgICAgICAgICAgIDwvaT5cclxuICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGZsZXgtcm93IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24tY29udGVudC1jZW50ZXIgYmctZGFyayB0ZXh0LXdoaXRlXCI+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJteC0xIGRpc3BsYXktNSBkLWlubGluZS1ibG9jayBhbGlnbi1zZWxmLWNlbnRlclwiIHYtaWY9XCJpdGVtLnBvaW50c1wiPnt7aXRlbS5wb2ludHN9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm14LTEgZGlzcGxheS01IGQtaW5saW5lLWJsb2NrIGFsaWduLXNlbGYtY2VudGVyXCIgdi1pZj1cIml0ZW0ubWFyZ2luXCI+e3tpdGVtLm1hcmdpbnxhZGRwbHVzfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJteC0xIHRleHQtY2VudGVyIGRpc3BsYXktNSBkLWlubGluZS1ibG9jayBhbGlnbi1zZWxmLWNlbnRlclwiIHYtaWY9XCJpdGVtLnNjb3JlXCI+Um91bmQge3tpdGVtLnJvdW5kfX0gdnMge3tpdGVtLm9wcG99fTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXgganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXIgYmctc3VjY2VzcyB0ZXh0LXdoaXRlXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiB2LWlmPVwiaXRlbS5zY29yZVwiIGNsYXNzPVwiZGlzcGxheS00IHlhbm9uZSBkLWlubGluZS1mbGV4XCI+e3tpdGVtLnNjb3JlfX08L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IHYtaWY9XCJpdGVtLnBvc2l0aW9uXCIgY2xhc3M9XCJkaXNwbGF5LTQgeWFub25lIGQtaW5saW5lLWZsZXhcIj57e2l0ZW0ucG9zaXRpb259fTwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgdi1pZj1cIml0ZW0uYXZlX3Njb3JlXCIgY2xhc3M9XCJkaXNwbGF5LTQgeWFub25lIGQtaW5saW5lLWZsZXhcIj57e2l0ZW0uYXZlX3Njb3JlfX08L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IHYtaWY9XCJpdGVtLmF2ZV9vcHBfc2NvcmVcIiBjbGFzcz1cImRpc3BsYXktNCB5YW5vbmUgZC1pbmxpbmUtZmxleFwiPnt7aXRlbS5hdmVfb3BwX3Njb3JlfX08L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuICBgLFxyXG4gIGRhdGE6IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHRpdGxlOiAnJyxcclxuICAgICAgcHJvZmlsZXMgOiBbXSxcclxuICAgICAgc3RhdHM6IFtdLFxyXG4gICAgICBjdXJyZW50VmlldzogJydcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBjcmVhdGVkOiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuc2hvd1BpYygndG9wMycpO1xyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgc2hvd1BpYzogZnVuY3Rpb24gKHQpIHtcclxuICAgICAgdGhpcy5jdXJyZW50VmlldyA9IHRcclxuICAgICAgbGV0IHN0YXRzID0gW107XHJcbiAgICAgIGlmICh0ID09ICdoaWF2ZXMnKSB7XHJcbiAgICAgICAgYXJyID0gdGhpcy5nZXRTdGF0cygnYXZlX3Njb3JlJyk7XHJcbiAgICAgICAgciA9IF8udGFrZShhcnIsIDMpLm1hcChmdW5jdGlvbiAocCkge1xyXG4gICAgICAgICAgcmV0dXJuIF8ucGljayhwLCBbJ3BsYXllcicsICdwbm8nLCAnYXZlX3Njb3JlJ10pXHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLnRpdGxlID0gJ0hpZ2hlc3QgQXZlcmFnZSBTY29yZXMnXHJcbiAgICAgIH1cclxuICAgICAgaWYgKHQgPT0gJ2xvb3BwYXZlcycpIHtcclxuICAgICAgICBhcnIgPSB0aGlzLmdldFN0YXRzKCdhdmVfb3BwX3Njb3JlJyk7XHJcbiAgICAgICAgciA9IF8udGFrZVJpZ2h0KGFyciwgMykucmV2ZXJzZSgpLm1hcChmdW5jdGlvbiAocCkge1xyXG4gICAgICAgICAgcmV0dXJuIF8ucGljayhwLCBbJ3BsYXllcicsICdwbm8nLCAnYXZlX29wcF9zY29yZSddKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy50aXRsZT0nTG93ZXN0IE9wcG9uZW50IEF2ZXJhZ2UgU2NvcmVzJ1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0ID09ICdoaWdhbWVzJykge1xyXG4gICAgICAgIGFyciA9IHRoaXMuY29tcHV0ZVN0YXRzKCk7XHJcbiAgICAgICAgciA9IF8udGFrZShhcnIsIDMpLm1hcChmdW5jdGlvbiAocCkge1xyXG4gICAgICAgICAgcmV0dXJuIF8ucGljayhwLCBbJ3BsYXllcicsICdwbm8nLCAnc2NvcmUnLCdyb3VuZCcsJ29wcG8nXSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMudGl0bGU9J0hpZ2ggR2FtZSBTY29yZXMnXHJcbiAgICAgIH1cclxuICAgICAgaWYgKHQgPT0gJ3RvcDMnKSB7XHJcbiAgICAgICAgYXJyID0gdGhpcy5nZXRTdGF0cygncG9pbnRzJyk7XHJcbiAgICAgICAgcyA9IF8uc29ydEJ5KGFycixbJ3BvaW50cycsJ21hcmdpbiddKS5yZXZlcnNlKClcclxuICAgICAgICByID0gXy50YWtlKHMsIDMpLm1hcChmdW5jdGlvbiAocCkge1xyXG4gICAgICAgICAgcmV0dXJuIF8ucGljayhwLCBbJ3BsYXllcicsICdwbm8nLCAncG9pbnRzJywnbWFyZ2luJywncG9zaXRpb24nXSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMudGl0bGU9J1RvcCAzJ1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnN0YXRzID0gcjtcclxuICAgICAgLy8gdGhpcy5wcm9maWxlcyA9IHRoaXMucGxheWVyc1tyLnBuby0xXTtcclxuXHJcbiAgICB9LFxyXG4gICAgZ2V0U3RhdHM6IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgcmV0dXJuIF8uc29ydEJ5KHRoaXMuZmluYWxzdGF0cywga2V5KS5yZXZlcnNlKCk7XHJcbiAgICB9LFxyXG4gICAgY29tcHV0ZVN0YXRzOiBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIGRhdGEgPSBfLmNsb25lKHRoaXMucmVzdWx0ZGF0YSk7XHJcbiAgICAgIHJldHVybiBfLmNoYWluKGRhdGEpXHJcbiAgICAgICAgLm1hcChmdW5jdGlvbihyKSB7XHJcbiAgICAgICAgICByZXR1cm4gXy5jaGFpbihyKVxyXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uKG0pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gbTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbihuKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG5bJ3Jlc3VsdCddID09PSAnd2luJztcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm1heEJ5KGZ1bmN0aW9uKHcpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdy5zY29yZTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnZhbHVlKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuc29ydEJ5KCdzY29yZScpXHJcbiAgICAgICAgLnZhbHVlKClcclxuICAgICAgICAucmV2ZXJzZSgpO1xyXG4gICAgfSxcclxuICB9LFxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICAuLi5tYXBHZXR0ZXJzKHtcclxuICAgICAgcGxheWVyczogJ1BMQVlFUlMnLFxyXG4gICAgICB0b3RhbF9yb3VuZHM6ICdUT1RBTF9ST1VORFMnLFxyXG4gICAgICBmaW5hbHN0YXRzOiAnRklOQUxfUk9VTkRfU1RBVFMnLFxyXG4gICAgICByZXN1bHRkYXRhOiAnUkVTVUxUREFUQScsXHJcbiAgICAgIG9uZ29pbmc6ICdPTkdPSU5HX1RPVVJORVknLFxyXG4gICAgfSksXHJcbiAgfSxcclxufSk7XHJcbmV4cG9ydCBkZWZhdWx0IHRvcFBlcmZvcm1lcnM7Il19
