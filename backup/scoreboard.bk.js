import { LoadingAlert, ErrorAlert } from './alerts.js';

export default {
  template: `
    <div class="container-fluid" id="scoreboard">
      <div class="row">
          <div v-if="loading" class="col">
              <loading></loading>
          </div>
          <div v-if="error" class="col">
              <error></error>
          </div>
      </div>
      <template v-if="!(error||loading)">
          <div class="row no-gutters justify-content-lg-center align-items-center" id="masthead">
                <div class="col-lg-7">
                    <h3 class="text-center bebas">{{ event_title }} Round {{currentRound}}
                    </h3>
                </div>
                <div class="col-lg-3">
                    <b-pagination class="p-3" align="center" :total-rows="+total_players" @input="processDetails"
                        v-model="currentPage" :per-page=per_page :hide-ellipsis="true" :limit=1 aria-label="Next 15"
                        v-b-tooltip.hover title="Navigate to next/previous page" />
                </div>
                <div class="col-lg-2">
                    <button type="button" class="btn btn-dark" v-on:click="reload()"><i class="fa fa-refresh" v-bind:class="{'fa-spin fa-fw': reloading == true}"
                          aria-hidden="true"></i><span v-if="reloading"> checking scores..</span> </button>
                </div>
          </div>

        <b-container fluid id="scoreboard">
            <b-row no-gutters class="justify-content-md-center" v-for="i in rowCount" :key="i">
                <b-col v-for="player in itemCountInRow(i)" :key="player.rank">
                    <b-media class="pb-0 mb-2 mr-2" vertical-align="center">
                        <div slot="aside">
                            <b-row class="justify-content-md-center">
                                <b-col>
                                    <b-img rounded="circle" :src="player.photo" width="50" height="50" :alt="player.player" />
                                </b-col>
                            </b-row>
                            <b-row class="justify-content-md-center">
                                <b-col cols="12" md="auto">
                                    <span class="flag-icon" :title="player.country_full" :class="'flag-icon-'+player.country | lowercase"></span>
                                </b-col>
                                <b-col col lg="2">
                                    <i class="fa" v-bind:class="{'fa-male': player.gender === 'm',
                      'fa-female': player.gender === 'f' }"
                                        aria-hidden="true"></i>
                                </b-col>
                            </b-row>
                            <b-row class="text-center" v-if="player.team">
                                <b-col><span>{{player.team}}</span></b-col>
                            </b-row>
                            <b-row>
                                <b-col class="text-white" v-bind:class="{'text-warning': player.result === 'draw',
              'text-info': player.result === 'AR',
              'text-danger': player.result === 'loss',
              'text-success': player.result === 'win' }">
                                    <h4 class="text-center position  mt-1">
                                        {{player.position}}
                                        <i class="fa" v-bind:class="{'fa-long-arrow-up': player.rank < player.lastrank,'fa-long-arrow-down': player.rank > player.lastrank,
                  'fa-arrows-h': player.rank == player.lastrank }"
                                            aria-hidden="true"></i>
                                    </h4>
                                </b-col>
                            </b-row>
                        </div>
                        <h5 class="m-0">{{player.player}}</h5>
                        <p class="card-text mt-0">
                            <span class="sdata points p-1">{{player.points}}-{{total_rounds - player.points}}</span>
                            <span class="sdata mar">{{player.margin | addplus}}</span>
                            <span class="sdata p1">was {{player.lastposition}}</span>
                        </p>
                        <b-row>
                            <b-col>
                                <span v-if="player.result =='AR' " class="bg-info d-inline p-1 ml-1 text-white result">{{
                                    player.result }}</span>
                                <span v-else class="d-inline p-1 ml-1 text-white result" v-bind:class="{'bg-warning': player.result === 'draw',
                          'bg-danger': player.result === 'loss',
                          'bg-success': player.result === 'win' }">
                                    {{player.result | firstchar}}</span>
                                <span v-if="player.result =='AR' " class="text-info d-inline p-1  sdata">Awaiting
                                    Result</span>
                                <span v-else class="d-inline p-1 sdata" v-bind:class="{'text-warning': player.result === 'draw',
                        'text-danger': player.result === 'loss',
                        'text-success': player.result === 'win' }">{{player.score}}
                                    - {{player.oppo_score}}</span>
                                <span class="d-block p-0 ml-1 opp">vs {{player.oppo}}</span>
                            </b-col>
                        </b-row>
                        <b-row align-h="center">
                            <b-col>
                                <span :title="res" v-for="res in player.prevresults" :key="res.key" class="d-inline-block p-1 text-white sdata-res text-center"
                                    v-bind:class="{'bg-warning': res === 'draw',
                      'bg-info': res === 'AR',
                      'bg-danger': res === 'loss',
                      'bg-success': res === 'win' }">{{res
                                    | firstchar}}</span>
                            </b-col>
                        </b-row>
                    </b-media>
                </b-col>
            </b-row>
        </b-container>
    </template>
</div>
    `,
  data: function() {
    return {
      itemsPerRow: 5,
      per_page: 15,
      parent_slug: this.$route.params.slug,
      slug: this.$route.params.event_slug,
      // total_players: null,
      reloading: false,
      loading: true,
      error: '',
      currentPage: 1,
      period: 0.5,
      timer: null,
      windowHeight: 0,
      scoreboard_data: [],
      response_data: [],
      category: '',
      // players: [],
      total_rounds: 0,
      currentRound: null,
      event_title: '',
      is_live_game: true,
    };
  },
  components: {
    loading: LoadingAlert,
    error: ErrorAlert,
  },
  computed: {
    ...Vuex.mapGetters({
      players: 'PLAYERS',
      total_players: 'TOTALPLAYERS',
    }),
    rowCount: function() {
      return Math.ceil(this.scoreboard_data.length / this.itemsPerRow);
    },
  },
  watch: {
    windowHeight: function(newHeight) {
      if (newHeight > 750) {
        //  console.log(`old: ${oldHeight} new: ${newHeight}`)

        this.per_page = 20;
        if (_.isEmpty(this.response_data)) {
          this.getData();
        } else {
          this.processDetails(this.currentPage);
        }
      }

      if (newHeight < 750) {
        // console.log(`old: ${oldHeight} new: ${newHeight}`)
        this.per_page = 15;
        if (_.isEmpty(this.response_data)) {
          this.getData();
        } else {
          this.processDetails(this.currentPage);
        }
      }
    },
  },
  created: function() {
    this.getData();
  },
  mounted: function() {
    this.timer = setInterval(
      function() {
        this.reload();
      }.bind(this),
      this.period * 60000
    );
    this.$nextTick(() => {
      // window.addEventListener('resize', this.getWindowWidth);
      window.addEventListener('resize', this.getWindowHeight);
      // Initialize
      this.getWindowHeight();
    });
  },
  beforeDestroy: function() {
    // window.removeEventListener('resize', this.getWindowWidth);
    window.removeEventListener('resize', this.getWindowHeight);
    this.cancelAutoUpdate();
  },
  methods: {
    getAsyncData: function() {
      var self = this;
      window.setTimeout(function() {
        self.title = this.event_title;
        self.$emit('updateHead');
      }, 2000);
    },
    getWindowWidth: function() {
      this.windowWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
    },
    getWindowHeight: function() {
      this.windowHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
    },
    cancelAutoUpdate: function() {
      clearInterval(this.timer);
    },
    reload: function() {
      if (this.is_live_game == true) {
        this.getData();
      } else {
        this.processDetails(this.currentPage);
      }
    },
    itemCountInRow: function(index) {
      return this.scoreboard_data.slice(
        (index - 1) * this.itemsPerRow,
        index * this.itemsPerRow
      );
    },
    getData: async function() {
      let url = `${baseURL}t_data`;
      this.loading = true;
      try {
        let { data } = await axios.get(url, { params: { slug: this.slug } });

        this.response_data = data[0];
        this.$store.dispatch('SET_PLAYERS_RESULTS', this.response_data);
        //this.resultdata = JSON.parse(this.response_data.results)
        this.reloading = this.loading = false;
        this.category = this.response_data.event_category[0]['name'];
        this.event_title = this.response_data.tourney[0]['post_title'];
        this.event_title = `Scoreboard ${this.event_title} - ${this.category}`;
        var self = this;
        self.$emit('updateHead');
        // this.slug = this.response_data.slug;
        // this.players = this.response_data.players;
        // this.total_players = this.response_data.players.length;
        this.is_live_game = this.response_data.ongoing[0];
        // console.log(this.is_live_game)
        this.processDetails(this.currentPage);
      } catch (error) {
        this.error = error.toString();
        this.reloading = this.loading = false;
      }
    },
    processDetails: function(currentPage) {
      let res = this.response_data;
      if (_.isEmpty(res) || this.is_live_game == true) {
        //  console.log('..getting from server, no result data available')
        this.getData();
      }
      if (!this.is_live_game == true && !_.isNull(this.timer)) {
        // console.log(this.is_live_game +':cancelling timers')
        this.cancelAutoUpdate();
      }
      //let currentPage = parseInt(this.currentPage)
      // let cat_params = this.$route.params.category
      let resultdata = JSON.parse(res.results);
      let initialRdData = _.initial(_.clone(resultdata));
      let previousRdData = _.last(initialRdData);
      let lastRdD = _.last(_.clone(resultdata));
      let lastRdData = _.map(lastRdD, player => {
        let x = player.pno - 1;

        player.photo = this.players[x].photo;
        player.gender = this.players[x].gender;
        player.country_full = this.players[x].country_full;
        player.country = this.players[x].country;
        if (
          player.result == 'draw' &&
          player.score == 0 &&
          player.oppo_score == 0
        ) {
          player.result = 'AR';
        }
        if (previousRdData) {
          let playerData = _.find(previousRdData, {
            player: player.player,
          });
          player.lastposition = playerData['position'];
          player.lastrank = playerData['rank'];
          // previous rounds results
          player.prevresults = _.chain(initialRdData)
            .flattenDeep()
            .filter(function(v) {
              return v.player === player.player;
            })
            .map('result')
            .value();
        }
        return player;
      });

      this.total_rounds = resultdata.length;
      this.currentRound = lastRdData[0]['round'];
      let chunks = _.chunk(lastRdData, this.per_page);
      // this.loading = false
      // this.reloading = false
      this.scoreboard_data = chunks[currentPage - 1];
    },
  },
};

