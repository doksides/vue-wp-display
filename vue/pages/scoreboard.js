
import baseURL from '../config.js';
let Scoreboard = Vue.component('scoreboard', {
  template: `
  <div class="row d-flex align-items-center justify-content-center">
  <template v-if="loading||error">
        <div v-if="loading" class="col align-self-center">
            <loading></loading>
        </div>
        <div v-if="error" class="col align-self-center">
            <error>
            <p slot="error">{{error}}</p>
            <p slot="error_msg">{{error_msg}}</p>
            </error>
        </div>
  </template>
  <template v-else>
  <div class="col" id="scoreboard">
    <div class="row no-gutters d-flex align-items-center justify-content-center" v-for="i in rowCount" :key="i">
      <div class="col-lg-3 col-sm-6 col-12 " v-for="player in itemCountInRow(i)" :key="player.rank">
        <b-media class="pb-0 mb-1 mr-1" vertical-align="center">
          <div slot="aside">
            <b-row class="justify-content-center">
              <b-col>
                <b-img rounded="circle" :src="player.photo" width="50" height="50" :alt="player.player" class="animated flipInX" />
              </b-col>
            </b-row>
            <b-row class="justify-content-center">
              <b-col cols="12" md="auto">
                <span class="flag-icon" :title="player.country_full"
                  :class="'flag-icon-'+player.country | lowercase"></span>
              </b-col>
              <b-col col lg="2">
                <i class="fa" v-bind:class="{'fa-male': player.gender === 'm',
                     'fa-female': player.gender === 'f' }" aria-hidden="true"></i>
              </b-col>
            </b-row>
            <b-row class="text-center" v-if="player.team">
              <b-col><span>{{player.team}}</span></b-col>
            </b-row>
            <b-row>
              <b-col class="text-white" v-bind:class="{'text-warning': player.result === 'draw',
             'text-info': player.result === 'awaiting',
             'text-danger': player.result === 'loss',
             'text-success': player.result === 'win' }">
                <h4 class="text-center position  mt-1">
                  {{player.position}}
                  <i class="fa" v-bind:class="{'fa-long-arrow-up': player.rank < player.lastrank,'fa-long-arrow-down': player.rank > player.lastrank,
                 'fa-arrows-h': player.rank == player.lastrank }" aria-hidden="true"></i>
                </h4>
              </b-col>
            </b-row>
          </div>
          <h5 class="m-0  animated fadeInLeft">{{player.player}}</h5>
          <p class="card-text mt-0">
            <span class="sdata points p-1">{{player.points}}-{{player.losses}}</span>
            <span class="sdata mar">{{player.margin | addplus}}</span>
            <span v-if="player.lastposition" class="sdata p1">was {{player.lastposition}}</span>
          </p>
          <div class="row">
            <b-col>
              <span v-if="player.result =='awaiting' " class="bg-info d-inline p-1 ml-1 text-white result">{{
                                   player.result | firstchar }}</span>
              <span v-else class="d-inline p-1 ml-1 text-white result" v-bind:class="{'bg-warning': player.result === 'draw',
                         'bg-danger': player.result === 'loss',
                         'bg-info': player.result === 'awaiting',
                         'bg-success': player.result === 'win' }">
                {{player.result | firstchar}}</span>
              <span v-if="player.result =='awaiting' " class="text-info d-inline p-1  sdata">Awaiting
                Result</span>
              <span v-else class="d-inline p-1 sdata" v-bind:class="{'text-warning': player.result === 'draw',
                       'text-danger': player.result === 'loss',
                       'text-success': player.result === 'win' }">{{player.score}}
                - {{player.oppo_score}}</span>
              <span class="d-block p-0 ml-1 opp">vs {{player.oppo}}</span>
            </b-col>
          </div>
          <div v-if="player.prevresults" class="row align-content-center">
            <b-col>
              <span :title="res" v-for="res in player.prevresults" :key="res.key"
                class="d-inline-block p-1 text-white sdata-res text-center" v-bind:class="{'bg-warning': res === 'draw',
                     'bg-info': res === 'awaiting',
                     'bg-danger': res === 'loss',
                     'bg-success': res === 'win' }">{{res|firstchar}}</span>
            </b-col>
          </div>
        </b-media>
      </div>
    </div>
  </div>
  </template>
</div>
    `,
  props: ['currentRound'],
  data: function() {
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
      // currentRound: null,
      event_title: '',
      is_live_game: true,
    };
  },

  mounted: function () {
    // this.fetchScoreboardData();
    this.processDetails(this.currentPage)
    this.timer = setInterval(
      function() {
        this.reload();
      }.bind(this),
      this.period * 60000
    );
  },
  watch: {
    currentRound: {
      immediate: true,
      handler: function () {
        this.processDetails(this.currentPage);
      }
     }
  },
  beforeDestroy: function() {
    // window.removeEventListener('resize', this.getWindowWidth);
    this.cancelAutoUpdate();
  },
  methods: {
     cancelAutoUpdate: function() {
      clearInterval(this.timer);
    },
    fetchScoreboardData: function() {
      this.$store.dispatch('FETCH_DATA', this.slug);
      console.log(this.slug);
    },
    reload: function() {
      if (this.is_live_game == true) {
        this.processDetails(this.currentPage);
      }
    },
    itemCountInRow: function(index) {
      return this.scoreboard_data.slice(
        (index - 1) * this.itemsPerRow,
        index * this.itemsPerRow
      );
    },
    processDetails: function(currentPage) {
      // console.log(this.result_data)
      let resultdata = this.result_data;
      // let lastRdD = _.last(_.clone(resultdata));
      let cr = this.currentRound - 1;

      let thisRdData = _.nth(_.clone(resultdata), cr);
      console.log('----This Round Data-----');
      console.log(cr);
      console.log(thisRdData);

      let initialRdData = [];
      let previousRdData = [];
      if(this.currentRound > 1)
      {
        previousRdData = _.nth(_.clone(resultdata),cr - 1);
        console.log('----Previous Round Data-----');
        console.log(previousRdData);
        initialRdData = _.take(_.clone(resultdata), cr);
      }
      let currentRdData = _.map(thisRdData, player => {
        let x = player.pno - 1;
        player.photo = this.players[x].photo;
        player.gender = this.players[x].gender;
        player.country_full = this.players[x].country_full;
        player.country = this.players[x].country;
        if (previousRdData.length > 0) {
          let playerData = _.find(previousRdData, {
            player: player.player,
          });
          player.lastposition = playerData['position'];
          player.lastrank = playerData['rank'];
          // previous rounds results
          if(initialRdData.length > 0) {
            player.prevresults = _.chain(initialRdData)
            .flattenDeep()
            .filter(function(v) {
              return v.player === player.player;
            })
            .map('result')
              .value();
          }
        }
        return player;
      });

      // this.total_rounds = resultdata.length;
      // this.currentRound = lastRdData[0].round;
      let chunks = _.chunk(currentRdData, this.total_players);
      // this.reloading = false
      this.scoreboard_data = chunks[currentPage - 1];
      console.log('Scoreboard Data')
      console.log(this.scoreboard_data)
    },
  },
  computed: {
    ...Vuex.mapGetters({
      result_data: 'RESULTDATA',
      players: 'PLAYERS',
      total_players: 'TOTALPLAYERS',
      total_rounds: 'TOTAL_ROUNDS',
      loading: 'LOADING',
      error: 'ERROR',
      category: 'CATEGORY',
    }),
    rowCount: function() {
      return Math.ceil(this.scoreboard_data.length / this.itemsPerRow);
    },
    error_msg: function() {
      return `We are currently experiencing network issues fetching this page ${
        this.pageurl
      } `;
    },
  },
});

export default Scoreboard;