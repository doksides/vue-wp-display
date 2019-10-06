'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var mapGetters = Vuex.mapGetters;
var topPerformers = Vue.component('top-stats', {
  template: '\n  <div class="col-lg-10 offset-lg-1 justify-content-center">\n    <div class="row">\n      <div class="col-lg-2 col-sm-4 col-12">\n        <div class="mt-5 d-flex flex-column align-content-center align-items-center justify-content-center">\n          <b-button variant="btn-outline-success" title="Top 3" class="m-2 btn-block" @click="showPic(\'top3\')" :pressed="currentView==\'top3\'">\n            <i class="fas fa-trophy m-1" aria-hidden="true"></i>Top 3</b-button>\n          <b-button variant="btn-outline-success" title="Highest Game Scores" class="m-2 btn-block" @click="showPic(\'higames\')" :pressed="currentView==\'higames\'">\n            <i class="fas fa-bullseye m-1" aria-hidden="true"></i>High Games</b-button>\n          <b-button variant="btn-outline-success" title="Highest Average Scores" class="m-2 btn-block" :pressed="currentView==\'hiaves\'"\n            @click="showPic(\'hiaves\')">\n            <i class="fas fa-thumbs-up m-1" aria-hidden="true"></i>High Ave. Scores</b-button>\n          <b-button variant="btn-outline-success" title="Lowest Average Opponent Scores" class="m-2 btn-block" @click="showPic(\'looppaves\')" :pressed="currentView==\'looppaves\'">\n            <i class="fas fa-beer mr-1" aria-hidden="true"></i>Low Opp Ave</b-button>\n        </div>\n      </div>\n      <div class="col-lg-10 col-sm-8 col-12">\n        <div class="row">\n          <div class="col-12 justify-content-center align-content-center">\n            <h3>{{title}}</h3>\n          </div>\n        </div>\n        <div class="row">\n          <div class="col-sm-4 col-12 animated fadeInRightBig" v-for="(item, index) in stats">\n            <h4 class="p-2 text-center bebas bg-dark text-white">{{item.player}}</h4>\n            <div class="d-flex flex-column justify-content-center align-items-center">\n              <img :src="players[item.pno-1].photo" width=\'120\' height=\'120\' class="img-fluid rounded-circle"\n                :alt="players[item.pno-1].post_title|lowercase">\n              <span class="d-block ml-5">\n                <i class="mx-1 flag-icon" :class="\'flag-icon-\'+players[item.pno-1].country | lowercase"\n                  :title="players[item.pno-1].country_full"></i>\n                <i class="mx-1 fa"\n                  :class="{\'fa-male\': players[item.pno-1].gender == \'m\', \'fa-female\': players[item.pno-1].gender == \'f\'}"\n                  aria-hidden="true">\n                </i>\n              </span>\n            </div>\n            <div class="d-flex flex-row justify-content-center align-content-center bg-dark text-white">\n              <span class="mx-1 display-5 d-inline-block align-self-center" v-if="item.points">{{item.points}}</span>\n              <span class="mx-1 display-5 d-inline-block align-self-center" v-if="item.margin">{{item.margin|addplus}}</span>\n              <span class="mx-1 text-center display-5 d-inline-block align-self-center" v-if="item.score">Round {{item.round}} vs {{item.oppo}}</span>\n            </div>\n            <div class="d-flex justify-content-center align-items-center bg-success text-white">\n              <div v-if="item.score" class="display-4 yanone d-inline-flex">{{item.score}}</div>\n              <div v-if="item.position" class="display-4 yanone d-inline-flex">{{item.position}}</div>\n              <div v-if="item.ave_score" class="display-4 yanone d-inline-flex">{{item.ave_score}}</div>\n              <div v-if="item.ave_opp_score" class="display-4 yanone d-inline-flex">{{item.ave_opp_score}}</div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n  ',
  data: function data() {
    return {
      title: '',
      profiles: [],
      stats: [],
      currentView: ''
    };
  },

  created: function created() {
    this.showPic('top3');
  },
  methods: {
    showPic: function showPic(t) {
      this.currentView = t;
      var stats = [];
      if (t == 'hiaves') {
        arr = this.getStats('ave_score');
        r = _.take(arr, 3).map(function (p) {
          return _.pick(p, ['player', 'pno', 'ave_score']);
        });
        this.title = 'Highest Average Scores';
      }
      if (t == 'looppaves') {
        arr = this.getStats('ave_opp_score');
        r = _.takeRight(arr, 3).reverse().map(function (p) {
          return _.pick(p, ['player', 'pno', 'ave_opp_score']);
        });
        this.title = 'Lowest Opponent Average Scores';
      }
      if (t == 'higames') {
        arr = this.computeStats();
        r = _.take(arr, 3).map(function (p) {
          return _.pick(p, ['player', 'pno', 'score', 'round', 'oppo']);
        });
        this.title = 'High Game Scores';
      }
      if (t == 'top3') {
        arr = this.getStats('points');
        s = _.sortBy(arr, ['points', 'margin']).reverse();
        r = _.take(s, 3).map(function (p) {
          return _.pick(p, ['player', 'pno', 'points', 'margin', 'position']);
        });
        this.title = 'Top 3';
      }

      this.stats = r;
      // this.profiles = this.players[r.pno-1];
    },
    getStats: function getStats(key) {
      return _.sortBy(this.finalstats, key).reverse();
    },
    computeStats: function computeStats() {
      var data = _.clone(this.resultdata);
      return _.chain(data).map(function (r) {
        return _.chain(r).map(function (m) {
          return m;
        }).filter(function (n) {
          return n['result'] === 'win';
        }).maxBy(function (w) {
          return w.score;
        }).value();
      }).sortBy('score').value().reverse();
    }
  },
  computed: _extends({}, mapGetters({
    players: 'PLAYERS',
    total_rounds: 'TOTAL_ROUNDS',
    finalstats: 'FINAL_ROUND_STATS',
    resultdata: 'RESULTDATA',
    ongoing: 'ONGOING_TOURNEY'
  }))
});