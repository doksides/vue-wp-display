export { StatsProfile as default };
let StatsProfile = Vue.component('stats_profile', {
  template: `
  <div class="row">
  <div class="col-10 offset-1 justify-content-center align-items-center">
    <div class="row">
      <div class="col-12 d-flex justify-content-center align-items-center">
        <b-button @click="view='profile'" variant="link" class="text-decoration-none" active-class="currentView" :disabled="view=='profile'" :pressed="view=='profile'" title="Player Profile">
        <b-icon icon="person"></b-icon>Profile</b-button>
        <b-button @click="view='head2head'" variant="link" class="text-decoration-none" active-class="currentView" :disabled="view=='head2head'" :pressed="view=='head2head'" title="Head To Head"><b-icon icon="people-fill"></b-icon>H2H</b-button>
      </div>
    </div>
    <h3 v-show="view=='profile'" class="bebas mb-2"><b-icon icon="person"></b-icon> Stats Profile</h3>
    <h3 class="mb-5 bebas" v-show="view=='head2head'">
    <b-icon icon="people-fill"></b-icon> Head to Head</h3>
    <template v-if="view=='profile'">
      <div v-if="all_players.length <=0" class="my-5 mx-auto d-flex flex-row align-items-center justify-content-center">
          <b-spinner variant="primary" style="width: 5rem; height: 5rem;" label="Loading players"></b-spinner>
      </div>
      <div v-else class="my-5 mx-auto d-md-flex flex-md-row align-items-center justify-content-center">
        <div class="mr-md-2 mb-sm-2">
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
      </template>
      <div v-show="loading">
        <div class="d-flex flex-md-row-reverse my-2 justify-content-center align-items-center">
        <span class="text-success" v-show="psearch && !notfound">Searching <em>{{psearch}}</em>...</span>
        <span class="text-danger" v-show="psearch && notfound"><em>{{psearch}}</em> not found!</span>
        <b-spinner v-show="!notfound" style="width: 5rem; height: 5rem;" type="grow" variant="success" label="Busy"></b-spinner>
        </div>
      </div>
      <div v-if="pdata.player" class="mx-auto d-md-flex flex-md-row align-items-start justify-content-around border rounded">
          <div v-show="psearch==pdata.player && !notfound" class="d-flex flex-column text-center align-items-center animated fadeIn">
          <h3>Profile Summary</h3>
            <h4 class="bebas">{{pdata.player}}
            <span class="d-inline-block mx-auto p-2">
            <i class="mx-auto flag-icon" :class="'flag-icon-'+pdata.country |lowercase" title="pdata.country_full"></i>
            <i class="ml-2 fa" :class="{'fa-male': pdata.gender == 'm','fa-female': pdata.gender == 'f','fa-users': pdata.is_team == 'yes' }" aria-hidden="true"></i>
            </span>
            </h4>
            <img :src='pdata.photo' :alt="pdata.player" v-bind="imgProps"></img>
            <div class="text-uppercase text-left" style="font-size:0.9em;">
              <div class="lead">{{pdata.total_tourneys | pluralize('tourney',{ includeNumber: true })}}
              <span class="d-inline-block text-success font-weight-light">
              <i class="fas fa-trophy m-1" aria-hidden="true"></i>{{tourney_firsts}}
              </span>
              </div>
              <span class="d-block text-info font-weight-light">{{pdata.total_games | pluralize('game',{ includeNumber: true })}}</span>
              <span class="d-block text-success font-weight-light">{{pdata.total_wins | pluralize('win',{ includeNumber: true })}} <em>({{pdata.percent_wins}}%)</em></span>
              <span class="d-block text-warning font-weight-light"> {{pdata.total_draws | pluralize('draw',{ includeNumber: true })}}</span>
              <span class="d-block text-danger font-weight-light"> {{pdata.total_losses | pluralize(['loss','losses'],{ includeNumber: true })}}</span>
              <span class="d-block text-primary font-weight-light">Ave Score: {{pdata.ave_score}}</span>
              <span class="d-block text-primary font-weight-light">Ave Opponents Score: {{pdata.ave_opp_score}}</span>
              <span class="d-block text-primary font-weight-light">Ave Cum. Mar: {{pdata.ave_margin}}</span>
            </div>
          </div>
        <div>
          <div v-show="!loading">
          <h3 title="Performance detail per tourney">Competitions</h3>
            <div class="p-3 mb-2 bg-light text-dark" v-for="c in pdata.competitions" :key="c.id">
              <h5 class="oswald">{{c.title}} <span style="font-size: smaller;" class="d-inline-block">{{c.final_rd.round}} games</span></h5>
              <p class="text-center text-light bg-dark">Points: {{c.final_rd.points}} Wins: {{c.final_rd.wins}} Pos: {{c.final_rank}}</p>
            </div>
          </div>
        </div>
      </div>
    </template>
    <!--
       <template v-if="view=='head2head'">
      <b-form-row class="my-1">
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
    </template>
    -->
  </div>
  </div>
  `,
  data: function () {
    return {
      view: "profile",
      showTouStats: false,
      psearch: null,
      search1: null,
      search2: null,
      pdata: {},
      pslug: null,
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
    loading: {
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
    tourney_firsts: function () {
      let c = this.pdata.competitions;
      let firsts = _.filter(c, ['final_rank', 1]);
      return firsts.length;
    }

  }
});
