import { Pairings, Standings, PlayerList, Results} from './playerlist.js';
import {LoadingAlert, ErrorAlert} from './alerts.js';
import { HiWins, LoWins, HiLoss, ComboScores, TotalScores, TotalOppScores, AveScores, AveOppScores, HiSpread, LoSpread } from './stats.js';
import StatsProfile from './profile.js';
import Scoreboard from './scoreboard.js';
import RatingStats from './rating_stats.js';
import topPerformers from './top.js';
export { CateDetail as default };
let CateDetail = Vue.component('cate', {
  template: `
    <div class="container-fluid">
    <div v-if="resultdata" class="row no-gutters justify-content-center align-items-center">
        <div class="col-12">
            <b-breadcrumb :items="breadcrumbs" />
        </div>
    </div>
    <div v-if="loading||error" class="row justify-content-center align-content-center align-items-center">
        <div v-if="loading" class="col align-self-center">
            <loading></loading>
        </div>
        <div v-else class="col align-self-center">
          <error>
          <p slot="error">{{error}}</p>
          <p slot="error_msg">{{error_msg}}</p>
          </error>
        </div>
    </div>
    <template v-if="!(error||loading)">
        <div v-if="viewIndex !=8 && viewIndex !=5" class="row justify-content-center align-items-center">
            <div class="col-12 col-lg-10 offset-lg-1">
              <div class="d-flex flex-column flex-lg-row align-content-center align-items-center justify-content-center" >
                <div class="mr-lg-0">
                  <b-img fluid thumbnail class="logo" :src="logo" :alt="event_title" />
                </div>
                <div class="mx-auto">
                  <h2 class="text-center bebas">{{ event_title }}
                  <span :title="total_rounds+ ' rounds, ' + total_players +' players'" v-show="total_rounds" class="text-center d-block">{{ total_rounds }} Games {{ total_players}} <i class="fas fa-users"></i> </span>
                  </h2>
                </div>
              </div>
            </div>
        </div>
        <div class="row justify-content-center align-items-center">
            <div class="col-12 d-flex justify-content-center align-items-center">
                <div class="text-center">
                <b-button @click="viewIndex=0" variant="link" class="text-decoration-none" :disabled="viewIndex==0" :pressed="viewIndex==0"><i class="fa fa-users" aria-hidden="true"></i> Players</b-button>
                <b-button @click="viewIndex=1" variant="link" class="text-decoration-none" :disabled="viewIndex==1" :pressed="viewIndex==1"> <i class="fa fa-user-plus"></i> Pairings</b-button>
                <b-button @click="viewIndex=2" variant="link" class="text-decoration-none" :disabled="viewIndex==2" :pressed="viewIndex==2"><b-icon icon="document-text"></b-icon> Results</b-button>
                <b-button title="Round-By-Round Standings" @click="viewIndex=3" variant="link" class="text-decoration-none" :disabled="viewIndex==3" :pressed="viewIndex==3"><b-icon icon="list-ol"></b-icon> Standings</b-button>
                <b-button title="Category Statistics" @click="viewIndex=4" variant="link" class="text-decoration-none" :disabled="viewIndex==4" :pressed="viewIndex==4"><b-icon icon="bar-chart-fill"></b-icon> Statistics</b-button>
                <router-link :to="{ name: 'Scoresheet', params: {  event_slug:slug, pno:1}}">
                <b-button variant="link" class="text-decoration-none"><b-icon icon="documents-alt"></b-icon> Scorecards</b-button>
                </router-link>
                <b-button title="Round-By-Round Scoreboard" @click="viewIndex=5" variant="link" class="text-decoration-none" active-class="currentView" :disabled="viewIndex==5" :pressed="viewIndex==5"><b-icon icon="display"></b-icon>
                Scoreboard</b-button>
                <b-button title="Top 3 Performances" @click="viewIndex=6" variant="link" class="text-decoration-none" active-class="currentView" :disabled="viewIndex==6" :pressed="viewIndex==6"><b-icon icon="award"></b-icon>
                Top Performers</b-button>
                <b-button title="Post-tourney Rating Statistics" v-if="rating_stats" @click="viewIndex=7" variant="link" class="text-decoration-none" active-class="currentView" :disabled="viewIndex==7" :pressed="viewIndex==7">
                <b-icon icon="graph-up"></b-icon>
                Rating Stats</b-button>
                <b-button title="Player Profile and Statistics"  @click="viewIndex=8" variant="link" class="text-decoration-none" active-class="currentView" :disabled="viewIndex==8" :pressed="viewIndex==8">
                <b-icon icon="trophy"></b-icon>
                Profile Stats</b-button>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-10 offset-md-1 col-12 justify-content-center align-items-center">
            <div class="d-flex flex-column">
              <h3 class="text-center bebas p-0 m-0"> {{tab_heading}}
              <span v-if="viewIndex >0 && viewIndex < 4">
              {{ currentRound }}
              </span>
              </h3>
              <template v-if="showPagination">
                  <b-pagination align="center" :total-rows="total_rounds" v-model="currentRound" :per-page="1"
                      :hide-ellipsis="true" aria-label="Navigation" change="roundChange">
                  </b-pagination>
              </template>
            </div>
          </div>
        </div>
        <template v-if="viewIndex==0">
          <allplayers :slug="slug"></allplayers>
        </template>
        <template v-if="viewIndex==6">
          <performers></performers>
        </template>
        <template v-if="viewIndex==7">
          <ratings :caption="caption" :computed_items="computed_rating_items">
          </ratings>
        </template>
        <template v-if="viewIndex==8">
           <profiles></profiles>
        </template>
        <template v-if="viewIndex==5">
        <scoreboard :currentRound="currentRound"></scoreboard>
        </template>
        <div v-else-if="viewIndex==4" class="row d-flex justify-content-center align-items-center">
            <div class="col-md-10 offset-md-0 col">
                <b-tabs content-class="mt-3 statsTabs" pills small lazy no-fade  v-model="tabIndex">
                    <b-tab title="High Wins" lazy>
                        <hiwins  :resultdata="resultdata" :caption="caption">
                        </hiwins>
                    </b-tab>
                    <b-tab title="High Losses" lazy>
                        <hiloss :resultdata="resultdata" :caption="caption">
                        </hiloss>
                    </b-tab>
                    <b-tab title="Low Wins" lazy>
                        <lowins  :resultdata="resultdata" :caption="caption">
                        </lowins>
                    </b-tab>
                    <b-tab title="Combined Scores">
                        <comboscores :resultdata="resultdata" :caption="caption">
                        </comboscores>
                    </b-tab>
                    <b-tab title="Total Scores">
                        <totalscores :caption="caption" :stats="fetchStats('total_score')"></totalscores>
                    </b-tab>
                    <b-tab title="Total Opp Scores">
                        <oppscores :caption="caption" :stats="fetchStats('total_oppscore')"></oppscores>
                    </b-tab>
                    <b-tab title="Ave Scores">
                        <avescores :caption="caption" :stats="fetchStats('ave_score')"></avescores>
                    </b-tab>
                    <b-tab title="Ave Opp Scores">
                        <aveoppscores :caption="caption" :stats="fetchStats('ave_oppscore')"></aveoppscores>
                    </b-tab>
                    <b-tab title="High Spreads " lazy>
                        <hispread :resultdata="resultdata" :caption="caption"></hispread>
                    </b-tab>
                    <b-tab title="Low Spreads" lazy>
                        <lospread :resultdata="resultdata" :caption="caption"></lospread>
                    </b-tab>
                </b-tabs>
            </div>
        </div>
        <div v-else class="row justify-content-center align-items-center">
            <div class="col-md-8 offset-md-2 col-12">
                <pairings :currentRound="currentRound" :resultdata="resultdata" :caption="caption" v-if="viewIndex==1"></pairings>
                <results :currentRound="currentRound" :resultdata="resultdata" :caption="caption" v-if="viewIndex==2"></results>
                <standings :currentRound="currentRound" :resultdata="resultdata" :caption="caption" v-if="viewIndex==3"></standings>
          </div>
        </div>
    </template>
</div>
`,
  components: {
    loading: LoadingAlert,
    error: ErrorAlert,
    allplayers: PlayerList,
    pairings: Pairings,
    results: Results,
    ratings: RatingStats,
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
    scoreboard: Scoreboard,
    performers: topPerformers,
    profiles: StatsProfile
  },
  data: function() {
    return {
      slug: this.$route.params.event_slug,
      path: this.$route.path,
      tourney_slug: '',
      isActive: false,
      gamedata: [],
      tabIndex: 0,
      viewIndex: 0,
      currentRound: 1,
      tab_heading: '',
      caption: '',
      showPagination: false,
      computed_rating_items: [],
      luckystiff: [],
      tuffluck: [],
      timer: '',
    };
  },
  created: function() {
    var p = this.slug.split('-');
    p.shift();
    this.tourney_slug = p.join('-');
    this.fetchData();
  },
  watch: {
    viewIndex: {
      immediate: true,
      handler: function(val) {
        if (val != 4) {
          this.getView(val);
        }
      }
    },
    rating_stats: {
      immediate: true,
      deep: true,
      handler: function(val) {
        if (val) {
          this.updateRatingData();
        }
      }
    }
  },
  beforeUpdate: function () {
    document.title = this.event_title;
    if (this.viewIndex == 4) {
      this.getTabs(this.tabIndex);
    }
  },
  methods: {
    fetchData: function() {
      this.$store.dispatch('FETCH_DATA', this.slug);
    },
    updateRatingData: function () {
      let resultdata = this.resultdata;
      let data = _.chain(resultdata).last().sortBy('pno').value();
      let items = _.clone(this.rating_stats);
      this.computed_rating_items = _.map(items, function (x) {
        let n = x.pno;
        let p = _.filter(data, function (o) {
          return o.pno == n;
        });
        x.photo = p[0].photo;
        x.position = p[0].position;
        return x;
      });

    },
    getView: function(val) {
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
        case 5:
          this.showPagination = true;
          this.tab_heading = null;
          this.caption = null;
          break;
        case 7:
          this.showPagination = false;
          this.tab_heading = 'Post Tournament Rating Statistics';
          this.caption = 'Rating Statistics';
          break;
        default:
          this.showPagination = false;
          this.tab_heading = null;
          this.caption = null;
          break;
      }
      // return true
    },
    getTabs: function(val) {
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
      }
      // return true
    },
    roundChange: function(page) {
      console.log(page);
      // console.log(this.currentRound);
      this.currentRound = page;
    },
    cancelAutoUpdate: function() {
      clearInterval(this.timer);
    },
    fetchStats: function(key) {
      let lastRdData = this.resultdata[this.total_rounds - 1];
      return _.sortBy(lastRdData, key).reverse();
    },
    tufflucky: function(result = 'win') {
      // method runs both luckystiff and tuffluck tables
      let data = this.resultdata; //JSON.parse(this.event_data.results);
      let players = _.map(this.players, 'post_title');
      let lsdata = [];
      let highsix = _.chain(players)
        .map(function(n) {
          let res = _.chain(data)
            .map(function(list) {
              return _.chain(list)
                .filter(function(d) {
                  return d['player'] === n && d['result'] === result;
                })
                .value();
            })
            .flattenDeep()
            .sortBy('diff')
            .value();
          if (result === 'win') {
            return _.first(res, 6);
          }
          return _.takeRight(res, 6);
        })
        .filter(function(n) {
          return n.length > 5;
        })
        .value();

      _.map(highsix, function(h) {
        let lastdata = _.takeRight(data);
        let diff = _.chain(h)
          .map('diff')
          .map(function(n) {
            return Math.abs(n);
          })
          .value();
        let name = h[0]['player'];
        let sum = _.reduce(
          diff,
          function(memo, num) {
            return memo + num;
          },
          0
        );
        let player_data = _.find(lastdata, {
          player: name,
        });
        let mar = player_data['margin'];
        let won = player_data['points'];
        let loss = player_data['round'] - won;
        // push values into lsdata array
        lsdata.push({
          player: name,
          spread: diff,
          sum_spread: sum,
          cummulative_spread: mar,
          won_loss: `${won} - ${loss}`,
        });
      });
      return _.sortBy(lsdata, 'sum_spread');
    },
    toNextRd: function() {
      let x = this.total_rounds;
      let n = this.currentRound + 1;
      if (n <= x) {
        this.currentRound = n;
      }
    },
    toPrevRd: function() {
      let n = this.currentRound - 1;
      if (n >= 1) {
        this.currentRound = n;
      }
    },
    toFirstRd: function() {
      if (this.currentRound != 1) {
        this.currentRound = 1;
      }
    },
    toLastRd: function() {
      // console.log(' going to last round')
      if (this.currentRound != this.total_rounds) {
        this.currentRound = this.total_rounds;
      }
    },
  },
  computed: {
    ...Vuex.mapGetters({
      players: 'PLAYERS',
      total_players: 'TOTALPLAYERS',
      resultdata: 'RESULTDATA',
      rating_stats: 'RATING_STATS',
      event_data: 'EVENTSTATS',
      error: 'ERROR',
      loading: 'LOADING',
      category: 'CATEGORY',
      total_rounds: 'TOTAL_ROUNDS',
      parent_slug: 'PARENTSLUG',
      event_title: 'EVENT_TITLE',
      tourney_title: 'TOURNEY_TITLE',
      logo: 'LOGO_URL',
    }),
    breadcrumbs: function () {
      return [
        {
          text: 'NSF News',
          href: '/'
        },
        {
          text: 'Tournaments',
          to: {
            name: 'TourneysList',
          },
        },
        {
          text: this.tourney_title,
          to: {
            name: 'TourneyDetail',
            params: {
              slug: this.tourney_slug,
            },
          },
        },
        {
          //text: _.capitalize(this.category),
          // let category = _.capitalize(this.category);
          text: `${_.capitalize(this.category)} - Results and Stats`,
          active: true,
        },
      ];
    },
    error_msg: function() {
      return `We are currently experiencing network issues fetching this page ${
        this.path
      } `;
    },
  },
});
// export default CateDetail;