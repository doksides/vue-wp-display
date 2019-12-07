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
      <div class="col-md-2 col-12">
      <!-- player list here -->
        <ul class=" p-2 mb-5 bg-white rounded">
          <li :key="player.pno" v-for="player in pdata" class="bebas">
          <span>{{player.pno}}</span> <b-img-lazy :alt="player.player" :src="player.photo" v-bind="picProps"></b-img-lazy>
            <b-button @click="getCard(player.pno)" variant="link">{{player.player}}</b-button>
          </li>
        </ul>
      </div>
      <div class="col-md-10 col-12">
      <template v-if="resultdata">
        <h4 class="green">Scorecard: <b-img :alt="mPlayer.player" class="mx-2" :src="mPlayer.photo" style="width:60px; height:60px"></b-img> {{mPlayer.player}}</h4>
        <b-table responsive="md" small hover foot-clone head-variant="light" bordered table-variant="light" :fields="fields" :items="scorecard" id="scorecard" class="bebas shadow p-4 mx-auto" style="width:90%; text-align:center; vertical-align: middle">
        <!-- A custom formatted column -->
        <template v-slot:cell(round)="data">
          {{data.item.round}} <sup v-if="data.item.start =='y'">*</sup>
        </template>
        <template v-slot:cell(oppo)="data">
          <small>#{{data.item.oppo_no}}</small><b-img-lazy :title="data.item.oppo" :alt="data.item.oppo" :src="data.item.opp_photo" v-bind="picProps"></b-img-lazy>
          <b-button @click="getCard(data.item.oppo_no)" variant="link">
              {{data.item.oppo|abbrv}}
          </b-button>
        </template>
        <template v-slot:table-caption>
          Scorecard: #{{mPlayer.pno}} {{mPlayer.player}}
        </template>
        </b-table>
      </template>
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
        width: '30px',
        height: '30px',
        class: 'shadow-sm, mx-1',
      },
      fields: [{key:'round',label:'Rd',sortable:true}, {key: 'oppo', label:'Opp. Name'},{key:'oppo_score',label:'Opp. Score',sortable:true},{key:'score',sortable:true},{key:'diff',sortable:true},{key:'result',sortable:true}, {key:'wins',label:'Won',sortable:true},{key:'losses',label:'Lost',sortable:true},{key:'points',sortable:true},{key:'margin',sortable:true,label:'Mar'},{key:'position',label:'Rank',sortable:true}],
      pdata: {},
      scorecard: {},
      mPlayer: {},
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
      let s = _.chain(c).map(function (v) {
        return _.filter(v, function (o) {
          return o.pno == n;
        }).map( function(i){
          i._cellVariants = [];
          i._cellVariants.result = 'info';
          if(i.result ==='win'){
            i._cellVariants.result = 'success';
          }
          if(i.result ==='loss'){
            i._cellVariants.result = 'danger';
          }
          if(i.result ==='draw'){
            i._cellVariants.result = 'warning';
          }
          return i;
        });
      }).flattenDeep().value();
      this.mPlayer = _.first(s);
      this.$router.replace({ name: 'Scoresheet', params: { pno: n } });
      this.player_no = n;
      console.log(s);
      this.scorecard = s;
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
