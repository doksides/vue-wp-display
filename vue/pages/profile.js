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
    <h3 v-show="view=='profile'" class="bebas"><b-icon icon="person"></b-icon> Stats Profile</h3>
    <h3 v-show="view=='head2head'" class="bebas"><b-icon icon="people-fill"></b-icon> Head to Head</h3>
    <template v-if="view=='profile'">
      <b-form-row class="my-1 mx-auto">
        <b-col sm="2" class="ml-sm-auto">
          <label for="search">Enter player names</label>
        </b-col>
        <b-col sm="4" class="mr-sm-auto">
          <b-form-input list="players-list" size="sm" placeholder="Start typing player name" id="search" v-model="psearch"  @update="getprofile" type="search">
          </b-form-input>
        </b-col>
      </b-form-row>
      <b-row v-show="loading">
        <b-col>
          <div class="d-flex text-center my-2 justify-content-center align-items-center">
          <b-spinner type="grow" variant="info" label="Busy"></b-spinner>
          </div>
        </b-col>
      </b-row>
      <b-row cols="2" v-show="!loading">
        <b-col>
        <div class="d-flex flex-column text-center align-items-center animated fadeIn">
        <h4 class="oswald">{{pdata.player}}
        <span class="d-block mx-auto my-1" style="font-size:small">
        <i class="mx-auto flag-icon" :class="'flag-icon-'+pdata.country" title="pdata.country_full"</i>
        <i class="ml-2 fa" :class="{'fa-male': pdata.gender == 'm','fa-female': pdata.gender == 'f','fa-users': pdata.is_team == 'yes' }" aria-hidden="true"></i>
        </span>
        </h4>
        <img :src='pdata.photo' :alt="pdata.player" v-bind="imgProps"></img>
        </div>
        </b-col>
        <b-col>
          <div>
          <div v-if="loading" class="d-flex text-center my-2 justify-content-center align-items-center">
          <b-spinner type="grow" label="Loading"></b-spinner>
          </div>
          <div v-else class="p-3 mb-2 bg-light text-dark" v-for="c in pdata.competitions" :key="c.id">
              <h6 class="oswald">{{c.title}}  <span style="font-size: smaller;" class="d-inline-block">{{c.final_rd.round}} games</span></h6>
              <p class="text-center text-light bg-dark">Points: {{c.final_rd.points}} Wins: {{c.final_rd.wins}} Pos: {{c.final_rank}}</p>
            </div>
          </div>
        </b-col>
      </b-row>
    </template>
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
    <template>
    <b-form-datalist :options="playerlist" id="players-list"></b-form-datalist>
    </template>
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
      loading: true,
      imgProps: {
        block: true,
        thumbnail: true,
        fluid: true,
        blank: true,
        blankColor: '#666',
        width: 150,
        height: 150,
        class: 'mb-3 shadow-sm',
      },
    }
  },
  created: function () {
    this.getPlayers();
  },
  watch: {
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
      console.log('..computed input..')
      console.log(i);
      let p = _.find(this.all_players, function (o) {
        return o.player == i;
      });
      if (p) {
      this.pslug = p.slug
      this.$store.dispatch('GET_PLAYER_TOU_DATA',this.pslug);
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
        console.log('----fp-----');
        console.log(fp);
        return fp;
      },
      set: function (newVal) {
        this.$store.commit('SET_ALL_PLAYERS', newVal);
      }
    },

  }
});
