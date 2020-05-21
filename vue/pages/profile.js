export { StatsProfile as default };
let StatsProfile = Vue.component('stats_profile', {
  template: `
  <div class="row">
  <div class="col-10 offset-1 justify-content-center align-items-center">
    <div class="row">
      <div class="col-12 d-flex justify-content-center align-items-center">
        <b-button @click="view='profile'" variant="link" class="text-decoration-none" active-class="currentView" :disabled="view ==='profile'" :pressed="view ==='profile'" title="Player Profile">
        <b-icon icon="person"></b-icon>Profile</b-button>
        <b-button @click="view='head2head'" variant="link" class="text-decoration-none" active-class="currentView" :disabled="view ==='head2head'" :pressed="view ==='head2head'" title="Head To Head">
        <b-icon icon="people-fill"></b-icon>H2H</b-button>
      </div>
    </div>

    <h3 v-if="view ==='profile'" class="bebas mb-2">
    <b-icon icon="person"></b-icon> Stats Profile</h3>
    <h3 class="mb-2 bebas" v-if="view ==='head2head'">
    <b-icon icon="people-fill"></b-icon> Head to Head</h3>

    <template v-if="view ==='profile'">
      <div v-if="view ==='profile' && (all_players.length <=0)" class="my-5 mx-auto d-flex flex-row align-items-center justify-content-center">
          <b-spinner variant="primary" style="width: 6rem; height: 6rem;" label="Loading players"></b-spinner>
      </div>
      <div v-else class="my-5 mx-auto w-75 d-md-flex flex-md-row align-items-center justify-content-center">
        <div class="mr-md-3 mb-sm-2">
          <label for="search">Player name:</label>
        </div>
        <div class="ml-md-2 flex-grow-1">
          <vue-simple-suggest
          v-model="psearch"
          display-attribute="player"
          value-attribute="slug"
          @select="getprofile"
          :styles="autoCompleteStyle"
          :destyled=true
          :filter-by-query=true
          :list="all_players"
          placeholder="Player name here"
          id="search"
          type="search">
          </vue-simple-suggest>
        </div>
      </div>
      <div v-show="loading">
        <div class="d-flex flex-md-row-reverse my-2 justify-content-center align-items-center">
        <span class="text-success" v-show="psearch && !notfound">Searching <em>{{psearch}}</em>...</span>
        <span class="text-danger" v-show="psearch && notfound"><em>{{psearch}}</em> not found!</span>
        <b-spinner v-show="!notfound" style="width: 6rem; height: 6rem;" type="grow" variant="success" label="Busy"></b-spinner>
        </div>
      </div>
      <div v-if="pdata.player" class="p-2 mx-auto d-md-flex flex-md-row align-items-start justify-content-around">
          <div v-show="psearch ===pdata.player && !notfound" class="d-flex flex-column text-center align-items-center animated fadeIn">
          <h4>Profile Summary</h4>
            <h5 class="oswald">{{pdata.player}}
            <span class="d-inline-block mx-auto p-2">
            <i class="mx-auto flag-icon" :class="'flag-icon-'+pdata.country |lowercase" title="pdata.country_full"></i>
            <i class="ml-2 fa" :class="{'fa-male': pdata.gender == 'm','fa-female': pdata.gender == 'f','fa-users': pdata.is_team == 'yes' }" aria-hidden="true"></i>
            </span>
            </h5>
            <img :src='pdata.photo' :alt="pdata.player" v-bind="imgProps"></img>
            <div class="text-uppercase text-left" style="font-size:0.9em;">
              <div v-if="pdata.total_tourneys" class="lead text-center">{{pdata.total_tourneys | pluralize('tourney',{ includeNumber: true })}}
              </div>
              <div v-else class="lead text-center">No rated competition</div>
              <div class="d-block text-primary font-weight-light">
               Tourney <span class="text-capitalize">(All Time)</span> Honors:
                <ul class="list-inline">
                  <li title="First Prize" class="list-inline-item goldcol font-weight-bold">
                    <i class="fas fa-trophy m-1" aria-hidden="true"></i>
                    <span class="badge">{{tourney_podiums(1)}}</span>
                  </li>
                  <li title="Second Prize" class="list-inline-item silvercol font-weight-bold">
                    <i class="fas fa-trophy m-1" aria-hidden="true"></i>
                    <span class="badge">{{tourney_podiums(2)}}</span>
                  </li>
                  <li title="Third Prize" class="list-inline-item bronzecol font-weight-bold">
                    <i class="fas fa-trophy m-1" aria-hidden="true"></i>
                    <span class="badge">{{tourney_podiums(3)}}</span>
                  </li>
                </ul>
              </div>
              <template v-if="pdata.total_games">
              <span class="d-block text-info font-weight-light text-capitalize">{{pdata.total_games | pluralize('game',{ includeNumber: true })}}</span>
              <span  class="d-block text-success font-weight-light text-capitalize">{{pdata.total_wins | pluralize('win',{ includeNumber: true })}} <em>({{pdata.percent_wins}}%)</em></span>
              <span class="d-block text-warning font-weight-light text-capitalize"> {{pdata.total_draws | pluralize('draw',{ includeNumber: true })}}</span>
              <span  class="d-block text-danger font-weight-light text-capitalize"> {{pdata.total_losses | pluralize(['loss','losses'],{ includeNumber: true })}}</span>
              <span class="d-block text-primary font-weight-light text-capitalize">Ave Score: {{pdata.ave_score}}</span>
              <span class="d-block text-primary font-weight-light text-capitalize">Ave Opponents Score: {{pdata.ave_opp_score}}</span>
              <span class="d-block text-primary font-weight-light text-capitalize">Ave Cum. Mar: {{pdata.ave_margin}}</span>
              </template>
              <template v-else>
              <span class="d-block text-info font-weight-light text-capitalize">No Stats Available</span>
              </template>
            </div>
          </div>
        <div>
          <div v-show="!loading">
          <h4 title="Performance summary per tourney">Competitions</h4>
            <template v-if="pdata.competitions">
            <div class="p-1 mb-1 bg-light" v-for="(c, tindex) in pdata.competitions" :key="c.id">
              <h5 class="oswald text-left">{{c.title}}
              <b-badge title="Final Rank">{{c.final_rd.rank}}</b-badge></h5>
                  <button class="btn btn-link text-decoration-none" type="button" title="Click to view player scoresheet for this event">
                  <router-link :to="{ name:'Scoresheet', params:{  event_slug:c.slug, pno:c.final_rd.pno}}">
                  <b-icon icon="documents-alt"></b-icon> Scorecard
                  </router-link>
                  </button>
                  <b-button class="text-decoration-none" variant="link" v-b-toggle="collapse+tindex+1" title="Click to toggle player stats for this event">
                  <b-icon icon="bar-chart-fill" variant="success" flip-h></b-icon>Statistics
                  </b-button>
                  <b-collapse :id="collapse+tindex+1">
                    <div class="card card-body">
                    <h6 class="oswald">{{c.final_rd.player}} Event Stats Summary</h6>
                    <ul class="list-inline" style="font-size:0.9em">
                      <li class="list-inline-item font-weight-light text-capitalize">
                        Points: {{c.final_rd.points}}/{{c.final_rd.round}}
                      </li>
                      <li class="list-inline-item font-weight-light text-capitalize">
                        Final Pos: {{c.final_rd.position}}
                      </li>
                    </ul>
                    <ul class="list-inline" style="font-size:0.9em">
                      <li class="list-inline-item text-success font-weight-light text-capitalize">
                        Won: {{c.final_rd.wins}}
                      </li>
                      <li class="list-inline-item text-warning font-weight-light text-capitalize">
                        Drew: {{c.final_rd.draws}}
                      </li>
                      <li class="list-inline-item text-danger font-weight-light text-capitalize">
                        Lost: {{c.final_rd.losses}}
                      </li>
                    </ul>
                    <ul class="list-inline" style="font-size:0.9em">
                      <li class="list-inline-item font-weight-light text-capitalize">
                        Average Score: {{c.final_rd.ave_score}}
                      </li>
                      <li class="list-inline-item font-weight-light text-capitalize">
                        Average Opp. Score: {{c.final_rd.ave_opp_score}}
                      </li>
                    </ul>
                    <ul class="list-inline" style="font-size:0.9em">
                      <li class="list-inline-item font-weight-light text-capitalize">
                        Total Score: {{c.final_rd.total_score}}
                      </li>
                      <li class="list-inline-item font-weight-light text-capitalize">
                        Total Opp. Score: {{c.final_rd.total_oppscore}}
                      </li>
                      <li class="list-inline-item font-weight-light text-capitalize">
                        Margin: {{c.final_rd.margin}}
                      </li>
                    </ul>
                    <ul class="list-inline" style="font-size:0.9em">
                      <li :class="{'text-success': c.final_rd.result == 'win','text-warning': c.final_rd.result == 'draw',
                      'text-danger': c.final_rd.result == 'loss'}"
                      class="list-inline-item font-weight-light">
                      Final game was a {{c.final_rd.score}} - {{c.final_rd.oppo_score}} {{c.final_rd.result}} (a difference of {{c.final_rd.diff|addplus}}) against {{c.final_rd.oppo}}
                      </li>
                    </ul>
                  </div>
                </b-collapse>
            </div>
          </template>
          <template v-else>
            <div class="p-1 mb-1 bg-light">No Competition so far!</div>
          </template>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="my-5 mx-auto d-flex flex-row align-items-center justify-content-center">
      <p>Coming Soon!</p>
      </div>
     <!-- <b-form-row class="my-1">
        <b-col sm="1" class="ml-sm-auto">
        <label for="search1">Player 1</label>
        </b-col>
        <b-col sm="3" class="mr-sm-auto">
        <b-form-input placeholder="Start typing player name" size="sm" id="search1" v-model="search1" type="search"></b-form-input>
        </b-col>
        <b-col sm="1" class="ml-sm-auto">
        <label class="ml-2" for="search2">Player 2</label>
        </b-col>
        <b-col sm="3" class="mr-sm-auto">
        <b-form-input size="sm" placeholder="Start typing player name" id="search2" v-model="search2" type="search"></b-form-input>
        </b-col>
      </b-form-row>
      <b-row cols="4">
        <b-col></b-col>
        <b-col>{{search1}}</b-col>
        <b-col></b-col>
        <b-col>{{search2}}</b-col>
      </b-row>
      -->
    </template>
  </div>
</div>
  `,
  data: function () {
    return {
      view: 'profile',
      // showTouStats: false,
      psearch: null,
      search1: null,
      search2: null,
      pdata: {},
      pslug: null,
      collapse: 'collapse',
      loading: null,
      notfound: null,
      autoCompleteStyle : {
        vueSimpleSuggest: "position-relative",
        inputWrapper: "",
        defaultInput : "form-control",
        suggestions: "position-absolute list-group z-1000",
        suggestItem: "list-group-item"
      },
      imgProps: {
        block: true,
        thumbnail: true,
        fluid: true,
        blank: true,
        blankColor: '#666',
        width: 120,
        height: 120,
        class: 'mb-3 shadow-sm',
      },
    }
  },
  created: function () {
    this.getPlayers();
  },
  watch: {
    view: {
      handler: function (n) {
        console.log(n);
      }
    },
    all_players_tou: {
      immediate: true,
      handler: function (val) {
        if(val.length > 0) {
          this.loading = true;
          this.getPData(val);
        }
      }
    },
  },
  methods: {
    getPlayers: function () {
      this.$store.dispatch('GET_ALL_PLAYERS', null);
    },
    getPData: function (v) {
      this.loading = false;
      console.log(this.pslug);
      var data = _.find(v, ['slug', this.pslug]);
      if (data) {
        this.pdata = data;
        this.loading = false;
      }
    },
    getprofile: function (i) {
      this.loading = true;
      this.notfound = true;
      console.log(i);
      let s = i.slug
      if (s) {
        console.log(s);
        this.pslug = s;
        this.$store.dispatch('GET_PLAYER_TOU_DATA',this.pslug);
        this.notfound = false;
      } else {
        this.notfound = true;
      }
    },
    tourney_podiums: function (rank) {
      let c = this.pdata.competitions;
      let wins = _.filter(c, ['final_rank', rank]);
      return wins.length;
    }
  },
  computed: {
    ...Vuex.mapGetters({
      all_players: 'ALL_PLAYERS',
      all_players_tou: 'ALL_PLAYERS_TOU_DATA',
    }),
    playerlist: {
      get: function () {
        let n = this.all_players;
        let fp = _.map(n, function (p) {
          return p.player;
        });
        console.log(fp);
        return fp;
      },
      set: function (newVal) {
        this.$store.commit('SET_ALL_PLAYERS', newVal);
      }
    },
  }
});
