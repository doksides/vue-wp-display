'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var mapGetters = Vuex.mapGetters;

var Scoreboard = Vue.component('scoreboard', {
  template: '\n  <div class="row align-items-center justify-content-center">\n  <template v-if="loading||error" class="row">\n        <div v-if="loading" class="col">\n            <loading></loading>\n        </div>\n        <div v-if="error" class="col">\n            <error>\n            <p slot="error">{{error}}</p>\n            <p slot="error_msg">{{error_msg}}</p>\n            </error>\n        </div>\n    </template>\n  <template v-else>\n  <div class="col" id="scoreboard">\n    <div class="row" v-for="i in rowCount" :key="i">\n      <div class="col-lg-3 no-gutters" v-for="player in itemCountInRow(i)" :key="player.rank">\n        <b-media class="pb-0 mb-2 mr-2" vertical-align="center">\n          <div slot="aside">\n            <b-row class="justify-content-center">\n              <b-col>\n                <b-img rounded="circle" :src="player.photo" width="50" height="50" :alt="player.player" class="animated fadeIn"/>\n              </b-col>\n            </b-row>\n            <b-row class="justify-content-center">\n              <b-col cols="12" md="auto">\n                <span class="flag-icon" :title="player.country_full"\n                  :class="\'flag-icon-\'+player.country | lowercase"></span>\n              </b-col>\n              <b-col col lg="2">\n                <i class="fa" v-bind:class="{\'fa-male\': player.gender === \'m\',\n                     \'fa-female\': player.gender === \'f\' }" aria-hidden="true"></i>\n              </b-col>\n            </b-row>\n            <b-row class="text-center" v-if="player.team">\n              <b-col><span>{{player.team}}</span></b-col>\n            </b-row>\n            <b-row>\n              <b-col class="text-white" v-bind:class="{\'text-warning\': player.result === \'draw\',\n             \'text-info\': player.result === \'AR\',\n             \'text-danger\': player.result === \'loss\',\n             \'text-success\': player.result === \'win\' }">\n                <h4 class="text-center position  mt-1">\n                  {{player.position}}\n                  <i class="fa" v-bind:class="{\'fa-long-arrow-up\': player.rank < player.lastrank,\'fa-long-arrow-down\': player.rank > player.lastrank,\n                 \'fa-arrows-h\': player.rank == player.lastrank }" aria-hidden="true"></i>\n                </h4>\n              </b-col>\n            </b-row>\n          </div>\n          <h5 class="m-0  animated fadeInLeft">{{player.player}}</h5>\n          <p class="card-text mt-0">\n            <span class="sdata points p-1">{{player.points}}-{{total_rounds - player.points}}</span>\n            <span class="sdata mar">{{player.margin | addplus}}</span>\n            <span class="sdata p1">was {{player.lastposition}}</span>\n          </p>\n          <div class="row">\n            <b-col>\n              <span v-if="player.result ==\'AR\' " class="bg-info d-inline p-1 ml-1 text-white result">{{\n                                   player.result }}</span>\n              <span v-else class="d-inline p-1 ml-1 text-white result" v-bind:class="{\'bg-warning\': player.result === \'draw\',\n                         \'bg-danger\': player.result === \'loss\',\n                         \'bg-success\': player.result === \'win\' }">\n                {{player.result | firstchar}}</span>\n              <span v-if="player.result ==\'AR\' " class="text-info d-inline p-1  sdata">Awaiting\n                Result</span>\n              <span v-else class="d-inline p-1 sdata" v-bind:class="{\'text-warning\': player.result === \'draw\',\n                       \'text-danger\': player.result === \'loss\',\n                       \'text-success\': player.result === \'win\' }">{{player.score}}\n                - {{player.oppo_score}}</span>\n              <span class="d-block p-0 ml-1 opp">vs {{player.oppo}}</span>\n            </b-col>\n          </div>\n          <div class="row align-content-center">\n            <b-col>\n              <span :title="res" v-for="res in player.prevresults" :key="res.key"\n                class="d-inline-block p-1 text-white sdata-res text-center" v-bind:class="{\'bg-warning\': res === \'draw\',\n                     \'bg-info\': res === \'AR\',\n                     \'bg-danger\': res === \'loss\',\n                     \'bg-success\': res === \'win\' }">{{res\n                                   | firstchar}}</span>\n            </b-col>\n          </div>\n        </b-media>\n      </div>\n    </div>\n  </div>\n  </template>\n</div>\n    ',
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

      //let res = this.result_data;
      //let currentPage = parseInt(this.currentPage)
      // let cat_params = this.$route.params.category
      var resultdata = this.result_data;
      var initialRdData = _.initial(_.clone(resultdata));
      var previousRdData = _.last(initialRdData);
      var lastRdD = _.last(_.clone(resultdata));
      var lastRdData = _.map(lastRdD, function (player) {
        var x = player.pno - 1;
        player.photo = _this.players[x].photo;
        player.gender = _this.players[x].gender;
        player.country_full = _this.players[x].country_full;
        player.country = _this.players[x].country;
        if (player.result == 'draw' && player.score == 0 && player.oppo_score == 0) {
          player.result = 'AR';
        }
        if (previousRdData) {
          var playerData = _.find(previousRdData, {
            player: player.player
          });
          player.lastposition = playerData['position'];
          player.lastrank = playerData['rank'];
          // previous rounds results
          player.prevresults = _.chain(initialRdData).flattenDeep().filter(function (v) {
            return v.player === player.player;
          }).map('result').value();
        }
        return player;
      });

      // this.total_rounds = resultdata.length;
      this.currentRound = lastRdData[0].round;
      var chunks = _.chunk(lastRdData, this.total_players);
      // this.reloading = false
      this.scoreboard_data = chunks[currentPage - 1];
    }
  },
  computed: _extends({}, mapGetters({
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
      return 'We are currently experiencing network issues fetching this page ' + this.pageurl + ' ';
    }
  })
});