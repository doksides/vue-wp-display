'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var CateDetail = Vue.component('cate', {
  template: '\n    <div class="container-fluid">\n    <div v-if="resultdata" class="row">\n        <div class="col-sm-10 offset-sm-1">\n            <b-breadcrumb :items="breadcrumbs" />\n        </div>\n    </div>\n    <div v-if="loading||error" class="row">\n        <div v-if="loading" class="col">\n            <loading></loading>\n        </div>\n        <div v-if="error" class="col">\n          <error>\n          <p slot="error">{{error}}</p>\n          <p slot="error_msg">{{error_msg}}</p>\n          </error>\n        </div>\n    </div>\n    <template v-if="!(error||loading)">\n        <div class="row justify-content-sm-center align-items-center">\n            <div class="col-2 col-xs-1">\n              <div class="d-flex">\n              <b-img class="thumbnail logo" :src="logo" :alt="event_title" />\n              </div>\n            </div>\n            <div class="col-8 col-sm-auto col-xs-auto">\n                <h2 class="text-center bebas">{{ event_title }}\n                    <em v-show="total_rounds" class="mx-auto">{{ total_rounds }} rounds\n                    </em>\n                </h2>\n                <div class="text-center">\n                <b-button @click="viewIndex=0" variant="link" class="text-decoration-none" :disabled="viewIndex==0" :pressed="viewIndex==0"><i class="fa fa-users" aria-hidden="true"></i> Players</b-button>\n                <b-button @click="viewIndex=1" variant="link" class="text-decoration-none" :disabled="viewIndex==1" :pressed="viewIndex==1"> <i class="fa fa-user-plus"></i> Pairings</b-button>\n                <b-button @click="viewIndex=2" variant="link" class="text-decoration-none" :disabled="viewIndex==2" :pressed="viewIndex==2"><i class="fas fa-sticky-note" aria-hidden="true"></i> Results</b-button>\n                <b-button @click="viewIndex=3" variant="link" class="text-decoration-none" :disabled="viewIndex==3" :pressed="viewIndex==3"><i class="fas fa-sort-numeric-down    "></i> Standings</b-button>\n                <b-button @click="viewIndex=4" variant="link" class="text-decoration-none" :disabled="viewIndex==4" :pressed="viewIndex==4"><i class="fas fa-chart-bar"></i> Statistics</b-button>\n                <!---\n                <b-button  @click="viewIndex=5" :to="{ name: \'Scoreboard\', params: { event_slug: slug}}"  variant="link" class="text-decoration-none" active-class="currentView" :disabled="viewIndex==5" :pressed="viewIndex==5"><i class="fas fa-chalkboard-teacher"></i>\n                Scoreboard</b-button>\n                -->\n                <b-button  @click="viewIndex=5" variant="link" class="text-decoration-none" active-class="currentView" :disabled="viewIndex==5" :pressed="viewIndex==5"><i class="fas fa-chalkboard-teacher"></i>\n                Scoreboard</b-button>\n                </div>\n            </div>\n            <div class="col-2 col-sm-2 col-xs-3">\n                    <!-- Ad here -->\n            </div>\n        </div>\n        <div class="row justify-content-center align-items-center">\n            <div class="col-sm-10 offset-sm-1">\n              <h3 class="text-center bebas p-0 m-0"> {{tab_heading}}\n              <span v-if="viewIndex >0 && viewIndex < 4">\n              {{ currentRound }}\n              </span>\n              </h3>\n              <template class="text-center" v-if="showPagination">\n                  <b-pagination align="center" :total-rows="total_rounds" v-model="currentRound" :per-page="1"\n                      :hide-ellipsis="true" aria-label="Navigation" change="roundChange">\n                  </b-pagination>\n              </template>\n            </div>\n        </div>\n        <template v-if="viewIndex==0">\n          <allplayers></allplayers>\n        </template>\n        <template v-else-if="viewIndex==5">\n        <scoreboard></scoreboard>\n        </template>\n        <div v-else-if="viewIndex==4" class="row justify-content-center align-items-center">\n            <div class="col-8 offset-1 col-sm-auto col-md-8 offset-md-1">\n                <b-tabs content-class="mt-3 statsTabs" pills small lazy no-fade  v-model="tabIndex">\n                    <b-tab title="High Wins" lazy>\n                        <hiwins  :resultdata="resultdata" :caption="caption">\n                        </hiwins>\n                    </b-tab>\n                    <b-tab title="High Losses" lazy>\n                        <hiloss :resultdata="resultdata" :caption="caption">\n                        </hiloss>\n                    </b-tab>\n                    <b-tab title="Low Wins" lazy>\n                        <lowins  :resultdata="resultdata" :caption="caption">\n                        </lowins>\n                    </b-tab>\n                    <b-tab title="Combined Scores">\n                        <comboscores :resultdata="resultdata" :caption="caption">\n                        </comboscores>\n                    </b-tab>\n                    <b-tab title="Total Scores">\n                        <totalscores :caption="caption" :stats="fetchStats(\'total_score\')"></totalscores>\n                    </b-tab>\n                    <b-tab title="Total Opp Scores">\n                        <oppscores :caption="caption" :stats="fetchStats(\'total_oppscore\')"></oppscores>\n                    </b-tab>\n                    <b-tab title="Ave Scores">\n                        <avescores :caption="caption" :stats="fetchStats(\'ave_score\')"></avescores>\n                    </b-tab>\n                    <b-tab title="Ave Opp Scores">\n                        <aveoppscores :caption="caption" :stats="fetchStats(\'ave_oppscore\')"></aveoppscores>\n                    </b-tab>\n\n                    <b-tab title="High Spreads " lazy>\n                        <hispread :resultdata="resultdata" :caption="caption"></hispread>\n                    </b-tab>\n                    <b-tab title="Low Spreads" lazy>\n                        <lospread :resultdata="resultdata" :caption="caption"></lospread>\n                    </b-tab>\n\n                </b-tabs>\n            </div>\n            <div class="col-2 col-sm-2 col-md-2">\n                    <!-- Sponsors -->\n            </div>\n        </div>\n        <div v-else class="row justify-content-md-center align-items-center">\n            <div class="col-8 offset-1 col-sm-auto  col-md-8 offset-md-1">\n                <pairings v-if="viewIndex==1" :currentRound="currentRound" :resultdata="resultdata" :caption="caption"></pairings>\n                <results v-if="viewIndex==2" :currentRound="currentRound" :resultdata="resultdata" :caption="caption"></results>\n                <standings v-if="viewIndex==3" :currentRound="currentRound" :resultdata="resultdata" :caption="caption"></standings>\n            </div>\n            <div class="col-2 col-sm-2 col-md-2">\n                    <!-- Sponsors -->\n            </div>\n        </div>\n    </template>\n</div>\n',
  components: {
    loading: LoadingAlert,
    error: ErrorAlert,
    allplayers: PlayerList,
    pairings: Pairings,
    results: Results,
    standings: Standings,
    hiwins: HiWins,
    hiloss: HiLoss,
    lowin: LoWins,
    comboscores: ComboScores,
    totalscores: TotalScores,
    oppscores: TotalOppScores,
    avescores: AveScores,
    aveoppscores: AveOppScores,
    hispread: HiSpread,
    lospread: LoSpread,
    // 'luckystiff-table': LuckyStiffTable,
    // 'tuffluck-table': TuffLuckTable
    scoreboard: Scoreboard
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
    /* tabIndex:
        {
            handler:
                function (valNew,old) {
                console.log('++++tabIndex++++');
                console.log(valNew);
                if (this.viewIndex == 4) {
                    this.getTabs(valNew);
                }
            },
            //immediate: true,
        } */
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
      console.log(this.slug);
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
      }
      // return true
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
          this.tab_heading = 'Average Scores';
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
      }
      // return true
    },
    roundChange: function roundChange(page) {
      console.log(page);
      console.log(this.currentRound);
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
        var loss = player_data['round'] - won;
        // push values into lsdata array
        lsdata.push({
          player: name,
          spread: diff,
          sum_spread: sum,
          cummulative_spread: mar,
          won_loss: won + ' - ' + loss
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
  computed: _extends({}, mapGetters({
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
      return 'We are currently experiencing network issues fetching this page ' + this.path + ' ';
    }
  })
});