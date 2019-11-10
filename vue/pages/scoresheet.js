import { LoadingAlert, ErrorAlert } from './alerts.js';
export { Scoresheet as default };

let Scoresheet = Vue.component('scoreCard', {
  template: `
  <div class="container-fluid">
    <div v-if="resultdata" class="row no-gutters justify-content-center align-items-top">
        <div class="col-12">
            <b-breadcrumb :items="breadcrumbs" />
        </div>
    </div>
    <template v-if="loading||error">
    <div class="row justify-content-center align-content-center align-items-center">
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
    </template>
    <template v-else>
    <div class="row justify-content-center align-items-center">
      <div class="col-12 d-flex">
        <b-img class="thumbnail logo ml-auto" :src="logo" :alt="event_title" />
        <h2 class="text-center bebas">{{ event_title }}
        <span class="text-center d-block">Scorecards <i class="fas fa-clipboard"></i></span>
        </h2>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-md-3 col-12">
      <!-- player list here -->
        <ul class="shadow p-3 mb-5 bg-white rounded">
          <li :key="player.pno" v-for="player in pdata" class="bebas">
          <span>{{player.pno}}</span> <b-img-lazy :alt="player.player" :src="player.photo" v-bind="picProps"></b-img-lazy>
            <b-button @click="getCard(player.pno)" variant="link">{{player.player}}</b-button>
          </li>
        </ul>
      </div>
      <div class="col-md-9 col-12">
          <template v-if="resultdata">
          <h4 class="bebas">#{{mPlayer.pno}}
          <b-img :alt="mPlayer.player" :src="mPlayer.photo" style="width: 50px; height:50px"></b-img>
          {{mPlayer.player}}: ScoreCard</h4>
          <table class="bebas table table-hover table-responsive-md" style="width:95%; text-align:center; vertical-align: middle">
          <thead class="thead-dark bebas">
            <tr>
              <th scope="col">Rd</th>
              <th scope="col">Opp. Name</th>
              <th scope="col">Opp. Score</th>
              <th scope="col">Score</th>
              <th scope="col">Diff</th>
              <th scope="col">Result</th>
              <th scope="col">Won</th>
              <th scope="col">Lost</th>
              <th scope="col">Points</th>
              <th scope="col">Cum. Spread</th>
              <th scope="col">Rank</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in scorecard">
              <td>{{s.round}}<sup v-if="s.start =='y'">*</sup></td>
              <td style="text-align:left"><small>#{{s.oppo_no}}</small><b-img-lazy :alt="s.oppo" :src="s.opp_photo" v-bind="picProps"></b-img-lazy>
              <b-button @click="getCard(s.oppo_no)" variant="link">
              {{s.oppo|abbrv}}
              </b-button>
              </td>
              <td>{{s.oppo_score}}</td>
              <td>{{s.score}}</td>
              <td>{{s.diff}}</td>
              <td v-bind:class="{'table-warning': s.result === 'draw',
              'table-info': s.result === 'awaiting',
              'table-danger': s.result === 'loss',
              'table-success': s.result === 'win' }">{{s.result|firstchar}}</td>
              <td>{{s.wins}}</td>
              <td>{{s.losses}}</td>
              <td>{{s.points}}</td>
              <td>{{s.margin}}</td>
              <td>{{s.position}}</td>
            </tr>
          </tbody>
          </table>
          </template>
          <!-- scorecards here -->
      </div>
    </div>
    </template>
  </div>
  `,
  data() {
    return {
      slug: this.$route.params.event_slug,
      player_no: this.$route.params.pno,
      path: this.$route.path,
      tourney_slug: '',
      picProps: {
        block: false,
        rounded: 'circle',
        fluid: true,
        blank: true,
        blankColor: '#bbb',
        width: '25px',
        height: '25px',
        class: 'shadow-sm, mx-1',
      },
      pdata: {},
      scorecard: {},
      mPlayer: {}
    };
  },
  components: {
    loading: LoadingAlert,
    error: ErrorAlert,
  },
  created() {
    var p = this.slug.split('-');
    p.shift();
    this.tourney_slug = p.join('-');
    console.log(this.tourney_slug);
    this.$store.dispatch('FETCH_RESDATA', this.slug);
    document.title = `Player Scorecards - ${this.tourney_title}`;
  },
  watch:{
    resultdata: {
      immediate: true,
      deep: true,
      handler: function (newVal) {
        if (newVal) {
          this.pdata = _.chain(this.resultdata)
            .last().sortBy('pno').value();
          this.getCard(this.player_no);
        }
      }
    },
  },
  methods: {
    getCard: function (n) {
      let c = _.clone(this.resultdata);
      this.scorecard = _.chain(c).map(function (v) {
        return _.filter(v, function (o) {
          return o.pno == n;
        });
      }).flattenDeep().value();
      this.mPlayer = _.first(this.scorecard);
      this.$router.replace({ name: 'Scoresheet', params: { pno: n } });
      this.player_no = n;
    },
  },
  computed: {
    ...Vuex.mapGetters({
      players: 'PLAYERS',
      total_players: 'TOTALPLAYERS',
      event_data: 'EVENTSTATS',
      resultdata: 'RESULTDATA',
      error: 'ERROR',
      loading: 'LOADING',
      category: 'CATEGORY',
      total_rounds: 'TOTAL_ROUNDS',
      parent_slug: 'PARENTSLUG',
      event_title: 'EVENT_TITLE',
      tourney_title: 'TOURNEY_TITLE',
      logo: 'LOGO_URL',
    }),
    breadcrumbs: function() {
      return [
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
          text: `${_.capitalize(this.category)} - Results and Stats`,
          to: {
            name: 'CateDetail',
            params: {
              event_slug: this.slug
            }
          }
        },
        {
          text: 'Scorecards',
          active: true
        }
      ];
    },
    error_msg: function() {
      return `We are currently experiencing network issues fetching this page ${
        this.path
      } `;
    },
  },
});
