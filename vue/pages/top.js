let mapGetters = Vuex.mapGetters;
let topPerformers = Vue.component('top-stats', {
  template: `
  <div class="col-lg-10 offset-lg-1 justify-content-center">
    <div class="row">
      <div class="col-lg-2 col-sm-4 col-12">
        <div class="mt-5 d-flex flex-column align-content-center align-items-center justify-content-center">
          <b-button variant="btn-outline-success" title="Top 3" class="m-2 btn-block" @click="showPic('top3')" :pressed="currentView=='top3'">
            <i class="fas fa-trophy m-1" aria-hidden="true"></i>Top 3</b-button>
          <b-button variant="btn-outline-success" title="Highest Game Scores" class="m-2 btn-block" @click="showPic('higames')" :pressed="currentView=='higames'">
            <i class="fas fa-bullseye m-1" aria-hidden="true"></i>High Game</b-button>
          <b-button variant="btn-outline-success" title="Highest Average Scores" class="m-2 btn-block" :pressed="currentView=='hiaves'"
            @click="showPic('hiaves')">
            <i class="fas fa-thumbs-up m-1" aria-hidden="true"></i>High Ave. Scores</b-button>
          <b-button variant="btn-outline-success" title="Lowest Average Opponent Scores" class="m-2 btn-block" @click="showPic('looppaves')" :pressed="currentView=='looppaves'">
            <i class="fas fa-beer mr-1" aria-hidden="true"></i>Low Opp Ave</b-button>
        </div>
      </div>
      <div class="col-lg-10 col-sm-8 col-12">
        <div class="row">
          <div class="col-12 justify-content-center align-content-center">
            <h3>{{title}}</h3>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-4 col-12 animated fadeInRightBig" v-for="(item, index) in stats">
            <h4 class="p-2 text-center bebas bg-dark text-white">{{item.player}}</h4>
            <div class="d-flex flex-column justify-content-center align-items-center">
              <img :src="players[item.pno-1].photo" width='120' height='120' class="img-fluid rounded-circle"
                :alt="players[item.pno-1].post_title|lowercase">
              <span class="d-block ml-5">
                <i class="mx-1 flag-icon" :class="'flag-icon-'+players[item.pno-1].country | lowercase"
                  :title="players[item.pno-1].country_full"></i>
                <i class="mx-1 fa"
                  :class="{'fa-male': players[item.pno-1].gender == 'm', 'fa-female': players[item.pno-1].gender == 'f'}"
                  aria-hidden="true">
                </i>
              </span>
            </div>
            <div class="d-flex flex-row justify-content-center align-content-center bg-dark text-white">
              <span class="mx-1 display-5 d-inline-block align-self-center" v-if="item.points">{{item.points}}</span>
              <span class="mx-1 display-5 d-inline-block align-self-center" v-if="item.margin">{{item.margin|addplus}}</span>
              <span class="mx-1 text-center display-5 d-inline-block align-self-center" v-if="item.score">Round {{item.round}} vs {{item.oppo}}</span>
            </div>
            <div class="d-flex justify-content-center align-items-center bg-success text-white">
              <div v-if="item.score" class="display-4 yanone d-inline-flex">{{item.score}}</div>
              <div v-if="item.position" class="display-4 yanone d-inline-flex">{{item.position}}</div>
              <div v-if="item.ave_score" class="display-4 yanone d-inline-flex">{{item.ave_score}}</div>
              <div v-if="item.ave_opp_score" class="display-4 yanone d-inline-flex">{{item.ave_opp_score}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  data: function () {
    return {
      title: '',
      profiles : [],
      stats: [],
      currentView: ''
    }
  },
  created: function() {
    this.showPic('top3');
  },
  methods: {
    showPic: function (t) {
      this.currentView = t
      let arr,r,s = [];
      if (t == 'hiaves') {
        arr = this.getStats('ave_score');
        r = _.take(arr, 3).map(function (p) {
          return _.pick(p, ['player', 'pno', 'ave_score'])
        })
        this.title = 'Highest Average Scores'
      }
      if (t == 'looppaves') {
        arr = this.getStats('ave_opp_score');
        r = _.takeRight(arr, 3).reverse().map(function (p) {
          return _.pick(p, ['player', 'pno', 'ave_opp_score'])
        })
        this.title='Lowest Opponent Average Scores'
      }
      if (t == 'higames') {
        arr = this.computeStats();
        r = _.take(arr, 3).map(function (p) {
          return _.pick(p, ['player', 'pno', 'score','round','oppo'])
        })
        this.title='High Game Scores'
      }
      if (t == 'top3') {
        arr = this.getStats('points');
        s = _.sortBy(arr,['points','margin']).reverse()
        r = _.take(s, 3).map(function (p) {
          return _.pick(p, ['player', 'pno', 'points','margin','position'])
        })
        this.title='Top 3'
      }

      this.stats = r;
      // this.profiles = this.players[r.pno-1];

    },
    getStats: function (key) {
      return _.sortBy(this.finalstats, key).reverse();
    },
    computeStats: function() {
      var data = _.clone(this.resultdata);
      return _.chain(data)
        .map(function(r) {
          return _.chain(r)
            .map(function(m) {
              return m;
            })
            .filter(function(n) {
              return n['result'] === 'win';
            })
            .maxBy(function(w) {
              return w.score;
            })
            .value();
        })
        .sortBy('score')
        .value()
        .reverse();
    },
  },
  computed: {
    ...mapGetters({
      players: 'PLAYERS',
      total_rounds: 'TOTAL_ROUNDS',
      finalstats: 'FINAL_ROUND_STATS',
      resultdata: 'RESULTDATA',
      ongoing: 'ONGOING_TOURNEY',
    }),
  },
});
export default topPerformers;